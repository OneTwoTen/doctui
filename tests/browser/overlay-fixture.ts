import "../../packages/core/src/styles.css";
import { Button, DoctuiProvider, Drawer, Modal, Stack } from "../../packages/core/src";
import { createApp, defineComponent, h, nextTick, ref } from "vue";

const App = defineComponent({
  setup() {
    const modalOpen = ref(false);
    const drawerOpen = ref(false);
    const modalSize = ref<"xs" | "sm" | "md" | "lg" | "xl">("xs");

    return () =>
      h(
        DoctuiProvider,
        {
          theme: {
            colors: {
              light: {
                neutral: {
                  filled: "#123456",
                },
              },
            },
          },
        },
        {
          default: () =>
            h("main", { style: { padding: "2rem" } }, [
              h("button", { id: "outside", type: "button" }, "Outside target"),
              h(
                "select",
                {
                  id: "modal-size",
                  value: modalSize.value,
                  onChange: (event: Event) => {
                    modalSize.value = (event.target as HTMLSelectElement).value as
                      | "xs"
                      | "sm"
                      | "md"
                      | "lg"
                      | "xl";
                  },
                },
                ["xs", "sm", "md", "lg", "xl"].map((size) =>
                  h("option", { value: size }, size),
                ),
              ),
              h(
                Button,
                {
                  id: "open-modal",
                  onClick: () => (modalOpen.value = true),
                },
                () => "Open modal",
              ),
              h(
                Modal,
                {
                  modelValue: modalOpen.value,
                  title: "Browser regression modal",
                  size: modalSize.value,
                  centered: true,
                  "onUpdate:modelValue": (value: boolean) =>
                    (modalOpen.value = value),
                },
                {
                  default: () =>
                    h(Stack, { gap: "md" }, () => [
                      h(
                        Button,
                        {
                          id: "open-drawer",
                          onClick: () => (drawerOpen.value = true),
                        },
                        () => "Open drawer",
                      ),
                      h(
                        Button,
                        { id: "modal-action" },
                        () => "Modal action",
                      ),
                      h(
                        Drawer,
                        {
                          modelValue: drawerOpen.value,
                          title: "Browser regression drawer",
                          size: "sm",
                          "onUpdate:modelValue": (value: boolean) =>
                            (drawerOpen.value = value),
                        },
                        {
                          default: () =>
                            h(
                              Button,
                              { id: "drawer-action" },
                              () => "Drawer action",
                            ),
                        },
                      ),
                    ]),
                },
              ),
            ]),
        },
      );
  },
});

createApp(App).mount("#app");
await nextTick();
Object.assign(window, { __doctuiOverlayFixtureReady: true });
