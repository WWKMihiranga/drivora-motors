#!/usr/bin/env node
/*
 * Regenerates the Fivora editor schema and the "panel-only" field list in fivora-template.json.
 *
 *   pnpm build && pnpm fivora:manifest
 *
 * - editorSchema: one section per top-level key of src/data/site-data.json `content`, with field types
 *   inferred from the data (image, url, number, select, textarea, ...) and readable labels.
 * - visualEditing.controlOnlyPaths: every field that never appears as an on-page marker in the built
 *   site (out/), e.g. text shown only after a click, alt text, translations, settings. Fivora edits those
 *   in its side panel instead of on the canvas. Everything else is edited by clicking it on the page.
 *
 * It also builds the site once with every value emptied (Fivora's "empty state" check): labels that only
 * exist on pages generated from list items (a car's detail page, a blog post) disappear when the list is
 * empty, so those are declared control-only too. The real site is rebuilt at the end.
 *
 * Run it after changing site-data.json or adding/removing markers in components, then run `pnpm validate`.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const manifestPath = path.join(root, "fivora-template.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const siteData = JSON.parse(fs.readFileSync(path.join(root, manifest.siteDataFile), "utf8"));
const content = siteData.content;

// Attribute names are assembled so this file is never mistaken for a component carrying markers.
const FIELD_ATTR = ["data", "preview", "field", "path"].join("-");

/* ---------------------------------------------------------------- schema ---------------------- */

const LABELS = {
  priceLkr: "Price", previousPriceLkr: "Previous price (shows as a price drop)", yom: "Year of manufacture",
  yor: "Year first registered", mileageKm: "Mileage (km)", engineCc: "Engine (cc)", batteryKwh: "Battery (kWh)",
  bodyType: "Body type", listedDaysAgo: "Days listed", auctionGrade: "Auction grade", vehicleClass: "Vehicle class",
  mileageSource: "Mileage source", href: "Link", q: "Question", a: "Answer", seo: "Search engine (SEO)",
  ui: "Interface words", si: "Sinhala", ta: "Tamil", readMins: "Reading time (minutes)", hex: "Colour (hex)",
};
const humanize = (key) =>
  LABELS[key] ??
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const uniq = (xs) => [...new Set(xs.filter((x) => typeof x === "string" && x))];
const vehicles = Array.isArray(content.vehicles) ? content.vehicles : [];
const SELECTS = {
  "vehicles.condition": Object.keys(content.labels?.condition ?? {}),
  "vehicles.status": Object.keys(content.labels?.status ?? {}),
  "vehicles.fuel": Object.keys(content.labels?.fuel ?? {}),
  "vehicles.transmission": Object.keys(content.labels?.transmission ?? {}),
  "vehicles.bodyType": Object.keys(content.labels?.body ?? {}),
  "vehicles.mileageSource": Object.keys(content.labels?.mileageSource ?? {}),
  "vehicles.vehicleClass": ["car", "commercial"],
  "vehicles.badge": uniq(["New arrival", "Price drop", "Popular", "Just landed", ...vehicles.map((v) => v.badge)]),
  "vehicles.documents.type": ["auction-sheet", "inspection", "service", "cr"],
  "posts.category": uniq(["Guide", "News", "Leasing", "EV", ...(content.posts ?? []).map((p) => p.category)]),
};

function primitiveType(key, value, schemaPath) {
  const select = SELECTS[schemaPath];
  if (select?.length) return { type: "select", options: select };
  if (typeof value === "number") return { type: "number" };
  if (typeof value === "boolean") return { type: "boolean" };
  const k = String(key);
  if (/image|photo|logo/i.test(k) || /\.images$/.test(schemaPath)) return { type: "image" };
  if (/(^href$|Href$|^url$|Url$)/.test(k)) return { type: "url" };
  if (/email/i.test(k)) return { type: "email" };
  if (/^(phone|whatsapp)$/i.test(k)) return { type: "tel" };
  if (typeof value === "string" && (value.length > 90 || /^(text|description|excerpt|a|note|answer)$/.test(k))) return { type: "textarea" };
  return { type: "text" };
}

/** Merge the shapes of all list items so optional keys (e.g. a car's `grade`) are part of the schema. */
function mergeItems(items) {
  if (!items.length) return "";
  if (items.every((x) => x && typeof x === "object" && !Array.isArray(x))) {
    const out = {};
    for (const it of items) for (const [k, v] of Object.entries(it)) {
      if (!(k in out)) out[k] = v;
      else if (Array.isArray(v) && Array.isArray(out[k])) out[k] = [...out[k], ...v];
    }
    return out;
  }
  return items.find((x) => x !== "" && x != null) ?? items[0];
}

function fieldFor(key, value, schemaPath) {
  const label = humanize(key);
  if (Array.isArray(value)) {
    const sample = mergeItems(value);
    if (sample && typeof sample === "object" && !Array.isArray(sample)) {
      return { key, type: "list", label, itemLabel: humanize(key).replace(/s$/, ""), fields: fieldsFor(sample, schemaPath) };
    }
    return { key, type: "list", label, itemField: { label: humanize(key).replace(/s$/, ""), ...primitiveType(key, sample, schemaPath) } };
  }
  if (value && typeof value === "object") return { key, type: "object", label, fields: fieldsFor(value, schemaPath) };
  return { key, label, ...primitiveType(key, value, schemaPath) };
}

function fieldsFor(obj, basePath) {
  return Object.entries(obj).map(([k, v]) => fieldFor(k, v, `${basePath}.${k}`));
}

const PLATFORM_KEYS = new Set(["additionalPages", "__fivoraIntake"]);
const sections = Object.entries(content)
  .filter(([k]) => !PLATFORM_KEYS.has(k))
  .map(([k, v]) => {
    const f = fieldFor(k, v, k);
    const { key, ...rest } = f;
    return { id: key, path: key, ...rest };
  });
// Pages the dealer creates in Fivora (policies etc.). Fivora fills this list; id and route are platform-managed.
sections.push({
  id: "additionalPages",
  path: "additionalPages",
  type: "list",
  label: "Additional pages",
  itemLabel: "Page",
  fields: [
    { key: "id", type: "text", label: "Page id" },
    { key: "label", type: "text", label: "Link label" },
    { key: "route", type: "text", label: "Route" },
  ],
});

/* ---------------------------------------------------------------- markers --------------------- */

function walkFiles(dir, re, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!["node_modules", ".next", ".git", ".deneb"].includes(e.name)) walkFiles(p, re, out);
    } else if (re.test(e.name)) out.push(p);
  }
  return out;
}

const outDir = path.join(root, manifest.outputDirectory || "out");
const siteDataPath = path.join(root, manifest.siteDataFile);
const buildCmd = manifest.buildCommand || "npm run build";
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const htmlRe = new RegExp(`\\b${FIELD_ATTR}\\s*=\\s*"([^"]*)"`, "g");
function collectHtmlMarkers() {
  const found = new Set();
  for (const f of walkFiles(outDir, /\.html?$/i)) {
    for (const m of fs.readFileSync(f, "utf8").matchAll(htmlRe)) found.add(decode(m[1]).trim());
  }
  return found;
}
const emptied = (v) =>
  Array.isArray(v) ? [] : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, emptied(x)])) : typeof v === "string" ? "" : typeof v === "number" ? 0 : typeof v === "boolean" ? false : v;

/** Mirrors Fivora's "probe" fixture: empty values get sample values and list items get every optional key. */
function probed(v, key = "", p = "") {
  if (Array.isArray(v)) {
    const sample = mergeItems(v);
    return v.map((item, i) =>
      item && typeof item === "object" && !Array.isArray(item) && sample && typeof sample === "object"
        ? probed({ ...Object.fromEntries(Object.keys(sample).map((k) => [k, typeof sample[k] === "number" ? 0 : Array.isArray(sample[k]) ? [] : ""])), ...item }, key, `${p}[${i}]`)
        : probed(item, key, `${p}[${i}]`),
    );
  }
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, probed(x, k, p ? `${p}.${k}` : k)]));
  if (typeof v === "number") return v === 0 ? 1 : v;
  if (typeof v === "boolean") return true;
  if (typeof v === "string" && !v.trim()) {
    const k = `${p}`.toLowerCase();
    if (/image|logo|photo/.test(k)) return `/template-validation-${k.replace(/[^a-z0-9]+/g, "-")}.svg`;
    if (/url|link|href/.test(k)) return `https://template-validation.example.invalid/${k.replace(/[^a-z0-9]+/g, "-")}`;
    return `Validation ${p}`;
  }
  return v;
}

const original = fs.readFileSync(siteDataPath, "utf8");
const probeContent = probed(content);
let htmlMarkers;
let emptyMarkers;
let probeMarkers;
const buildWith = (c) => {
  fs.writeFileSync(siteDataPath, JSON.stringify({ ...siteData, content: c }, null, 2));
  execSync(buildCmd, { cwd: root, stdio: "ignore" });
  return collectHtmlMarkers();
};
try {
  console.log("Building the empty-state site…");
  emptyMarkers = buildWith(emptied(content));
  console.log("Building the probe-content site…");
  probeMarkers = buildWith(probeContent);
} finally {
  fs.writeFileSync(siteDataPath, original);
  console.log("Building the real site…");
  execSync(buildCmd, { cwd: root, stdio: "ignore" });
  htmlMarkers = collectHtmlMarkers();
}
const srcRe = new RegExp(`\\b${FIELD_ATTR}\\s*=\\s*(?:"([^"]*)"|\\{\\s*\`([^\`]*)\`\\s*\\})`, "g");
const sourceMarkers = new Set();
for (const f of walkFiles(path.join(root, "src"), /\.[cm]?[jt]sx?$/)) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(srcRe)) {
    sourceMarkers.add((m[1] ?? m[2]).trim().replace(/\[\s*\$\{[^}]+\}\s*\]/g, "[*]"));
  }
}

/* ---------------------------------------------------------------- control-only ---------------- */

const wild = (p) => p.replace(/\[\d+\]/g, "[*]");
const leavesOf = (root) => {
  const out = [];
  (function walk(v, p) {
    if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${p}[${i}]`));
    if (v && typeof v === "object") return Object.entries(v).forEach(([k, x]) => walk(x, p ? `${p}.${k}` : k));
    out.push(p);
  })(Object.fromEntries(Object.entries(root).filter(([k]) => !PLATFORM_KEYS.has(k))), "");
  return out;
};
const leaves = leavesOf(content);
const allLeaves = [...new Set([...leaves, ...leavesOf(probeContent)])];

/*
 * Fivora's checks: every field of the probe-content site must be on a page (probe pass), and every
 * non-list field must stay on a page when all values are empty (empty-state pass). Anything that
 * fails either is edited in the side panel instead.
 */
const control = new Set();
for (const p of allLeaves) {
  if (/\[\d+\]/.test(p)) {
    const w = wild(p);
    if (!sourceMarkers.has(w)) control.add(w); // whole pattern edited in the panel
    else if (!probeMarkers.has(p)) control.add(p); // this one item's field is not on any page
  } else if (!probeMarkers.has(p) || !emptyMarkers.has(p)) {
    control.add(p);
  }
}
// Platform-managed parts of the dealer's extra pages (Fivora sets them; never shown as text).
control.add("additionalPages[*].id");
control.add("additionalPages[*].route");
const controlOnlyPaths = [...control].sort();

/* ---------------------------------------------------------------- sanity check ---------------- */

const known = new Set([...leaves, ...leaves.map(wild)]);
const exempt = /^(additionalPages|__fivoraIntake)/;
const unknown = [...new Set([...htmlMarkers].map((m) => m))].filter(
  (m) => !exempt.test(m) && !known.has(m) && !known.has(wild(m)) && !leaves.some((l) => l.startsWith(`${m}.`) || l.startsWith(`${m}[`)),
);

manifest.editorSchema = { version: 1, sections };
manifest.visualEditing = { ...manifest.visualEditing, controlOnlyPaths };
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

const onPage = leaves.filter((p) => htmlMarkers.has(p)).length;
console.log(`fivora-template.json updated: ${sections.length} editor sections, ${leaves.length} editable values.`);
console.log(`  ${onPage} can be clicked and edited on a page; the other ${leaves.length - onPage} are edited in the side panel.`);
console.log(`  ${controlOnlyPaths.length} control-only entries declared for Fivora's strict checks.`);
if (unknown.length) {
  console.log(`\n⚠ ${unknown.length} on-page markers point at paths missing from site-data.json:`);
  unknown.slice(0, 30).forEach((u) => console.log("   ", u));
  process.exitCode = 1;
}
