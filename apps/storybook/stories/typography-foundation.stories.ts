import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Typography/Font foundation",
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const fontStack =
  '"Be Vietnam Pro", "Avenir Next", "Segoe UI Variable", "Segoe UI", ui-sans-serif, system-ui, sans-serif';

export const VietnameseReadability: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "lg", style: { maxWidth: "46rem" } }, () => [
        h(Title, { order: 2 }, () => "Giao diện rõ ràng cho tiếng Việt"),
        h(
          Text,
          null,
          () =>
            "Doctui ưu tiên Be Vietnam Pro để dấu tiếng Việt cân đối, chữ nhỏ dễ đọc và giao diện giữ được cảm giác hiện đại trên cả macOS lẫn Windows.",
        ),
        h(
          Text,
          { muted: true },
          () =>
            "Ă Â Ê Ô Ơ Ư · á à ả ã ạ · ấ ầ ẩ ẫ ậ · ế ề ể ễ ệ · ố ồ ổ ỗ ộ · ớ ờ ở ỡ ợ · ứ ừ ử ữ ự · Đ đ",
        ),
        h(
          Text,
          { size: "sm" },
          () =>
            "Sphinx of black quartz, judge my vow. 0123456789 — email@example.com",
        ),
      ]),
    ),
};

export const WeightScale: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "sm", style: { maxWidth: "42rem" } }, () =>
        [400, 500, 600, 700].map((weight) =>
          h(
            Text,
            { key: weight, weight, size: "lg" },
            () => `${weight} — Thiết kế sản phẩm nhanh, rõ ràng và nhất quán`,
          ),
        ),
      ),
    ),
};

export const TypeScale: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "42rem" } }, () => [
        h(Text, { size: "xs" }, () => "xs · Metadata, helper text, compact labels"),
        h(Text, { size: "sm" }, () => "sm · Secondary descriptions and dense controls"),
        h(Text, { size: "md" }, () => "md · Default interface and body copy"),
        h(Text, { size: "lg", weight: 600 }, () => "lg · Dialog headings and section emphasis"),
        h(Text, { size: "xl", weight: 700 }, () => "xl · Strong page-level emphasis"),
      ]),
    ),
};

export const InterfaceSample: Story = {
  render: () =>
    preview(() =>
      h(
        Paper,
        {
          radius: "lg",
          shadow: "sm",
          style: {
            maxWidth: "32rem",
            padding: "1.5rem",
          },
        },
        {
          default: () =>
            h(Stack, { gap: "md" }, () => [
              h(Group, { justify: "space-between" }, () => [
                h(Title, { order: 3 }, () => "Tạo lớp học mới"),
                h(Badge, { color: "primary", variant: "light" }, () => "Bản nháp"),
              ]),
              h(
                Text,
                { size: "sm", muted: true },
                () =>
                  "Mẫu này kiểm tra font trong tiêu đề, nội dung, input, badge và action cùng một bề mặt.",
              ),
              h(TextInput, {
                label: "Tên lớp",
                placeholder: "Ví dụ: Toán 12A1",
              }),
              h(Group, { justify: "flex-end" }, () => [
                h(Button, { variant: "default" }, () => "Hủy"),
                h(Button, null, () => "Tạo lớp"),
              ]),
              h(
                Text,
                {
                  size: "xs",
                  muted: true,
                  style: { fontFamily: fontStack },
                },
                () => "Showcase stack: Be Vietnam Pro → native platform fallbacks",
              ),
            ]),
        },
      ),
    ),
};
