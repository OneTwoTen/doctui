# doctui Agent Guide

This file is the primary instruction set for coding agents working in this repository.

The phased implementation plan lives in [`docs/ROADMAP.md`](./docs/ROADMAP.md). When choosing what to build next, follow the roadmap unless the task explicitly changes project direction.

Infrastructure constraints live in [`docs/INFRASTRUCTURE.md`](./docs/INFRASTRUCTURE.md).

Technology and dependency decisions live in [`docs/TECH_STACK.md`](./docs/TECH_STACK.md). Treat that document as canonical when selecting versions, build tools, test tools, package management, docs tooling or release dependencies.

## Product direction

`doctui` is a Vue 3 UI library with a Mantine-like developer experience, but it is not a Mantine port and must not become a React-shaped API wrapped in Vue syntax.

Core principles:

1. Design for Vue first: use `v-model`, slots, emits, provide/inject and composables naturally.
2. Do not add Reka UI or another component framework as a dependency.
3. Shared interaction behavior belongs in internal primitives/composables, not duplicated across components.
4. Accessibility is a release requirement.
5. Theme behavior must be driven by stable tokens and CSS variables.
6. Public APIs should be predictable across all components.
7. Avoid unnecessary runtime dependencies.
8. Mantine docs/`llms.txt` can be used as behavior and API inspiration, not as a source to blindly copy.
9. Documentation, LLM artifacts and MCP should converge on one validated public API metadata source rather than independent handwritten copies.
10. doctui is GitHub-first and zero-VPS by default: the normal project lifecycle must not require a project-owned server or always-on backend.
11. Do not replace the canonical tech stack casually; new infrastructure/tooling must solve a demonstrated requirement.

## Repository architecture

Target layout:

```text
apps/
  docs/              # VitePress documentation
  storybook/         # Storybook configuration and visual playground
packages/
  core/              # Components, theme, internal primitives
  hooks/             # Framework-level composables
  form/              # Form state/helpers
  notifications/     # Notification system
  dates/             # Date components and utilities
  mcp/               # @doctui/mcp-server
scripts/              # Metadata/docs/llms generators
docs/                 # Architecture, roadmap and contribution documents
```

Do not create a new package for code that is only used by one package. Start local and extract only after the abstraction is proven. Packages listed in the target layout should be created when real implementation work needs them, not as empty placeholders.

## Component API conventions

- Export components by simple names from packages, e.g. `Button`, `TextInput`, `Modal`.
- Use PascalCase Vue component names.
- Use `modelValue` + `update:modelValue` for the primary two-way value.
- Prefer named slots for structural regions (`leftSection`, `rightSection`, `label`, `description`) instead of passing VNodes in props.
- Use events for meaningful state changes. Do not expose implementation-only events.
- Boolean props should read positively when practical (`disabled`, `loading`, `required`, `clearable`).
- Use the shared size/radius/color/variant types when they exist. Do not redefine them per component.
- Controlled and uncontrolled behavior must be intentional and documented.
- Public prop names are part of the compatibility contract; avoid casual renames.

## Styling conventions

- Core components must not depend on Tailwind or UnoCSS.
- Use CSS variables as the public theming contract.
- Prefix library variables with `--dui-`.
- Prefer semantic tokens over raw values inside components.
- Components may expose stable `data-*` attributes for state styling.
- Keep style selectors shallow and local.
- Do not couple behavior to visual classes.
- Dark mode must be token-driven, not component-by-component overrides.

## Internal primitives

Before implementing complex overlays or inputs, prefer shared primitives such as:

- `Portal`
- `FocusTrap`
- `ScrollLock`
- `Transition`
- `Floating`
- `ClickOutside`
- `DismissableLayer`
- `VisuallyHidden`
- `Combobox`

`Floating UI` may be used for positioning. Do not implement a custom popper/positioning engine.

## Accessibility

For interactive components:

- Keyboard operation must match the relevant WAI-ARIA interaction model.
- Focus must never become trapped unintentionally.
- Modal-like surfaces must restore focus appropriately.
- Escape/click-outside behavior must be consistent and documented.
- Visible labels and accessible names must stay in sync.
- Disabled state must prevent interaction consistently.
- Do not add ARIA attributes merely to silence audits; use correct semantics first.

## Testing requirements

Every non-trivial component change should include the smallest useful combination of:

- unit/behavior tests,
- keyboard/focus tests,
- Storybook stories for important visual states,
- accessibility checks for interactive components.

Do not write tests that only assert implementation details such as internal class names unless that class is explicitly public API.

## Documentation requirements

A public component is not complete until it has:

- a clear purpose,
- basic usage,
- important variants/states,
- accessibility notes when interaction is non-trivial,
- public API metadata,
- Storybook coverage.

Docs examples must use idiomatic Vue and must compile.

When the metadata registry exists, treat it as the shared machine-readable representation consumed by generated API docs, LLM artifacts and MCP. Do not manually maintain a conflicting second API description for those outputs.

## Mantine reference policy

When using Mantine as a reference:

1. Identify the user-facing behavior or API idea being studied.
2. Translate React concepts into idiomatic Vue concepts.
3. Re-implement behavior independently.
4. Do not copy source code unless there is a deliberate licensing reason and required notices are preserved.
5. Do not preserve awkward React-only concepts just for API similarity.

Examples:

- `children` -> default slot
- render props -> scoped slots when appropriate
- `value/onChange` -> `v-model`
- React context -> Vue provide/inject
- hooks -> composables

## Dependency policy

Before adding a runtime dependency, explain why the behavior should not live in doctui itself.

Allowed categories when justified:

- low-level positioning/DOM infrastructure,
- date/time primitives,
- well-scoped utilities with a clear maintenance advantage.

Avoid adding:

- full component frameworks,
- styling frameworks as core runtime dependencies,
- large utility packages for one helper.

## Infrastructure policy

Normal development, CI, documentation, release and consumption workflows must not depend on a project-owned VPS.

- Use GitHub Actions for CI, builds, release automation and static documentation generation.
- Use GitHub Pages for production VitePress docs, Storybook, metadata and LLM documentation.
- Use GitHub-hosted runners for normal CI.
- Use GitHub Releases/Actions artifacts for release and CI outputs where appropriate.
- Do not add SSH deployment, a Docker host, Kubernetes, a production database, Redis or a required self-hosted runner to the standard architecture without an explicit project-level decision.
- Prefer static/build-time solutions over hosted runtime services.
- Keep the project reproducible from a clean public clone with no private infrastructure dependency.

## MCP policy

The MCP package belongs after the public metadata/docs model is sufficiently stable.

- MCP must consume the same validated registry used by docs/LLM tooling.
- Do not create an independent manually-maintained MCP component database.
- Prefer a small stable tool surface such as component search, API lookup, examples and use-case discovery.
- Keep MCP independent from the Vue runtime where practical.
- MCP must never recommend APIs that are not exported by the matching doctui version.
- `@doctui/mcp-server` should run locally for consumers under Bun/Node and must not require a doctui-owned always-on remote MCP service.

## Working procedure

Before coding:

1. Read this file and any scoped `AGENTS.md` beneath the target directory.
2. Read the relevant phase in `docs/ROADMAP.md` when the task advances project implementation.
3. Read `docs/TECH_STACK.md` before changing tooling, versions, dependencies, test infrastructure, docs tooling or release tooling.
4. Read `docs/INFRASTRUCTURE.md` when changing CI, release, hosting, docs deployment or MCP delivery.
5. Inspect adjacent components and shared types.
6. Check whether a primitive/composable already solves part of the task.
7. Confirm the public API before implementing details.

Before finishing:

1. Run the repository's existing formatter, lint, typecheck and relevant tests from `package.json`.
2. Do not change package managers or lockfile format unless requested.
3. Confirm Storybook/docs examples still build when affected.
4. Summarize public API changes and compatibility impact.
5. Leave unrelated files untouched.

If the repository is still being bootstrapped and commands do not exist yet, do not invent passing test results. State exactly what could and could not be run.
