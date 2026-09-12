import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { run } from "vue-tsc";

const require = createRequire(import.meta.url);
const typescript6Package = require.resolve("@typescript/typescript6/package.json");
const typescript6Tsc = join(dirname(typescript6Package), "lib", "tsc.js");

run(typescript6Tsc);
