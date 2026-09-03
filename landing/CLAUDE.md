@AGENTS.md

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Icons

`app/layout.tsx` sets `metadata.icons` by hand. While that field is present, Next stops emitting `<link>` tags for the `app/icon.*` and `app/apple-icon.*` file conventions (`resolve-metadata.js` merges file-based icons only `if (!resolvedMetadata.icons)`). The file is still built into a hashed route such as `/icon.png?<hash>`, but nothing in `<head>` references it. It fails silently: no error, no build warning, just a missing icon. The shipped Next docs say file-based metadata wins; for `icons` the implementation does the opposite.

Exception: `app/favicon.ico` is merged into `metadata.icons` unconditionally and keeps its `<link>`. It stays in `app/`.

Rules:
- Add icons to `metadata.icons` in `app/layout.tsx`, with the file itself in `public/`. Do not add `app/icon.png` or `app/apple-icon.png` — they will be served but referenced by nothing.
- Leave `app/favicon.ico` where it is; it is the one icon file convention that still works alongside `metadata.icons`.
- `app/manifest.ts` is unaffected: route conventions still work, only the icon `<link>` emission is suppressed.
- After touching any icon, check the rendered `<head>` for the `<link>` instead of trusting that the file exists.
