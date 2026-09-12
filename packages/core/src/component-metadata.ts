export interface ComponentMetadataEntry {
  readonly name: string;
  readonly category: "layout" | "typography" | "action";
  readonly description: string;
  readonly props: readonly string[];
  readonly accessibility?: readonly string[];
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
    description: "Vertical flex layout for consistent spacing between children.",
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
    description: "Semantic text primitive using doctui typography and color tokens.",
    props: ["as", "size", "muted", "weight"],
  },
  {
    name: "Title",
    category: "typography",
    description: "Semantic h1-h6 heading primitive.",
    props: ["order"],
    accessibility: ["Heading level is represented by the rendered native h1-h6 element."],
  },
  {
    name: "Button",
    category: "action",
    description: "Native button control with doctui color, variant and size tokens.",
    props: ["color", "variant", "size", "radius", "loading", "disabled", "fullWidth", "type"],
    accessibility: [
      "Uses a native button element.",
      "Loading state disables interaction and exposes aria-busy.",
      "Focus-visible styles use the theme focus ring token.",
    ],
  },
];
