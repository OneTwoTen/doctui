import { readFile, writeFile } from "node:fs/promises";

function replaceEntry(source, name, replacement) {
  const startMarker = `  {\n    name: "${name}",`;
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing ${name} metadata entry`);
  const endMarker = "\n  },";
  const endStart = source.indexOf(endMarker, start);
  if (endStart < 0) throw new Error(`Missing ${name} metadata entry end`);
  const end = endStart + endMarker.length;
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

const stylesPath = "packages/core/src/styles.css";
let styles = await readFile(stylesPath, "utf8");

styles = styles.replace(
  /\.dui-Overlay \{[\s\S]*?\n\}\n\n\.dui-Overlay > \[data-dui-overlay-surface\]/,
  `.dui-Overlay {
  align-items: center;
  background: color-mix(
    in srgb,
    var(--dui-overlay-color, var(--dui-color-neutral-filled))
      calc(var(--dui-overlay-opacity, 0.55) * 100%),
    transparent
  );
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: var(--dui-z-index-overlay);
}

.dui-Overlay[data-align="start"] {
  align-items: flex-start;
}

.dui-Overlay[data-align="center"] {
  align-items: center;
}

.dui-Overlay > [data-dui-overlay-surface]`,
);

styles = styles.replace(
  /\.dui-Modal \{[\s\S]*?\n\}\n\n\.dui-Modal-header,/,
  `.dui-Modal {
  --dui-modal-width: 32rem;

  background: var(--dui-color-surface-raised);
  box-shadow: var(--dui-shadow-xl);
  box-sizing: border-box;
  color: var(--dui-color-text);
  margin: var(--dui-spacing-lg);
  max-height: calc(100vh - 2 * var(--dui-spacing-lg));
  max-width: min(
    calc(100vw - 2 * var(--dui-spacing-lg)),
    var(--dui-modal-width)
  );
  min-width: 0;
  overflow: auto;
  width: 100%;
  z-index: var(--dui-z-index-modal);
}

.dui-Modal[data-size="xs"] {
  --dui-modal-width: 20rem;
}

.dui-Modal[data-size="sm"] {
  --dui-modal-width: 26rem;
}

.dui-Modal[data-size="md"] {
  --dui-modal-width: 32rem;
}

.dui-Modal[data-size="lg"] {
  --dui-modal-width: 42rem;
}

.dui-Modal[data-size="xl"] {
  --dui-modal-width: 56rem;
}

.dui-Modal-header,`,
);

styles = styles.replace(
  /\.dui-Drawer \{[\s\S]*?\n\}\n\n\.dui-Drawer\[data-position="left"\]/,
  `.dui-Drawer {
  --dui-drawer-width: 28rem;

  background: var(--dui-color-surface);
  bottom: 0;
  box-shadow: var(--dui-shadow-lg);
  box-sizing: border-box;
  padding: var(--dui-spacing-lg);
  position: fixed;
  top: 0;
  width: min(100%, var(--dui-drawer-width));
  z-index: var(--dui-z-index-modal);
}

.dui-Drawer[data-position="left"]`,
);

styles = styles.replace(
  /\.dui-Drawer\[data-size="xs"\] \{[\s\S]*?\.dui-Drawer\[data-size="lg"\] \{[\s\S]*?\n\}/,
  `.dui-Drawer[data-size="xs"] {
  --dui-drawer-width: 16rem;
}

.dui-Drawer[data-size="sm"] {
  --dui-drawer-width: 20rem;
}

.dui-Drawer[data-size="md"] {
  --dui-drawer-width: 28rem;
}

.dui-Drawer[data-size="lg"] {
  --dui-drawer-width: 36rem;
}

.dui-Drawer[data-size="xl"] {
  --dui-drawer-width: 48rem;
}`,
);

styles = styles.replace(/z-index: 20;/g, "z-index: var(--dui-z-index-popover);");
styles = styles.replace(/z-index: 30;/g, "z-index: var(--dui-z-index-tooltip);");
await writeFile(stylesPath, styles);

const metadataPath = "packages/core/src/component-metadata.ts";
let metadata = await readFile(metadataPath, "utf8");
metadata = replaceEntry(
  metadata,
  "Overlay",
  `  {
    name: "Overlay",
    category: "overlays",
    description:
      "Portal-backed semantic-color backdrop with controlled visibility and dismissal.",
    props: ["modelValue", "color", "opacity", "closeOnClick"],
    accessibility: [
      "Backdrop color uses semantic theme tokens and opacity affects only the backdrop, never dialog content.",
      "Overlay is a layering primitive, not a dialog; accessible dialog naming and focus management belong to Modal or Drawer.",
    ],
    examples: [
      '<Overlay v-model="open" color="neutral" :opacity="0.55"><div>Surface</div></Overlay>',
    ],
  },`,
);
metadata = replaceEntry(
  metadata,
  "Modal",
  `  {
    name: "Modal",
    category: "overlays",
    description:
      "Accessible modal dialog with nested-layer dismissal, reference-counted scroll lock and focus restoration.",
    props: [
      "modelValue",
      "title",
      "ariaLabel",
      "size",
      "radius",
      "centered",
      "closeOnEscape",
      "closeOnClickOutside",
      "withCloseButton",
    ],
    accessibility: [
      "Uses role=dialog and aria-modal, traps focus while open, and restores the previously focused element on close.",
      "A visible title provides aria-labelledby; ariaLabel names titleless dialogs, with Dialog as a safety fallback.",
      "Only the top dismissable layer reacts to Escape or outside pointer interaction when dialogs are nested.",
    ],
    examples: [
      '<Modal v-model="open" title="Review changes" size="lg" centered>...</Modal>',
      '<Modal v-model="open" aria-label="Confirm publish" :close-on-click-outside="false">...</Modal>',
    ],
  },`,
);
metadata = replaceEntry(
  metadata,
  "Drawer",
  `  {
    name: "Drawer",
    category: "overlays",
    description:
      "Accessible side dialog with shared overlay, nested-layer dismissal and focus restoration.",
    props: [
      "modelValue",
      "title",
      "ariaLabel",
      "position",
      "size",
      "radius",
      "closeOnEscape",
      "closeOnClickOutside",
      "withCloseButton",
    ],
    accessibility: [
      "Uses role=dialog and aria-modal, traps focus, closes on Escape when enabled and restores the trigger on close.",
      "A visible title provides aria-labelledby; ariaLabel names titleless drawers, with Drawer as a safety fallback.",
      "Shared scroll locking is reference-counted so closing one nested layer never unlocks the page under another open layer.",
    ],
    examples: [
      '<Drawer v-model="open" title="Filters" position="right" size="md">...</Drawer>',
    ],
  },`,
);
await writeFile(metadataPath, metadata);

const configPath = "apps/docs/.vitepress/config.mts";
let config = await readFile(configPath, "utf8");
if (!config.includes('link: "/guide/overlays"')) {
  const marker = '          { text: "TagsInput", link: "/guide/tags-input" },';
  if (!config.includes(marker)) throw new Error("Missing TagsInput sidebar entry");
  config = config.replace(
    marker,
    `${marker}\n          { text: "Overlays", link: "/guide/overlays" },`,
  );
  await writeFile(configPath, config);
}
