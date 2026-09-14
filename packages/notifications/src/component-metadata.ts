export const DOCTUI_NOTIFICATIONS_METADATA = [
  {
    name: "Notifications",
    package: "@doctui/notifications",
    category: "feedback",
    description:
      "Accessible notification renderer with explicit shared-store lifecycle ownership.",
    props: ["store", "position", "cleanOnUnmount"],
    accessibility: [
      "Each notification uses its own polite, atomic status live region so simultaneous messages and updates are announced independently.",
      "Dismiss controls are native buttons outside the live region, and renderer cleanup is opt-in with cleanOnUnmount for stores owned by that renderer.",
    ],
  },
] as const;
