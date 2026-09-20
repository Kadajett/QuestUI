# AI integration guide

Use this document as the compact operating contract for coding agents working with QuestUI.

## What QuestUI is

QuestUI is not a wrapper package around opaque widgets. It is a source-copy library:

```text
shadcn-compatible registry item
  -> editable Quest TypeScript source
  -> Astryx interaction/semantics
  -> StyleX-compiled pixel presentation
```

The consumer owns copied Quest source. Astryx and StyleX remain dependencies.

## Canonical files

| Concern | Canonical source |
|---|---|
| Installable component names and Astryx mapping | `cli/catalog.ts` |
| Public repository exports | `components/quest/index.ts` |
| Theme, modes, pixel colors, fonts, stepped geometry | `components/quest/theme.ts` |
| Component implementation | `components/quest/<name>.tsx` |
| Registry generation | `scripts/build-registry.ts` |
| Generated registry | `public/r/` |
| CLI routing | `cli/quest.ts` |
| Guarded Vite setup | `cli/init.ts`, `cli/init-project.ts` |
| Interactive examples | `demo*.tsx` |
| Consumer proof | `scripts/verify-consumer.ts` |

Never edit generated registry JSON directly. Change source, then run `npm run registry`.

## Selecting a component

1. Read `docs/components.md` or run `npx quest-ui list`.
2. Install the narrowest composition that owns the required behavior.
3. Import the copied file directly, for example `@/components/quest/dialog`.
4. Use Astryx layout primitives for structure: `Stack`, `Grid`, `Layout`, or `AppShell`.
5. Use Quest `Card` only for a standalone framed widget; do not wrap every list row in a card.

Before inventing UI, discover Astryx rather than guessing:

```sh
npx astryx build "<screen or interaction>"
npx astryx component <Name>
npx astryx search "<capability>"
npx astryx docs layout
npx astryx docs tokens
```

## Styling invariants

- Keep interaction, focus management, keyboard behavior, and announcements in Astryx or native semantic elements.
- Use StyleX for component styling.
- Prefer Astryx component props before custom StyleX.
- Use theme tokens such as `var(--color-*)`, `var(--spacing-*)`, `var(--radius-*)`, and Quest local tokens such as `var(--q-primary)`.
- Put brand/accent colors in `questTheme`; do not override global color variables in a page.
- Keep both `overworld` (light) and `castle` (dark) modes functional.
- Preserve forced-colors and reduced-motion behavior where present.
- Dense data belongs in tables, lists, and items rather than repeated cards.

## Adding or changing a composition

A component is complete only when all applicable surfaces agree:

1. `components/quest/<name>.tsx` implements the source composition.
2. `cli/catalog.ts` contains the CLI name and Astryx foundation.
3. `components/quest/index.ts` exports the public values and types.
4. The workbench contains a real stateful example.
5. Behavior tests cover meaningful interaction boundaries.
6. `npm run registry` emits `public/r/quest-<name>.json`.
7. `docs/components.md` and the README catalog stay accurate.
8. The packaged consumer can install and build the copied source.

Do not add compatibility aliases for renamed component slugs. Migrate source, callers, generated registry items, docs, and examples together.

## Verification

Use the narrowest relevant check while iterating. Before release, run:

```sh
npm test
npm run test:e2e
npm run build
npm run engineering:check
node scripts/verify-consumer.ts
```

`verify-consumer.ts` expects the local registry server on port 5173. It packs the real CLI, initializes a fresh Vite app, installs all 64 components separately, and runs a production TypeScript/StyleX build.

## Known boundaries

- Automatic `quest-ui init` supports npm + Vite + React + TypeScript + ESM only.
- Other bundlers require manual StyleX compiler integration.
- There is no public registry URL in the repository; pass `--registry` or `QUEST_UI_REGISTRY`.
- Quest button link polymorphism is not implemented. Use Astryx `Link` for navigation.
- `packages/pixel-avatars` is a separate companion package, not a registry component.
