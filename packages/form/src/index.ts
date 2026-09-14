import { computed, reactive, ref, toRaw } from "vue";

export type FormValidator<T, K extends keyof T> = (
  value: T[K],
  values: T,
) => string | undefined | null | Promise<string | undefined | null>;
export type FormValidators<T> = Partial<{
  [K in keyof T]: FormValidator<T, K>;
}>;

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validate?: FormValidators<T>;
}

export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
) {
  const initialValues = structuredClone(options.initialValues);
  const values = reactive(structuredClone(initialValues)) as unknown as T;
  const errors = reactive({}) as Partial<Record<keyof T, string>>;
  const touched = reactive({}) as Partial<Record<keyof T, boolean>>;
  const submitting = ref(false);
  const isDirty = computed(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
  );

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    values[field] = value;
  };
  const setFieldError = <K extends keyof T>(field: K, error?: string) => {
    if (error) errors[field] = error;
    else delete errors[field];
  };
  const setFieldTouched = <K extends keyof T>(field: K, value = true) => {
    touched[field] = value;
  };
  const validate = async () => {
    for (const key of Object.keys(options.validate ?? {}) as Array<keyof T>) {
      const validator = options.validate?.[key];
      if (!validator) continue;
      const error = await validator(values[key] as T[typeof key], values as T);
      setFieldError(key, error ?? undefined);
    }
    return Object.keys(errors).length === 0;
  };
  const reset = () => {
    for (const key of Object.keys(values) as Array<keyof T>) delete values[key];
    Object.assign(values, structuredClone(initialValues));
    for (const key of Object.keys(errors) as Array<keyof T>) delete errors[key];
    for (const key of Object.keys(touched) as Array<keyof T>)
      delete touched[key];
  };
  const submit = async (handler: (values: T) => void | Promise<void>) => {
    if (!(await validate())) return false;
    submitting.value = true;
    try {
      await handler(toRaw(values) as T);
      return true;
    } finally {
      submitting.value = false;
    }
  };
  return {
    values,
    errors,
    touched,
    submitting,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validate,
    reset,
    submit,
  };
}
