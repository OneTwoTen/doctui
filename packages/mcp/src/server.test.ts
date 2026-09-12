import { describe, expect, it } from "vitest";
import {
  DOCTUI_MCP_VERSION,
  findComponentForUseCase,
  getComponentApi,
  searchComponents,
} from "./index";

describe("@doctui/mcp-server", () => {
  it("searches the generated registry and exposes API details", () => {
    expect(DOCTUI_MCP_VERSION).toBe("0.0.0");
    expect(searchComponents("multiple selected values")[0]?.name).toBe(
      "MultiSelect",
    );
    expect(getComponentApi("Modal")?.props).toContain("closeOnEscape");
  });

  it("recommends exported components for use cases", () => {
    expect(
      findComponentForUseCase(
        "searchable control with multiple selected values",
      )[0]?.name,
    ).toBe("MultiSelect");
  });
});
