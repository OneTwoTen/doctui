---
name: create-docs-story
description: Add or improve doctui Storybook stories and VitePress documentation for a public component.
---
# Document a doctui component

## Documentation surfaces

For doctui, "documentation" means **both**:

- VitePress user documentation with copy-paste code examples, and
- Storybook visual/interactive documentation with representative states and compositions.

Do not consider a public component documented when only one of these surfaces is complete unless the task explicitly scopes one surface out.

## Mandatory live VitePress rendering

Every public component documented in VitePress must be shown at least once as
a live, rendered doctui component, not only as a fenced code block. Component
tags must resolve to the actual exported component through an explicit local
import or the shared `apps/docs/.vitepress/theme/index.ts` registration. Never
leave PascalCase doctui tags as unresolved custom elements.

When adding a component from a new package, register its component and load
its public stylesheet in the VitePress theme. The docs build must verify that
the preview renders real component markup (for example a `data-dui-component`
attribute), in addition to compiling the Markdown.

## Workflow

1. Read the component implementation and tests; document actual behavior, not intended behavior.
2. Inventory the public surface that needs examples: core usage, meaningful props/variants, states, slots, events/`v-model`, accessibility behavior and supported customization paths.
3. Create a minimal basic example that a user can copy in VitePress and a matching basic Storybook story.
4. Add at least one live VitePress preview using the actual exported component, and verify it renders rather than remaining an unresolved custom element.
5. Add copy-paste VitePress examples for each meaningful public behavior. Do not consider docs complete when only the basic example exists but the API exposes additional important variants, states or customization paths.
6. Add Storybook stories for meaningful variants, sizes/colors, visual states and edge states; add an interactive story for keyboard/focus-sensitive behavior.
7. Add at least one **advanced composition story** for public components that are normally used with other doctui components. Compose multiple exported doctui components into a realistic higher-level UI instead of showing every component only in isolation.
8. Prefer advanced stories that demonstrate a real product pattern such as a settings panel, form section, toolbar, card, empty state, confirmation flow, filter bar or dashboard block.
9. For foundation APIs that exist before enough public components are available, create a realistic composed foundation preview and replace/extend it with actual doctui-component composition once those components exist.
10. Document `v-model`, emits and named slots explicitly when they exist.
11. Add accessibility notes for non-native widgets.
12. Document supported theming/CSS-variable customization with at least one concrete VitePress example and one visual Storybook example when the component exposes or consumes public theme tokens.
13. Ensure examples use only public APIs, except local Storybook-only demo components used to compose a foundation preview before corresponding public doctui components exist.
14. Keep VitePress examples small enough to copy without unrelated setup; advanced Storybook stories may be larger when the composition itself is the lesson.
15. Keep source metadata structured so docs generators can produce API tables and future `llms.txt` output.
16. Run Storybook/docs builds when available.

## Storybook coverage rule

A normal public component should usually have the following Storybook coverage when applicable:

- `Basic` — smallest representative usage,
- `Variants` — meaningful visual variants/colors/sizes,
- `States` — disabled/loading/error/empty/selected/etc.,
- `Interactive` — keyboard/focus/model/event behavior when relevant,
- `Theming` — provider/token/CSS-variable customization when relevant,
- `AdvancedComposition` — a realistic UI composed from multiple doctui components.

Do not create redundant stories only to satisfy names. Combine stories when that makes comparison clearer, but preserve the coverage above.

### Advanced composition requirement

Once the repository has enough public primitives, `AdvancedComposition` should use **two or more relevant exported doctui components** and demonstrate how their APIs work together. Prefer composing the component under documentation with sibling components rather than building a fake one-off demo entirely from native HTML.

Advanced stories are not only visual showcases. They should teach recommended composition patterns, spacing/theme usage, state flow and accessibility boundaries.

## Example coverage rule

Documentation examples are part of the release contract, not decoration. A public API change should normally include examples for every user-facing concept introduced by that change. Depending on the API, this usually means:

- basic usage,
- significant variants/sizes/colors,
- disabled/loading/error/empty or other important states,
- slots and model/event flows,
- provider/theme usage,
- CSS-variable customization,
- nested/composed usage when behavior changes by context,
- realistic multi-component composition in Storybook.

Storybook breadth does not replace copy-paste VitePress examples, and VitePress prose/examples do not replace visual/interactive Storybook coverage. Both surfaces are required for normal public component work.

## Do not

- Copy Mantine documentation prose verbatim.
- Show internal imports in user-facing VitePress examples.
- Use undocumented CSS internals as the recommended customization path.
- Document only the happy path when the public API exposes meaningful variants or states.
- Stop Storybook coverage at one basic/default story.
- Call a story "advanced" when it still demonstrates only one isolated component with more props.
- Add examples that cannot compile against the exported public API.
