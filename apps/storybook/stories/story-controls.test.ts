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
] as const;

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
});
