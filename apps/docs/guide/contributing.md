# Contributing

doctui is developed as a Bun workspace. Install dependencies from the
repository root, then run the common quality gates before opening a pull
request:

```bash
bun install
bun run format
bun run lint
bun run typecheck
bun run test
bun run build
```

Public component changes should include the smallest useful set of behavior
tests, keyboard/focus tests, Storybook states, documentation and metadata.
Use Vue-native APIs (`v-model`, slots, emits and composables) and keep styling
inside the `--dui-*` token contract.

Do not add a component framework, Tailwind/UnoCSS dependency or a project-owned
server. New runtime dependencies need a clear maintenance or platform-level
justification.

## Metadata and generated artifacts

The component registry is the source for API-oriented generated output. After
metadata changes, regenerate and review:

```bash
bun run metadata:generate
```

This updates `metadata/components.json`, `llms.txt` and `llms-full.txt`.

## Changesets

Add a changeset for publishable package changes:

```bash
bunx changeset
```

The release workflow turns pending changesets into a release pull request and
publishes packages after it is merged.
