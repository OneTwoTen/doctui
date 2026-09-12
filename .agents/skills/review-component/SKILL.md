---
name: review-component
description: Review a doctui component or pull request for API consistency, accessibility, theme integration, tests and maintenance risk.
---
# Review a doctui component

Review in this order:

1. Public API: consistency, unnecessary props, Vue idioms, breaking changes.
2. Semantics/accessibility: native semantics, keyboard model, focus, labels, disabled state.
3. Architecture: duplicated primitives, state ownership, composable boundaries.
4. Theme/styling: token use, CSS variable contract, state attributes, dark mode.
5. Behavior: controlled/uncontrolled transitions, edge states, async/loading cases.
6. Tests: critical user flows, keyboard/focus, regression coverage, and whether observable behavior or bug fixes were driven by a failing test first where practical.
7. Docs/Storybook: public API accuracy, sufficient copy-paste examples for meaningful variants/states/customization paths, and Storybook coverage for visual/interactive states.
8. Dependencies/performance: unnecessary packages, listeners, watchers and DOM work.

## Test-first review rule

For new observable behavior and bug fixes, prefer evidence of a red-green-refactor flow:

- a test was added or changed to describe the intended behavior,
- that test would fail against the previous implementation for the expected reason,
- implementation then makes it pass,
- regression coverage remains after refactoring.

Do not block purely mechanical or non-testable changes just because a red test cannot be demonstrated, but require the PR to explain the exception when it affects public behavior.

## Documentation coverage rule

Treat missing examples as a product-quality issue when the public API is documented only partially. Check that docs provide copy-paste examples for the user-facing concepts introduced or changed by the PR, including where applicable:

- basic usage,
- meaningful variants/sizes/colors,
- important states,
- slots and `v-model`/events,
- theming and CSS-variable customization,
- contextual/nested/composed behavior.

Storybook breadth does not substitute for code examples in public docs, and prose does not substitute for visual/interactive Storybook states.

Report findings by severity. Prefer concrete fixes over stylistic preferences.
