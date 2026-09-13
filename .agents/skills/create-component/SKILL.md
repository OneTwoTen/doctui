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
3. If Mantine is a reference, extract behavior/UX concepts only; explicitly translate React patterns into Vue patterns. Compare geometry, state visuals, focus treatment and customization surface in addition to prop names.
4. Write down the proposed public API: props, emits, slots, exposed methods, state attributes, public CSS variables and style parts when applicable.
5. Identify reusable lower-level behavior. Build/reuse an internal primitive or composable instead of duplicating it.
6. Write the smallest behavioral/regression tests for the new contract **before implementation**. Run the relevant test and confirm it fails for the expected missing behavior (red). If the environment cannot run tests, state that explicitly instead of claiming a red test.
7. Implement the minimum semantic markup and behavior required to make the new tests pass (green), then add styling through existing theme tokens/CSS variables.
8. Add keyboard/focus/ARIA behavior required by the widget pattern, with failing tests first for non-trivial interaction behavior.
9. Refactor only after the relevant tests are green; keep behavior covered throughout the refactor.
10. Add Storybook visual documentation: basic usage, meaningful variants/states, interactive behavior when relevant, theming/customization when relevant, and an advanced composition story when enough related doctui components exist.
11. The advanced Storybook example must demonstrate realistic composition, normally by combining the new component with at least one other exported doctui component into a higher-level UI pattern. Do not treat a single component with many props as advanced composition.
12. Add/update VitePress documentation and API metadata. Every meaningful public prop, variant, state, slot, theming/customization path or non-obvious behavior introduced by the change must have a representative copy-paste example where practical; do not stop at one minimal example when the API exposes more user-facing behavior.
13. Run the repository's formatter, lint, typecheck, relevant tests, Storybook build and docs build when affected.
14. Report public API decisions, accessibility behavior, red-to-green test coverage, Storybook composition coverage and any deliberate differences from the reference.

## Field/input component rule

For `InputWrapper`, text-like fields, Checkbox/Radio/Switch, selection inputs and any component that wraps a native form control:

1. Read `.cursor/rules/field-components.mdc` before changing the DOM or styling contract.
2. Keep generated IDs plus label/description/error relationships centralized in the shared field primitive. Do not duplicate fallback ID generation in every field.
3. Consumer `class`/`style` belong to the outer field root. Native form/autofill/ARIA/data attributes and native listeners belong to the actual native control. Use `inheritAttrs: false` to make that split explicit.
4. If `size` is public, write a failing test that proves it changes observable state/geometry. Size must scale appropriate height, padding, indicator, section or track/thumb dimensions rather than only font size.
5. Prefer CSS variables for geometry and semantic tokens for colors. For new or substantially refactored field styling, use a colocated/family stylesheet that can still be bundled into the package stylesheet.
6. Custom Checkbox/Radio/Switch visuals must keep the native input as the source of keyboard, focus, form and accessibility semantics. Project native `:checked`, `:disabled` and `:focus-visible` state onto the visual indicator/track.
7. When users need to customize multiple visual regions, use the shared typed `classNames`/`styles` part contract. Reuse existing part names instead of inventing component-specific synonyms.
8. For free-form token/multi-value text inputs, define trim/duplicate/limit policy before coding. Batch parsing must compute the complete accepted next value before emitting `update:modelValue`; only single-character separators may act as keyboard delimiter keys, while multi-character separators are parsed from input text. Keep the native text input as the stable focus target and document Backspace/remove/clear focus behavior.
9. Add Storybook coverage that compares `xs/sm/md/lg/xl` geometry and important states. Also keep a realistic form/composition story that shows sibling doctui components working together.
10. Document outer-root vs native-control attr ownership, accessibility relationships, public CSS variables and style parts in VitePress and metadata.

## Test-first rule

Use red-green-refactor as the default implementation order for observable behavior and bug fixes:

1. **Red:** add or update a test that describes the desired public behavior and verify that it fails for the expected reason.
2. **Green:** make the smallest implementation change that satisfies the test.
3. **Refactor:** improve structure without changing behavior while keeping the suite green.

Do not write implementation first and add tests afterward merely to mirror the implementation. Exceptions are limited to exploratory spikes or changes that cannot be meaningfully tested first; document the reason and add regression coverage before considering the work complete.

## Documentation example rule

Documentation is part of the public API contract and includes **both VitePress and Storybook**.

VitePress examples should cover the useful API surface with copy-paste code, typically including:

- basic usage,
- meaningful variants/sizes/colors,
- important states such as disabled/loading/error when applicable,
- slots and `v-model`/events when applicable,
- theming or CSS-variable customization when exposed,
- realistic usage patterns.

Storybook should cover visual and interactive breadth, typically including:

- basic/default state,
- variants/sizes/colors,
- state matrix and edge cases,
- interaction/focus behavior when relevant,
- theming/customization,
- at least one `AdvancedComposition`-style story that combines multiple doctui components into a realistic component or UI block when the component ecosystem is sufficient.

Prefer small copy-pasteable VitePress examples over prose-only descriptions. Prefer Storybook for visual comparison and larger composition examples. Neither surface replaces the other.

## Final checklist

- [ ] Vue-first API (`v-model`, slots, emits where appropriate)
- [ ] no Reka UI/component framework dependency
- [ ] shared primitives reused
- [ ] theme tokens/CSS variables used
- [ ] `size` scales meaningful geometry when exposed
- [ ] wrapped native-control attrs have an explicit root/control ownership contract
- [ ] token inputs define normalization, separator, limit and focus behavior explicitly when applicable
- [ ] multi-part customization uses stable typed style parts when needed
- [ ] relevant behavior started with a failing test (red) before implementation
- [ ] keyboard/focus behavior tested
- [ ] disabled/loading/error states covered when applicable
- [ ] Storybook covers basic, meaningful variants/states and interactions
- [ ] Storybook includes a realistic advanced multi-component composition when applicable
- [ ] VitePress docs include sufficient copy-paste examples for the public API surface
- [ ] docs/API metadata added and synchronized
- [ ] Storybook and docs builds pass
- [ ] no undocumented breaking API change
