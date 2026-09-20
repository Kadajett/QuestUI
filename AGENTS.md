<!-- engineering:policy:start -->
## Working on this project

This project uses @kadajett/engineering with the generic profile.

- Start with .engineering/config.json: it lists the source files, TypeScript projects, code limits, and import boundaries we check.
- Run the package manager's engineering:check script as well as the framework's own lint, format, build, and tests. They catch different problems.
- Keep the framework's app structure and source intact during setup. The checker belongs in its package, not copied into the app.
- If we're keeping known quality issues, record them once with engineering baseline --accept --reason "why we're keeping them". Don't reset the baseline to make new failures pass. Run engineering prune after fixing old issues to remove their allowances.
- Keep the project's existing package manager, formatter, linter, and TypeScript module/runtime settings.
- Tests follow the same complexity, nesting, and parameter limits as app code, but have no function-length limit and may be up to 1000 lines per file. Generated, vendor, and build files are excluded through configuration.
- When adding or changing tests, run test:mutation if available and inspect stryker.config.json for scope and the score threshold. Surviving mutants point to missing behavioral assertions; add meaningful tests rather than weakening the threshold. Mutation runs are separate from setup and the fast quality gate.
- Use Graphify to help navigate, then check the source itself. Keep secrets and .env files out of extraction, and ask before using semantic model calls.
- Setup isn't permission to add remotes, deploy, or create cloud resources.
- For Cloudflare projects, use the actual Wrangler configuration, generated types, and resource IDs. Bindings belong to this project, not to an example from another app.
- Prefer functions, immutable data, early returns, and explicit dependencies. Validate data at trust boundaries. Review coverage and duplication yourself; these checks don't measure them.

Commit the package in .engineering/vendor with the lockfile so everyone can run the same checks without access to the author's machine. The setup details are in .engineering/state.json.
<!-- engineering:policy:end -->

<!-- engineering:skills:start -->
## Project skills

These skills were picked for this project: `codebase-design`, `diagnosing-bugs`, `tdd`, `vercel-react-best-practices`.

- Before coding or reviewing, look in .agents/skills and read the relevant SKILL.md files. Use the shared engineering advice and matching library guidance without waiting for the user to ask.
- After cloning the project or changing dependencies, run engineering skills . (or the engineering:skills package script). It restores local links and picks guidance for newly added libraries.
- .engineering/skills.json records the upstream sources and fallback versions. Skills reused from your own installation stay yours; setup doesn't upgrade them.
- Follow the user's instructions and this project's architecture, checks, security rules, and agreed workflow when a skill suggests something different. A skill mentioning a script, plugin, MCP server, cloud resource, or deployment isn't permission to run or install it.
- Some libraries won't have a matching skill. Use their official docs rather than assuming they're covered.
<!-- engineering:skills:end -->

<!-- ASTRYX:START -->
Astryx v0.6.2 · 164 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:
1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:
- No <div> — components do all layout/spacing, page frame included.
- Frame first: read `astryx docs layout` before writing any page or screen — page frame, region widths, breakpoint behavior.
- Dense data = rows (Table, List/Item), never Card-wrapped list items; Card is for standalone widgets. Status = StatusDot/Token; Badge = counts only.
- Custom styling: component props first; else style/className with tokens — var(--color-*|--spacing-*|--radius-*). No raw hex/px. (No StyleX/Tailwind compiler here — don't use xstyle/utility classes.)
- Tokens for every value (`astryx docs tokens`). Brand/accent belongs in the theme (`astryx theme list` / `theme add <slug>`, or `astryx theme template` for a custom one) — never override --color-* in :root.
- SELF-CHECK before you finish: re-read the file and replace any raw <div>/<span> layout, imported .css/@apply, or hardcoded value (#hex, 16px) with the component or a token (var(--color-*|--spacing-*|…)). If unsure a component/prop exists, run `astryx component <Name>` / `astryx search "<thing>"`; don't hand-roll CSS.

MORE CLI:
  search "<query>"   find any component / hook / doc / template / block
  component --list   164 components by category
  template --list    page + block recipes
  docs <topic>       browser-support, cli-integrations, color, elevation, getting-started, icons, illustrations, internationalization, layout, migration, motion, principles, shape, spacing, styling-libraries, styling, theme, tokens, typography, working-with-ai
  swizzle <Name>     eject component source for deep customization
  upgrade --apply    run after any Astryx or integration dependency bump
<!-- ASTRYX:END -->
