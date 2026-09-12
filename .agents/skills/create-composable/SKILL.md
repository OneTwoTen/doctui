---
name: create-composable
description: Create a reusable doctui Vue composable with a small stable API, SSR safety and focused tests.
---
# Create a doctui composable

## Workflow

1. Confirm the behavior is reusable across multiple components or is a public hook-worthy utility.
2. Search existing composables/internal helpers before adding a new abstraction.
3. Define inputs, reactive return values and lifecycle behavior before implementation.
4. Write focused tests for the intended observable behavior before implementation and run them to confirm the expected failure (red). If tests cannot run in the current environment, state that explicitly instead of claiming a red test.
5. Implement the minimum behavior required to make the tests pass (green).
6. Avoid hidden global state unless global coordination is the purpose.
7. Guard DOM access so SSR/import-time execution remains safe.
8. Keep watcher/effect cleanup explicit.
9. Prefer Vue primitives over introducing a utility dependency.
10. Add further red-first tests for lifecycle, reactivity, cleanup and edge cases as those behaviors are implemented.
11. Refactor only while the relevant suite stays green.
12. Document whether the composable is public API or internal-only, with copy-paste examples for meaningful public usage patterns.

## Test-first rule

Use red-green-refactor as the default order for new observable behavior and bug fixes:

- **Red:** describe the desired behavior in a test and verify the test fails for the expected missing behavior.
- **Green:** make the smallest implementation change that makes the test pass.
- **Refactor:** improve structure with the suite remaining green.

Do not implement behavior first and then add tests that simply mirror the finished code. For exploratory or genuinely non-testable work, document the exception and add regression coverage before completion.

## Quality bar

- Small API surface.
- Predictable reactivity.
- No leaked listeners/timers/observers.
- SSR-safe when the capability permits it.
- Typed without forcing consumers to cast common use cases.
- Public usage is documented with representative copy-paste examples.
- Observable behavior is covered through a red-green-refactor workflow where practical.
