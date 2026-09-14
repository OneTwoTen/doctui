import { h, type VNode } from "vue";

function icon(name: string, paths: VNode[]) {
  return h(
    "svg",
    {
      "aria-hidden": "true",
      "data-dui-icon": name,
      fill: "none",
      height: "1em",
      viewBox: "0 0 24 24",
      width: "1em",
    },
    paths,
  );
}

export function calendarIcon() {
  return icon("calendar", [
    h("path", {
      d: "M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "1.8",
    }),
  ]);
}

export function chevronLeftIcon() {
  return icon("chevron-left", [
    h("path", {
      d: "m15 18-6-6 6-6",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
    }),
  ]);
}

export function chevronRightIcon() {
  return icon("chevron-right", [
    h("path", {
      d: "m9 18 6-6-6-6",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
    }),
  ]);
}

export function xIcon() {
  return icon("x", [
    h("path", {
      d: "m7 7 10 10M17 7 7 17",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-width": "2",
    }),
  ]);
}
