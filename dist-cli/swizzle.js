import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { astryxVersion, componentCatalog } from "./catalog.js";
import { astryxLicense } from "./license.js";
import { fail, runUpstream } from "./upstream.js";
const help = `Usage: quest-ui swizzle <name> [--output DIR] [--cwd APP] [--overwrite]

Eject the corresponding Astryx component source using @astryxdesign/cli@${astryxVersion}.
Use a QuestUI list name or its Astryx component name. --list lists upstream sources.
Default output: ./components/astryx (inside the target app).

The app must already have @astryxdesign/core@${astryxVersion} installed.
Ejected source retains Astryx imports and requires a StyleX compiler; this is not
self-contained dependency removal. Repoint your composition imports to the copied
component to use your edits. Existing files require --overwrite.
Original copyright headers and the Astryx MIT license are preserved.`;
function parse(args) {
    const { values, positionals } = parseArgs({
        args,
        allowPositionals: true,
        options: {
            output: { type: "string", default: "./components/astryx" },
            cwd: { type: "string", default: process.cwd() },
            overwrite: { type: "boolean", short: "f", default: false },
        },
    });
    if (positionals.length > 1)
        fail("swizzle accepts one component at a time.");
    return { name: positionals[0], output: values.output, cwd: resolve(values.cwd), overwrite: values.overwrite };
}
export function swizzle(args) {
    if (args.includes("--help") || args.includes("-h")) {
        console.log(help);
        return;
    }
    const options = parse(args.filter(arg => arg !== "--list"));
    const upstreamPackage = `@astryxdesign/cli@${astryxVersion}`;
    if (args.includes("--list")) {
        runUpstream(upstreamPackage, "astryx", ["swizzle", "--list"], options.cwd);
        return;
    }
    if (!options.name)
        fail("swizzle requires a component name. Run 'quest-ui swizzle --help'.");
    const item = componentCatalog.find(component => component.name === options.name || component.native === options.name);
    if (!item)
        fail(`Unknown QuestUI component '${options.name}'. Run 'quest-ui list'.`);
    const forwarded = ["swizzle", item.native, "--package", "@astryxdesign/core", "--output", options.output];
    if (options.overwrite)
        forwarded.push("--overwrite");
    console.log("Ejected source retains Astryx npm imports and requires StyleX compilation.");
    if (!runUpstream(`@astryxdesign/cli@${astryxVersion}`, "astryx", forwarded, options.cwd))
        return;
    writeFileSync(resolve(options.cwd, options.output, item.native, "LICENSE.astryx"), astryxLicense);
}
