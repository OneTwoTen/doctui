# Getting started

The repository is an active prerelease monorepo. Packages are versioned with
Changesets and will be published through the GitHub Actions release workflow.

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

The workspace currently contains `@doctui/core`, `@doctui/hooks`,
`@doctui/form`, `@doctui/notifications`, `@doctui/dates`, and the local
`@doctui/mcp-server` package. Import only the packages your app needs.
