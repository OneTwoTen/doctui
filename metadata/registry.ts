import {
  DOCTUI_COMPONENT_CATEGORIES,
  DOCTUI_COMPONENT_METADATA,
} from "../packages/core/src/component-metadata";
import { DOCTUI_DATES_METADATA } from "../packages/dates/src/component-metadata";
import { DOCTUI_NOTIFICATIONS_METADATA } from "../packages/notifications/src/component-metadata";
import { getQualityPublicApi } from "./quality-contract";

function withVerifiedPublicApi<T extends { readonly name: string }>(entry: T) {
  const contract = getQualityPublicApi(entry.name);
  if (!contract) return entry;

  return {
    ...entry,
    props: contract.props,
    events: contract.events,
    slots: contract.slots,
  };
}

export const DOCTUI_REGISTRY = {
  schemaVersion: 1,
  version: "0.0.0",
  categories: DOCTUI_COMPONENT_CATEGORIES,
  components: [
    ...DOCTUI_COMPONENT_METADATA.map((entry) => ({
      ...withVerifiedPublicApi(entry),
      package: "@doctui/core",
    })),
    ...DOCTUI_DATES_METADATA.map(withVerifiedPublicApi),
    ...DOCTUI_NOTIFICATIONS_METADATA.map(withVerifiedPublicApi),
  ],
  packages: [
    {
      name: "@doctui/core",
      description: "Core Vue components, theme and primitives.",
    },
    {
      name: "@doctui/hooks",
      description: "Reusable Vue composables for browser and app state.",
    },
    {
      name: "@doctui/form",
      description: "Vue-first form state, validation and submit helpers.",
    },
    {
      name: "@doctui/notifications",
      description: "Notification store and accessible renderer.",
    },
    {
      name: "@doctui/dates",
      description: "Dependency-free date and calendar components.",
    },
    {
      name: "@doctui/mcp-server",
      description: "Local MCP server for querying the generated registry.",
    },
  ],
} as const;

export function validateRegistry(registry = DOCTUI_REGISTRY) {
  const categoryIds = new Set(registry.categories.map(({ id }) => id));
  const names = new Set<string>();
  for (const component of registry.components) {
    if (names.has(component.name))
      throw new Error(`Duplicate component: ${component.name}`);
    if (!categoryIds.has(component.category))
      throw new Error(`Unknown category: ${component.category}`);
    if (!component.package || !component.description)
      throw new Error(`Incomplete metadata: ${component.name}`);
    names.add(component.name);
  }
  return registry;
}
