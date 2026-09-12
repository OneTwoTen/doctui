---
name: review-component
description: Review a doctui component or pull request for API consistency, accessibility, theme integration, tests and maintenance risk.
---
# Review a doctui component

Review in this order:

1. Public API: consistency, unnecessary props, Vue idioms, breaking changes.
2. Semantics/accessibility: native semantics, keyboard model, focus, labels, disabled state.
3. Architecture: duplicated primitives, state ownership, composable boundaries.
4. Theme/styling: token use, CSS variable contract, state attributes, dark mode, geometry across sizes and supported style parts.
5. Behavior: controlled/uncontrolled transitions, edge states, async/loading cases.
6. Tests: critical user flows, keyboard/focus, regression coverage, and whether observable behavior or bug fixes were driven by a failing test first where practical.
7. VitePress docs: public API accuracy and sufficient copy-paste examples for meaningful variants/states/customization paths.
8. Storybook docs: basic coverage, variants/states, interaction coverage, theming examples and advanced multi-component composition when applicable.
9. Dependencies/performance: unnecessary packages, listeners, watchers and DOM work.

## Field/input review rule

When reviewing an input-like component, explicitly verify all of the following before approving:

- `InputWrapper` or the equivalent shared primitive owns generated IDs and label/description/error relationships; field implementations do not create a second relationship system.
- Consumer `class`/`style` land on the outer field root, while native form/autofill/ARIA/data attributes and native listeners land on the real native control.
- `inheritAttrs: false` is used when attr ownership is split across multiple DOM nodes.
- A public `size` changes real geometry (height, padding, indicator, section, track/thumb, hit area as relevant) rather than only text size.
- Size/state geometry is token/CSS-variable driven and remains coherent across `xs/sm/md/lg/xl`.
- Error, disabled, readonly, selected/checked and focus-visible styling is complete and consistent; focus/error precedence is deliberate.
- Custom Checkbox/Radio/Switch visuals preserve a real native input for keyboard, focus, form and accessibility semantics.
- Multi-part customization uses the shared typed `classNames`/`styles` vocabulary instead of undocumented deep selectors or one-off props.
- Public CSS variables and style-part names are documented and treated as compatibility surface.
- Tests cover attrs/listener forwarding, custom IDs, description + error composition, required/disabled/readonly behavior and focus. Custom boolean visuals must also prove native type/name/checked/disabled semantics remain intact.
- Storybook contains a size/state matrix plus realistic composition; VitePress and metadata describe the same final contract.

When Mantine or another mature library is used as reference, compare interaction, geometry, visual state, focus treatment and customization ergonomics. Do not rate parity based only on similarly named props.

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
- part-based `classNames`/`styles` customization when public,
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
