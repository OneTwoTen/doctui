---
name: create-docs-story
description: Add or improve doctui Storybook stories and VitePress documentation for a public component.
---
# Document a doctui component

## Workflow

1. Read the component implementation and tests; document actual behavior, not intended behavior.
2. Inventory the public surface that needs examples: core usage, meaningful props/variants, states, slots, events/`v-model`, accessibility behavior and supported customization paths.
3. Create a minimal basic example that a user can copy.
4. Add copy-paste examples for each meaningful public behavior. Do not consider docs complete when only the basic example exists but the API exposes additional important variants, states or customization paths.
5. Add Storybook stories for meaningful variants, visual states and edge states; add an interactive story for keyboard/focus-sensitive behavior.
6. Document `v-model`, emits and named slots explicitly when they exist.
7. Add accessibility notes for non-native widgets.
8. Document supported theming/CSS-variable customization with at least one concrete example when the component exposes or consumes public theme tokens.
9. Add a realistic composition example when the component is normally used together with other doctui components or providers.
10. Ensure examples use only public APIs and are small enough to copy without unrelated setup.
11. Keep source metadata structured so docs generators can produce API tables and future `llms.txt` output.
12. Run Storybook/docs builds when available.

## Example coverage rule

Documentation examples are part of the release contract, not decoration. A public API change should normally include examples for every user-facing concept introduced by that change. Depending on the API, this usually means:

- basic usage,
- significant variants/sizes/colors,
- disabled/loading/error/empty or other important states,
- slots and model/event flows,
- provider/theme usage,
- CSS-variable customization,
- nested/composed usage when behavior changes by context.

A Storybook story does not replace a documentation example when users need code they can copy into an application. Conversely, docs prose does not replace a visual Storybook state when appearance or interaction needs inspection.

## Do not

- Copy Mantine documentation prose verbatim.
- Show internal imports in user-facing examples.
- Use undocumented CSS internals as the recommended customization path.
- Document only the happy path when the public API exposes meaningful variants or states.
- Add examples that cannot compile against the exported public API.
