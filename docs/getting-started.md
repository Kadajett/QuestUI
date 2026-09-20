# Getting started

QuestUI is a source-copy React component library. The CLI copies editable TypeScript into an application; Astryx supplies interaction semantics and StyleX compiles the pixel-art presentation.

## Requirements

- Node.js 22.13 or newer
- npm
- React 19
- A Vite React TypeScript ESM application for automatic setup
- An HTTP(S) host serving this repository's generated `public/r` directory

## Prepare the registry

From this repository:

```sh
npm install
npm run registry
npm run dev
```

The local registry is now available at `http://127.0.0.1:5173/r`. `npm run registry` emits one registry item for each entry in `cli/catalog.ts` plus `quest-theme.json`.

## Install the CLI

Until the package is published, build or use the repository tarball:

```sh
npm run build
npm pack
npm install --save-dev /path/to/quest-ui-core-0.1.0.tgz
```

The installed binary is `quest-ui`; invoke it through `npx quest-ui` from the consumer application.

## Initialize a Vite application

```sh
npx quest-ui init \
  --framework vite \
  --registry http://127.0.0.1:5173/r \
  --cwd ./my-app \
  --yes
```

`init` performs a guarded, repeatable setup:

1. Adds the StyleX Vite plugin before the React plugin.
2. Adds the `@/*` source alias and `components.json` source-copy configuration.
3. Installs pinned Astryx and StyleX dependencies.
4. Copies the Quest theme, bundled fonts, and font licenses.
5. Imports Astryx reset/theme CSS once and wraps the existing React root in `Theme`.

Existing plugins and application code are preserved. Unsupported configuration shapes fail before local files are written. Run `npx quest-ui init --help` for the accepted project shape.

## Add components

```sh
npx quest-ui add button card dialog \
  --registry http://127.0.0.1:5173/r \
  --cwd ./my-app \
  --yes
```

List valid component names without network access:

```sh
npx quest-ui list
```

`add` validates names locally, resolves each one to `<registry>/quest-<name>.json`, then delegates source delivery to the pinned shadcn CLI. Standard shadcn add options such as `--overwrite`, `--diff`, `--view`, `--path`, and `--dry-run` pass through.

Use `QUEST_UI_REGISTRY` instead of repeating `--registry`:

```sh
QUEST_UI_REGISTRY=https://example.com/r npx quest-ui add input field
```

## Import copied source

Prefer direct imports so dependencies remain explicit:

```tsx
import {Button} from '@/components/quest/button'
import {Card, CardContent} from '@/components/quest/card'
```

The complete repository package also exports the catalog from `@quest-ui/core`, but registry consumers own the copied modules and normally import them directly.

## Deep customization

Quest compositions deliberately keep Astryx as a dependency. To edit the underlying Astryx implementation itself:

```sh
npx quest-ui swizzle Button --cwd ./my-app --output src/components/astryx
```

Swizzled source retains the upstream Astryx license and still requires StyleX compilation.

## Other frameworks

The automatic initializer supports Vite only. Other StyleX-capable bundlers can use the generated registry, but must configure StyleX extraction and add these entry imports manually:

```tsx
import '@astryxdesign/core/reset.css'
import '@astryxdesign/core/astryx.css'
import './components/quest/fonts.css'
```

Wrap the application with `Theme` from `@astryxdesign/core/theme` and `questTheme` from the copied `components/quest/theme` module.
