export const DOCTUI_COMPONENT_CATEGORIES = [
  {
    id: "layout",
    label: "Layout",
    description:
      "Primitives for structure, spacing, alignment, and responsive layout.",
  },
  {
    id: "typography",
    label: "Typography",
    description:
      "Components for semantic text, headings, and readable content.",
  },
  {
    id: "actions",
    label: "Actions",
    description:
      "Controls that trigger user actions, commands, and primary interactions.",
  },
  {
    id: "inputs",
    label: "Inputs",
    description:
      "Form controls for collecting and editing user-provided values.",
  },
  {
    id: "navigation",
    label: "Navigation",
    description:
      "Components that move users between views, sections, and destinations.",
  },
  {
    id: "data-display",
    label: "Data display",
    description:
      "Components for presenting structured values, status, and information.",
  },
  {
    id: "feedback",
    label: "Feedback",
    description:
      "Loading, progress, validation, empty-state, and status feedback.",
  },
  {
    id: "overlays",
    label: "Overlays",
    description: "Layered UI such as dialogs, popovers, menus, and tooltips.",
  },
  {
    id: "media",
    label: "Media",
    description:
      "Components for images, icons, avatars, and other visual media.",
  },
  {
    id: "utilities",
    label: "Utilities",
    description:
      "Low-level helpers that support composition without defining a major UI domain.",
  },
] as const;

export type ComponentCategoryId =
  (typeof DOCTUI_COMPONENT_CATEGORIES)[number]["id"];

export interface ComponentMetadataEntry {
  readonly name: string;
  readonly category: ComponentCategoryId;
  readonly description: string;
  readonly props: readonly string[];
  readonly accessibility?: readonly string[];
}

export function getComponentCategory(category: ComponentCategoryId) {
  return DOCTUI_COMPONENT_CATEGORIES.find(({ id }) => id === category);
}

export const DOCTUI_COMPONENT_METADATA: readonly ComponentMetadataEntry[] = [
  {
    name: "Box",
    category: "layout",
    description: "Low-level polymorphic container with token-based spacing.",
    props: ["as", "padding", "margin"],
  },
  {
    name: "Flex",
    category: "layout",
    description: "Flexbox layout primitive with theme-token gaps.",
    props: ["as", "gap", "direction", "align", "justify", "wrap"],
  },
  {
    name: "Stack",
    category: "layout",
    description:
      "Vertical flex layout for consistent spacing between children.",
    props: ["as", "gap", "align", "justify"],
  },
  {
    name: "Group",
    category: "layout",
    description: "Horizontal wrapping layout for related controls and content.",
    props: ["as", "gap", "align", "justify", "wrap"],
  },
  {
    name: "Grid",
    category: "layout",
    description:
      "CSS grid layout primitive with token-backed gaps and columns.",
    props: ["as", "columns", "gap", "align", "justify"],
  },
  {
    name: "Container",
    category: "layout",
    description:
      "Centered responsive container constrained by theme breakpoints.",
    props: ["as", "size"],
  },
  {
    name: "Center",
    category: "layout",
    description: "Flex helper that centers content on both axes.",
    props: ["as", "inline"],
  },
  {
    name: "Space",
    category: "layout",
    description: "Semantic layout spacer using the theme spacing scale.",
    props: ["size", "orientation"],
  },
  {
    name: "Divider",
    category: "layout",
    description: "Separator for related content with optional label content.",
    props: ["orientation", "size", "color", "label"],
    accessibility: ["Uses role=separator and exposes its orientation."],
  },
  {
    name: "Text",
    category: "typography",
    description:
      "Semantic text primitive using doctui typography and color tokens.",
    props: ["as", "size", "muted", "weight"],
  },
  {
    name: "Title",
    category: "typography",
    description: "Semantic h1-h6 heading primitive.",
    props: ["order"],
    accessibility: [
      "Heading level is represented by the rendered native h1-h6 element.",
    ],
  },
  {
    name: "Code",
    category: "typography",
    description: "Monospace inline or block code presentation.",
    props: ["block", "size"],
  },
  {
    name: "Kbd",
    category: "typography",
    description: "Semantic keyboard shortcut label.",
    props: ["size"],
  },
  {
    name: "Button",
    category: "actions",
    description:
      "Native button control with doctui color, variant and size tokens.",
    props: [
      "color",
      "variant",
      "size",
      "radius",
      "loading",
      "disabled",
      "fullWidth",
      "type",
    ],
    accessibility: [
      "Uses a native button element.",
      "Loading state disables interaction and exposes aria-busy.",
      "Focus-visible styles use the theme focus ring token.",
    ],
  },
  {
    name: "ActionIcon",
    category: "actions",
    description: "Compact icon-only native button with an accessible name.",
    props: [
      "ariaLabel",
      "color",
      "variant",
      "size",
      "radius",
      "disabled",
      "type",
    ],
    accessibility: [
      "Requires ariaLabel because icon-only controls need an accessible name.",
    ],
  },
  {
    name: "UnstyledButton",
    category: "actions",
    description: "Native button reset for building custom action surfaces.",
    props: ["disabled", "type"],
    accessibility: ["Preserves native button keyboard and disabled behavior."],
  },
  {
    name: "Badge",
    category: "data-display",
    description:
      "Compact status label using semantic color and variant tokens.",
    props: ["color", "variant", "size", "radius"],
  },
  {
    name: "Paper",
    category: "data-display",
    description: "Surface container with optional border, radius and shadow.",
    props: ["shadow", "radius", "withBorder"],
  },
  {
    name: "Skeleton",
    category: "feedback",
    description: "Loading placeholder that can reveal its content when ready.",
    props: ["visible", "height", "width", "radius"],
    accessibility: [
      "The placeholder is hidden from assistive technology while visible.",
    ],
  },
  {
    name: "Loader",
    category: "feedback",
    description: "Animated progress indicator for an indeterminate operation.",
    props: ["type", "size", "color"],
    accessibility: ["Uses role=status and provides a Loading accessible name."],
  },
  {
    name: "Overlay",
    category: "overlays",
    description:
      "Portal-backed backdrop with controlled visibility and dismissal.",
    props: ["modelValue", "color", "opacity", "closeOnClick"],
    accessibility: [
      "Backdrop is not a replacement for a modal dialog; provide an accessible surface inside it.",
    ],
  },
  {
    name: "Modal",
    category: "overlays",
    description:
      "Accessible dialog with portal, focus trap, Escape dismissal and focus restoration.",
    props: [
      "modelValue",
      "title",
      "ariaLabel",
      "size",
      "radius",
      "centered",
      "closeOnEscape",
      "closeOnClickOutside",
      "withCloseButton",
    ],
    accessibility: [
      "Uses role=dialog and aria-modal, traps focus while open, and restores the previously focused element on close.",
    ],
  },
  {
    name: "Drawer",
    category: "overlays",
    description:
      "Accessible side panel with shared overlay and focus behavior.",
    props: [
      "modelValue",
      "title",
      "ariaLabel",
      "position",
      "size",
      "radius",
      "closeOnEscape",
      "closeOnClickOutside",
      "withCloseButton",
    ],
    accessibility: [
      "Uses a modal dialog, focus trap, Escape dismissal and focus restoration.",
    ],
  },
  {
    name: "Popover",
    category: "overlays",
    description: "Dismissable contextual panel anchored to a target slot.",
    props: ["modelValue", "position", "closeOnEscape", "closeOnClickOutside"],
    accessibility: [
      "Provides dialog semantics and consistent outside/Escape dismissal.",
    ],
  },
  {
    name: "Tooltip",
    category: "overlays",
    description: "Non-essential contextual text revealed on hover or focus.",
    props: ["label", "modelValue", "position"],
    accessibility: [
      "Appears on focus as well as hover and is not intended for critical information.",
    ],
  },
  {
    name: "Menu",
    category: "navigation",
    description: "Keyboard-navigable menu built from native menu item buttons.",
    props: ["modelValue", "data", "closeOnClickOutside"],
    accessibility: [
      "Uses menu/menuitem roles and supports Arrow, Home, End and Escape.",
    ],
  },
  {
    name: "Combobox",
    category: "inputs",
    description:
      "Shared searchable selection primitive with listbox semantics.",
    props: [
      "modelValue",
      "data",
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
      "Uses combobox/listbox roles and supports Arrow, Home, End, Enter and Escape keyboard behavior.",
    ],
  },
  {
    name: "Select",
    category: "inputs",
    description:
      "Single-value selection control backed by the shared combobox engine.",
    props: [
      "modelValue",
      "data",
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
    accessibility: ["Uses the shared combobox keyboard and listbox semantics."],
  },
  {
    name: "Autocomplete",
    category: "inputs",
    description:
      "Searchable single-value input backed by the shared combobox engine.",
    props: [
      "modelValue",
      "data",
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
      "Uses a searchable combobox and filters options without duplicating navigation logic.",
    ],
  },
  {
    name: "MultiSelect",
    category: "inputs",
    description:
      "Searchable multi-value selection control backed by the shared combobox engine.",
    props: [
      "modelValue",
      "data",
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
      "Uses a multiselect listbox and supports keyboard selection and removal.",
    ],
  },
  {
    name: "TagsInput",
    category: "inputs",
    description:
      "Free-form token input for adding, removing and clearing string values.",
    props: [
      "modelValue",
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
      "Uses a native input for entry and gives every removable tag an accessible remove button.",
    ],
  },
  {
    name: "InputWrapper",
    category: "inputs",
    description:
      "Shared label, description, required and error structure for inputs.",
    props: ["id", "label", "description", "error", "required"],
    accessibility: [
      "Associates labels and help/error text with the wrapped control.",
    ],
  },
  {
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
    ],
    accessibility: [
      "Uses a native textarea and links its label and description/error text.",
    ],
  },
  {
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
    ],
    accessibility: [
      "Uses a native number input with standard keyboard and validation semantics.",
    ],
  },
  {
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
    ],
    accessibility: [
      "Uses a native password input and shared label/help/error associations.",
    ],
  },
  {
    name: "Checkbox",
    category: "inputs",
    description:
      "Native checkbox with boolean v-model and shared field messaging.",
    props: [
      "modelValue",
      "id",
      "label",
      "description",
      "error",
      "required",
      "disabled",
    ],
    accessibility: ["Uses a native checkbox inside a labelable control."],
  },
  {
    name: "Radio",
    category: "inputs",
    description: "Native radio option for a shared scalar v-model.",
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
    ],
    accessibility: [
      "Uses native radio semantics; provide the same name for a group.",
    ],
  },
  {
    name: "Switch",
    category: "inputs",
    description: "Boolean toggle using a checkbox with switch semantics.",
    props: [
      "modelValue",
      "id",
      "label",
      "description",
      "error",
      "required",
      "disabled",
    ],
    accessibility: [
      "Uses role=switch with aria-checked and native keyboard behavior.",
    ],
  },
  {
    name: "SegmentedControl",
    category: "inputs",
    description:
      "Single-selection control with radio semantics and arrow navigation.",
    props: ["modelValue", "data", "ariaLabel", "size", "radius", "disabled"],
    accessibility: [
      "Uses radiogroup/radio roles; Arrow, Home, End, Enter and Space are supported.",
    ],
  },
  {
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
    ],
    accessibility: [
      "Uses a native input and links its label and description/error text through accessible IDs.",
    ],
  },
];

export function getComponentMetadata(name: string) {
  return DOCTUI_COMPONENT_METADATA.find((component) => component.name === name);
}

export function getComponentStorybookTitle(name: string): string {
  const component = getComponentMetadata(name);

  if (!component) {
    throw new Error(`Unknown doctui component metadata: ${name}`);
  }

  const category = getComponentCategory(component.category);

  if (!category) {
    throw new Error(`Unknown doctui component category: ${component.category}`);
  }

  return `${category.label}/${component.name}`;
}
