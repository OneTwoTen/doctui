import "@doctui/core/styles.css";
import "@doctui/dates/styles.css";
import "@doctui/notifications/styles.css";
import "./preview.css";
import "./typography.css";
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Code,
  Combobox,
  Container,
  Divider,
  DoctuiProvider,
  Drawer,
  Flex,
  Grid,
  Group,
  InputWrapper,
  Kbd,
  Loader,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
  Overlay,
  Paper,
  PasswordInput,
  Popover,
  Radio,
  SegmentedControl,
  Select,
  Skeleton,
  Space,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from "@doctui/core";
import {
  Calendar,
  DateInput,
  DatePicker,
  DateTimePicker,
  MonthPicker,
  YearPicker,
} from "@doctui/dates";
import { Notifications } from "@doctui/notifications";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { defineComponent, h, type Component } from "vue";

const docsComponents: Record<string, Component> = {
  ActionIcon,
  Autocomplete,
  Badge,
  Box,
  Button,
  Calendar,
  Center,
  Checkbox,
  Code,
  Combobox,
  Container,
  DateInput,
  DatePicker,
  DateTimePicker,
  Divider,
  DoctuiProvider,
  Drawer,
  Flex,
  Grid,
  Group,
  InputWrapper,
  Kbd,
  Loader,
  Menu,
  Modal,
  MonthPicker,
  MultiSelect,
  Notifications,
  NumberInput,
  Overlay,
  Paper,
  PasswordInput,
  Popover,
  Radio,
  SegmentedControl,
  Select,
  Skeleton,
  Space,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  YearPicker,
};

const DocsLayout = defineComponent({
  name: "DocsLayout",
  setup() {
    const { isDark } = useData();

    return () =>
      h(
        DoctuiProvider,
        {
          class: "docs-doctui-provider",
          colorScheme: isDark.value ? "dark" : "light",
        },
        {
          default: () => h(DefaultTheme.Layout),
        },
      );
  },
});

export default {
  ...DefaultTheme,
  Layout: DocsLayout,
  enhanceApp(
    context: Parameters<NonNullable<typeof DefaultTheme.enhanceApp>>[0],
  ) {
    DefaultTheme.enhanceApp?.(context);
    for (const [name, component] of Object.entries(docsComponents)) {
      context.app.component(name, component);
    }
  },
};
