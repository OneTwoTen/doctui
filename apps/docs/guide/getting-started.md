# Getting started

The repository is currently in **Phase 0 — Repository foundation**. Packages are not published to npm yet.

## Public project sites

- [Documentation](https://onetwoten.github.io/doctui/)
- [Storybook](https://onetwoten.github.io/doctui/storybook/) — interactive component playground and visual states.

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

The Storybook workbench includes Controls and Actions in the addon panel. Stories that define `args` expose editable Controls; stories with a `play` function expose their step-by-step run in Interactions. For example, open `Actions/Button/Interactive` or `Inputs/TextInput/Interactive` and use the panel tabs after the story loads.

Run the documentation site:

```sh
bun run docs:dev
```

## Workspace packages

The first public package is `@doctui/core`, which exports the theme foundation and the initial layout, typography, action and input components.
