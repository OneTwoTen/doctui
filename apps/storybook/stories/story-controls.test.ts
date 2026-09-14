import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const componentStories = [
  "text-input.stories.ts",
  "textarea.stories.ts",
  "number-input.stories.ts",
  "password-input.stories.ts",
  "checkbox.stories.ts",
  "radio.stories.ts",
  "switch.stories.ts",
  "overlay.stories.ts",
  "modal.stories.ts",
  "drawer.stories.ts",
] as const;

const overlayActionScenarios = {
  "modal.stories.ts": [
    "DestructiveAction",
    "LoadingAction",
    "DisabledAction",
    "LongContentFixedFooter",
    "ResponsiveActions",
    "NoFooter",
    "CustomFooterLayout",
    "AdvancedComposition",
  ],
  "drawer.stories.ts": [
    "ApplyFilters",
    "LoadingAction",
    "LongContentFixedFooter",
    "ResponsiveActions",
    "NoFooter",
    "LeftPosition",
    "CustomBackdrop",
  ],
} as const;

describe("Storybook component controls contract", () => {
  it.each(componentStories)(
    "%s exposes functional Controls",
    async (filename) => {
      const source = await readFile(new URL(filename, import.meta.url), "utf8");

      expect(source).toMatch(/component:\s*[A-Z][A-Za-z0-9]*/);
      expect(source).toContain("args:");
      expect(source).toContain("argTypes:");
      expect(source).toMatch(/render:\s*\(args\)/);
    },
  );

  it.each(Object.entries(overlayActionScenarios))(
    "%s documents footer and action edge cases",
    async (filename, scenarios) => {
      const source = await readFile(new URL(filename, import.meta.url), "utf8");

      expect(source).toContain("footer:");
      expect(source).toContain("Button");
      for (const scenario of scenarios) {
        expect(source).toContain(`export const ${scenario}`);
      }
    },
  );
});
