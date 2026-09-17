import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import ts from "@typescript/typescript6";
import { livePreviewManifest } from "../apps/docs/.vitepress/live-preview-manifest.mjs";
import { DOCTUI_REGISTRY } from "../metadata/registry.ts";

const PUBLIC_COMPONENT_PACKAGES = new Set([
  "@doctui/core",
  "@doctui/dates",
  "@doctui/notifications",
]);

function sameSet(left, right) {
  return (
    left.size === right.size && [...left].every((value) => right.has(value))
  );
}

function sortedDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}

async function collectStoryFiles(directory) {
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".stories.ts"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

function importedStoryComponents(source, expectedPackages) {
  const imports = [];

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;

    const packageName = statement.moduleSpecifier.text;
    if (!PUBLIC_COMPONENT_PACKAGES.has(packageName)) continue;

    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;

    for (const element of bindings.elements) {
      const importedName = element.propertyName?.text ?? element.name.text;
      const localName = element.name.text;
      const expectedPackage = expectedPackages.get(importedName);
      if (expectedPackage !== packageName) continue;
      imports.push({ importedName, localName });
    }
  }

  return imports;
}

function identifierIsUsed(source, localName) {
  let usages = 0;

  const visit = (node) => {
    if (ts.isIdentifier(node) && node.text === localName) {
      const parent = node.parent;
      const isImportBinding =
        ts.isImportSpecifier(parent) ||
        ts.isImportClause(parent) ||
        ts.isNamespaceImport(parent);
      if (!isImportBinding) usages += 1;
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return usages > 0;
}

async function main() {
  const errors = [];
  const registryComponents = DOCTUI_REGISTRY.components;
  const registryNames = new Set(registryComponents.map(({ name }) => name));
  const expectedPackages = new Map(
    registryComponents.map(({ name, package: packageName }) => [name, packageName]),
  );

  const coreIndex = await readFile("packages/core/src/index.ts", "utf8");
  if (coreIndex.includes('export * from "./primitives/index"')) {
    errors.push(
      "@doctui/core root still re-exports internal primitives; keep low-level primitives internal unless they are deliberately promoted into the public registry/docs contract",
    );
  }

  const manifestNames = new Set(
    livePreviewManifest.map(({ component }) => component),
  );
  if (!sameSet(registryNames, manifestNames)) {
    const missingLivePreviews = sortedDifference(registryNames, manifestNames);
    const staleLivePreviews = sortedDifference(manifestNames, registryNames);
    if (missingLivePreviews.length) {
      errors.push(
        `Registry components missing VitePress live-preview coverage: ${missingLivePreviews.join(", ")}`,
      );
    }
    if (staleLivePreviews.length) {
      errors.push(
        `VitePress live-preview manifest contains components outside the canonical registry: ${staleLivePreviews.join(", ")}`,
      );
    }
  }

  const storyFiles = await collectStoryFiles("apps/storybook/stories");
  const storyCoverage = new Map(
    registryComponents.map(({ name }) => [name, new Set()]),
  );

  for (const storyFile of storyFiles) {
    const text = await readFile(storyFile, "utf8");
    const source = ts.createSourceFile(
      storyFile,
      text,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );

    for (const { importedName, localName } of importedStoryComponents(
      source,
      expectedPackages,
    )) {
      if (!identifierIsUsed(source, localName)) continue;
      storyCoverage.get(importedName)?.add(storyFile);
    }
  }

  const missingStories = [...storyCoverage]
    .filter(([, files]) => files.size === 0)
    .map(([name]) => name)
    .sort();
  if (missingStories.length) {
    errors.push(
      `Registry components missing Storybook render coverage from their public package: ${missingStories.join(", ")}`,
    );
  }

  if (errors.length) {
    throw new Error(`Documentation coverage regression:\n- ${errors.join("\n- ")}`);
  }

  console.log(
    `Documentation coverage: ${registryComponents.length} registry components have VitePress live previews and Storybook coverage; internal primitives are not root exports`,
  );
}

await main();
