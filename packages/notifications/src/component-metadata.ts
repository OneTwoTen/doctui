export const DOCTUI_NOTIFICATIONS_METADATA = [
  {
    name: "Notifications",
    package: "@doctui/notifications",
    category: "feedback",
    description: "Accessible renderer for notifications managed by a store.",
    props: ["store", "position"],
    accessibility: [
      "Uses a polite live region, status items, and explicit dismiss buttons.",
    ],
  },
] as const;
