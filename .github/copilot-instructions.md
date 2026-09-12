# GitHub Copilot instructions for doctui

Read and follow `/AGENTS.md` first.

Key constraints:

- Vue 3 + TypeScript, Vue-first APIs.
- No Reka UI or other component framework dependency.
- Prefer shared internal primitives for focus, overlay, dismissal and positioning behavior.
- Core styling uses doctui CSS variables (`--dui-*`), not Tailwind/UnoCSS.
- Accessibility, keyboard behavior and focus behavior are part of the component contract.
- Mantine may be referenced for UX/API ideas, but implementations should be independent and idiomatic Vue.
- New public components require tests, Storybook coverage and docs/API metadata.
