---
name: create-composable
description: Create a reusable doctui Vue composable with a small stable API, SSR safety and focused tests.
---
# Create a doctui composable

## Workflow

1. Confirm the behavior is reusable across multiple components or is a public hook-worthy utility.
2. Search existing composables/internal helpers before adding a new abstraction.
3. Define inputs, reactive return values and lifecycle behavior before implementation.
4. Avoid hidden global state unless global coordination is the purpose.
5. Guard DOM access so SSR/import-time execution remains safe.
6. Keep watcher/effect cleanup explicit.
7. Prefer Vue primitives over introducing a utility dependency.
8. Add tests for lifecycle, reactivity, cleanup and edge cases.
9. Document whether the composable is public API or internal-only.

## Quality bar

- Small API surface.
- Predictable reactivity.
- No leaked listeners/timers/observers.
- SSR-safe when the capability permits it.
- Typed without forcing consumers to cast common use cases.
