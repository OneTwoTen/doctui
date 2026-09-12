# GitHub Copilot instructions for doctui

Read and follow `/AGENTS.md` first. Treat `docs/TECH_STACK.md` as canonical for tooling and dependency decisions.

Key constraints:

- Vue 3 + TypeScript 7, with Vue-first APIs.
- TypeScript 7 is the project baseline. TypeScript 6 may exist only as an isolated temporary compatibility bridge for Vue tooling that still requires it.
- Biome is the sole lint/format tool. Do not introduce ESLint, TypeScript ESLint or Prettier without an explicit project-level decision.
- No Reka UI or other component framework dependency.
- Prefer shared internal primitives for focus, overlay, dismissal and positioning behavior.
- Core styling uses doctui CSS variables (`--dui-*`), not Tailwind/UnoCSS.
- Accessibility, keyboard behavior and focus behavior are part of the component contract.
- Mantine may be referenced for UX/API ideas, but implementations should be independent and idiomatic Vue.
- New public components require tests, Storybook coverage and docs/API metadata.
- Keep normal CI, docs and release workflows GitHub-hosted and zero-VPS.
