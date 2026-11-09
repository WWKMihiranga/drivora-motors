/*
 * Vanilla three.js showroom (no React renderer, to keep the chunk small).
 * Loaded with dynamic import() only when the visitor reaches the 3D section.
 * Model: Ferrari 458 Italia by vicent091036 (via the three.js examples), Draco-compressed.
 */
import {
  ACESFilmicToneMapping,
  Color,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { withBasePath } from "@/lib/base-path";

export interface ViewerApi {
  setColor: (hex: string) => void;
  dispose: () => void;
}

export async function mountViewer(
  container: HTMLElement,
  opts: { color: string; lite: boolean; onProgress?: (p: number) => void },
): Promise<ViewerApi> {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const renderer = new WebGLRenderer({ antialias: !opts.lite, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.lite ? 1 : 1.75));
  renderer.setSize(width, height);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.style.touchAction = "pan-y";
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const camera = new PerspectiveCamera(36, width / height, 0.1, 100);
  camera.position.set(4.6, 1.5, -4.8);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4.2;
  controls.maxDistance = 9;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.target.set(0, 0.45, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;
  controls.update();
  const stopAuto = () => (controls.autoRotate = false);
  controls.addEventListener("start", stopAuto);

  const bodyMat = new MeshPhysicalMaterial({
    color: new Color(opts.color),
    metalness: 1,
    roughness: 0.45,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
  });
  const detailsMat = new MeshStandardMaterial({ color: 0xdddddd, metalness: 1, roughness: 0.45 });
  const glassMat = opts.lite
    ? new MeshPhysicalMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.55 })
    : new MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1 });

  const draco = new DRACOLoader();
  draco.setDecoderPath(withBasePath("/draco/"));
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  const gltf = await loader.loadAsync(withBasePath("/models/showroom-coupe.glb"), (e) => {
    if (e.total) opts.onProgress?.(e.loaded / e.total);
  });
  const car = gltf.scene.children[0] as Object3D;
  const set = (name: string, mat: MeshStandardMaterial | MeshPhysicalMaterial) => {
    const o = car.getObjectByName(name) as Mesh | undefined;
    if (o) o.material = mat;
  };
  set("body", bodyMat);
  ["rim_fl", "rim_fr", "rim_rr", "rim_rl", "trim"].forEach((n) => set(n, detailsMat));
  set("glass", glassMat);
  const wheels = ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"]
    .map((n) => car.getObjectByName(n))
    .filter(Boolean) as Object3D[];

  scene.add(car);

  // Render only while on screen and the tab is visible.
  let visible = true;
  let raf = 0;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) loop();
  });
  io.observe(container);
  const onVis = () => !document.hidden && visible && loop();
  document.addEventListener("visibilitychange", onVis);

  function loop() {
    cancelAnimationFrame(raf);
    const tick = () => {
      if (!visible || document.hidden) return;
      controls.update();
      if (controls.autoRotate) for (const w of wheels) w.rotation.x -= 0.02;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  loop();

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(container);

  return {
    setColor(hex) {
      bodyMat.color.set(hex);
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      controls.removeEventListener("start", stopAuto);
      controls.dispose();
      draco.dispose();
      envTex.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose?.();
      });
      [bodyMat, detailsMat, glassMat].forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
