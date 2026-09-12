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
6. Write the smallest behavioral/regression tests for the new contract **before implementation**. Run the relevant test and confirm it fails for the expected missing behavior (red). If the environment cannot run tests, state that explicitly instead of claiming a red test.
7. Implement the minimum semantic markup and behavior required to make the new tests pass (green), then add styling through existing theme tokens/CSS variables.
8. Add keyboard/focus/ARIA behavior required by the widget pattern, with failing tests first for non-trivial interaction behavior.
9. Refactor only after the relevant tests are green; keep behavior covered throughout the refactor.
10. Add Storybook stories for normal, variants, edge states and interactive states.
11. Add/update documentation and API metadata. Every meaningful public prop, variant, state, slot, theming/customization path or non-obvious behavior introduced by the change must have a representative copy-paste example where practical; do not stop at one minimal example when the API exposes more user-facing behavior.
12. Run the repository's formatter, lint, typecheck, relevant tests, Storybook build and docs build when affected.
13. Report public API decisions, accessibility behavior, red-to-green test coverage and any deliberate differences from the reference.

## Test-first rule

Use red-green-refactor as the default implementation order for observable behavior and bug fixes:

1. **Red:** add or update a test that describes the desired public behavior and verify that it fails for the expected reason.
2. **Green:** make the smallest implementation change that satisfies the test.
3. **Refactor:** improve structure without changing behavior while keeping the suite green.

Do not write implementation first and add tests afterward merely to mirror the implementation. Exceptions are limited to exploratory spikes or changes that cannot be meaningfully tested first; document the reason and add regression coverage before considering the work complete.

## Documentation example rule

Documentation is part of the public API contract. For a new or substantially changed component, examples should cover the useful surface of the API, typically including:

- basic usage,
- meaningful variants/sizes/colors,
- important states such as disabled/loading/error when applicable,
- slots and `v-model`/events when applicable,
- theming or CSS-variable customization when exposed,
- at least one realistic composition example when the component is normally used with other doctui primitives.

Prefer small copy-pasteable examples over prose-only descriptions. Storybook may provide visual/state breadth, but it does not replace user-facing docs examples.

## Final checklist

- [ ] Vue-first API (`v-model`, slots, emits where appropriate)
- [ ] no Reka UI/component framework dependency
- [ ] shared primitives reused
- [ ] theme tokens/CSS variables used
- [ ] relevant behavior started with a failing test (red) before implementation
- [ ] keyboard/focus behavior tested
- [ ] disabled/loading/error states covered when applicable
- [ ] Storybook stories cover meaningful states/variants
- [ ] docs include sufficient copy-paste examples for the public API surface
- [ ] docs/API metadata added
- [ ] no undocumented breaking API change
