# doctui

A Vue 3 UI component system inspired by the developer experience of Mantine, implemented independently for Vue.

## Goals

- Vue-first APIs: `v-model`, slots, emits, provide/inject and composables.
- No dependency on Reka UI or another component framework.
- Accessible behavior is part of the component contract, not an optional enhancement.
- Themeable with CSS variables and stable design tokens.
- Storybook for interactive component development.
- VitePress for guides and public documentation.
- LLM-friendly documentation with generated `llms.txt` / `llms-full.txt`.
- MCP support for structured AI access to components, APIs and docs.
- Small, composable internal primitives instead of duplicated interaction logic.
- GitHub-first infrastructure with no required project-owned VPS or always-on backend.

## Intended workspace

```text
apps/
  docs/
  storybook/
packages/
  core/
  hooks/
  form/
  notifications/
  dates/
  mcp/
scripts/
```

Packages should be created when implementation work actually requires them; the layout above describes the target monorepo.

## Technology stack

The canonical stack and dependency decisions are documented in [`docs/TECH_STACK.md`](./docs/TECH_STACK.md).

Initial baseline:

```text
Bun 1.4
Vue 3.5 stable
TypeScript 7
Biome 2.5
Vite 8.1
Vitest 5
Storybook 10.6
VitePress stable 1.x
GitHub Actions + GitHub Pages
```

TypeScript 7 is the project baseline. Vue SFC tooling may temporarily use an isolated TypeScript 6 compatibility bridge until native TypeScript 7 integration is available; that compatibility layer does not change the project baseline.

## Infrastructure direction

The default public infrastructure is intentionally zero-VPS:

```text
GitHub repository
      ↓
GitHub Actions
      ↓
├── CI / tests / builds
├── docs + Storybook generation
├── metadata + llms generation
├── releases
└── GitHub Pages deployment
```

VitePress, Storybook, metadata and LLM docs should be deployable as static assets to GitHub Pages. Normal CI should use GitHub-hosted runners. `@doctui/mcp-server` is intended to run locally for consumers rather than requiring a doctui-owned always-on MCP backend.

See [`docs/INFRASTRUCTURE.md`](./docs/INFRASTRUCTURE.md) for the full policy.

## Roadmap

See [`docs/ROADMAP.md`](./docs/ROADMAP.md) for the phased implementation plan, milestones, quality gates and MCP/LLM documentation strategy.

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for architectural principles and implementation ordering.

## Reference policy

Mantine documentation, examples and `llms.txt` may be used as product/API/UX references. Do not mechanically translate React source into Vue. Prefer an independent Vue implementation that preserves good concepts while using idiomatic Vue APIs.

## Agent instructions

Read [`AGENTS.md`](./AGENTS.md) before changing the repository. Reusable agent workflows live under [`.agents/skills`](./.agents/skills), and Cursor project rules live under [`.cursor/rules`](./.cursor/rules).

## License

MIT. See [`LICENSE`](./LICENSE).
