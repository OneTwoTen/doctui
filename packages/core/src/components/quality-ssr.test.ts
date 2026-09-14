import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { Combobox, Menu, TextInput, Tooltip } from "../index";

async function renderRelationshipFixture() {
  return renderToString(
    createSSRApp({
      render: () =>
        h("div", [
          h(TextInput, {
            label: "Email",
            description: "Use a work address",
            error: "Required",
          }),
          h(Combobox, {
            label: "Technology",
            searchable: true,
            data: [
              { value: "vue", label: "Vue" },
              { value: "rust", label: "Rust" },
            ],
          }),
          h(
            Menu,
            {
              modelValue: false,
              data: [{ value: "profile", label: "Profile" }],
            },
            {
              target: () => h("button", { type: "button" }, "Actions"),
            },
          ),
          h(
            Tooltip,
            { label: "More information", modelValue: true },
            {
              default: () =>
                h("button", { id: "quality-tooltip-trigger" }, "Info"),
            },
          ),
        ]),
    }),
  );
}

describe("PR #7 SSR relationship ids", () => {
  it("renders deterministic ids for field, combobox, menu and tooltip relationships", async () => {
    const first = await renderRelationshipFixture();
    const second = await renderRelationshipFixture();

    expect(first).toBe(second);
    expect(first).toMatch(/<label[^>]+for="([^"]+)"/);
    expect(first).toContain("aria-describedby=");
    expect(first).toContain('aria-haspopup="listbox"');
    expect(first).toContain('aria-haspopup="menu"');
    expect(first).toMatch(
      /id="quality-tooltip-trigger"[^>]+aria-describedby="([^"]+)"/,
    );
    expect(first).toMatch(/role="tooltip"/);
  });
});
