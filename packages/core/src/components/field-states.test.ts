import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import {
  Checkbox,
  NumberInput,
  PasswordInput,
  Radio,
  Switch,
  Textarea,
  TextInput,
} from "../index";

const textLikeFields = [
  ["TextInput", TextInput, "input"],
  ["Textarea", Textarea, "textarea"],
  ["NumberInput", NumberInput, "input"],
  ["PasswordInput", PasswordInput, "input"],
] as const;

describe.each(textLikeFields)("%s common field states", (_name, component, selector) => {
  it("keeps label, description, error, required, disabled and custom attrs on the native control", () => {
    const wrapper = mount(component, {
      props: {
        id: "field-id",
        label: "Field label",
        description: "Field description",
        error: "Field error",
        required: true,
        disabled: true,
      },
      attrs: {
        name: "field-name",
        "data-probe": "native-control",
        "aria-describedby": "external-help",
      },
    });

    const control = wrapper.get(selector);
    expect(wrapper.get("label").attributes("for")).toBe("field-id");
    expect(wrapper.get("#field-id-description").text()).toBe(
      "Field description",
    );
    expect(wrapper.get("#field-id-error").attributes("role")).toBe("alert");
    expect(control.attributes("required")).toBeDefined();
    expect(control.attributes("disabled")).toBeDefined();
    expect(control.attributes("aria-invalid")).toBe("true");
    expect(control.attributes("aria-describedby")).toBe(
      "field-id-description field-id-error external-help",
    );
    expect(control.attributes("name")).toBe("field-name");
    expect(control.attributes("data-probe")).toBe("native-control");
  });

  it("keeps read-only controls focusable", () => {
    const wrapper = mount(component, {
      props: {
        id: "readonly-field",
        label: "Read-only field",
        readonly: true,
      },
      attachTo: document.body,
    });

    const control = wrapper.get(selector);
    expect(control.attributes("readonly")).toBeDefined();
    (control.element as HTMLElement).focus();
    expect(document.activeElement).toBe(control.element);
    wrapper.unmount();
  });
});

const booleanFields = [
  ["Checkbox", Checkbox, {}],
  ["Radio", Radio, { value: "pro", modelValue: "free", name: "plan" }],
  ["Switch", Switch, {}],
] as const;

describe.each(booleanFields)("%s common field states", (_name, component, extraProps) => {
  it("keeps label, description, error, required, disabled and custom attrs connected", () => {
    const wrapper = mount(component, {
      props: {
        ...extraProps,
        id: "choice-id",
        label: "Choice label",
        description: "Choice description",
        error: "Choice error",
        required: true,
        disabled: true,
      },
      attrs: {
        "data-probe": "native-choice",
        "aria-describedby": "external-choice-help",
      },
      attachTo: document.body,
    });

    const root = wrapper.get(`[data-dui-component='${_name}']`);
    const control = wrapper.get("input");
    expect(root.element.tagName).toBe("LABEL");
    expect(root.attributes("for")).toBe("choice-id");
    expect(wrapper.get("#choice-id-description").text()).toBe(
      "Choice description",
    );
    expect(wrapper.get("#choice-id-error").attributes("role")).toBe("alert");
    expect(control.attributes("required")).toBeDefined();
    expect(control.attributes("disabled")).toBeDefined();
    expect(control.attributes("aria-invalid")).toBe("true");
    expect(control.attributes("aria-describedby")).toBe(
      "choice-id-description choice-id-error external-choice-help",
    );
    expect(control.attributes("data-probe")).toBe("native-choice");

    (control.element as HTMLElement).focus();
    expect(document.activeElement).not.toBe(control.element);
    wrapper.unmount();
  });
});
