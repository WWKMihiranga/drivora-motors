// Generates the two small hand-built Lottie animations used on the site.
// Run: node scripts/make-lottie.mjs
import { writeFileSync } from "node:fs";

const INK = [0.055, 0.067, 0.086, 1];
const ORANGE = [0.761, 0.255, 0.047, 1];
const WHITE = [1, 1, 1, 1];
const GREY = [0.82, 0.84, 0.87, 1];

const st = (v) => ({ a: 0, k: v });
const ease = (n = 1) => ({
  i: { x: Array(n).fill(0.22), y: Array(n).fill(1) },
  o: { x: Array(n).fill(0.4), y: Array(n).fill(0) },
});
const anim = (frames, dims = 1) => ({
  a: 1,
  k: frames.map(([t, s], idx) => (idx === frames.length - 1 ? { t, s } : { t, s, ...ease(dims) })),
});
const tr = (extra = {}) => ({
  ty: "tr",
  p: st([0, 0]),
  a: st([0, 0]),
  s: st([100, 100]),
  r: st(0),
  o: st(100),
  ...extra,
});
const layer = (ind, nm, shapes, ks = {}, op = 120) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm,
  sr: 1,
  ao: 0,
  bm: 0,
  ip: 0,
  op,
  st: 0,
  ks: {
    o: st(100),
    r: st(0),
    p: st([60, 60, 0]),
    a: st([0, 0, 0]),
    s: st([100, 100, 100]),
    ...ks,
  },
  shapes,
});
const comp = (nm, op, layers, w = 120, h = 120) => ({
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op,
  w,
  h,
  nm,
  ddd: 0,
  assets: [],
  layers,
});

/* 1. success: ink disc pops in, white tick draws, orange ring ripples out */
const success = comp("success", 70, [
  layer(
    1,
    "tick",
    [
      {
        ty: "gr",
        nm: "tick",
        it: [
          {
            ty: "sh",
            ks: st({
              i: [[0, 0], [0, 0], [0, 0]],
              o: [[0, 0], [0, 0], [0, 0]],
              v: [[-17, 1], [-5, 13], [19, -12]],
              c: false,
            }),
          },
          { ty: "st", c: st(WHITE), o: st(100), w: st(7), lc: 2, lj: 2, ml: 4 },
          { ty: "tm", s: st(0), e: anim([[14, [0]], [34, [100]]]), o: st(0), m: 1 },
          tr(),
        ],
      },
    ],
    {},
    70,
  ),
  layer(
    2,
    "disc",
    [{ ty: "gr", nm: "disc", it: [{ ty: "el", p: st([0, 0]), s: st([84, 84]) }, { ty: "fl", c: st(INK), o: st(100), r: 1 }, tr()] }],
    { s: anim([[0, [0, 0, 100]], [14, [108, 108, 100]], [22, [100, 100, 100]]], 3) },
    70,
  ),
  layer(
    3,
    "ring",
    [{ ty: "gr", nm: "ring", it: [{ ty: "el", p: st([0, 0]), s: st([84, 84]) }, { ty: "st", c: st(ORANGE), o: st(100), w: st(3), lc: 2, lj: 2 }, tr()] }],
    {
      s: anim([[10, [100, 100, 100]], [48, [138, 138, 100]]], 3),
      o: anim([[10, [90]], [48, [0]]]),
    },
    70,
  ),
]);

/* 2. searching: magnifier glides over a dashed road, looping */
const searching = comp(
  "searching",
  120,
  [
    layer(
      1,
      "lens",
      [
        {
          ty: "gr",
          nm: "glass",
          it: [
            { ty: "el", p: st([0, 0]), s: st([30, 30]) },
            { ty: "st", c: st(INK), o: st(100), w: st(4), lc: 2, lj: 2 },
            tr(),
          ],
        },
        {
          ty: "gr",
          nm: "handle",
          it: [
            { ty: "sh", ks: st({ i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]], v: [[11, 11], [22, 22]], c: false }) },
            { ty: "st", c: st(ORANGE), o: st(100), w: st(5), lc: 2, lj: 2 },
            tr(),
          ],
        },
      ],
      {
        p: anim([[0, [44, 52, 0]], [60, [76, 46, 0]], [120, [44, 52, 0]]], 3),
        r: anim([[0, [-6]], [60, [6]], [120, [-6]]]),
      },
    ),
    layer(
      2,
      "road",
      [
        {
          ty: "gr",
          nm: "road",
          it: [
            { ty: "sh", ks: st({ i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]], v: [[-48, 0], [48, 0]], c: false }) },
            {
              ty: "st",
              c: st(GREY),
              o: st(100),
              w: st(4),
              lc: 2,
              lj: 2,
              d: [
                { n: "d", nm: "dash", v: st(10) },
                { n: "g", nm: "gap", v: st(9) },
                { n: "o", nm: "offset", v: anim([[0, [0]], [120, [76]]]) },
              ],
            },
            tr(),
          ],
        },
      ],
      { p: st([60, 92, 0]) },
    ),
  ],
);

writeFileSync(new URL("../public/lottie/success.json", import.meta.url), JSON.stringify(success));
writeFileSync(new URL("../public/lottie/searching.json", import.meta.url), JSON.stringify(searching));
console.log("lottie files written");
