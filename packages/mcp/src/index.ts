#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import registry from "../../../metadata/components.json";

export type DoctuiRegistry = typeof registry;
export const DOCTUI_MCP_VERSION = registry.version;

const searchableText = (component: (typeof registry.components)[number]) =>
  [component.name, component.package, component.description, ...component.props]
    .join(" ")
    .toLowerCase();
const queryWords = (query: string) =>
  query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2)
    .map(
      (word) =>
        ({ multiple: "multi", selected: "selection", values: "value" })[word] ??
        word,
    );
const componentScore = (
  component: (typeof registry.components)[number],
  query: string,
) => {
  const haystack = searchableText(component);
  const words = queryWords(query);
  return (
    words.reduce(
      (score, word) => score + (haystack.includes(word) ? 1 : 0),
      0,
    ) + (words.includes("multi") && component.name === "MultiSelect" ? 2 : 0)
  );
};
const componentMatches = (query: string) => {
  if (!query.trim()) return [...registry.components];
  return registry.components
    .map((component) => ({
      component,
      score: componentScore(component, query),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ component }) => component);
};

export function searchComponents(query = "") {
  return componentMatches(query).map((component) => ({
    name: component.name,
    package: component.package,
    category: component.category,
    description: component.description,
  }));
}

export function getComponent(name: string) {
  return registry.components.find(
    (component) => component.name.toLowerCase() === name.trim().toLowerCase(),
  );
}

export function getComponentApi(name: string) {
  const component = getComponent(name);
  return component
    ? {
        name: component.name,
        package: component.package,
        props: component.props,
        accessibility:
          "accessibility" in component ? component.accessibility : [],
      }
    : undefined;
}

export function findComponentForUseCase(useCase: string) {
  const words = queryWords(useCase);
  return registry.components
    .map((component) => {
      const haystack = searchableText(component);
      const score =
        words.reduce(
          (total, word) => total + (haystack.includes(word) ? 1 : 0),
          0,
        ) +
        (words.includes("multi") && component.name === "MultiSelect" ? 2 : 0);
      return { component, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.component.name.localeCompare(b.component.name),
    )
    .slice(0, 5)
    .map(({ component, score }) => ({
      name: component.name,
      package: component.package,
      description: component.description,
      score,
    }));
}

export function createDoctuiMcpServer() {
  const server = new McpServer({
    name: "doctui",
    version: DOCTUI_MCP_VERSION,
  });

  server.registerResource(
    "components",
    "doctui://components",
    { title: "doctui components", mimeType: "application/json" },
    async (uri) => ({
      contents: [{ uri: uri.href, text: JSON.stringify(registry, null, 2) }],
    }),
  );
  server.registerResource(
    "component",
    new ResourceTemplate("doctui://components/{name}", {
      list: async () => ({
        resources: registry.components.map((component) => ({
          uri: `doctui://components/${encodeURIComponent(component.name)}`,
          name: component.name,
          mimeType: "application/json",
        })),
      }),
    }),
    { title: "doctui component", mimeType: "application/json" },
    async (uri) => {
      const name = decodeURIComponent(uri.pathname.split("/").pop() ?? "");
      const component = getComponent(name);
      return {
        contents: [
          { uri: uri.href, text: JSON.stringify(component ?? null, null, 2) },
        ],
      };
    },
  );

  server.registerTool(
    "search_components",
    {
      title: "Search doctui components",
      description: "Find exported doctui components by name, purpose or prop.",
      inputSchema: z.object({ query: z.string().default("") }),
    },
    async ({ query }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(searchComponents(query), null, 2),
        },
      ],
    }),
  );
  server.registerTool(
    "get_component",
    {
      title: "Get a doctui component",
      description: "Return the canonical metadata for one exported component.",
      inputSchema: z.object({ name: z.string() }),
    },
    async ({ name }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(getComponent(name) ?? null, null, 2),
        },
      ],
    }),
  );
  server.registerTool(
    "get_component_api",
    {
      title: "Get a doctui component API",
      description: "Return props and accessibility guidance for a component.",
      inputSchema: z.object({ name: z.string() }),
    },
    async ({ name }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(getComponentApi(name) ?? null, null, 2),
        },
      ],
    }),
  );
  server.registerTool(
    "get_component_examples",
    {
      title: "Get doctui component examples",
      description: "Return the package import and API details for a component.",
      inputSchema: z.object({ name: z.string() }),
    },
    async ({ name }) => {
      const component = getComponent(name);
      const examples = component
        ? [`import { ${component.name} } from '${component.package}';`]
        : [];
      return {
        content: [{ type: "text", text: JSON.stringify(examples, null, 2) }],
      };
    },
  );
  server.registerTool(
    "search_docs",
    {
      title: "Search doctui docs",
      description: "Search the generated doctui reference content.",
      inputSchema: z.object({ query: z.string() }),
    },
    async ({ query }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(searchComponents(query), null, 2),
        },
      ],
    }),
  );
  server.registerTool(
    "find_component_for_use_case",
    {
      title: "Find a doctui component for a use case",
      description: "Recommend exported components for a natural-language need.",
      inputSchema: z.object({ useCase: z.string() }),
    },
    async ({ useCase }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(findComponentForUseCase(useCase), null, 2),
        },
      ],
    }),
  );

  return server;
}

export async function startDoctuiMcpServer() {
  return serveStdio(() => createDoctuiMcpServer());
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await startDoctuiMcpServer();
}
