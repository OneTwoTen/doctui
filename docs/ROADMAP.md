# doctui roadmap

This roadmap is the implementation plan for doctui. It is intentionally ordered around shared foundations instead of raw component count.

## Product target

Build a Vue-native UI system with:

- predictable Vue 3 APIs,
- stable theming and design tokens,
- strong accessibility behavior,
- a reusable component/composable ecosystem,
- Storybook for component development,
- VitePress for public documentation,
- generated component metadata,
- `llms.txt` / `llms-full.txt` for LLM context,
- an MCP server for structured AI access to the library,
- independent package publishing from a monorepo.

Mantine may be used as a UX/API/documentation reference, but doctui remains an independent Vue implementation.

## Target monorepo

```text
apps/
  docs/                  # VitePress public documentation
  storybook/             # Storybook development environment

packages/
  core/                  # Components, theme, internal interaction primitives
  hooks/                 # General Vue composables
  form/                  # Form state and validation helpers
  notifications/         # Notification system
  dates/                 # Date inputs, calendars and date utilities
  mcp/                   # @doctui/mcp-server

scripts/
  generate-metadata.ts
  generate-llms.ts
  validate-docs.ts

docs/
  ARCHITECTURE.md
  ROADMAP.md
```

Do not create all target packages on day one if they have no implementation yet. The structure above is the intended destination.

---

# Phase 0 — Repository foundation

## Goal

Create a reproducible monorepo foundation before implementing public components.

## Deliverables

- Bun workspace configuration.
- Vue 3 + TypeScript baseline.
- Shared TypeScript configuration.
- Vite library build configuration.
- Vitest test configuration.
- ESLint/formatting configuration.
- `packages/core` package scaffold.
- `apps/storybook` scaffold.
- `apps/docs` VitePress scaffold.
- CI workflow for lint, typecheck, tests and builds.
- package naming and export conventions.

## Required commands

The repository should converge on commands similar to:

```text
bun install
bun run lint
bun run typecheck
bun run test
bun run build
bun run storybook
bun run docs:dev
```

Exact command names may evolve, but there must be one root-level entry point for each common workflow.

## Acceptance criteria

- Fresh clone installs with one package-manager command.
- `packages/core` can be imported by Storybook and docs through workspace resolution.
- CI runs without requiring unpublished npm packages.
- TypeScript project references/workspace configuration do not duplicate compiler settings unnecessarily.
- No component-framework dependency is introduced.

---

# Phase 1 — Theme, tokens and styling foundation

## Goal

Define the contract every visual component will depend on before component APIs become numerous.

## Deliverables

### Theme model

Implement concepts such as:

- `DoctuiProvider`
- `createTheme()`
- theme merge behavior
- color scheme handling
- semantic colors
- spacing scale
- radius scale
- font sizes
- line heights
- shadows
- breakpoints
- z-index scale

### CSS variables

Public theme variables use the `--dui-*` prefix.

Examples:

```text
--dui-color-primary-filled
--dui-color-primary-light
--dui-spacing-md
--dui-radius-md
--dui-font-size-sm
--dui-shadow-md
```

### Shared style types

Define stable shared public types for:

- `Size`
- `Radius`
- `Color`
- `Variant`

Do not let each component reinvent these types.

### Styling internals

Establish:

- class-name conventions,
- state `data-*` attributes,
- style override boundaries,
- dark-mode token behavior,
- CSS reset/baseline policy.

## Acceptance criteria

- Theme values can be changed from one provider and reflected across existing components.
- Dark/light behavior is token-driven.
- Core does not depend on Tailwind, UnoCSS or another styling framework.
- Consumers can override documented CSS variables without knowing component internals.

---

# Phase 2 — Layout, typography and basic controls

## Goal

Prove the theme/API conventions on low-complexity components before building interaction infrastructure.

## Candidate components

### Layout

- `Box`
- `Flex`
- `Stack`
- `Group`
- `Grid`
- `Center`
- `Container`
- `Space`
- `Divider`

### Typography/display

- `Text`
- `Title`
- `Code`
- `Kbd`
- `Badge`
- `Paper`
- `Skeleton`
- `Loader`

### Actions

- `Button`
- `ActionIcon`
- `UnstyledButton`

## Work required for every public component

- implementation,
- exports,
- public TypeScript types,
- behavioral/unit tests where meaningful,
- Storybook stories,
- docs page or generated docs entry,
- API metadata source.

## Acceptance criteria

- Shared `size`, `radius`, `color` and `variant` behavior is consistent.
- Button keyboard/focus/disabled/loading behavior is accessible.
- Storybook demonstrates important states rather than only default examples.
- Docs examples use idiomatic Vue.

---

# Phase 3 — Input foundation and simple form controls

## Goal

Build a reusable input architecture before Select/Combobox-style components.

## Foundation

Create shared internal/public building blocks as justified:

- `Input`
- `InputWrapper`
- label/description/error handling
- generated IDs
- required indicator
- left/right sections
- clear button conventions
- controlled `v-model` conventions

## Candidate components

- `TextInput`
- `Textarea`
- `NumberInput`
- `PasswordInput`
- `Checkbox`
- `Radio`
- `Switch`
- `SegmentedControl`

## Accessibility requirements

- label/input association,
- description/error `aria-describedby`,
- disabled/read-only semantics,
- keyboard interaction,
- group semantics for checkbox/radio groups.

## Acceptance criteria

- All input-like components follow one error/description/label contract.
- IDs remain deterministic enough for hydration and accessibility.
- `v-model` behavior is consistent across controls.
- Form package work can build on these controls without special cases.

---

# Phase 4 — Interaction primitives and overlays

## Goal

Own the difficult accessibility and interaction infrastructure that replaces a headless UI framework.

## Internal primitives/composables

Prioritize shared implementations of:

- `Portal`
- `FocusTrap`
- `ScrollLock`
- `Transition`
- `ClickOutside`
- `DismissableLayer`
- `VisuallyHidden`
- focus restoration
- nested overlay coordination
- escape-key handling
- optional `Floating` abstraction on top of Floating UI

Floating UI is acceptable for positioning; doctui should not implement a custom geometry engine.

## Components built after primitives mature

- `Overlay`
- `Modal`
- `Drawer`
- `Popover`
- `Tooltip`
- `Menu`

## Required test scenarios

- open/close state,
- escape dismissal,
- click-outside behavior,
- focus trap,
- focus restoration,
- nested overlays,
- disabled menu items,
- keyboard menu navigation,
- viewport collision/position updates where relevant.

## Acceptance criteria

- Modal focus never leaks behind the active modal.
- Overlay primitives are shared; components do not duplicate dismissal logic.
- Menu supports the relevant WAI-ARIA keyboard interaction model.
- Tooltip is not required to access critical information.

---

# Phase 5 — Combobox architecture and advanced inputs

## Goal

Build one robust selection/search architecture reused by advanced components.

## Combobox foundation

Design internal primitives/state for:

- active option,
- selected option(s),
- option registration,
- keyboard navigation,
- listbox semantics,
- filtering/search,
- empty state,
- scroll-to-active-option,
- dropdown positioning,
- virtualized-list compatibility without requiring virtualization initially.

## Candidate components

- `Select`
- `MultiSelect`
- `Autocomplete`
- `TagsInput`
- `Combobox` public API if the abstraction proves useful to consumers.

## Acceptance criteria

- Select/Menu/Autocomplete do not each contain separate keyboard-navigation engines.
- Arrow/Home/End/Enter/Escape behavior is tested.
- Screen-reader roles/relationships are correct.
- Large option sets have a documented future virtualization path.

---

# Phase 6 — Feature packages

These packages should be introduced when the lower-level contracts they depend on are stable.

## `@doctui/hooks`

Candidate composables:

- `useDisclosure`
- `useMediaQuery`
- `useClipboard`
- `useDebouncedValue`
- `useDebouncedCallback`
- `useDocumentTitle`
- `useElementSize`
- `useHotkeys`
- `useLocalStorage`

Only add composables that provide meaningful cross-project value; do not wrap browser APIs without a reason.

## `@doctui/form`

Goals:

- Vue-first form state,
- field registration,
- validation,
- nested values,
- dirty/touched state,
- submit state,
- field-level errors,
- adapters that work naturally with doctui input components.

Do not clone React form APIs mechanically.

## `@doctui/notifications`

Goals:

- provider/store architecture,
- `show`, `update`, `hide`, `clean`,
- queue/limit handling,
- positions,
- auto-close and pause behavior,
- accessibility announcement strategy.

## `@doctui/dates`

Start only after input and overlay foundations are stable.

Candidate components:

- `Calendar`
- `DatePicker`
- `DateInput`
- `DateTimePicker`
- `MonthPicker`
- `YearPicker`
- range variants where justified.

Date utility dependencies must be deliberately evaluated before adoption.

## Acceptance criteria

- Feature packages depend downward on stable foundations and do not create circular dependencies.
- Applications can install only the packages they need.

---

# Phase 7 — Documentation platform and component registry

## Goal

Make documentation a generated product of the same metadata that AI tooling will later consume.

## Storybook

Use Storybook for:

- isolated component development,
- visual states,
- interaction testing where useful,
- theme/dark mode preview,
- accessibility feedback,
- debugging.

Each major state should have a purposeful story.

## VitePress

Public docs should include:

- getting started,
- installation,
- theming,
- styling,
- accessibility principles,
- components,
- composables,
- form,
- notifications,
- dates,
- migration/versioning guides,
- contribution guide.

## Component metadata registry

Create one canonical machine-readable representation of public APIs.

Conceptual entry:

```ts
{
  name: 'Button',
  package: '@doctui/core',
  description: 'Triggers an action',
  props: [],
  slots: [],
  events: [],
  cssVariables: [],
  examples: [],
  accessibility: {}
}
```

The exact format should be versioned and validated.

## Source-of-truth rule

Avoid maintaining independent handwritten copies of the same API in:

- Vue source,
- VitePress,
- Storybook,
- llms files,
- MCP.

Prefer generation from source/types/metadata where reliable.

## Acceptance criteria

- API tables cannot silently drift from exported TypeScript APIs.
- Metadata generation fails CI on invalid references.
- Storybook and docs can consume workspace packages without publishing them.

---

# Phase 8 — LLM documentation

## Goal

Make doctui usable by coding assistants even without MCP configuration.

## Outputs

Generate:

- `/llms.txt`
- `/llms-full.txt`
- optionally component-focused markdown under `/llms/`

## Content priorities

Include concise, accurate information about:

- package installation,
- imports,
- component purpose,
- props,
- `v-model`,
- slots,
- events,
- theming,
- accessibility constraints,
- working Vue examples.

## Generation

```text
Vue source/types/stories/docs metadata
                ↓
         component registry
                ↓
      generate-llms script
                ↓
       llms.txt / full
```

## Acceptance criteria

- Generated docs reference only exported APIs.
- Examples compile or are checked by CI where practical.
- `llms.txt` is regenerated as part of release/docs workflows.

---

# Phase 9 — MCP server

## Goal

Provide structured, queryable access to doctui for coding agents.

## Package

```text
packages/mcp/
  src/
    server.ts
    tools/
    resources/
    registry/
```

Target package name:

```text
@doctui/mcp-server
```

## Initial resources

Candidate resources:

```text
doctui://components
doctui://components/{name}
doctui://hooks
doctui://theme
doctui://guides/{name}
```

## Initial tools

Prioritize a small stable tool surface:

- `search_components`
- `get_component`
- `get_component_api`
- `get_component_examples`
- `search_docs`
- `find_component_for_use_case`

Avoid exposing tools that merely duplicate raw filesystem access.

## Example capability

Input:

```text
I need a searchable control that supports multiple selected values.
```

Expected MCP reasoning surface:

```text
Recommended: MultiSelect
Alternatives: Combobox
Relevant API: v-model, data, searchable, clearable
Examples: ...
```

The server must obtain this from the same registry used by docs/LLM generation rather than a second manually-maintained database.

## Runtime

Keep MCP independent from Vue runtime where practical. It should primarily read generated metadata/docs and can run under Bun/Node-compatible JavaScript.

## Acceptance criteria

- MCP package works without starting the docs site.
- Search returns only real exported components/APIs.
- Invalid/deprecated APIs are not recommended.
- Version returned by MCP can be mapped to the installed doctui version.
- Basic Cursor/Codex/Claude-style MCP configuration examples are documented where applicable.

---

# Phase 10 — Release engineering and public distribution

## Goal

Make doctui safe to consume as a normal open-source package family.

## Deliverables

- package build outputs and export maps,
- ESM-first distribution,
- TypeScript declaration output,
- package `sideEffects` policy for CSS,
- semver policy,
- changelog generation/process,
- npm publishing workflow,
- prerelease channel,
- GitHub Releases,
- docs deployment,
- Storybook deployment or integration into docs,
- release-time llms generation,
- MCP publishing.

## Proposed packages

Only publish packages that contain stable useful functionality:

```text
@doctui/core
@doctui/hooks
@doctui/form
@doctui/notifications
@doctui/dates
@doctui/mcp-server
```

## Acceptance criteria for 1.0

- Core APIs have documented compatibility guarantees.
- Theme contract is stable.
- Primary interactive components meet accessibility requirements.
- Public components have tests, docs, stories and metadata.
- npm packages can be tree-shaken appropriately.
- docs and llms artifacts match the released version.
- MCP reports/query results for the same released version.

---

# Post-1.0 candidates

Do not treat these as Phase 1 requirements.

Possible expansion areas:

- `Dropzone`
- `Carousel`
- `Tree`
- `TreeSelect`
- `Pagination`
- `Stepper`
- `Spotlight` / command palette
- rich-text integrations
- charts package/integrations
- data-table patterns
- virtualized advanced lists
- internationalization helpers
- RTL hardening
- visual regression infrastructure
- Figma/design-token integrations
- codemods/migration tooling

New packages require a clear independent installation/use case.

---

# Cross-cutting quality gates

These apply to every phase.

## API

- Vue-first, not React-shaped.
- Consistent names across components.
- Avoid breaking changes without a versioning reason.
- Public API additions require documentation.

## Accessibility

- Relevant WAI-ARIA patterns are explicitly researched and tested.
- Keyboard behavior is part of acceptance criteria.
- Focus behavior is tested for overlays and selection widgets.
- Accessibility regressions block releases for affected components.

## Dependencies

- No Reka UI or full component framework.
- Runtime dependencies require justification.
- Prefer platform/Vue capabilities for small helpers.
- Floating UI is acceptable for positioning infrastructure.

## Performance

- Avoid global reactive state when local state is sufficient.
- Avoid unnecessary watchers and deep reactivity.
- Keep package boundaries tree-shakable.
- Do not introduce virtualization until real component requirements justify it.

## Testing

For relevant changes run:

- lint,
- typecheck,
- unit/behavior tests,
- component interaction tests,
- build,
- docs/Storybook build when affected.

Do not claim checks passed if they were not actually run.

## Documentation

A public component is not complete without documentation and metadata.

---

# Milestone summary

| Milestone | Main outcome |
| --- | --- |
| M0 | Monorepo boots and CI works |
| M1 | Stable theme/token contract |
| M2 | Layout, typography and buttons usable |
| M3 | Input architecture and simple controls usable |
| M4 | Overlay/focus/dismissal infrastructure stable |
| M5 | Select/MultiSelect/Autocomplete architecture stable |
| M6 | Hooks/form/notifications/dates packages expand ecosystem |
| M7 | Storybook + VitePress + canonical component registry |
| M8 | Generated `llms.txt` and `llms-full.txt` |
| M9 | `@doctui/mcp-server` available |
| M10 | Release pipeline and path to stable 1.0 |

## Current priority

The immediate implementation order is:

```text
Phase 0
  ↓
Phase 1
  ↓
Phase 2
  ↓
Phase 3
  ↓
Phase 4
  ↓
Phase 5
```

Phases 7–9 should be designed early, especially metadata shape, but should not delay establishing correct component foundations.
