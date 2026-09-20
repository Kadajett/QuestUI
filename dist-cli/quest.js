#!/usr/bin/env node
import { componentCatalog } from "./catalog.js";
import { init } from "./init.js";
import { swizzle } from "./swizzle.js";
import { fail, runUpstream } from "./upstream.js";
const shadcnVersion = "4.21.0";
const components = componentCatalog.map(component => component.name);
const help = `QuestUI — editable Astryx compositions and Quest theme source.

Usage:
  quest-ui list
  quest-ui init --framework vite --registry <base-url> [--cwd APP] [--dry-run]
  quest-ui add <component...> --registry <base-url> [shadcn add options]
  quest-ui swizzle <component> [--output DIR] [--cwd APP] [--overwrite]
  quest-ui --help

Commands:
  list     List QuestUI compositions offline.
  init     Wire StyleX, Astryx styles and Quest Theme in an npm Vite React TS app.
  add      Copy QuestUI compositions and theme through upstream shadcn add.
  swizzle  Eject corresponding Astryx source for deeper customization.

Registry:
  Set --registry <http(s)-base-url> or QUEST_UI_REGISTRY for init and add.
  --registry overrides the environment variable. No public registry is assumed.
  Each component resolves to <base-url>/quest-<component>.json.

Examples:
  quest-ui list
  quest-ui init --framework vite --registry http://localhost:5173/r --cwd ./my-app
  quest-ui add button card --registry http://localhost:5173/r --cwd ./my-app --yes
  QUEST_UI_REGISTRY=https://your-host.example/r quest-ui add input label

For add, pass shadcn options through unchanged, including --cwd, --yes, --overwrite,
--path, --dry-run, --diff, and --view. Put component names before options with
optional values (--diff and --view). init --help shows supported app shapes and
fresh Vite scaffolding instructions. Unsupported frameworks fail without writes.

Uses shadcn@${shadcnVersion} via npm exec. init and add may download packages;
list and this help do not access the network.`;
function runShadcn(command, args) {
    runUpstream(`shadcn@${shadcnVersion}`, "shadcn", [command, ...args]);
}
function requiredValue(args, index, option) {
    const value = args[index + 1];
    if (!value || value.startsWith("-")) {
        fail(`${option} requires a value. Use ${option}=<value> if it starts with '-'.`);
    }
    return value;
}
function registryBase(value) {
    if (!value) {
        fail("A registry URL is required. Pass --registry <base-url> or set QUEST_UI_REGISTRY. For local development, use --registry http://localhost:5173/r.");
    }
    let url;
    try {
        url = new URL(value);
    }
    catch {
        fail("The registry must be an absolute http:// or https:// base URL.");
    }
    if (!/^https?:\/\//i.test(value) || !["http:", "https:"].includes(url.protocol) || !url.hostname) {
        fail("The registry must be an absolute http:// or https:// base URL.");
    }
    if (url.username || url.password || url.search || url.hash) {
        fail("The registry base URL must not contain credentials, a query, or a fragment.");
    }
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
    return url;
}
function forwardOption(args, index, forwarded) {
    const arg = args[index];
    if (arg === undefined)
        return index;
    forwarded.push(arg);
    // Identify values only; upstream shadcn owns option validation and execution.
    if (["--cwd", "-c", "--path", "-p"].includes(arg)) {
        forwarded.push(requiredValue(args, index, arg));
        return index + 1;
    }
    const next = args[index + 1];
    if (["--diff", "--view"].includes(arg) && next && !next.startsWith("-")) {
        forwarded.push(next);
        return index + 1;
    }
    if (arg === "--cwd=" || arg === "--path=")
        fail(`${arg.slice(0, -1)} requires a non-empty value.`);
    return index;
}
function addName(names, name) {
    if (!components.includes(name))
        fail(`Unknown component '${name}'. Run 'quest-ui list' for available names.`);
    if (!names.includes(name))
        names.push(name);
}
function parseFlagArgs(flagArgs, names, forwarded) {
    let registry = process.env["QUEST_UI_REGISTRY"];
    let index = 0;
    while (index < flagArgs.length) {
        const arg = flagArgs[index];
        if (arg === undefined)
            break;
        if (/^--registry(?:=|$)/.test(arg)) {
            registry = arg.startsWith("--registry=") ? arg.slice("--registry=".length) : requiredValue(flagArgs, index, arg);
            if (arg === "--registry")
                index++;
        }
        else if (arg.startsWith("-")) {
            index = forwardOption(flagArgs, index, forwarded);
        }
        else {
            addName(names, arg);
        }
        index++;
    }
    return registry;
}
function parseAddArgs(args) {
    const separator = args.indexOf("--");
    const flagArgs = separator === -1 ? args : args.slice(0, separator);
    const names = [];
    const forwarded = [];
    const registry = parseFlagArgs(flagArgs, names, forwarded);
    if (separator !== -1) {
        for (const name of args.slice(separator + 1))
            addName(names, name);
    }
    if (!names.length)
        fail("add requires at least one component name. Run 'quest-ui list' for available names.");
    return { names, forwarded, registry };
}
function add(args) {
    const { names, forwarded, registry } = parseAddArgs(args);
    const base = registryBase(registry);
    runShadcn("add", [...names.map(name => new URL(`quest-${name}.json`, base).href), ...forwarded]);
}
const [command, ...args] = process.argv.slice(2);
switch (command) {
    case undefined:
    case "--help":
    case "-h":
    case "help":
        console.log(help);
        break;
    case "list":
        if (args.some(arg => arg !== "--help" && arg !== "-h"))
            fail("list takes no arguments.");
        console.log(args.length ? "Usage: quest-ui list\n\nList all available Quest component names offline." : components.join("\n"));
        break;
    case "init":
        init(args);
        break;
    case "add":
        if (args.includes("--help") || args.includes("-h"))
            console.log(help);
        else
            add(args);
        break;
    case "swizzle":
        swizzle(args);
        break;
    default:
        fail(`Unknown command '${command}'. Run 'quest-ui --help' for usage.`);
}
