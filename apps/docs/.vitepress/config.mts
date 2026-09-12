import { defineConfig } from "vitepress";

const base = process.env.DOCTUI_DOCS_BASE ?? "/doctui/";
const storybookUrl =
  process.env.DOCTUI_STORYBOOK_URL ??
  "https://onetwoten.github.io/doctui/storybook/";

export default defineConfig({
  title: "doctui",
  description:
    "A Vue-native UI system with predictable APIs and strong accessibility.",
  base,
  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Components", link: "/guide/basic-components" },
      {
        text: "Storybook",
        link: storybookUrl,
      },
      {
        text: "Roadmap",
        link: "https://github.com/OneTwoTen/doctui/blob/main/docs/ROADMAP.md",
      },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "Theming", link: "/guide/theming" },
          { text: "Accessibility", link: "/guide/accessibility" },
          { text: "Basic components", link: "/guide/basic-components" },
          { text: "Component taxonomy", link: "/guide/component-taxonomy" },
          { text: "Hooks", link: "/guide/hooks" },
          { text: "Form", link: "/guide/form" },
          { text: "Notifications", link: "/guide/notifications" },
          { text: "Dates", link: "/guide/dates" },
          { text: "MCP server", link: "/guide/mcp" },
          { text: "Versioning", link: "/guide/versioning" },
          { text: "Contributing", link: "/guide/contributing" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/OneTwoTen/doctui" },
    ],
  },
});
