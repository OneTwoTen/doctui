import {
  createTheme,
  type DoctuiColorScheme,
  DoctuiProvider,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h } from "vue";

const meta = {
  title: "Foundation/Theme",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type SemanticColor = "primary" | "neutral" | "success" | "warning" | "danger";

type SemanticVariant = "filled" | "light" | "outline" | "subtle";

const semanticColors: SemanticColor[] = [
  "primary",
  "neutral",
  "success",
  "warning",
  "danger",
];

const semanticVariants: SemanticVariant[] = [
  "filled",
  "light",
  "outline",
  "subtle",
];

const customTheme = createTheme({
  radius: { md: "1rem" },
  colors: {
    light: {
      primary: {
        filled: "#7c3aed",
        filledHover: "#6d28d9",
        light: "#ede9fe",
        lightHover: "#ddd6fe",
        lightText: "#5b21b6",
      },
      success: {
        filled: "#15803d",
        light: "#dcfce7",
        lightText: "#166534",
      },
    },
    dark: {
      primary: {
        filled: "#a78bfa",
        filledHover: "#c4b5fd",
        light: "#2e1065",
        lightHover: "#4c1d95",
      },
    },
  },
});

const compactTheme = createTheme({
  spacing: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
  },
  radius: {
    md: "0.375rem",
  },
  colors: {
    dark: {
      primary: {
        filled: "#14b8a6",
        filledHover: "#2dd4bf",
      },
    },
  },
});

function colorVariable(color: SemanticColor, token: string): string {
  return `var(--dui-color-${color}-${token})`;
}

function themedButton(
  label: string,
  color: SemanticColor,
  variant: SemanticVariant,
) {
  const tokenPrefix = `--dui-color-${color}-${variant}`;
  const background =
    variant === "outline" ? "transparent" : `var(${tokenPrefix})`;
  const border =
    variant === "outline"
      ? `1px solid var(--dui-color-${color}-outline)`
      : "1px solid transparent";

  return h(
    "button",
    {
      type: "button",
      style: {
        background,
        border,
        borderRadius: "var(--dui-radius-md)",
        color: `var(${tokenPrefix}-text)`,
        cursor: "pointer",
        font: "inherit",
        fontSize: "var(--dui-font-size-sm)",
        padding: "var(--dui-spacing-sm) var(--dui-spacing-md)",
      },
    },
    label,
  );
}

function previewCard(title: string, body: string) {
  return h(
    "section",
    {
      style: {
        background: "var(--dui-color-surface-raised)",
        border: "1px solid var(--dui-color-border)",
        borderRadius: "var(--dui-radius-md)",
        boxShadow: "var(--dui-shadow-sm)",
        padding: "var(--dui-spacing-lg)",
      },
    },
    [
      h(
        "h3",
        {
          style: {
            fontSize: "var(--dui-font-size-md)",
            margin: "0 0 var(--dui-spacing-xs)",
          },
        },
        title,
      ),
      h(
        "p",
        {
          style: {
            color: "var(--dui-color-text-muted)",
            fontSize: "var(--dui-font-size-sm)",
            lineHeight: "var(--dui-line-height-md)",
            margin: 0,
          },
        },
        body,
      ),
    ],
  );
}

function renderPreview(colorScheme: DoctuiColorScheme, theme = createTheme()) {
  return () => ({
    setup() {
      return () =>
        h(
          DoctuiProvider,
          { colorScheme, theme },
          {
            default: () =>
              h(
                "div",
                {
                  style: {
                    background: "var(--dui-color-body)",
                    color: "var(--dui-color-text)",
                    fontFamily: "var(--dui-font-family)",
                    minHeight: "260px",
                    padding: "var(--dui-spacing-xl)",
                  },
                },
                [
                  h("h2", { style: { marginTop: 0 } }, `${colorScheme} theme`),
                  h(
                    "p",
                    { style: { color: "var(--dui-color-text-muted)" } },
                    "This preview consumes only public --dui-* theme variables.",
                  ),
                  previewCard(
                    "Provider-scoped tokens",
                    "Spacing, radius, colors, shadows and typography all come from the active DoctuiProvider.",
                  ),
                  h(
                    "div",
                    {
                      style: {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "var(--dui-spacing-sm)",
                        marginTop: "var(--dui-spacing-lg)",
                      },
                    },
                    [
                      themedButton("Primary", "primary", "filled"),
                      themedButton("Success", "success", "light"),
                      themedButton("Danger", "danger", "outline"),
                    ],
                  ),
                ],
              ),
          },
        );
    },
  });
}

function renderSemanticPalette(colorScheme: DoctuiColorScheme) {
  return () => ({
    setup() {
      return () =>
        h(
          DoctuiProvider,
          { colorScheme },
          {
            default: () =>
              h(
                "div",
                {
                  style: {
                    background: "var(--dui-color-body)",
                    color: "var(--dui-color-text)",
                    fontFamily: "var(--dui-font-family)",
                    padding: "var(--dui-spacing-xl)",
                  },
                },
                [
                  h(
                    "h2",
                    { style: { marginTop: 0 } },
                    "Semantic color × variant matrix",
                  ),
                  h(
                    "p",
                    { style: { color: "var(--dui-color-text-muted)" } },
                    "Each shared Color can drive the filled, light, outline and subtle contracts used by future components.",
                  ),
                  ...semanticColors.map((color) =>
                    h(
                      "section",
                      {
                        style: {
                          borderTop: "1px solid var(--dui-color-border)",
                          padding: "var(--dui-spacing-md) 0",
                        },
                      },
                      [
                        h(
                          "strong",
                          { style: { textTransform: "capitalize" } },
                          color,
                        ),
                        h(
                          "div",
                          {
                            style: {
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "var(--dui-spacing-sm)",
                              marginTop: "var(--dui-spacing-sm)",
                            },
                          },
                          semanticVariants.map((variant) =>
                            themedButton(variant, color, variant),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
          },
        );
    },
  });
}

const StoryStatusBadge = defineComponent({
  name: "StoryStatusBadge",
  props: {
    label: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      default: "success",
    },
  },
  setup(props) {
    return () => {
      const tone = props.tone as SemanticColor;

      return h(
        "span",
        {
          style: {
            background: colorVariable(tone, "light"),
            borderRadius: "var(--dui-radius-full)",
            color: colorVariable(tone, "light-text"),
            display: "inline-flex",
            fontSize: "var(--dui-font-size-xs)",
            fontWeight: "600",
            padding: "0.25rem var(--dui-spacing-sm)",
          },
        },
        props.label,
      );
    };
  },
});

const StoryMetricCard = defineComponent({
  name: "StoryMetricCard",
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        "article",
        {
          style: {
            background: "var(--dui-color-surface-raised)",
            border: "1px solid var(--dui-color-border)",
            borderRadius: "var(--dui-radius-md)",
            boxShadow: "var(--dui-shadow-xs)",
            padding: "var(--dui-spacing-lg)",
          },
        },
        [
          h(
            "div",
            {
              style: {
                color: "var(--dui-color-text-muted)",
                fontSize: "var(--dui-font-size-sm)",
              },
            },
            props.label,
          ),
          h(
            "div",
            {
              style: {
                fontSize: "var(--dui-font-size-xl)",
                fontWeight: "700",
                margin: "var(--dui-spacing-xs) 0",
              },
            },
            props.value,
          ),
          h(
            "div",
            {
              style: {
                color: "var(--dui-color-success-light-text)",
                fontSize: "var(--dui-font-size-xs)",
              },
            },
            props.detail,
          ),
        ],
      );
  },
});

const StoryActionBar = defineComponent({
  name: "StoryActionBar",
  setup() {
    return () =>
      h(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--dui-spacing-sm)",
          },
        },
        [
          themedButton("Create project", "primary", "filled"),
          themedButton("Export", "neutral", "outline"),
          themedButton("Archive", "danger", "subtle"),
        ],
      );
  },
});

const StoryActivityItem = defineComponent({
  name: "StoryActivityItem",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      default: "primary",
    },
  },
  setup(props) {
    return () => {
      const tone = props.tone as SemanticColor;

      return h(
        "li",
        {
          style: {
            alignItems: "flex-start",
            borderTop: "1px solid var(--dui-color-border)",
            display: "flex",
            gap: "var(--dui-spacing-sm)",
            padding: "var(--dui-spacing-md) 0",
          },
        },
        [
          h("span", {
            style: {
              background: colorVariable(tone, "filled"),
              borderRadius: "var(--dui-radius-full)",
              flex: "0 0 0.625rem",
              height: "0.625rem",
              marginTop: "0.35rem",
              width: "0.625rem",
            },
          }),
          h("div", {}, [
            h("strong", {}, props.title),
            h(
              "div",
              {
                style: {
                  color: "var(--dui-color-text-muted)",
                  fontSize: "var(--dui-font-size-sm)",
                  marginTop: "0.2rem",
                },
              },
              props.description,
            ),
          ]),
        ],
      );
    };
  },
});

const StoryDashboardPanel = defineComponent({
  name: "StoryDashboardPanel",
  setup() {
    return () =>
      h(
        "section",
        {
          style: {
            background: "var(--dui-color-surface)",
            border: "1px solid var(--dui-color-border)",
            borderRadius: "var(--dui-radius-lg)",
            padding: "var(--dui-spacing-xl)",
          },
        },
        [
          h(
            "header",
            {
              style: {
                alignItems: "flex-start",
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--dui-spacing-md)",
                justifyContent: "space-between",
              },
            },
            [
              h("div", {}, [
                h(
                  "div",
                  {
                    style: {
                      alignItems: "center",
                      display: "flex",
                      gap: "var(--dui-spacing-sm)",
                    },
                  },
                  [
                    h("h2", { style: { margin: 0 } }, "Workspace overview"),
                    h(StoryStatusBadge, { label: "Healthy", tone: "success" }),
                  ],
                ),
                h(
                  "p",
                  {
                    style: {
                      color: "var(--dui-color-text-muted)",
                      marginBottom: 0,
                    },
                  },
                  "A composed Storybook example that exercises theme tokens across several reusable UI pieces.",
                ),
              ]),
              h(StoryActionBar),
            ],
          ),
          h(
            "div",
            {
              style: {
                display: "grid",
                gap: "var(--dui-spacing-md)",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                marginTop: "var(--dui-spacing-xl)",
              },
            },
            [
              h(StoryMetricCard, {
                label: "Active projects",
                value: "24",
                detail: "+3 this week",
              }),
              h(StoryMetricCard, {
                label: "Build success",
                value: "98.7%",
                detail: "+1.2% this month",
              }),
              h(StoryMetricCard, {
                label: "Open reviews",
                value: "7",
                detail: "2 ready to merge",
              }),
            ],
          ),
          h(
            "div",
            {
              style: {
                background: "var(--dui-color-surface-raised)",
                border: "1px solid var(--dui-color-border)",
                borderRadius: "var(--dui-radius-md)",
                marginTop: "var(--dui-spacing-lg)",
                padding: "0 var(--dui-spacing-lg)",
              },
            },
            [
              h("h3", { style: { marginBottom: 0 } }, "Recent activity"),
              h("ul", { style: { listStyle: "none", margin: 0, padding: 0 } }, [
                h(StoryActivityItem, {
                  title: "Theme contract updated",
                  description:
                    "Semantic color variants now share one predictable token model.",
                  tone: "primary",
                }),
                h(StoryActivityItem, {
                  title: "Checks passing",
                  description:
                    "Lint, typecheck and tests validate the foundation before Phase 2.",
                  tone: "success",
                }),
                h(StoryActivityItem, {
                  title: "Documentation expanded",
                  description:
                    "Storybook and VitePress now demonstrate basic and advanced usage.",
                  tone: "warning",
                }),
              ]),
            ],
          ),
        ],
      );
  },
});

export const Light: Story = {
  render: renderPreview("light"),
};

export const Dark: Story = {
  render: renderPreview("dark"),
};

export const CustomTheme: Story = {
  render: renderPreview("light", customTheme),
};

export const SemanticColors: Story = {
  render: renderSemanticPalette("light"),
};

export const SemanticColorsDark: Story = {
  render: renderSemanticPalette("dark"),
};

export const NestedProviders: Story = {
  render: () => ({
    setup() {
      return () =>
        h(
          DoctuiProvider,
          { colorScheme: "dark" },
          {
            default: () =>
              h(
                "div",
                {
                  style: {
                    background: "var(--dui-color-body)",
                    color: "var(--dui-color-text)",
                    fontFamily: "var(--dui-font-family)",
                    padding: "var(--dui-spacing-xl)",
                  },
                },
                [
                  h("h2", { style: { marginTop: 0 } }, "Parent provider"),
                  previewCard(
                    "Default dark scope",
                    "The parent establishes dark semantic tokens for the whole section.",
                  ),
                  h(
                    DoctuiProvider,
                    { theme: compactTheme },
                    {
                      default: () =>
                        h(
                          "div",
                          {
                            style: {
                              background: "var(--dui-color-surface-raised)",
                              border: "1px solid var(--dui-color-border)",
                              borderRadius: "var(--dui-radius-md)",
                              marginTop: "var(--dui-spacing-lg)",
                              padding: "var(--dui-spacing-lg)",
                            },
                          },
                          [
                            h(
                              "h3",
                              { style: { marginTop: 0 } },
                              "Nested compact scope",
                            ),
                            h(
                              "p",
                              {
                                style: { color: "var(--dui-color-text-muted)" },
                              },
                              "The child inherits dark mode, then overrides spacing, radius and primary tokens.",
                            ),
                            themedButton("Nested primary", "primary", "filled"),
                          ],
                        ),
                    },
                  ),
                ],
              ),
          },
        );
    },
  }),
};

export const CssVariableOverrides: Story = {
  render: () => ({
    setup() {
      return () =>
        h(
          DoctuiProvider,
          {
            style: {
              "--dui-color-primary-filled": "#0f766e",
              "--dui-color-primary-filled-hover": "#115e59",
              "--dui-radius-md": "1.25rem",
              "--dui-spacing-md": "1.5rem",
            },
          },
          {
            default: () =>
              h(
                "div",
                {
                  style: {
                    background: "var(--dui-color-body)",
                    color: "var(--dui-color-text)",
                    fontFamily: "var(--dui-font-family)",
                    padding: "var(--dui-spacing-xl)",
                  },
                },
                [
                  h(
                    "h2",
                    { style: { marginTop: 0 } },
                    "Local CSS variable overrides",
                  ),
                  previewCard(
                    "No theme object mutation",
                    "The provider remains immutable while a narrower scope overrides documented CSS variables.",
                  ),
                  h("div", { style: { marginTop: "var(--dui-spacing-md)" } }, [
                    themedButton("Overridden primary", "primary", "filled"),
                  ]),
                ],
              ),
          },
        );
    },
  }),
};

export const AdvancedComposition: Story = {
  render: () => ({
    setup() {
      return () =>
        h(
          DoctuiProvider,
          { colorScheme: "light", theme: customTheme },
          {
            default: () =>
              h(
                "main",
                {
                  style: {
                    background: "var(--dui-color-body)",
                    color: "var(--dui-color-text)",
                    fontFamily: "var(--dui-font-family)",
                    minHeight: "100vh",
                    padding: "var(--dui-spacing-xl)",
                  },
                },
                [h(StoryDashboardPanel)],
              ),
          },
        );
    },
  }),
};
