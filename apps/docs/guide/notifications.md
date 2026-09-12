# Notifications

`@doctui/notifications` separates notification state from its renderer so an
application can keep one store per app shell or feature area.

```ts
import { Notifications, createNotifications } from '@doctui/notifications';

const notifications = createNotifications({ limit: 4, position: 'top-end' });
notifications.show({
  title: 'Saved',
  message: 'Your changes are ready.',
  color: 'success',
});
```

Render `<Notifications :store="notifications" />` near the application root.
Notifications use a polite live region, provide an explicit dismiss button,
and pause auto-close while the pointer is over an item. Use `update`, `hide`,
`clean`, `pause`, and `resume` for imperative lifecycle control.
