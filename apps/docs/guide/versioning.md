# Versioning

doctui packages follow semantic versioning and are currently in the `0.x`
prerelease stage. Public API additions are minor releases; fixes that preserve
the contract are patch releases; breaking changes require a major release once
the project reaches `1.0`.

Each publishable package is versioned independently through Changesets. A
changeset should describe the user-visible API or behavior impact and name the
affected package(s).

Generated metadata, `llms.txt`, documentation and MCP responses are rebuilt as
part of the release workflow so they stay aligned with the package version.
Consumers should import from package entry points such as `@doctui/core` and
avoid undocumented deep imports.
