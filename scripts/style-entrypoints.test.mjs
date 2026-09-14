import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("documentation style entrypoints", () => {
  it("loads the published doctui stylesheet and provider in Storybook", async () => {
    const preview = await readFile(
      "apps/storybook/.storybook/preview.ts",
      "utf8",
    );

    expect(preview).toContain('import "@doctui/core/styles.css";');
    expect(preview).toContain('import { DoctuiProvider } from "@doctui/core";');
    expect(preview).toContain("<DoctuiProvider><story /></DoctuiProvider>");
  });

  it("loads the published doctui stylesheet in VitePress", async () => {
    const theme = await readFile("apps/docs/.vitepress/theme/index.ts", "utf8");

    expect(theme).toContain('import "@doctui/core/styles.css";');
  });
});
