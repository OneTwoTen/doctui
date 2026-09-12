import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { h } from "vue";
import {
  Checkbox,
  InputWrapper,
  NumberInput,
  PasswordInput,
  Radio,
  Switch,
  Textarea,
  TextInput,
} from "../index";

describe("shared field relationships", () => {
  it("composes description and error relationships without dropping either message", () => {
    const wrapper = mount(InputWrapper, {
      props: {
        id: "profile-name",
        label: "Name",
        description: "Use your public name.",
        error: "Name is required.",
        required: true,
      },
      slots: {
        default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
          h("input", { id, "aria-describedby": describedBy }),
      },
    });

    expect(wrapper.get("label").attributes("for")).toBe("profile-name");
    expect(wrapper.get("input").attributes("aria-describedby")).toBe(
      "profile-name-description profile-name-error",
    );
    expect(wrapper.get("#profile-name-description").text()).toBe(
      "Use your public name.",
    );
    expect(wrapper.get("#profile-name-error").attributes("role")).toBe("alert");
    expect(wrapper.get("#profile-name-error").text()).toBe("Name is required.");
  });
});

describe("text-like field contract", () => {
  it("keeps TextInput root attributes separate from native control attributes", async () => {
    const onInput = vi.fn();
    const wrapper = mount(TextInput, {
      props: {
        id: "email",
        modelValue: "before",
        label: "Email",
        description: "Account email",
        error: "Invalid email",
        required: true,
      },
      attrs: {
        class: "consumer-root",
        style: "width: 18rem",
        name: "email",
        autocomplete: "email",
        "aria-describedby": "external-help",
        onInput,
      },
    });

    const root = wrapper.get("[data-dui-component='TextInput']");
    const input = wrapper.get("input");

    expect(root.classes()).toContain("consumer-root");
    expect(root.attributes("style")).toContain("width: 18rem");
    expect(input.classes()).not.toContain("consumer-root");
    expect(input.attributes("name")).toBe("email");
    expect(input.attributes("autocomplete")).toBe("email");
    expect(input.attributes("aria-describedby")).toBe(
      "email-description email-error external-help",
    );
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("required")).toBeDefined();

    await input.setValue("after");
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["after"]);
  });

  it("forwards Textarea attributes to its native root/control and keeps readonly focusable", () => {
    const wrapper = mount(Textarea, {
      props: {
        id: "notes",
        label: "Notes",
        description: "Optional details",
        readonly: true,
        size: "lg",
      },
      attrs: {
        class: "consumer-root",
        style: "min-height: 9rem",
        name: "notes",
        "data-probe": "textarea",
      },
      attachTo: document.body,
    });

    const textarea = wrapper.get("textarea");
    expect(textarea.classes()).toContain("consumer-root");
    expect(textarea.attributes("style")).toContain("min-height: 9rem");
    expect(textarea.attributes("name")).toBe("notes");
    expect(textarea.attributes("data-probe")).toBe("textarea");
    expect(textarea.attributes("readonly")).toBeDefined();
    expect(textarea.attributes("data-size")).toBe("lg");

    textarea.element.focus();
    expect(document.activeElement).toBe(textarea.element);
    wrapper.unmount();
  });

  it("forwards NumberInput attributes to its native root/control", () => {
    const wrapper = mount(NumberInput, {
      props: {
        id: "seats",
        label: "Seats",
        modelValue: 3,
        min: 1,
        max: 10,
        size: "sm",
      },
      attrs: {
        class: "consumer-root",
        style: "max-width: 8rem",
        name: "seats",
        inputmode: "numeric",
      },
    });

    const input = wrapper.get("input");
    expect(input.classes()).toContain("consumer-root");
    expect(input.attributes("style")).toContain("max-width: 8rem");
    expect(input.attributes("name")).toBe("seats");
    expect(input.attributes("inputmode")).toBe("numeric");
    expect(input.attributes("data-size")).toBe("sm");
  });

  it("keeps PasswordInput on the same root/control forwarding contract", () => {
    const wrapper = mount(PasswordInput, {
      props: {
        id: "password",
        label: "Password",
        readonly: true,
      },
      attrs: {
        class: "consumer-root",
        style: "width: 20rem",
        name: "password",
        autocomplete: "current-password",
      },
    });

    const root = wrapper.get("[data-dui-component='TextInput']");
    const input = wrapper.get("input");
    expect(root.classes()).toContain("consumer-root");
    expect(root.attributes("style")).toContain("width: 20rem");
    expect(input.attributes("name")).toBe("password");
    expect(input.attributes("autocomplete")).toBe("current-password");
    expect(input.attributes("readonly")).toBeDefined();
  });
});

describe("native boolean control contract", () => {
  it("keeps Checkbox root styling separate from native attributes and exposes size", () => {
    const wrapper = mount(Checkbox, {
      props: {
        id: "terms",
        modelValue: true,
        label: "Accept terms",
        description: "Required to continue",
        error: "Please confirm",
        required: true,
        size: "lg",
      },
      attrs: {
        class: "consumer-root",
        style: "margin-top: 1rem",
        name: "terms",
        "aria-describedby": "external-terms-help",
        "data-probe": "checkbox",
      },
    });

    const root = wrapper.get("[data-dui-component='Checkbox']");
    const input = wrapper.get("input");
    expect(root.element.tagName).toBe("LABEL");
    expect(root.attributes("for")).toBe("terms");
    expect(root.classes()).toContain("consumer-root");
    expect(root.attributes("style")).toContain("margin-top: 1rem");
    expect(root.attributes("data-size")).toBe("lg");
    expect(root.attributes("style")).toContain(
      "font-size: var(--dui-font-size-lg)",
    );
    expect(input.attributes("name")).toBe("terms");
    expect(input.attributes("data-probe")).toBe("checkbox");
    expect(input.attributes("aria-describedby")).toBe(
      "terms-description terms-error external-terms-help",
    );
    expect(input.attributes("required")).toBeDefined();
  });

  it("keeps Radio grouping/native attributes on the input and exposes size", () => {
    const wrapper = mount(Radio, {
      props: {
        id: "plan-pro",
        modelValue: "free",
        value: "pro",
        name: "plan",
        label: "Pro",
        size: "sm",
      },
      attrs: {
        class: "consumer-root",
        style: "padding: 2px",
        "data-probe": "radio",
      },
    });

    const root = wrapper.get("[data-dui-component='Radio']");
    const input = wrapper.get("input");
    expect(root.attributes("for")).toBe("plan-pro");
    expect(root.classes()).toContain("consumer-root");
    expect(root.attributes("style")).toContain("padding: 2px");
    expect(root.attributes("data-size")).toBe("sm");
    expect(input.attributes("name")).toBe("plan");
    expect(input.attributes("data-probe")).toBe("radio");
    expect(input.classes()).not.toContain("consumer-root");
  });

  it("keeps Switch semantics and size observable while disabled", () => {
    const wrapper = mount(Switch, {
      props: {
        id: "notifications",
        modelValue: true,
        label: "Notifications",
        disabled: true,
        size: "xl",
      },
      attrs: {
        class: "consumer-root",
        name: "notifications",
      },
      attachTo: document.body,
    });

    const root = wrapper.get("[data-dui-component='Switch']");
    const input = wrapper.get("input");
    expect(root.classes()).toContain("consumer-root");
    expect(root.attributes("data-size")).toBe("xl");
    expect(root.attributes("data-disabled")).toBe("true");
    expect(input.attributes("role")).toBe("switch");
    expect(input.attributes("aria-checked")).toBe("true");
    expect(input.attributes("name")).toBe("notifications");
    expect(input.attributes("disabled")).toBeDefined();

    input.element.focus();
    expect(document.activeElement).not.toBe(input.element);
    wrapper.unmount();
  });
});
