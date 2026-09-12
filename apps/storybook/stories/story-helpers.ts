import { DoctuiProvider } from "@doctui/core";
import { defineComponent, h } from "vue";

export function preview(renderContent: () => ReturnType<typeof h>) {
  return defineComponent({
    setup() {
      return () => h(DoctuiProvider, null, { default: renderContent });
    },
  });
}
