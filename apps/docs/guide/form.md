# Form

`@doctui/form` provides Vue-first form state without imposing a component
framework or a React-shaped registration API.

```ts
import { useForm } from '@doctui/form';

const form = useForm({
  initialValues: { email: '' },
  validate: {
    email: (value) => value.includes('@') ? undefined : 'Enter an email',
  },
});

form.setFieldValue('email', 'ada@example.com');
await form.submit(async (values) => save(values));
```

The returned state includes reactive `values`, `errors`, `touched`,
`submitting`, and `isDirty` values. Use `setFieldTouched` from the input's
blur event and pass field errors to doctui inputs.

`validate` supports synchronous and asynchronous field validators. `reset`
restores the initial values and clears errors/touched state.
