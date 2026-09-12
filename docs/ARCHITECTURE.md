# doctui architecture

## Objective

Build a Vue-native component system with the coherence and developer experience people value in Mantine, while owning doctui's implementation, accessibility behavior and theme contract.

The detailed implementation plan lives in [`ROADMAP.md`](./ROADMAP.md).

## Layers

```text
Design tokens / CSS variables
          ↓
Internal primitives + composables
          ↓
Core components
          ↓
Feature packages (hooks, form, notifications, dates)
          ↓
Storybook + VitePress docs
          ↓
Canonical component/API metadata registry
          ↓
Generated docs artifacts (API tables, llms.txt, llms-full.txt)
          ↓
@doctui/mcp-server
```

The metadata registry is intended to become the machine-readable source consumed by docs/LLM/MCP tooling. Do not create separate handwritten API databases for each output.

## Important decisions

### Vue-first public API

Do not preserve React-shaped APIs solely for similarity with Mantine. Translate concepts into Vue's native model.

### No headless component framework

The project intentionally does not depend on Reka UI. Complex interactions must therefore be implemented and tested deliberately. Low-level infrastructure such as Floating UI is acceptable when it solves a specialized problem without imposing a component architecture.

### Shared primitives before complex components

`Select`, `Autocomplete`, `Menu` and similar components should not each implement their own popup/focus/dismissal logic. Shared internal foundations should mature first.

### Styling contract

CSS variables are the stable theme boundary. Consumer applications may use any styling solution without forcing doctui to depend on it.

### Monorepo package boundaries

Use a monorepo so packages, docs, Storybook and tooling can consume the same local source during development.

Target packages include:

- `@doctui/core`
- `@doctui/hooks`
- `@doctui/form`
- `@doctui/notifications`
- `@doctui/dates`
- `@doctui/mcp-server`

Do not create a package merely because the target architecture lists it. Create packages when there is real implementation and an independent installation/use case.

### AI documentation architecture

The preferred flow is:

```text
Vue source/types/stories/docs
          ↓
validated component registry
     ┌────┼─────────────┐
     ↓    ↓             ↓
VitePress Storybook  llms generators
                       ↓
                  MCP server
```

MCP should not depend on the Vue runtime where practical; it primarily exposes structured documentation/API metadata.

## Suggested implementation order

1. Monorepo/tooling/CI foundation.
2. Theme/token/provider foundation.
3. Layout and typography primitives.
4. Button/action controls.
5. Input foundation + simple form controls.
6. Portal/focus/scroll-lock/dismissal/transition primitives.
7. Floating layer.
8. Modal/Drawer/Tooltip/Popover/Menu.
9. Combobox foundation.
10. Select/Autocomplete/MultiSelect.
11. Hooks, notifications, form helpers and dates.
12. Canonical component metadata registry.
13. Generated `llms.txt` / `llms-full.txt`.
14. `@doctui/mcp-server`.
15. Stable release/publishing pipeline.

Do not optimize for component count. Optimize for consistency of the foundations that many components share.
