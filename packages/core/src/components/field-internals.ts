import type { InputWrapperProps } from "./InputWrapper";

interface FieldRelationshipProps {
  readonly id?: string;
  readonly label?: string;
  readonly description?: string;
  readonly error?: string;
  readonly required?: boolean;
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
