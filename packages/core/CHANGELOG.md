# @doctui/core

## 0.1.0

### Minor Changes

- dab37ac: Add the first feature-package APIs, interaction primitives, date controls,
  generated documentation artifacts and local MCP integration.

### Patch Changes

- 45fcfff: Harden TagsInput IDs, accessible naming, separator parsing, token semantics, focus behavior, and edge-case handling.
- 56de85d: Repair TagsInput visual styling, control focus behavior, and native form submission so committed tags are serialized instead of the unfinished editor draft.
- 4641f62: Harden Menu, Popover, and Tooltip trigger semantics, keyboard focus behavior, dismissal focus restoration, and accessible descriptions.
- 0d07dc6: Harden SegmentedControl roving tabindex and radio-group keyboard behavior, including disabled-option skipping and empty or invalid controlled values. Polish Checkbox, Radio and Switch interaction feedback, and add complete size, hover, selected, focus, disabled and reduced-motion styling for SegmentedControl while preserving native input semantics.
- f7a2f0a: Harden Modal, Drawer and Overlay nested dismissal, focus restoration, reference-counted scroll locking, accessible naming and token-backed visual behavior.
- 0de1c24: Repair Menu, Popover and Tooltip visual presentation, name Popover dialogs from their real trigger relationship, and align contextual overlay Storybook playgrounds with controlled component args.
- 1792ca9: Harden Combobox focus management across Select, Autocomplete and MultiSelect. Add stable public ids, valid aria-activedescendant tracking during filtering, disabled-option skipping, scroll-to-active behavior, consistent clear events, accessible-name fallbacks, and expanded keyboard/accessibility documentation.
- df7308d: Wire breakpoint, semantic component color, focusable visually-hidden, and overlay stacking behavior through the public `--dui-*` theme token contract.
