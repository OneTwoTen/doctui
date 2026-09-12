import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { validateRegistry } from "../metadata/registry";

const execFileAsync = promisify(execFile);

const registry = validateRegistry();
const components = [...registry.components].sort((a, b) =>
  a.name.localeCompare(b.name),
);
const output = { ...registry, components };

await mkdir("metadata", { recursive: true });
await writeFile(
  "metadata/components.json",
  `${JSON.stringify(output, null, 2)}\n`,
);
await execFileAsync(process.execPath, [
  "x",
  "biome",
  "format",
  "--write",
  "metadata/components.json",
]);

const lines = [
  "# doctui",
  "",
  `Generated component and package reference for doctui ${registry.version}.`,
  "",
  "## Packages",
  "",
  ...registry.packages.map(
    ({ name, description }) => `- ${name}: ${description}`,
  ),
  "",
  "## Components",
  "",
  ...components.map(
    (component) =>
      `- ${component.name} (${component.package}): ${component.description}`,
  ),
  "",
];
await writeFile("llms.txt", `${lines.join("\n").trimEnd()}\n`);

const full = [
  ...lines,
  "## API details",
  "",
  ...components.flatMap((component) => [
    `### ${component.name}`,
    "",
    `Package: \`${component.package}\``,
    "",
    component.description,
    "",
    `Props: ${component.props.map((prop) => `\`${prop}\``).join(", ") || "none"}.`,
    "",
    ...("accessibility" in component
      ? component.accessibility.map((note) => `Accessibility: ${note}`)
      : []),
    "",
  ]),
];
await writeFile("llms-full.txt", `${full.join("\n").trimEnd()}\n`);
