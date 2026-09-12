import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import * as core from "./index";
import SmokeComponent from "./test-fixtures/SmokeComponent.vue";

describe("@doctui/core foundation", () => {
  it("resolves as an ESM module", () => {
    expect(core).toBeDefined();
  });

  it("compiles and mounts a Vue SFC", () => {
    const wrapper = mount(SmokeComponent, {
      props: { label: "doctui" },
    });

    expect(wrapper.get("button").text()).toBe("doctui");
  });
});
