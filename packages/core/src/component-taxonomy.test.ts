import { describe, expect, it } from "vitest";
import {
  DOCTUI_COMPONENT_CATEGORIES,
  DOCTUI_COMPONENT_METADATA,
  getComponentCategory,
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
    expect(DOCTUI_COMPONENT_METADATA.find(({ name }) => name === "Button")?.category).toBe(
      "actions",
    );
  });
});
