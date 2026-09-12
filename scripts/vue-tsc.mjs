import { createRequire } from "node:module";
import { dirname } from "node:path";
import { run } from "vue-tsc";

const require = createRequire(import.meta.url);
const typescript6Package = require.resolve(
  "@typescript/typescript6/package.json",
);
const typescript6Tsc = require.resolve("typescript/lib/tsc.js", {
  paths: [dirname(typescript6Package)],
});

run(typescript6Tsc);
