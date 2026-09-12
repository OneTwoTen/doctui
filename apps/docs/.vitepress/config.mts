import { defineConfig } from "vitepress";

export default defineConfig({
  title: "doctui",
  description:
    "A Vue-native UI system with predictable APIs and strong accessibility.",
  base: "/doctui/",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
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
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/OneTwoTen/doctui" },
    ],
  },
});
