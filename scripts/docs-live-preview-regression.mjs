import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  guidePreviewCoverage,
  livePreviewManifest,
  nonVisualDocsComponents,
  renderSmokeCases,
} from "../apps/docs/.vitepress/live-preview-manifest.mjs";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const guidesDir = join(rootDir, "apps/docs/guide");
const themePath = join(rootDir, "apps/docs/.vitepress/theme/index.ts");
const distDir = join(rootDir, "apps/docs/.vitepress/dist/guide");

function stripFencedCode(source) {
  const output = [];
  let fence = null;

  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*(```+|~~~+)/);
    if (match) {
      const marker = match[1][0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence === null) output.push(line);
  }

  return output.join("\n");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getThemeRegistry(themeSource) {
  const start = themeSource.indexOf("const docsComponents");
  if (start === -1) throw new Error("Cannot find docsComponents registry");
  const end = themeSource.indexOf("};", start);
  if (end === -1) throw new Error("Cannot parse docsComponents registry");
  return themeSource.slice(start, end + 2);
}

function parseRegisteredComponents(registrySource) {
  return [...registrySource.matchAll(/^\s{2}([A-Z][A-Za-z0-9]+),\s*$/gm)].map(
    (match) => match[1],
  );
}

function hasLiveTag(source, component) {
  const expression = new RegExp(`<${escapeRegex(component)}(?:\\s|/?>)`);
  return expression.test(stripFencedCode(source));
}

function hasLocalPublicImport(source, component) {
  const clean = stripFencedCode(source);
  const expression = new RegExp(
    `import\\s*\\{[\\s\\S]*?\\b${escapeRegex(component)}\\b[\\s\\S]*?\\}\\s*from\\s*["']@doctui/`,
  );
  return expression.test(clean);
}

function countSourcePreviews(source) {
  const clean = stripFencedCode(source);
  return [...clean.matchAll(/class=(?:"[^"]*\bdocs-preview\b[^"]*"|'[^']*\bdocs-preview\b[^']*')/g)].length;
}

function runSourceCheck() {
  const errors = [];
  const themeSource = readFileSync(themePath, "utf8");
  const registrySource = getThemeRegistry(themeSource);
  const registered = parseRegisteredComponents(registrySource);
  const excluded = new Set(nonVisualDocsComponents);
  const manifestComponents = new Set(
    livePreviewManifest.map((entry) => entry.component),
  );

  if (!themeSource.includes("Layout: DocsLayout")) {
    errors.push("docs theme must render the VitePress layout inside DoctuiProvider");
  }

  for (const component of registered) {
    if (!excluded.has(component) && !manifestComponents.has(component)) {
      errors.push(
        `${component}: registered in docs theme but missing from live preview manifest`,
      );
    }
  }

  for (const entry of livePreviewManifest) {
    const guidePath = join(guidesDir, entry.guide);
    if (!existsSync(guidePath)) {
      errors.push(`${entry.component}: guide ${entry.guide} does not exist`);
      continue;
    }

    const source = readFileSync(guidePath, "utf8");
    if (!hasLiveTag(source, entry.component)) {
      errors.push(
        `${entry.component}: ${entry.guide} has no live tag outside fenced code`,
      );
    }

    const globallyRegistered = new RegExp(
      `^\\s{2}${escapeRegex(entry.component)},\\s*$`,
      "m",
    ).test(registrySource);
    if (!globallyRegistered && !hasLocalPublicImport(source, entry.component)) {
      errors.push(
        `${entry.component}: preview is neither globally registered nor locally imported from a public @doctui package`,
      );
    }
  }

  for (const coverage of guidePreviewCoverage) {
    const guidePath = join(guidesDir, coverage.guide);
    if (!existsSync(guidePath)) {
      errors.push(`${coverage.guide}: guide-level preview coverage file does not exist`);
      continue;
    }

    const source = readFileSync(guidePath, "utf8");
    const previewCount = countSourcePreviews(source);
    if (previewCount < coverage.minPreviews) {
      errors.push(
        `${coverage.guide}: expected at least ${coverage.minPreviews} live preview boundaries, found ${previewCount}`,
      );
    }
  }

  if (errors.length) {
    throw new Error(
      `Docs live-preview source regression:\n- ${errors.join("\n- ")}`,
    );
  }

  console.log(
    `Docs live-preview source coverage: ${livePreviewManifest.length} components across ${guidePreviewCoverage.length} audited guides`,
  );
}

function builtGuidePath(slug) {
  const candidates = [
    join(distDir, `${slug}.html`),
    join(distDir, slug, "index.html"),
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

function assertThemeProvider(html, guide, errors) {
  if (!html.includes("data-dui-provider")) {
    errors.push(`${guide}: rendered page is missing DoctuiProvider`);
  }
  if (!html.includes("--dui-color-text:") || !html.includes("--dui-spacing-md:")) {
    errors.push(`${guide}: rendered provider is missing doctui theme CSS variables`);
  }
}

function runRenderCheck() {
  const errors = [];

  for (const coverage of guidePreviewCoverage) {
    const slug = coverage.guide.replace(/\.md$/, "");
    const pagePath = builtGuidePath(slug);
    if (!pagePath) {
      errors.push(`${slug}: built VitePress page not found`);
      continue;
    }

    const html = readFileSync(pagePath, "utf8");
    assertThemeProvider(html, slug, errors);

    const renderedPreviews = (html.match(/\bdocs-preview\b/g) ?? []).length;
    if (renderedPreviews < coverage.minPreviews) {
      errors.push(
        `${slug}: expected at least ${coverage.minPreviews} rendered preview boundaries, found ${renderedPreviews}`,
      );
    }
  }

  for (const smokeCase of renderSmokeCases) {
    const pagePath = builtGuidePath(smokeCase.guide);
    if (!pagePath) {
      errors.push(`${smokeCase.guide}: built VitePress page not found`);
      continue;
    }

    const html = readFileSync(pagePath, "utf8");
    for (const marker of smokeCase.markers) {
      const doubleQuoted = `data-dui-component="${marker}"`;
      const singleQuoted = `data-dui-component='${marker}'`;
      if (!html.includes(doubleQuoted) && !html.includes(singleQuoted)) {
        errors.push(`${smokeCase.guide}: rendered marker ${marker} not found`);
      }
    }
  }

  if (errors.length) {
    throw new Error(
      `Docs live-preview render regression:\n- ${errors.join("\n- ")}`,
    );
  }

  console.log(
    `Docs live-preview render smoke: ${guidePreviewCoverage.length} themed guides + ${renderSmokeCases.length} component marker cases`,
  );
}

const mode = process.argv[2] ?? "--source";
if (mode === "--source") runSourceCheck();
else if (mode === "--render") runRenderCheck();
else throw new Error(`Unknown mode: ${mode}`);
