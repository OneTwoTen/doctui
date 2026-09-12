import { describe, expect, it } from "vitest";
import * as core from "./index";

describe("@doctui/core foundation", () => {
  it("resolves as an ESM module", () => {
    expect(core).toBeDefined();
  });
});
