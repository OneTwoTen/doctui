# doctui technology stack

This document is the canonical technology decision record for the doctui implementation stack.

The priorities are:

1. Vue-native public APIs.
2. Modern stable tooling.
3. Minimal runtime dependencies.
4. Static/GitHub-first infrastructure with no required VPS.
5. One source of truth for component APIs, docs, LLM files and MCP.
6. Reproducible builds on GitHub-hosted runners.

Version numbers below describe the initial baseline. Patch/minor upgrades are expected through normal dependency maintenance when compatibility remains intact.

## Baseline versions

- Bun: 1.4.x
- Vue: 3.5.x stable; initial baseline 3.5.42
- TypeScript: 7.0.x stable; initial baseline 7.0.2
- Biome: 2.5.x
- Vite: 8.1.x
- `@vitejs/plugin-vue`: 6.x
- `vue-tsc`: current compatible 3.x line, used through an isolated compatibility bridge when required
- Vitest: 5.x
- `@vue/test-utils`: 2.5.x
- Storybook: 10.6.x using `@storybook/vue3-vite`
- VitePress: stable 1.x line
- `vue-component-meta`: current compatible 3.x line
- Changesets: 3.x
- MCP server SDK: `@modelcontextprotocol/server` 2.x when the MCP phase starts

Do not downgrade the project-wide TypeScript baseline to solve a tool-specific compatibility problem. Isolate compatibility workarounds to the tool that needs them.

---

# Runtime and package management

## Bun

Bun is the repository package manager, script runner and workspace manager.

Use:

```text
bun install
bun run <script>
bunx <tool>
```

Root workspace layout:

```text
apps/*
packages/*
```

Use `bun.lock` as the only dependency lockfile. Do not add pnpm, Yarn or npm lockfiles.

Start with Bun workspaces and root scripts. Do not add Turborepo, Nx or Lerna in Phase 0. Add task orchestration/caching only after CI measurements demonstrate a real need.

Changesets may later manage package versions/releases; it is not the workspace manager.

---

# Vue baseline

Use Vue 3.5 stable as the initial runtime baseline.

Published Vue packages should treat Vue as a peer dependency rather than bundle a second Vue runtime.

Conceptually:

```json
{
  "peerDependencies": {
    "vue": ">=3.5.0 <4"
  }
}
```

Use Vue-native public APIs:

- `<script setup lang="ts">`
- `defineProps`
- `defineEmits`
- `defineSlots` where useful
- `defineModel` when it keeps the public API clear
- `provide` / `inject`
- composables
- slots
- `modelValue` / `update:modelValue` as the documented two-way binding contract where appropriate

Do not preserve React-shaped callback or children APIs merely to resemble Mantine.

---

# TypeScript 7

## Canonical compiler baseline

TypeScript 7 is the canonical TypeScript version for doctui source code, repository scripts and packages.

Use strict mode and an explicit bundled-library configuration rather than relying on moving compiler defaults.

Initial direction:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

Package-specific configuration may extend the shared root configuration.

## Temporary Vue tooling compatibility bridge

At the time TypeScript 7 was adopted, parts of the Vue language tooling ecosystem still depended on TypeScript 6-era compiler APIs. Therefore doctui permits a narrow compatibility bridge.

Rules:

- `typescript@7` remains the normal project dependency and source compiler baseline.
- A separate `@typescript/typescript6` development dependency may be introduced only for a Vue SFC tool that cannot yet consume TypeScript 7.
- The compatibility version must be invoked through an isolated script/configuration path.
- Do not alias the repository-wide `typescript` package back to TypeScript 6.
- Do not compile ordinary `.ts` project code with TypeScript 6 just because `vue-tsc` needs it.
- Remove the bridge once Vue tooling supports TypeScript 7 natively and the replacement passes doctui CI.

Phase 0 must verify the actual `vue-tsc` and declaration-generation invocation instead of assuming an untested wrapper command.

The same isolation rule applies to `vue-component-meta` if its compiler integration temporarily requires the compatibility compiler.

---

# Build system

Use Vite 8 as the primary build system for Vue package development and library builds. Use the official Vue Vite plugin.

Do not add webpack, a second Rollup build layer, tsup or unbuild in Phase 0 unless Vite library mode fails a demonstrated package requirement.

Published packages should be ESM-first.

Target concept:

```text
packages/core/src
        ↓
Vite library build
        ↓
packages/core/dist
├── index.js
├── chunks/modules as appropriate
├── styles.css
└── TypeScript declarations
```

Package rules:

- Vue is external/peer.
- Define explicit package `exports`.
- Preserve useful module boundaries for tree shaking where needed.
- CSS must be represented correctly in `sideEffects` when required.
- Do not produce CommonJS by default.

---

# Linting and formatting: Biome

Biome is the sole repository formatter and general-purpose linter.

Use `@biomejs/biome` 2.5.x or a compatible newer 2.x release.

Do not install or configure ESLint, `eslint-plugin-vue`, TypeScript ESLint or Prettier unless an explicit project-level decision changes this policy.

Expected root commands should converge on:

```text
bun run lint       # biome check without writes / CI-safe validation
bun run format     # biome format/write or biome check --write as configured
bun run check      # combined Biome checks where useful
```

Direct tooling equivalents include:

```text
bunx biome check .
bunx biome check --write .
bunx biome ci .
```

## Vue configuration

Enable Biome's Vue domain and Vue/HTML-like parsing/formatting support in `biome.json`.

Initial direction:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.0/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    },
    "domains": {
      "vue": "recommended"
    }
  },
  "html": {
    "experimentalFullSupportEnabled": true,
    "formatter": {
      "enabled": true
    }
  }
}
```

Biome's full Vue/HTML-like support is still an evolving area. If a valid Vue pattern produces a false positive or formatter problem:

1. confirm it against the current Biome version,
2. use the narrowest possible Biome override/ignore,
3. document the reason when it is non-obvious,
4. do not add ESLint or Prettier as a parallel fallback without an explicit architecture decision.

Biome does not replace TypeScript semantic type checking, Vue compiler checks, accessibility behavior tests or browser tests.

---

# Styling and theme system

Use platform CSS, not a styling framework.

Chosen direction:

- plain CSS,
- CSS custom properties,
- optional CSS layers,
- component-local CSS files or Vue style blocks as appropriate,
- semantic state `data-*` attributes.

Core must not depend on Tailwind, UnoCSS, Sass, Less or a runtime CSS-in-JS system.

All public design tokens use the `--dui-*` namespace, for example:

```css
--dui-color-primary-filled
--dui-color-primary-light
--dui-spacing-md
--dui-radius-md
--dui-font-size-sm
--dui-shadow-md
```

Theme data flows through `DoctuiProvider` and CSS variables. Dark mode is token-driven.

Initial customization surface:

1. regular `class` and `style` forwarding,
2. CSS variables,
3. semantic `data-*` state attributes.

A richer `classNames` / `styles` API should wait until component anatomy conventions are stable.

---

# Interaction infrastructure

Do not use Reka UI or another headless component framework.

Build doctui-owned primitives for behavior such as:

- Portal,
- FocusTrap,
- ScrollLock,
- DismissableLayer,
- ClickOutside,
- Transition,
- VisuallyHidden,
- overlay coordination,
- focus restoration,
- Combobox state/navigation.

`@floating-ui/dom` is the preferred low-level dependency for floating positioning once an overlay component actually needs it. Do not implement a custom geometry engine.

---

# Testing

Use:

- Vitest 5,
- `@vue/test-utils` 2.5+.

Unit/component tests cover public behavior, props/events/slots, controlled state and regressions.

For behavior that depends on a real browser, use Vitest Browser Mode with the Playwright browser provider selectively, especially for:

- Modal/Drawer focus trapping,
- focus restoration,
- Menu keyboard navigation,
- Combobox/Select interactions,
- pointer/focus edge cases,
- accessibility-critical browser behavior.

Do not create a separate full application E2E suite by default.

Automated accessibility tooling can supplement tests, but it does not replace keyboard/focus testing against relevant WAI-ARIA interaction patterns.

---

# Storybook

Use Storybook 10.6+ with `@storybook/vue3-vite`.

Storybook is for:

- isolated component development,
- important visual states,
- theme/dark-mode preview,
- responsive inspection,
- interaction examples/tests where useful,
- accessibility feedback.

It is not the primary public documentation site.

Production Storybook is a static build mounted under the GitHub Pages output, for example:

```text
/doctui/storybook/
```

No Storybook server runs in production.

---

# Documentation

Use VitePress stable 1.x for the public documentation site.

Do not make a VitePress prerelease the production baseline without an explicit decision.

VitePress owns:

- getting started,
- installation,
- theming,
- styling,
- accessibility guidance,
- component/package documentation,
- migration guides,
- MCP and AI integration documentation.

Production documentation is built statically and deployed to GitHub Pages.

---

# Component metadata and generated documentation

Use `vue-component-meta` as the first choice for extracting Vue public API information.

Canonical pipeline:

```text
Vue source + TypeScript types
          ↓
vue-component-meta
          ↓
doctui normalization/validation
          ↓
canonical component registry
          ↓
├── VitePress API tables
├── Storybook metadata where useful
├── llms.txt
├── llms-full.txt
├── static metadata JSON
└── MCP resources/tools
```

Handwritten prose/examples can enrich metadata, but API facts should not be independently duplicated in multiple systems.

Generated artifacts should include:

```text
/llms.txt
/llms-full.txt
/metadata/components.json
```

They are static GitHub Pages artifacts; no database/API service is required.

---

# MCP

When the MCP phase starts, use the stable `@modelcontextprotocol/server` 2.x line unless the project deliberately updates the decision.

Initial transport: stdio.

Runtime target: Bun and modern Node.js where practical.

```text
AI client
   ↓ stdio
@doctui/mcp-server
   ↓
bundled/versioned doctui registry
```

The default doctui architecture must not require a remotely hosted MCP service.

---

# Release management

Use Changesets 3.x for monorepo package versioning and changelog intent.

Planned package family:

```text
@doctui/core
@doctui/hooks
@doctui/form
@doctui/notifications
@doctui/dates
@doctui/mcp-server
```

Do not publish empty placeholder packages.

Use the public npm registry. Prefer GitHub Actions trusted publishing/OIDC with provenance instead of long-lived npm credentials where supported.

GitHub Releases should accompany meaningful public releases.

---

# CI/CD

Use GitHub Actions on GitHub-hosted runners.

Initial workflows:

```text
ci.yml
pages.yml
```

Later:

```text
release.yml
security.yml
```

Pull request validation should converge on:

```text
bun install --frozen-lockfile
Biome checks
TypeScript 7 checks
Vue SFC typecheck/declaration compatibility check
Vitest
package build
Storybook build
VitePress build
metadata/docs validation
```

On `main`:

```text
build packages
       ↓
generate metadata/LLM artifacts
       ↓
build VitePress
       ↓
build Storybook
       ↓
mount Storybook into static site output
       ↓
GitHub Pages deploy
```

No SSH or VPS deployment.

---

# Dependency automation and security

Prefer GitHub-native/free tooling:

- Dependabot,
- GitHub dependency review where applicable,
- CodeQL as the repository matures,
- `bun audit` in scheduled/security workflows when useful.

Do not auto-merge major upgrades.

---

# SSR and browser compatibility

Components must be safe for SSR consumers even though doctui's own docs are static.

Rules:

- do not access `window` or `document` at module evaluation time,
- DOM work belongs in lifecycle hooks or guarded utilities,
- Portal/Teleport behavior must be hydration-aware,
- accessibility IDs must not create hydration mismatches,
- browser-only functionality must degrade predictably.

Target modern evergreen browsers. Build output initially targets ES2022.

---

# Explicitly not in the baseline

Do not add these without a demonstrated requirement and explicit project-level decision where appropriate:

- Reka UI,
- Vuetify / PrimeVue / Naive UI or another component library,
- Tailwind/UnoCSS as a core dependency,
- VueUse as a general core runtime dependency,
- ESLint,
- Prettier,
- TypeScript ESLint,
- Turborepo / Nx / Lerna,
- Sass/Less,
- runtime CSS-in-JS,
- tsup/unbuild alongside Vite,
- a dedicated backend,
- database/Redis,
- Docker production deployment,
- self-hosted GitHub runners,
- remote always-on MCP server,
- separate Playwright E2E application suite.

---

# Deferred decisions

Evaluate these when their phase begins instead of locking them during bootstrap:

- date library,
- virtualization engine,
- carousel dependency/implementation,
- rich-text integration,
- chart integration,
- visual regression platform,
- remote MCP transport,
- richer style-override API.

---

# Initial dependency ownership

## Root development tooling

```text
bun
TypeScript 7
@biomejs/biome
@typescript/typescript6  # compatibility-only, only if M0 proves Vue tooling requires it
Changesets               # when release workflow starts
```

## `packages/core`

Runtime/peer direction:

```text
peer: vue
runtime later when required: @floating-ui/dom
```

Development/build direction:

```text
Vite
@vitejs/plugin-vue
Vue SFC type/declaration tooling
Vitest
@vue/test-utils
```

## `apps/storybook`

```text
Storybook
@storybook/vue3-vite
accessibility tooling
workspace @doctui/core
```

## `apps/docs`

```text
VitePress
workspace @doctui/core
```

## `packages/mcp` later

```text
@modelcontextprotocol/server
versioned doctui registry/metadata
```

---

# Canonical interpretation

`docs/TECH_STACK.md` overrides older wording in roadmap or agent material if those documents still refer generically to ESLint/Prettier or TypeScript 6. Such stale references should be updated when touched. The intended baseline is TypeScript 7 + Biome.