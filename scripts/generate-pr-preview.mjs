import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const pageShell = ({ title, body }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color-scheme: light dark; }
      * { box-sizing: border-box; }
      body { margin: 0; background: Canvas; color: CanvasText; }
      main { width: min(960px, calc(100% - 32px)); margin: 64px auto; }
      a { color: inherit; }
      .eyebrow { margin: 0 0 8px; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .62; }
      h1 { margin: 0; font-size: clamp(32px, 6vw, 56px); line-height: 1.05; letter-spacing: -.04em; }
      .lede { max-width: 720px; margin: 16px 0 0; font-size: 18px; line-height: 1.6; opacity: .72; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 32px; }
      .card { display: block; padding: 20px; border: 1px solid color-mix(in srgb, CanvasText 16%, transparent); border-radius: 16px; text-decoration: none; background: color-mix(in srgb, Canvas 94%, CanvasText 6%); }
      .card:hover { border-color: color-mix(in srgb, CanvasText 35%, transparent); transform: translateY(-1px); }
      .card strong { display: block; margin-bottom: 8px; font-size: 18px; }
      .card span { opacity: .66; line-height: 1.5; }
      dl { display: grid; grid-template-columns: max-content 1fr; gap: 10px 18px; margin: 32px 0 0; padding: 20px; border: 1px solid color-mix(in srgb, CanvasText 14%, transparent); border-radius: 16px; }
      dt { font-weight: 700; opacity: .7; }
      dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .92em; }
      .list { display: grid; gap: 12px; margin-top: 32px; }
      .preview { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; padding: 18px 20px; border: 1px solid color-mix(in srgb, CanvasText 14%, transparent); border-radius: 16px; text-decoration: none; }
      .preview:hover { border-color: color-mix(in srgb, CanvasText 35%, transparent); }
      .preview-title { font-weight: 700; }
      .preview-meta { margin-top: 5px; font-size: 14px; opacity: .65; }
      .empty { margin-top: 32px; padding: 24px; border: 1px dashed color-mix(in srgb, CanvasText 24%, transparent); border-radius: 16px; opacity: .7; }
      @media (max-width: 560px) { main { margin: 36px auto; } dl { grid-template-columns: 1fr; } dd + dt { margin-top: 8px; } .preview { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`;

export function renderPrPreviewPage(metadata) {
  const shortSha = metadata.sha.slice(0, 7);

  return pageShell({
    title: `doctui PR #${metadata.number} preview`,
    body: `
      <p class="eyebrow">doctui · pull request preview</p>
      <h1>PR #${escapeHtml(metadata.number)}</h1>
      <p class="lede">${escapeHtml(metadata.title)}</p>

      <div class="grid">
        <a class="card" href="./docs/">
          <strong>Review docs →</strong>
          <span>Browse the VitePress documentation built from this PR.</span>
        </a>
        <a class="card" href="./storybook/">
          <strong>Review Storybook →</strong>
          <span>Inspect component states, examples, and compositions from this PR.</span>
        </a>
        <a class="card" href="${escapeHtml(metadata.prUrl)}">
          <strong>Open pull request →</strong>
          <span>Return to the GitHub discussion and changed files.</span>
        </a>
      </div>

      <dl>
        <dt>Branch</dt><dd><code>${escapeHtml(metadata.branch)}</code></dd>
        <dt>Commit</dt><dd><code>${escapeHtml(shortSha)}</code></dd>
        <dt>Repository</dt><dd>${escapeHtml(metadata.repository)}</dd>
        <dt>Generated</dt><dd>${escapeHtml(metadata.generatedAt)}</dd>
        <dt>Workflow</dt><dd><a href="${escapeHtml(metadata.runUrl)}">View GitHub Actions run</a></dd>
      </dl>`,
  });
}

export function renderPreviewDashboard(previews) {
  const items = previews
    .map(
      (preview) => `
        <a class="preview" href="./pr-${escapeHtml(preview.number)}/">
          <div>
            <div class="preview-title">#${escapeHtml(preview.number)} · ${escapeHtml(preview.title)}</div>
            <div class="preview-meta">${escapeHtml(preview.branch)} · ${escapeHtml(preview.sha.slice(0, 7))}</div>
          </div>
          <span>Review →</span>
        </a>`,
    )
    .join("");

  return pageShell({
    title: "doctui PR previews",
    body: `
      <p class="eyebrow">doctui · review hub</p>
      <h1>Pull request previews</h1>
      <p class="lede">Live documentation and Storybook snapshots for open doctui pull requests.</p>
      ${items ? `<div class="list">${items}</div>` : '<div class="empty">There are no active PR previews.</div>'}`,
  });
}

async function writePrPage(outputDirectory) {
  const metadata = {
    number: process.env.PR_NUMBER ?? "",
    title: process.env.PR_TITLE ?? "",
    branch: process.env.PR_BRANCH ?? "",
    sha: process.env.PR_SHA ?? "",
    repository: process.env.GITHUB_REPOSITORY ?? "",
    prUrl: process.env.PR_URL ?? "",
    runUrl: process.env.RUN_URL ?? "",
    generatedAt: new Date().toISOString(),
  };

  await mkdir(outputDirectory, { recursive: true });
  await Promise.all([
    writeFile(join(outputDirectory, "index.html"), renderPrPreviewPage(metadata)),
    writeFile(join(outputDirectory, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`),
  ]);
}

async function writeDashboard(previewsDirectory, outputFile) {
  await mkdir(previewsDirectory, { recursive: true });
  const entries = await readdir(previewsDirectory, { withFileTypes: true });
  const previews = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith("pr-")) {
      continue;
    }

    try {
      const metadata = JSON.parse(
        await readFile(join(previewsDirectory, entry.name, "metadata.json"), "utf8"),
      );
      previews.push(metadata);
    } catch {
      // Ignore incomplete preview directories so one bad snapshot cannot break Pages.
    }
  }

  previews.sort((left, right) => Number(right.number) - Number(left.number));
  await writeFile(outputFile, renderPreviewDashboard(previews));
}

async function main() {
  const [command, first, second] = process.argv.slice(2);

  if (command === "page" && first) {
    await writePrPage(first);
    return;
  }

  if (command === "dashboard" && first && second) {
    await writeDashboard(first, second);
    return;
  }

  throw new Error(
    "Usage: node scripts/generate-pr-preview.mjs page <output-dir> | dashboard <previews-dir> <output-file>",
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
