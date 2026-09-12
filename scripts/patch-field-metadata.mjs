import { readFile, writeFile } from "node:fs/promises";

const metadataPath = "packages/core/src/component-metadata.ts";
let source = await readFile(metadataPath, "utf8");

const currentInterface = `export interface ComponentMetadataEntry {
  readonly name: string;
  readonly category: ComponentCategoryId;
  readonly description: string;
  readonly props: readonly string[];
  readonly accessibility?: readonly string[];
}`;

const nextInterface = `export interface ComponentMetadataEntry {
  readonly name: string;
  readonly category: ComponentCategoryId;
  readonly description: string;
  readonly props: readonly string[];
  readonly accessibility?: readonly string[];
  readonly examples?: readonly string[];
}`;

if (source.includes(currentInterface)) {
  source = source.replace(currentInterface, nextInterface);
} else if (!source.includes("readonly examples?: readonly string[];")) {
  throw new Error("ComponentMetadataEntry shape changed; update metadata patch script.");
}

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
  "InputWrapper",
  `  {
    name: "InputWrapper",
    category: "inputs",
    description:
      "Shared label, description, required and error structure for inputs.",
    props: [
      "id",
      "label",
      "description",
      "error",
      "required",
      "classNames",
      "styles",
    ],
    accessibility: [
      "Generates an SSR-safe control ID when one is not provided and associates the visible label with that ID.",
      "Keeps description and error messages in the DOM together and exposes both IDs to the scoped control slot.",
    ],
    examples: [
      '<InputWrapper label="Email"><template #default="{ id, describedBy }"><input :id="id" :aria-describedby="describedBy" /></template></InputWrapper>',
    ],
  },`,
);

replaceEntry(
  "Textarea",
  `  {
    name: "Textarea",
    category: "inputs",
    description: "Multi-line text field with shared input wrapper semantics.",
    props: [
      "modelValue",
      "id",
      "label",
      "description",
      "error",
      "required",
      "size",
      "radius",
      "disabled",
      "readonly",
      "placeholder",
      "rows",
      "resize",
      "classNames",
      "styles",
    ],
    accessibility: [
      "Uses a native textarea and links its label, description and error text through accessible IDs.",
      "Read-only fields remain focusable while disabled fields use native disabled semantics.",
    ],
    examples: [
      '<Textarea v-model="bio" label="Bio" size="lg" :styles="fieldStyles" />',
    ],
  },`,
);

replaceEntry(
  "NumberInput",
  `  {
    name: "NumberInput",
    category: "inputs",
    description:
      "Native numeric input with numeric v-model values and range constraints.",
    props: [
      "modelValue",
      "id",
      "label",
      "description",
      "error",
      "required",
      "size",
      "radius",
      "disabled",
      "readonly",
      "placeholder",
      "min",
      "max",
      "step",
      "classNames",
      "styles",
    ],
    accessibility: [
      "Uses a native number input with standard keyboard and validation semantics.",
      "Description, error and consumer-provided aria-describedby IDs are composed instead of replacing one another.",
    ],
    examples: [
      '<NumberInput v-model="quantity" label="Quantity" :min="1" :max="10" size="sm" />',
    ],
  },`,
);

replaceEntry(
  "PasswordInput",
  `  {
    name: "PasswordInput",
    category: "inputs",
    description: "Password field built on the shared TextInput contract.",
    props: [
      "modelValue",
      "id",
      "label",
      "description",
      "error",
      "required",
      "size",
      "radius",
      "disabled",
      "readonly",
      "placeholder",
      "clearable",
      "classNames",
      "styles",
    ],
    accessibility: [
      "Uses a native password input and the shared label/help/error relationship contract.",
      "Native form attributes and listeners are forwarded to the password input while class/style customize the outer field root.",
    ],
    examples: [
      '<PasswordInput v-model="password" label="Password" autocomplete="current-password" />',
    ],
  },`,
);

replaceEntry(
  "Checkbox",
  `  {
    name: "Checkbox",
    category: "inputs",
    description:
      "Native checkbox semantics with doctui-controlled visual geometry and shared field messaging.",
    props: [
      "modelValue",
      "id",
      "label",
      "description",
      "error",
      "required",
      "disabled",
      "size",
      "classNames",
      "styles",
    ],
    accessibility: [
      "Keeps a native checkbox as the semantic, focus and keyboard source while rendering a custom visual indicator.",
      "Disabled and required behavior uses native form semantics.",
    ],
    examples: [
      '<Checkbox v-model="accepted" label="Accept terms" size="lg" required />',
    ],
  },`,
);

replaceEntry(
  "Radio",
  `  {
    name: "Radio",
    category: "inputs",
    description:
      "Native radio option with doctui-controlled visual geometry for a shared scalar v-model.",
    props: [
      "modelValue",
      "value",
      "name",
      "id",
      "label",
      "description",
      "error",
      "required",
      "disabled",
      "size",
      "classNames",
      "styles",
    ],
    accessibility: [
      "Uses native radio semantics and keyboard behavior; provide the same name for options in one group.",
      "The custom visual indicator does not replace the native input in the accessibility tree.",
    ],
    examples: [
      '<Radio v-model="plan" name="plan" value="pro" label="Pro" size="md" />',
    ],
  },`,
);

replaceEntry(
  "Switch",
  `  {
    name: "Switch",
    category: "inputs",
    description:
      "Boolean toggle that keeps native checkbox behavior behind a doctui track and thumb visual.",
    props: [
      "modelValue",
      "id",
      "label",
      "description",
      "error",
      "required",
      "disabled",
      "size",
      "classNames",
      "styles",
    ],
    accessibility: [
      "Uses a native checkbox with role=switch and aria-checked while preserving native keyboard and disabled behavior.",
      "Focus-visible styling is rendered on the visual track without hiding the native focus source from assistive technology.",
    ],
    examples: [
      '<Switch v-model="notifications" label="Notifications" size="lg" />',
    ],
  },`,
);

replaceEntry(
  "TextInput",
  `  {
    name: "TextInput",
    category: "inputs",
    description: "Single-line text field with shared input wrapper semantics.",
    props: [
      "modelValue",
      "id",
      "label",
      "description",
      "error",
      "required",
      "size",
      "radius",
      "disabled",
      "readonly",
      "type",
      "placeholder",
      "leftSection",
      "rightSection",
      "clearable",
      "classNames",
      "styles",
    ],
    accessibility: [
      "Uses a native input and links its label, description and error text through accessible IDs.",
      "Consumer aria-describedby IDs are composed with doctui-generated message IDs, and error state forces aria-invalid=true.",
    ],
    examples: [
      '<TextInput v-model="email" label="Email" autocomplete="email" size="lg" />',
      '<TextInput v-model="query" :class-names="fieldClasses" :styles="fieldStyles" />',
    ],
  },`,
);

await writeFile(metadataPath, source);
