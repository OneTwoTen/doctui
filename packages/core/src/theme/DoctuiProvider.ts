import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  type PropType,
} from "vue";
import { DOCTUI_CONTEXT_KEY } from "./context";
import { getThemeCssVariables } from "./css-variables";
import { DEFAULT_THEME } from "./default-theme";
import { mergeTheme } from "./merge-theme";
import type { DoctuiColorScheme, DoctuiThemeOverride } from "./types";

export const DoctuiProvider = defineComponent({
  name: "DoctuiProvider",
  inheritAttrs: false,
  props: {
    theme: {
      type: Object as PropType<DoctuiThemeOverride>,
      default: undefined,
    },
    colorScheme: {
      type: String as PropType<DoctuiColorScheme>,
      default: undefined,
    },
    tag: {
      type: String,
      default: "div",
    },
  },
  setup(props, { attrs, slots }) {
    const parent = inject(DOCTUI_CONTEXT_KEY, null);
    const theme = computed(() =>
      mergeTheme(parent?.theme.value ?? DEFAULT_THEME, props.theme),
    );
    const colorScheme = computed<DoctuiColorScheme>(
      () => props.colorScheme ?? parent?.colorScheme.value ?? "light",
    );
    const cssVariables = computed(() =>
      getThemeCssVariables(theme.value, colorScheme.value),
    );

    provide(DOCTUI_CONTEXT_KEY, { theme, colorScheme });

    return () =>
      h(
        props.tag,
        {
          ...attrs,
          "data-dui-provider": "",
          "data-dui-color-scheme": colorScheme.value,
          style: [cssVariables.value, attrs.style],
        },
        slots.default?.(),
      );
  },
});
