import type { InputWrapperProps } from "./InputWrapper";

interface FieldRelationshipProps {
  readonly id?: string | undefined;
  readonly label?: string | undefined;
  readonly description?: string | undefined;
  readonly error?: string | undefined;
  readonly required?: boolean | undefined;
}

interface FieldStateProps extends FieldRelationshipProps {
  readonly size?: string | undefined;
  readonly disabled?: boolean | undefined;
  readonly readonly?: boolean | undefined;
}

export function getInputWrapperProps(
  props: FieldRelationshipProps,
  includeLabel = true,
): InputWrapperProps {
  return {
    ...(props.id === undefined ? {} : { id: props.id }),
    ...(includeLabel && props.label !== undefined
      ? { label: props.label }
      : {}),
    ...(props.description === undefined
      ? {}
      : { description: props.description }),
    ...(props.error === undefined ? {} : { error: props.error }),
    required: props.required ?? false,
  };
}

export function getFieldRootStateAttrs(
  props: FieldStateProps,
  component: string,
) {
  return {
    "data-dui-field": component,
    "data-size": props.size,
    "data-disabled": props.disabled ? "true" : undefined,
    "data-readonly": props.readonly ? "true" : undefined,
    "data-error": props.error ? "true" : undefined,
    "data-required": props.required ? "true" : undefined,
  };
}

export function splitFieldAttrs(attrs: Record<string, unknown>) {
  const { class: rootClass, style: rootStyle, ...controlAttrs } = attrs;

  return {
    rootAttrs: {
      ...(rootClass === undefined ? {} : { class: rootClass }),
      ...(rootStyle === undefined ? {} : { style: rootStyle }),
    },
    controlAttrs,
  };
}

export function composeDescribedBy(...values: readonly unknown[]) {
  const ids = values.flatMap((value) =>
    typeof value === "string" ? value.trim().split(/\s+/).filter(Boolean) : [],
  );
  const uniqueIds = [...new Set(ids)];
  return uniqueIds.length > 0 ? uniqueIds.join(" ") : undefined;
}
