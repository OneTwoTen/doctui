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
7. VitePress docs: public API accuracy and sufficient copy-paste examples for meaningful variants/states/customization paths.
8. Storybook docs: basic coverage, variants/states, interaction coverage, theming examples and advanced multi-component composition when applicable.
9. Dependencies/performance: unnecessary packages, listeners, watchers and DOM work.

## Test-first review rule

For new observable behavior and bug fixes, prefer evidence of a red-green-refactor flow:

- a test was added or changed to describe the intended behavior,
- that test would fail against the previous implementation for the expected reason,
- implementation then makes it pass,
- regression coverage remains after refactoring.

Do not block purely mechanical or non-testable changes just because a red test cannot be demonstrated, but require the PR to explain the exception when it affects public behavior.

## Documentation coverage rule

Treat documentation as two required surfaces for normal public component work:

- **VitePress:** copy-paste usage documentation,
- **Storybook:** visual, state, interaction and composition documentation.

Check that VitePress covers the user-facing concepts introduced or changed by the PR, including where applicable:

- basic usage,
- meaningful variants/sizes/colors,
- important states,
- slots and `v-model`/events,
- theming and CSS-variable customization,
- contextual/nested behavior.

Check that Storybook goes beyond a default story and covers where applicable:

- variants/sizes/colors,
- state and edge-case matrices,
- keyboard/focus/interactive behavior,
- theming/customization,
- a realistic advanced composition story.

### Advanced Storybook review rule

Once enough public doctui primitives exist, an advanced story should combine **two or more exported doctui components** into a realistic higher-level UI or composed component. Examples include a settings panel, form section, toolbar, card, empty state, filter bar, confirmation flow or dashboard block.

A story is not advanced merely because one isolated component has many props set. The story should demonstrate component interoperability, recommended composition, state flow, theme/spacing behavior and accessibility boundaries.

Foundation work may temporarily use local Storybook-only demo sub-components when no public component set exists yet, but follow-up component phases should replace or extend these with real doctui component compositions.

Storybook breadth does not substitute for code examples in VitePress, and VitePress prose/examples do not substitute for visual/interactive Storybook states. Missing either surface is a documentation gap.

Report findings by severity. Prefer concrete fixes over stylistic preferences.
