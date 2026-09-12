import {
  computed,
  inject,
  type ComputedRef,
  type InjectionKey,
} from "vue";
import { DEFAULT_THEME } from "./default-theme";
import type { DoctuiColorScheme, DoctuiTheme } from "./types";

export interface DoctuiContextValue {
  theme: ComputedRef<DoctuiTheme>;
  colorScheme: ComputedRef<DoctuiColorScheme>;
}

export const DOCTUI_CONTEXT_KEY = Symbol(
  "doctui-context",
) as InjectionKey<DoctuiContextValue>;

const FALLBACK_CONTEXT: DoctuiContextValue = {
  theme: computed(() => DEFAULT_THEME),
  colorScheme: computed(() => "light"),
};

export function useDoctuiTheme(): ComputedRef<DoctuiTheme> {
  return inject(DOCTUI_CONTEXT_KEY, FALLBACK_CONTEXT).theme;
}

export function useDoctuiColorScheme(): ComputedRef<DoctuiColorScheme> {
  return inject(DOCTUI_CONTEXT_KEY, FALLBACK_CONTEXT).colorScheme;
}
