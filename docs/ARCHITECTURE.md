# doctui architecture

## Objective

Build a Vue-native component system with the coherence and developer experience people value in Mantine, while owning doctui's implementation, accessibility behavior and theme contract.

## Layers

```text
Design tokens / CSS variables
          ↓
Internal primitives + composables
          ↓
Core components
          ↓
Feature packages (form, notifications, dates)
          ↓
Storybook + VitePress docs
          ↓
Generated API metadata + llms.txt
```

## Important decisions

### Vue-first public API

Do not preserve React-shaped APIs solely for similarity with Mantine. Translate concepts into Vue's native model.

### No headless component framework

The project intentionally does not depend on Reka UI. Complex interactions must therefore be implemented and tested deliberately. Low-level infrastructure such as Floating UI is acceptable when it solves a specialized problem without imposing a component architecture.

### Shared primitives before complex components

`Select`, `Autocomplete`, `Menu` and similar components should not each implement their own popup/focus/dismissal logic. Shared internal foundations should mature first.

### Styling contract

CSS variables are the stable theme boundary. Consumer applications may use any styling solution without forcing doctui to depend on it.

## Suggested implementation order

1. Theme/token/provider foundation.
2. Layout and typography primitives.
3. Button/action controls.
4. Input foundation + simple form controls.
5. Portal/focus/scroll-lock/dismissal/transition primitives.
6. Floating layer.
7. Modal/Drawer/Tooltip/Popover/Menu.
8. Combobox foundation.
9. Select/Autocomplete/MultiSelect.
10. Notifications, form helpers and dates.

Do not optimize for component count. Optimize for consistency of the foundations that many components share.
