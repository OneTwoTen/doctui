---
name: create-docs-story
description: Add or improve doctui Storybook stories and VitePress documentation for a public component.
---
# Document a doctui component

## Workflow

1. Read the component implementation and tests; document actual behavior, not intended behavior.
2. Create a minimal basic example that a user can copy.
3. Add examples for meaningful variants/states only.
4. Add an interactive Storybook story for keyboard/focus-sensitive behavior.
5. Document `v-model`, emits and named slots explicitly when they exist.
6. Add accessibility notes for non-native widgets.
7. Ensure examples use only public APIs.
8. Keep source metadata structured so docs generators can produce API tables and future `llms.txt` output.
9. Run Storybook/docs builds when available.

## Do not

- Copy Mantine documentation prose verbatim.
- Show internal imports in user-facing examples.
- Use undocumented CSS internals as the recommended customization path.
