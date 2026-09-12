# Component taxonomy

`doctui` classifies components by stable UI domains instead of roadmap phases. The same taxonomy drives Storybook navigation, documentation discovery, registries, and future MCP tools.

## Canonical categories

| ID | Label | Purpose |
| --- | --- | --- |
| `layout` | Layout | Structure, spacing, alignment, and responsive layout |
| `typography` | Typography | Semantic text and headings |
| `actions` | Actions | Controls that trigger user actions |
| `inputs` | Inputs | Form controls that collect or edit values |
| `navigation` | Navigation | Moving between views, sections, and destinations |
| `data-display` | Data display | Structured values, status, and information |
| `feedback` | Feedback | Loading, progress, validation, and status feedback |
| `overlays` | Overlays | Dialogs, popovers, menus, and tooltips |
| `media` | Media | Images, icons, avatars, and visual media |
| `utilities` | Utilities | Low-level helpers that support composition |

The machine-readable ID is the contract. Human-facing labels may be presented in Storybook or documentation without requiring MCP clients to parse UI text.

## Storybook mapping

Component stories use `Category/Component` paths:

- `Layout/Box`
- `Layout/Flex`
- `Layout/Stack`
- `Layout/Group`
- `Typography/Text`
- `Typography/Title`
- `Actions/Button`

Cross-component examples live under `Recipes/...` instead of pretending to be component categories.

Storybook 10 requires CSF titles and `storySort` configuration to be statically analyzable, so Storybook keeps literal labels in its source files. Tests compare those literals against the canonical metadata registry so the human navigation cannot silently drift from the machine-readable taxonomy.

## Metadata source

`@doctui/core` exports:

- `DOCTUI_COMPONENT_CATEGORIES`
- `DOCTUI_COMPONENT_METADATA`
- `getComponentCategory()`
- `getComponentMetadata()`
- `getComponentStorybookTitle()`

Future MCP and registry endpoints should consume these exports rather than maintaining a second machine-readable category list. That keeps Storybook, docs, and machine discovery aligned as the component set grows.
