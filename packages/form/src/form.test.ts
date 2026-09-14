import { describe, expect, it } from "vitest";
import { useForm } from "./index";

describe("@doctui/form", () => {
  it("tracks values, dirty state, touched fields and validation errors", async () => {
    const form = useForm({
      initialValues: { email: "", age: 0 },
      validate: {
        email: (value) => (value.includes("@") ? undefined : "Enter an email"),
        age: (value) => (value > 0 ? undefined : "Age is required"),
      },
    });
    expect(form.isDirty.value).toBe(false);
    form.setFieldValue("email", "invalid");
    form.setFieldTouched("email", true);
    expect(form.isDirty.value).toBe(true);
    expect(form.touched.email).toBe(true);
    expect(await form.validate()).toBe(false);
    expect(form.errors.email).toBe("Enter an email");
    form.setFieldValue("email", "ada@example.com");
    form.setFieldValue("age", 37);
    expect(await form.validate()).toBe(true);
    expect(form.errors).toEqual({});
  });

  it("guards submit with validation and resets to initial values", async () => {
    const form = useForm({ initialValues: { name: "Ada" } });
    const submitted: Array<{ name: string }> = [];
    expect(
      await form.submit(async (values) => {
        submitted.push(values);
      }),
    ).toBe(true);
    form.setFieldValue("name", "Grace");
    form.reset();
    expect(form.values.name).toBe("Ada");
    expect(submitted).toEqual([{ name: "Ada" }]);
  });
});
