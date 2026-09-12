import {
  createTheme,
  type DoctuiColorScheme,
  DoctuiProvider,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";

const meta = {
  title: "Foundation/Theme",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const customTheme = createTheme({
  radius: { md: "1rem" },
  colors: {
    light: {
      primaryFilled: "#7c3aed",
      primaryLight: "#ede9fe",
    },
    dark: {
      primaryFilled: "#a78bfa",
      primaryLight: "#2e1065",
    },
  },
});

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
                    padding: "var(--dui-spacing-xl)",
                    minHeight: "240px",
                  },
                },
                [
                  h("h2", { style: { marginTop: 0 } }, `${colorScheme} theme`),
                  h(
                    "p",
                    { style: { color: "var(--dui-color-text-muted)" } },
                    "This preview consumes only public --dui-* theme variables.",
                  ),
                  h(
                    "div",
                    {
                      style: {
                        background: "var(--dui-color-surface-raised)",
                        border: "1px solid var(--dui-color-border)",
                        borderRadius: "var(--dui-radius-md)",
                        boxShadow: "var(--dui-shadow-md)",
                        padding: "var(--dui-spacing-lg)",
                      },
                    },
                    [
                      h(
                        "button",
                        {
                          type: "button",
                          style: {
                            background: "var(--dui-color-primary-filled)",
                            border: 0,
                            borderRadius: "var(--dui-radius-md)",
                            color: "white",
                            cursor: "pointer",
                            font: "inherit",
                            padding:
                              "var(--dui-spacing-sm) var(--dui-spacing-md)",
                          },
                        },
                        "Primary token",
                      ),
                    ],
                  ),
                ],
              ),
          },
        );
    },
  });
}

export const Light: Story = {
  render: renderPreview("light"),
};

export const Dark: Story = {
  render: renderPreview("dark"),
};

export const CustomTheme: Story = {
  render: renderPreview("light", customTheme),
};
