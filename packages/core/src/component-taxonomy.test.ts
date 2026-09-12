import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  DOCTUI_COMPONENT_CATEGORIES,
  DOCTUI_COMPONENT_METADATA,
  getComponentCategory,
  getComponentStorybookTitle,
} from "./component-metadata";

describe("component taxonomy", () => {
  it("exposes stable machine ids and human labels for Storybook and MCP", () => {
    expect(DOCTUI_COMPONENT_CATEGORIES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "layout", label: "Layout" }),
        expect.objectContaining({ id: "typography", label: "Typography" }),
        expect.objectContaining({ id: "actions", label: "Actions" }),
      ]),
    );
  });

  it("assigns every component to a registered category", () => {
    for (const component of DOCTUI_COMPONENT_METADATA) {
      expect(getComponentCategory(component.category)).toBeDefined();
    }
  });

  it("uses plural stable category ids for action components", () => {
    expect(
      DOCTUI_COMPONENT_METADATA.find(({ name }) => name === "Button")?.category,
    ).toBe("actions");
  });

  it("keeps Storybook literal titles aligned with the metadata registry", async () => {
    const stories = [
      ["Box", "box.stories.ts"],
      ["Flex", "flex.stories.ts"],
      ["Stack", "stack.stories.ts"],
      ["Group", "group.stories.ts"],
      ["Text", "text.stories.ts"],
      ["Title", "title.stories.ts"],
      ["Button", "button.stories.ts"],
    ] as const;

    for (const [component, file] of stories) {
      const source = await readFile(`apps/storybook/stories/${file}`, "utf8");

      expect(source).toContain(
        `title: "${getComponentStorybookTitle(component)}"`,
      );
    }
  });

  it("keeps Storybook category order aligned with the registry", async () => {
    const source = await readFile(
      "apps/storybook/.storybook/preview.ts",
      "utf8",
    );
    let previousIndex = -1;

    for (const { label } of DOCTUI_COMPONENT_CATEGORIES) {
      const currentIndex = source.indexOf(`"${label}"`);

      expect(currentIndex).toBeGreaterThan(previousIndex);
      previousIndex = currentIndex;
    }
  });
});
