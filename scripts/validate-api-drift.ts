import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { QUALITY_PUBLIC_API } from "../metadata/quality-contract";
import { DOCTUI_REGISTRY } from "../metadata/registry";

function propertyName(node: ts.PropertyName | undefined) {
  if (!node) return undefined;
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return undefined;
}

function objectElementName(property: ts.ObjectLiteralElementLike) {
  return "name" in property ? propertyName(property.name) : undefined;
}

function objectMember(
  object: ts.ObjectLiteralExpression,
  name: string,
): ts.ObjectLiteralElementLike | undefined {
  return object.properties.find(
    (property) => objectElementName(property) === name,
  );
}

function componentOptions(source: ts.SourceFile, componentName: string) {
  let result: ts.ObjectLiteralExpression | undefined;

  const visit = (node: ts.Node) => {
    if (result) return;
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "defineComponent" &&
      node.arguments[0] &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      const options = node.arguments[0];
      const nameMember = objectMember(options, "name");
      if (
        nameMember &&
        ts.isPropertyAssignment(nameMember) &&
        ts.isStringLiteral(nameMember.initializer) &&
        nameMember.initializer.text === `Dui${componentName}`
      ) {
        result = options;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  if (!result)
    throw new Error(`Could not find defineComponent for ${componentName}`);
  return result;
}

function extractProps(options: ts.ObjectLiteralExpression) {
  const member = objectMember(options, "props");
  if (!member || !ts.isPropertyAssignment(member)) return [];
  if (!ts.isObjectLiteralExpression(member.initializer)) return [];

  return member.initializer.properties
    .map(objectElementName)
    .filter((name): name is string => Boolean(name));
}

function extractEvents(options: ts.ObjectLiteralExpression) {
  const member = objectMember(options, "emits");
  if (!member || !ts.isPropertyAssignment(member)) return [];

  if (ts.isObjectLiteralExpression(member.initializer)) {
    return member.initializer.properties
      .map(objectElementName)
      .filter((name): name is string => Boolean(name));
  }

  if (ts.isArrayLiteralExpression(member.initializer)) {
    return member.initializer.elements
      .filter(ts.isStringLiteral)
      .map((element) => element.text);
  }

  return [];
}

function extractSlots(options: ts.ObjectLiteralExpression) {
  const setup = objectMember(options, "setup");
  if (!setup) return [];

  const slots = new Set<string>();
  const visit = (node: ts.Node) => {
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "slots"
    ) {
      slots.add(node.name.text);
    }
    if (
      ts.isElementAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "slots" &&
      node.argumentExpression &&
      ts.isStringLiteral(node.argumentExpression)
    ) {
      slots.add(node.argumentExpression.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(setup);
  return [...slots];
}

function assertSame(
  component: string,
  kind: string,
  actual: readonly string[],
  expected: readonly string[],
) {
  const left = [...actual].sort();
  const right = [...expected].sort();
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    throw new Error(
      `${component} ${kind} drifted. source=${JSON.stringify(left)} expected=${JSON.stringify(right)}`,
    );
  }
}

async function collectFiles(root: string, extension: string) {
  const files: string[] = [];
  const walk = async (directory: string) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(target);
      else if (entry.isFile() && target.endsWith(extension)) files.push(target);
    }
  };
  await walk(root);
  return files;
}

const docs = await collectFiles("apps/docs", ".md");
const stories = await collectFiles("apps/storybook/stories", ".ts");
const docsText = await Promise.all(
  docs.map(async (file) => ({ file, text: await readFile(file, "utf8") })),
);
const storiesText = await Promise.all(
  stories.map(async (file) => ({ file, text: await readFile(file, "utf8") })),
);

const packageIndexes = {
  "@doctui/core": "packages/core/src/components/index.ts",
  "@doctui/dates": "packages/dates/src/index.ts",
  "@doctui/notifications": "packages/notifications/src/index.ts",
} as const;

for (const contract of QUALITY_PUBLIC_API) {
  const sourceText = await readFile(contract.source, "utf8");
  const source = ts.createSourceFile(
    contract.source,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const options = componentOptions(source, contract.name);

  assertSame(contract.name, "props", extractProps(options), contract.props);
  assertSame(contract.name, "events", extractEvents(options), contract.events);
  assertSame(contract.name, "slots", extractSlots(options), contract.slots);

  const metadata = DOCTUI_REGISTRY.components.find(
    (entry) => entry.name === contract.name,
  );
  if (!metadata)
    throw new Error(`Missing generated metadata for ${contract.name}`);
  if (metadata.package !== contract.package) {
    throw new Error(
      `${contract.name} package drifted: ${metadata.package} != ${contract.package}`,
    );
  }

  const metadataApi = metadata as typeof metadata & {
    readonly events?: readonly string[];
    readonly slots?: readonly string[];
  };
  assertSame(contract.name, "metadata props", metadata.props, contract.props);
  assertSame(
    contract.name,
    "metadata events",
    metadataApi.events ?? [],
    contract.events,
  );
  assertSame(
    contract.name,
    "metadata slots",
    metadataApi.slots ?? [],
    contract.slots,
  );

  const packageIndex = await readFile(packageIndexes[contract.package], "utf8");
  if (!packageIndex.includes(contract.name)) {
    throw new Error(`${contract.name} is not exported by ${contract.package}`);
  }

  if (!docsText.some(({ text }) => text.includes(contract.name))) {
    throw new Error(`No VitePress documentation mentions ${contract.name}`);
  }
  if (!storiesText.some(({ text }) => text.includes(contract.name))) {
    throw new Error(`No Storybook story mentions ${contract.name}`);
  }
}

console.log(
  `API drift check passed for ${QUALITY_PUBLIC_API.length} PR #7 component contracts`,
);
