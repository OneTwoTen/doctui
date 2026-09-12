import { readFile, writeFile } from "node:fs/promises";

const metadataPath = "packages/core/src/component-metadata.ts";
let source = await readFile(metadataPath, "utf8");

function replaceEntry(name, replacement) {
  const startMarker = `  {\n    name: "${name}",`;
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing metadata entry: ${name}`);

  const endMarker = "\n  },";
  const endStart = source.indexOf(endMarker, start);
  if (endStart < 0) throw new Error(`Missing metadata entry end: ${name}`);
  const end = endStart + endMarker.length;

  source = `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

replaceEntry(
  "Combobox",
  `  {
    name: "Combobox",
    category: "inputs",
    description:
      "Focus-managed listbox engine used by doctui selection controls.",
    props: [
      "modelValue",
      "data",
      "id",
      "multiple",
      "searchable",
      "clearable",
      "label",
      "description",
      "error",
      "required",
      "disabled",
      "placeholder",
      "ariaLabel",
      "nothingFound",
      "size",
      "radius",
    ],
    accessibility: [
      "Keeps DOM focus on the native combobox input and exposes the active enabled option through aria-activedescendant.",
      "Arrow keys, Home and End skip disabled options; filtering never leaves aria-activedescendant pointing at a missing option.",
      "Visible labels use the shared field relationship; ariaLabel is supported when no visible label is rendered, with a safe fallback accessible name.",
    ],
    examples: [
      '<Combobox id="framework" v-model="framework" :data="frameworks" label="Framework" clearable />',
      '<Combobox v-model="framework" :data="frameworks" searchable aria-label="Search framework" nothing-found="No matches" />',
    ],
  },`,
);

replaceEntry(
  "Select",
  `  {
    name: "Select",
    category: "inputs",
    description:
      "Single-value selection control backed by the shared Combobox focus model.",
    props: [
      "modelValue",
      "data",
      "id",
      "label",
      "description",
      "error",
      "required",
      "disabled",
      "placeholder",
      "clearable",
      "ariaLabel",
      "nothingFound",
      "size",
      "radius",
    ],
    accessibility: [
      "Uses the Combobox aria-activedescendant focus model and skips disabled options during keyboard navigation.",
      "Supports a stable public id plus visible-label or ariaLabel accessible naming.",
      "Clear emits both the existing v-model update and the shared clear event.",
    ],
    examples: [
      '<Select id="assignee" v-model="assignee" :data="people" label="Assignee" clearable @clear="trackCleared" />',
    ],
  },`,
);

replaceEntry(
  "Autocomplete",
  `  {
    name: "Autocomplete",
    category: "inputs",
    description:
      "Searchable single-value selection control backed by the shared Combobox engine.",
    props: [
      "modelValue",
      "data",
      "id",
      "label",
      "description",
      "error",
      "required",
      "disabled",
      "placeholder",
      "clearable",
      "ariaLabel",
      "nothingFound",
      "size",
      "radius",
    ],
    accessibility: [
      "Filtering preserves a valid active descendant by option value and falls back to the first enabled visible option when needed.",
      "Empty results remove aria-activedescendant and announce the nothingFound content as status text.",
      "Clear is forwarded consistently with Select and MultiSelect.",
    ],
    examples: [
      '<Autocomplete id="framework-search" v-model="framework" :data="frameworks" label="Framework" nothing-found="No matches" />',
    ],
  },`,
);

replaceEntry(
  "MultiSelect",
  `  {
    name: "MultiSelect",
    category: "inputs",
    description:
      "Searchable multi-value selection control backed by the shared Combobox engine.",
    props: [
      "modelValue",
      "data",
      "id",
      "label",
      "description",
      "error",
      "required",
      "disabled",
      "placeholder",
      "clearable",
      "ariaLabel",
      "nothingFound",
      "size",
      "radius",
    ],
    accessibility: [
      "Uses aria-multiselectable listbox semantics while keeping DOM focus on the native combobox input.",
      "Backspace removes the last selected value when the search query is empty, and controlled updates immediately refresh aria-selected state.",
      "Clear emits an empty array plus the shared clear event.",
    ],
    examples: [
      '<MultiSelect id="compare" v-model="frameworks" :data="options" label="Compare with" clearable />',
    ],
  },`,
);

await writeFile(metadataPath, source);
