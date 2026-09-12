---
name: create-component
description: Design and implement a new public doctui Vue component with consistent API, accessibility, tests, Storybook and docs.
---
# Create a doctui component

## Use this skill when

Creating a new component under `packages/core` or substantially redesigning an existing component API.

## Inputs

- Component name and purpose.
- Required behavior/states.
- Any Mantine documentation/API being used as a reference.
- Known dependencies or constraints.

## Workflow

1. Read `/AGENTS.md` and relevant Cursor rules.
2. Study adjacent doctui components and shared types before designing the API.
3. If Mantine is a reference, extract behavior/UX concepts only; explicitly translate React patterns into Vue patterns.
4. Write down the proposed public API: props, emits, slots, exposed methods and state attributes.
5. Identify reusable lower-level behavior. Build/reuse an internal primitive or composable instead of duplicating it.
6. Implement semantic markup first, then styling.
7. Add keyboard/focus/ARIA behavior required by the widget pattern.
8. Add behavioral tests for the critical states and interactions.
9. Add Storybook stories for normal, variants, edge states and interactive states.
10. Add/update documentation and API metadata.
11. Run the repository's formatter, lint, typecheck and relevant tests.
12. Report public API decisions, accessibility behavior and any deliberate differences from the reference.

## Final checklist

- [ ] Vue-first API (`v-model`, slots, emits where appropriate)
- [ ] no Reka UI/component framework dependency
- [ ] shared primitives reused
- [ ] theme tokens/CSS variables used
- [ ] keyboard/focus behavior tested
- [ ] disabled/loading/error states covered when applicable
- [ ] Storybook story added
- [ ] docs/API metadata added
- [ ] no undocumented breaking API change
