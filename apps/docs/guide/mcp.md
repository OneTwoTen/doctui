# MCP server

`@doctui/mcp-server` is a local Bun/Node-compatible MCP server backed by the
same generated registry used for `llms.txt` and the public API reference.

```json
{
  "mcpServers": {
    "doctui": {
      "command": "bunx",
      "args": ["@doctui/mcp-server"]
    }
  }
}
```

The initial tool surface includes `search_components`, `get_component`,
`get_component_api`, `get_component_examples`, `search_docs`, and
`find_component_for_use_case`. It also exposes `doctui://components` and
`doctui://components/{name}` resources. The server does not require a doctui
hosted service.
