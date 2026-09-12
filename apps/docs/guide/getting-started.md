# Getting started

The repository is currently in **Phase 0 — Repository foundation**. Packages are not published to npm yet.

## Local development

```sh
bun install
bun run lint
bun run typecheck
bun run test
bun run build
```

Run the component workbench:

```sh
bun run storybook
```

Run the documentation site:

```sh
bun run docs:dev
```

## Workspace packages

The first public package scaffold is `@doctui/core`. Phase 0 intentionally keeps its public export surface empty; the theme and token contracts arrive in Phase 1 before visual components are added.
