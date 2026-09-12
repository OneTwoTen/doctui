# Package and export conventions

This document defines Phase 0 package rules for the doctui monorepo.

## Naming

- Publishable packages use the `@doctui/<name>` scope.
- Applications under `apps/*` are private and also use `@doctui/<name>` names for workspace filtering.
- Do not publish application packages.

## Module format

- Packages are ESM-first and set `type: module`.
- CommonJS output is not produced unless a demonstrated consumer requirement appears later.
- Public entry points must be listed explicitly in `package.json#exports`.
- Consumers must not rely on undocumented deep imports.

## Vue dependency

- Publishable Vue packages declare Vue as a peer dependency.
- The initial supported range is `>=3.5.0 <4`.
- Bundles must externalize Vue so consumers do not receive a second runtime copy.

## Source and declaration policy

- Vite library mode owns JavaScript bundling.
- Vue SFC declaration generation uses the repository's isolated `vue-tsc` compatibility bridge while TypeScript 7 lacks the programmatic API required by Vue tooling.
- TypeScript 7 remains the repository-wide compiler baseline.

## Future packages

Create packages only when implementation work starts. The intended long-term package set is documented in `ROADMAP.md`; Phase 0 begins with `@doctui/core` only.
