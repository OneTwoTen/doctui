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
6. Tests: critical user flows, keyboard/focus, regression coverage.
7. Docs/Storybook: public API accuracy and useful examples.
8. Dependencies/performance: unnecessary packages, listeners, watchers and DOM work.

Report findings by severity. Prefer concrete fixes over stylistic preferences.
