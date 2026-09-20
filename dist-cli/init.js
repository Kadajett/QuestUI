import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { planInit } from "./init-project.js";
import { fail, runUpstream } from "./upstream.js";
const help = `Usage: quest-ui init --framework vite --registry <base-url> [--cwd APP] [--dry-run] [--yes]

Initialize an existing npm Vite React TypeScript ESM app. For a new app, first run:
  npm create vite@latest my-app -- --template react-ts
  cd my-app && npm install
  quest-ui init --framework vite --registry http://localhost:5173/r

Requirements: Node.js >=22.13, npm, vite.config.ts with defineConfig({plugins:[react()]}),
@vitejs/plugin-react, src/main.tsx with one top-level createRoot().render(), tsconfig.json.
Existing user code, CSS, and other plugins are preserved. Function/spread configs,
conflicting aliases/dependencies/theme wiring, non-npm apps, and other frameworks
fail before installation or file writes. No --force/overwrite option is provided.

Setup adds the StyleX compiler before React, configures the @/src alias and shadcn
source-copy components.json, installs pinned Astryx/StyleX dependencies, copies the
Quest theme/fonts/licenses via upstream shadcn add, and wraps the existing root with
Astryx Theme. It does not run shadcn init: that installs unrelated Tailwind/base styles.
Use quest-ui add afterwards. Existing theme source is retained on repeated init.

--dry-run validates and prints local changes without writes, installs, or network.
--yes is accepted for scripting; setup has no local confirmation prompts.
--registry overrides QUEST_UI_REGISTRY. No public registry is assumed.
Other framework/bundler integrations require manual compiler and Theme setup.`;
function registry(value) {
    if (!value)
        throw new Error("Pass --registry <http(s)-base-url> or set QUEST_UI_REGISTRY.");
    const url = new URL(value);
    if (!/^https?:\/\//i.test(value) || !["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password || url.search || url.hash)
        throw new Error("Registry must be an absolute HTTP(S) base URL without credentials, query, or fragment.");
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
    return new URL("quest-theme.json", url).href;
}
function installFailure(child) {
    if (child.error)
        return child.error.message;
    if (child.signal)
        return child.signal;
    if (child.status !== 0)
        return String(child.status);
    return undefined;
}
function npmInvocation(args) {
    const npmCli = process.env["npm_execpath"];
    if (npmCli && /(?:^|[\\/])npm-cli\.js$/.test(npmCli)) {
        return { command: process.execPath, args: [npmCli, ...args] };
    }
    return { command: "npm", args };
}
function install(packages, development, cwd) {
    if (!packages.length)
        return;
    const args = ["install", "--save-exact", ...(development ? ["--save-dev"] : []), ...packages];
    const invocation = npmInvocation(args);
    const child = spawnSync(invocation.command, invocation.args, { cwd, stdio: "inherit", shell: false });
    const failure = installFailure(child);
    if (failure) {
        throw new Error(`npm install did not complete (${failure}). Configuration was not written; inspect package.json and the lockfile before retrying.`);
    }
}
function writePlanFile(plan, file) {
    const path = resolve(plan.cwd, file.path);
    const current = existsSync(path) ? readFileSync(path, "utf8") : undefined;
    if (current !== file.before)
        throw new Error(`${file.path} changed after preflight; refusing to overwrite it.`);
    writeFileSync(path, file.after, { flag: file.before === undefined ? "wx" : "w" });
}
function verifyThemeFiles(cwd) {
    for (const path of ["src/components/quest/theme.ts", "src/components/quest/fonts.css"]) {
        if (!existsSync(resolve(cwd, path))) {
            throw new Error(`Registry did not deliver ${path}. Check that --registry serves the Quest catalog including quest-theme.json.`);
        }
    }
}
function rollback(cwd, written) {
    for (const file of [...written].reverse()) {
        const path = resolve(cwd, file.path);
        if (!existsSync(path) || readFileSync(path, "utf8") !== file.after)
            continue;
        if (file.before === undefined)
            unlinkSync(path);
        else
            writeFileSync(path, file.before);
    }
}
function execute(plan, themeUrl) {
    install(plan.runtime, false, plan.cwd);
    install(plan.development, true, plan.cwd);
    const written = [];
    try {
        for (const file of plan.files) {
            writePlanFile(plan, file);
            written.push(file);
        }
        const delivered = plan.themeInstalled
            || runUpstream("shadcn@4.21.0", "shadcn", ["add", themeUrl, "--cwd", plan.cwd, "--yes"], plan.cwd);
        if (!delivered) {
            throw new Error("Theme source delivery failed. Dependencies or partial registry files may remain; local setup changes are being rolled back.");
        }
        verifyThemeFiles(plan.cwd);
    }
    catch (error) {
        rollback(plan.cwd, written);
        throw error;
    }
}
function printPlan(plan, themeUrl) {
    console.log(`QuestUI Vite setup: ${plan.cwd}`);
    for (const file of plan.files)
        console.log(`${file.before === undefined ? "Create" : "Update"} ${file.path}`);
    if (plan.runtime.length)
        console.log(`Install runtime: ${plan.runtime.join(" ")}`);
    if (plan.development.length)
        console.log(`Install development: ${plan.development.join(" ")}`);
    console.log(plan.themeInstalled ? "Preserve existing Quest theme and fonts." : `Copy Quest theme: ${themeUrl}`);
}
function runInit(args) {
    const { values } = parseArgs({ args, options: {
            framework: { type: "string" }, registry: { type: "string" }, cwd: { type: "string", short: "c", default: process.cwd() },
            "dry-run": { type: "boolean", default: false }, yes: { type: "boolean", short: "y", default: false },
        } });
    if (values.framework !== "vite") {
        throw new Error("Only --framework vite is supported automatically. Run quest-ui init --help for prerequisites; no files were changed.");
    }
    const themeUrl = registry(values.registry ?? process.env["QUEST_UI_REGISTRY"]);
    const plan = planInit(resolve(values.cwd));
    printPlan(plan, themeUrl);
    if (values["dry-run"]) {
        console.log("Dry run complete; no changes made. Registry availability has not been checked.");
        return;
    }
    execute(plan, themeUrl);
    console.log("QuestUI initialized: StyleX, Astryx styles, and Quest Theme are wired. Use quest-ui add to copy components.");
}
export function init(args) {
    if (args.includes("--help") || args.includes("-h")) {
        console.log(help);
        return;
    }
    try {
        runInit(args);
    }
    catch (error) {
        fail(error instanceof Error ? error.message : String(error));
    }
}
