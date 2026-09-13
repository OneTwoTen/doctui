import { readFile, writeFile } from "node:fs/promises";

const metadataPath = "packages/core/src/component-metadata.ts";
let metadata = await readFile(metadataPath, "utf8");

const startMarker = '  {\n    name: "TagsInput",';
const start = metadata.indexOf(startMarker);
if (start < 0) throw new Error("Missing TagsInput metadata entry");
const endMarker = "\n  },";
const endStart = metadata.indexOf(endMarker, start);
if (endStart < 0) throw new Error("Missing TagsInput metadata entry end");
const end = endStart + endMarker.length;

const replacement = `  {
    name: "TagsInput",
    category: "inputs",
    description:
      "Free-form token field with deterministic parsing, native focus and accessible token-list semantics.",
    props: [
      "modelValue",
      "id",
      "name",
      "label",
      "description",
      "error",
      "required",
      "disabled",
      "readonly",
      "placeholder",
      "ariaLabel",
      "clearable",
      "maxTags",
      "separator",
      "size",
      "radius",
    ],
    accessibility: [
      "Uses InputWrapper for SSR-safe IDs and field relationships while keeping a native text input as the entry and focus target.",
      "Selected tags are exposed as a list with native remove buttons; Backspace on an empty input removes the last tag without moving focus.",
      "Multi-character separators are parsed from input text, while only one-character separators act as keyboard delimiter keys.",
    ],
    examples: [
      '<TagsInput id="skills" name="skills" v-model="skills" label="Skills" :max-tags="5" clearable />',
      '<TagsInput v-model="topics" aria-label="Topics" separator="||" />',
    ],
  },`;

metadata = `${metadata.slice(0, start)}${replacement}${metadata.slice(end)}`;
await writeFile(metadataPath, metadata);

const stylesPath = "packages/core/src/styles.css";
let styles = await readFile(stylesPath, "utf8");
if (!styles.includes(".dui-TagsInput-tags {")) {
  const marker = ".dui-TagsInput-input {";
  const markerIndex = styles.indexOf(marker);
  if (markerIndex < 0) throw new Error("Missing TagsInput input style marker");
  const tagsStyle = `.dui-TagsInput-tags {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--dui-spacing-xs);
}

`;
  styles = `${styles.slice(0, markerIndex)}${tagsStyle}${styles.slice(markerIndex)}`;
  await writeFile(stylesPath, styles);
}

const configPath = "apps/docs/.vitepress/config.mts";
let config = await readFile(configPath, "utf8");
if (!config.includes('link: "/guide/tags-input"')) {
  const selectionLine = '          { text: "Selection controls", link: "/guide/selection-controls" },';
  if (!config.includes(selectionLine)) throw new Error("Missing selection controls sidebar entry");
  config = config.replace(
    selectionLine,
    `${selectionLine}\n          { text: "TagsInput", link: "/guide/tags-input" },`,
  );
  await writeFile(configPath, config);
}
