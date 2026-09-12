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
- Small, composable internal primitives instead of duplicated interaction logic.

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
scripts/
```

## Reference policy

Mantine documentation, examples and `llms.txt` may be used as product/API/UX references. Do not mechanically translate React source into Vue. Prefer an independent Vue implementation that preserves good concepts while using idiomatic Vue APIs.

## Agent instructions

Read [`AGENTS.md`](./AGENTS.md) before changing the repository. Reusable agent workflows live under [`.agents/skills`](./.agents/skills), and Cursor project rules live under [`.cursor/rules`](./.cursor/rules).

## License

MIT. See [`LICENSE`](./LICENSE).
