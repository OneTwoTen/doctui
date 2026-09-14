import "../../packages/core/src/styles.css";
import { createApp, defineComponent, h, nextTick, ref } from "vue";
import {
  Button,
  DoctuiProvider,
  Drawer,
  Group,
  Modal,
  Stack,
} from "../../packages/core/src";

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
                    modalSize.value = (event.target as HTMLSelectElement)
                      .value as "xs" | "sm" | "md" | "lg" | "xl";
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
                      h(Button, { id: "modal-action" }, () => "Modal action"),
                      ...Array.from({ length: 24 }, (_, index) =>
                        h(
                          "p",
                          { "data-modal-long-row": "", key: index },
                          `Long modal content ${index + 1}`,
                        ),
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
                            h(Stack, { gap: "md" }, () => [
                              h(
                                Button,
                                { id: "drawer-action" },
                                () => "Drawer action",
                              ),
                              ...Array.from({ length: 24 }, (_, index) =>
                                h(
                                  "p",
                                  { "data-drawer-long-row": "", key: index },
                                  `Long drawer content ${index + 1}`,
                                ),
                              ),
                            ]),
                          footer: () =>
                            h(Group, { gap: "sm" }, () => [
                              h(Button, { id: "drawer-cancel" }, () => "Cancel"),
                              h(Button, { id: "drawer-save" }, () => "Save"),
                            ]),
                        },
                      ),
                    ]),
                  footer: () =>
                    h(Group, { gap: "sm" }, () => [
                      h(Button, { id: "modal-cancel" }, () => "Cancel"),
                      h(Button, { id: "modal-save" }, () => "Save"),
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
