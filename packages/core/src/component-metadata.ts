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
