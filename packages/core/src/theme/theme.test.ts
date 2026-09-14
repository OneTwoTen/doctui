import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { createTheme } from "./create-theme";
import { getThemeCssVariables } from "./css-variables";
import { DoctuiProvider } from "./DoctuiProvider";
import { DEFAULT_THEME } from "./default-theme";
import { mergeTheme } from "./merge-theme";

const customTheme = createTheme({
  spacing: { md: "2rem" },
  radius: { md: "0.875rem" },
  colors: {
    dark: {
      primary: {
        filled: "#7c3aed",
      },
    },
  },
});

describe("theme foundation", () => {
  it("merges nested theme scales and semantic color tokens without dropping defaults", () => {
    const theme = mergeTheme(DEFAULT_THEME, customTheme);

    expect(theme.spacing.md).toBe("2rem");
    expect(theme.spacing.sm).toBe(DEFAULT_THEME.spacing.sm);
    expect(theme.colors.dark.primary.filled).toBe("#7c3aed");
    expect(theme.colors.dark.primary.light).toBe(
      DEFAULT_THEME.colors.dark.primary.light,
    );
    expect(theme.colors.dark.text).toBe(DEFAULT_THEME.colors.dark.text);
    expect(DEFAULT_THEME.spacing.md).toBe("1rem");
  });

  it("uses the doctui typography stack as a public theme token", () => {
    const variables = getThemeCssVariables(DEFAULT_THEME, "light");

    expect(DEFAULT_THEME.fontFamily).toContain('"Be Vietnam Pro"');
    expect(DEFAULT_THEME.fontFamily).toContain('"Segoe UI Variable"');
    expect(variables["--dui-font-family"]).toBe(DEFAULT_THEME.fontFamily);
  });

  it("maps the active color scheme and scales to --dui-* variables", () => {
    const theme = mergeTheme(DEFAULT_THEME, customTheme);
    const variables = getThemeCssVariables(theme, "dark");

    expect(variables["--dui-spacing-md"]).toBe("2rem");
    expect(variables["--dui-radius-md"]).toBe("0.875rem");
    expect(variables["--dui-color-primary-filled"]).toBe("#7c3aed");
    expect(variables["--dui-color-success-filled"]).toBe(
      DEFAULT_THEME.colors.dark.success.filled,
    );
    expect(variables["--dui-color-text"]).toBe(DEFAULT_THEME.colors.dark.text);
    expect(variables["--dui-z-index-modal"]).toBe("500");
    expect(variables["--dui-breakpoint-md"]).toBeUndefined();
  });

  it("keeps resolved themes readonly at runtime", () => {
    const theme = mergeTheme(DEFAULT_THEME, customTheme);

    expect(Object.isFrozen(DEFAULT_THEME)).toBe(true);
    expect(Object.isFrozen(DEFAULT_THEME.spacing)).toBe(true);
    expect(Object.isFrozen(theme)).toBe(true);
    expect(Object.isFrozen(theme.colors.dark.primary)).toBe(true);
  });

  it("scopes theme variables and color scheme on the provider", () => {
    const wrapper = mount(DoctuiProvider, {
      props: {
        theme: customTheme,
        colorScheme: "dark",
      },
      slots: { default: "content" },
    });

    expect(wrapper.attributes("data-dui-color-scheme")).toBe("dark");
    expect(wrapper.element.style.getPropertyValue("--dui-spacing-md")).toBe(
      "2rem",
    );
    expect(
      wrapper.element.style.getPropertyValue("--dui-color-primary-filled"),
    ).toBe("#7c3aed");
  });

  it("allows consumer CSS variables to override provider defaults", () => {
    const wrapper = mount(DoctuiProvider, {
      attrs: {
        style: "--dui-spacing-md: 3rem; --dui-color-primary-filled: #111827;",
      },
      slots: { default: "content" },
    });

    expect(wrapper.element.style.getPropertyValue("--dui-spacing-md")).toBe(
      "3rem",
    );
    expect(
      wrapper.element.style.getPropertyValue("--dui-color-primary-filled"),
    ).toBe("#111827");
  });

  it("inherits a parent provider theme before applying nested overrides", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              DoctuiProvider,
              { theme: { spacing: { md: "2.5rem" } } },
              {
                default: () =>
                  h(
                    DoctuiProvider,
                    { theme: { radius: { md: "1.25rem" } } },
                    { default: () => h("span", "nested") },
                  ),
              },
            );
        },
      }),
    );

    const providers = wrapper.findAll("[data-dui-provider]");
    expect(providers).toHaveLength(2);
    expect(
      providers[1]?.element.style.getPropertyValue("--dui-spacing-md"),
    ).toBe("2.5rem");
    expect(
      providers[1]?.element.style.getPropertyValue("--dui-radius-md"),
    ).toBe("1.25rem");
  });
});
