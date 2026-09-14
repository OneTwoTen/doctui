# Hooks

`@doctui/hooks` contains small Vue composables that are useful across applications without imposing a component framework.

```ts
import { useDisclosure, useDebouncedValue, useLocalStorage } from '@doctui/hooks';

const dialog = useDisclosure();
const query = useDebouncedValue(search, 250);
const preferences = useLocalStorage('preferences', { density: 'comfortable' });
```

Available composables include `useDisclosure`, `useMediaQuery`, `useClipboard`, `useDebouncedValue`, `useDebouncedCallback`, `useDocumentTitle`, `useElementSize`, `useHotkeys`, and `useLocalStorage`.

Browser-dependent composables guard DOM APIs and can be imported safely by SSR applications. Listener, timer, observer, and title cleanup is handled by Vue lifecycle hooks.
