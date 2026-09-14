import {
  Container,
  createTheme,
  Divider,
  type DoctuiColorScheme,
  DoctuiProvider,
  Group,
  Loader,
  Stack,
  Text,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";

const meta = {
  title: "Foundation/Theme Contracts",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const customTheme = createTheme({
  breakpoints: { md: "38rem" },
  colors: {
    light: {
      danger: { outline: "#be123c" },
      warning: { filled: "#ea580c" },
    },
    dark: {
      danger: { outline: "#fb7185" },
      warning: { filled: "#fdba74" },
    },
  },
});

function renderThemeContract(
  colorScheme: DoctuiColorScheme,
  theme = createTheme(),
) {
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
                minHeight: "18rem",
                padding: "var(--dui-spacing-xl)",
              },
            },
            [
              h(Container, { size: "md" }, () =>
                h(Stack, { gap: "lg" }, () => [
                  h(Text, { as: "strong" }, () =>
                    `${colorScheme} semantic component tokens`,
                  ),
                  h(
                    Text,
                    { muted: true, size: "sm" },
                    () =>
                      "Container width comes from the provider breakpoint token; Divider and Loader consume semantic color tokens.",
                  ),
                  h(Divider, {
                    color: "danger",
                    label: "danger outline token",
                  }),
                  h(Group, { gap: "lg" }, () => [
                    h(Loader, { color: "primary", type: "oval" }),
                    h(Loader, { color: "success", type: "dots" }),
                    h(Loader, { color: "warning", type: "bars" }),
                  ]),
                ]),
              ),
            ],
          ),
      },
    );
}

export const Light: Story = {
  render: renderThemeContract("light"),
};

export const Dark: Story = {
  render: renderThemeContract("dark"),
};

export const CustomTokenOverrides: Story = {
  render: renderThemeContract("light", customTheme),
};

export const CustomTokenOverridesDark: Story = {
  render: renderThemeContract("dark", customTheme),
};
