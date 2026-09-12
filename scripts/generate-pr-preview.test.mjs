import { describe, expect, it } from "vitest";
import {
  renderPreviewDashboard,
  renderPrPreviewPage,
} from "./generate-pr-preview.mjs";

describe("PR preview pages", () => {
  it("renders docs, Storybook, PR, and commit metadata", () => {
    const html = renderPrPreviewPage({
      number: 5,
      title: "Add Button <script>",
      branch: "feat/button",
      sha: "1234567890abcdef",
      repository: "OneTwoTen/doctui",
      prUrl: "https://github.com/OneTwoTen/doctui/pull/5",
      runUrl: "https://github.com/OneTwoTen/doctui/actions/runs/123",
      generatedAt: "2026-09-12T00:00:00.000Z",
    });

    expect(html).toContain("PR #5");
    expect(html).toContain("./docs/");
    expect(html).toContain("./storybook/");
    expect(html).toContain("1234567");
    expect(html).toContain("Add Button &lt;script&gt;");
    expect(html).not.toContain("Add Button <script>");
  });

  it("renders a dashboard for active previews", () => {
    const html = renderPreviewDashboard([
      {
        number: 8,
        title: "Grid primitives",
        branch: "feat/grid",
        sha: "abcdef123456",
      },
      {
        number: 5,
        title: "Basic controls",
        branch: "feat/basic-controls",
        sha: "1234567890ab",
      },
    ]);

    expect(html).toContain("./pr-8/");
    expect(html).toContain("#8 · Grid primitives");
    expect(html).toContain("./pr-5/");
  });
});
