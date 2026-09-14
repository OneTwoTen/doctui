import {
  Button,
  Combobox,
  DoctuiProvider,
  Menu,
  SegmentedControl,
  TextInput,
} from "../../packages/core/src";
import { DatePicker } from "../../packages/dates/src";
import {
  createNotifications,
  Notifications,
} from "../../packages/notifications/src";
import { createApp, defineComponent, h, nextTick, ref } from "vue";

const notifications = createNotifications({ limit: 3 });

const App = defineComponent({
  setup() {
    const email = ref("");
    const segment = ref<string | number>();
    const technology = ref<string | number | null>(null);
    const menuOpen = ref(false);
    const menuSelection = ref("");
    const pickedDate = ref<string | null>("2026-09-14");

    notifications.show({
      title: "Saved",
      message: "Browser matrix notification",
      autoClose: false,
      color: "success",
    });

    const section = (id: string, children: unknown[]) =>
      h("section", { id, style: { marginBottom: "2rem" } }, children);

    return () =>
      h(
        DoctuiProvider,
        {
          colorScheme: "dark",
          theme: {
            colors: {
              dark: {
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
              section("field-contract", [
                h(TextInput, {
                  id: "quality-email",
                  modelValue: email.value,
                  label: "Email",
                  description: "Use a work address",
                  error: "Email is required",
                  required: true,
                  name: "email",
                  "onUpdate:modelValue": (value: string) => {
                    email.value = value;
                  },
                }),
              ]),
              section("segmented-contract", [
                h(SegmentedControl, {
                  modelValue: segment.value,
                  ariaLabel: "Runtime",
                  data: [
                    { value: "disabled", label: "Disabled", disabled: true },
                    { value: "vue", label: "Vue" },
                    { value: "rust", label: "Rust" },
                  ],
                  "onUpdate:modelValue": (value: string | number) => {
                    segment.value = value;
                  },
                }),
                h(
                  "output",
                  { "data-quality-segment-value": "" },
                  String(segment.value ?? ""),
                ),
              ]),
              section("combobox-contract", [
                h(Combobox, {
                  id: "quality-tech",
                  modelValue: technology.value,
                  label: "Technology",
                  searchable: true,
                  clearable: true,
                  data: [
                    { value: "vue", label: "Vue" },
                    { value: "disabled", label: "Disabled", disabled: true },
                    { value: "rust", label: "Rust" },
                  ],
                  "onUpdate:modelValue": (
                    value:
                      | string
                      | number
                      | null
                      | readonly (string | number)[],
                  ) => {
                    if (!Array.isArray(value)) technology.value = value;
                  },
                }),
                h(
                  "output",
                  { "data-quality-combobox-value": "" },
                  String(technology.value ?? ""),
                ),
              ]),
              section("menu-contract", [
                h(
                  Menu,
                  {
                    modelValue: menuOpen.value,
                    data: [
                      { value: "disabled", label: "Disabled", disabled: true },
                      { value: "profile", label: "Profile" },
                      { value: "sign-out", label: "Sign out" },
                    ],
                    "onUpdate:modelValue": (value: boolean) => {
                      menuOpen.value = value;
                    },
                    onSelect: (value: string) => {
                      menuSelection.value = value;
                    },
                  },
                  {
                    target: () =>
                      h(Button, { id: "quality-menu-trigger" }, () => "Actions"),
                  },
                ),
                h(
                  "output",
                  { "data-quality-menu-value": "" },
                  menuSelection.value,
                ),
              ]),
              section("date-contract", [
                h(DatePicker, {
                  id: "quality-date",
                  modelValue: pickedDate.value,
                  label: "Release date",
                  locale: "en-US",
                  "onUpdate:modelValue": (value: string | null) => {
                    pickedDate.value = value;
                  },
                }),
                h(
                  "output",
                  { "data-quality-date-value": "" },
                  String(pickedDate.value ?? ""),
                ),
              ]),
              section("notification-contract", [
                h(Notifications, { store: notifications }),
              ]),
            ]),
        },
      );
  },
});

createApp(App).mount("#app");
await nextTick();
Object.assign(window, { __doctuiQualityFixtureReady: true });
