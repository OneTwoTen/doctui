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
  readonly examples?: readonly string[];
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
