import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { astryxVersion } from "./catalog.js";
import { setupEntry } from "./init-entry.js";
import { setupVite } from "./init-vite.js";
import { addProperty, apply, objectValue, property } from "./init-syntax.js";
export const stylexVersion = "0.19.1";
function connectParents(node) {
    ts.forEachChild(node, child => {
        const modifiable = child;
        modifiable.parent = node;
        connectParents(child);
    });
}
function jsonFile(cwd, path) {
    const text = readFileSync(resolve(cwd, path), "utf8");
    const parsed = ts.parseConfigFileTextToJson(path, text);
    if (parsed.error || !parsed.config || typeof parsed.config !== "object" || Array.isArray(parsed.config))
        throw new Error(`${path} must be a valid JSON object.`);
    return { text, value: parsed.config };
}
function baseUrlChange(options, path) {
    const base = property(options, "baseUrl");
    if (!base)
        return addProperty(options, '"baseUrl": "."');
    if (ts.isStringLiteral(base.initializer) && [".", "./"].includes(base.initializer.text))
        return undefined;
    throw new Error(`${path}: baseUrl must be the app root for '@/components'.`);
}
function sourceAliasTarget(propertyNode) {
    if (!ts.isArrayLiteralExpression(propertyNode.initializer) || propertyNode.initializer.elements.length !== 1)
        return false;
    const element = propertyNode.initializer.elements[0];
    return !!element && ts.isStringLiteral(element) && ["src/*", "./src/*"].includes(element.text);
}
function pathsChange(options, path) {
    const paths = property(options, "paths");
    if (!paths)
        return addProperty(options, '"paths": { "@/*": ["./src/*"] }');
    const aliases = objectValue(paths.initializer, `${path} paths`);
    const source = property(aliases, "@/*");
    if (!source)
        return addProperty(aliases, '"@/*": ["./src/*"]');
    if (sourceAliasTarget(source))
        return undefined;
    throw new Error(`${path}: '@/*' already points somewhere other than src.`);
}
function typescriptConfig(text, path) {
    const file = ts.parseJsonText(path, text);
    connectParents(file);
    const statement = file.statements[0];
    if (!statement || !ts.isExpressionStatement(statement))
        throw new Error(`${path}: unsupported JSON shape.`);
    const config = objectValue(statement.expression, path);
    if (property(config, "extends")) {
        throw new Error(`${path}: inherited TypeScript configs need manual alias integration before init.`);
    }
    const compilerOptions = property(config, "compilerOptions");
    if (!compilerOptions) {
        return apply(text, [addProperty(config, '"compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } }')]);
    }
    const options = objectValue(compilerOptions.initializer, `${path} compilerOptions`);
    const changes = [baseUrlChange(options, path), pathsChange(options, path)]
        .filter((change) => change !== undefined);
    return apply(text, changes);
}
function dependencyPlan(manifest) {
    const dependencies = { ...manifest["devDependencies"], ...manifest["dependencies"] };
    for (const name of ["react", "react-dom", "vite", "typescript", "@vitejs/plugin-react"]) {
        if (typeof dependencies[name] !== "string")
            throw new Error(`Missing ${name}. Create or prepare a Vite React TypeScript app first.`);
    }
    const runtime = [];
    const development = [];
    for (const [name, version, target] of [
        ["@astryxdesign/core", astryxVersion, runtime], ["@astryxdesign/theme-neutral", astryxVersion, runtime],
        ["@stylexjs/stylex", stylexVersion, runtime], ["@stylexjs/unplugin", stylexVersion, development],
    ]) {
        const installed = dependencies[name];
        if (!installed)
            target.push(`${name}@${version}`);
        else if (![version, `^${version}`, `~${version}`].includes(installed))
            throw new Error(`${name}@${installed} conflicts with the Quest catalog version ${version}; reconcile it explicitly before init.`);
    }
    return { runtime, development };
}
function compatibleComponentsConfig(value) {
    if (value["tsx"] !== true || value["rsc"] !== false || typeof value["style"] !== "string")
        return false;
    const tailwind = value["tailwind"];
    if (typeof tailwind?.["css"] !== "string")
        return false;
    const aliases = value["aliases"];
    return aliases?.["components"] === "@/components" && aliases["lib"] === "@/lib";
}
function sourceDelivery(cwd) {
    const path = "components.json";
    if (existsSync(resolve(cwd, path))) {
        const { value } = jsonFile(cwd, path);
        if (!compatibleComponentsConfig(value)) {
            throw new Error("Existing components.json must have valid style/tailwind config, tsx:true, rsc:false, components:'@/components' and lib:'@/lib'. It was not overwritten.");
        }
        return undefined;
    }
    return { path, before: undefined, after: `${JSON.stringify({
            $schema: "https://ui.shadcn.com/schema.json", style: "new-york", rsc: false, tsx: true,
            tailwind: { config: "", css: "src/index.css", baseColor: "neutral", cssVariables: true, prefix: "" },
            aliases: { components: "@/components", ui: "@/components/ui", utils: "@/lib/utils", lib: "@/lib", hooks: "@/hooks" },
        }, null, 2)}\n` };
}
function safeProjectPaths(cwd) {
    for (const path of ["package.json", "package-lock.json", "vite.config.ts", "tsconfig.json", "tsconfig.app.json", "components.json", "src", "src/main.tsx", "src/index.css", "src/components", "src/components/quest"]) {
        if (existsSync(resolve(cwd, path)) && lstatSync(resolve(cwd, path)).isSymbolicLink())
            throw new Error(`${path} is a symlink. Init does not modify linked project files; integrate manually.`);
    }
    const directory = resolve(cwd, "src/components/quest");
    if (existsSync(directory) && readdirSync(directory).length && !existsSync(resolve(directory, "theme.ts")))
        throw new Error("Existing Quest source without theme.ts may conflict with registry delivery. Restore the theme or initialize a clean app; nothing was overwritten.");
}
function validateHtmlEntry(cwd) {
    const html = readFileSync(resolve(cwd, "index.html"), "utf8");
    const scripts = [...html.matchAll(/<script\b[^>]*>/gi)]
        .map(match => match[0])
        .filter(tag => /\btype\s*=\s*["']module["']/i.test(tag));
    const script = scripts[0];
    if (scripts.length === 1 && script && /\bsrc\s*=\s*["'](?:\/|\.\/)?src\/main\.tsx["']/i.test(script))
        return;
    throw new Error("index.html must load src/main.tsx as its sole module entry; custom entries require manual setup.");
}
function validateManifest(cwd) {
    const { value } = jsonFile(cwd, "package.json");
    const manager = value["packageManager"];
    const foreignLock = ["pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"]
        .some(path => existsSync(resolve(cwd, path)));
    if ((typeof manager === "string" && !manager.startsWith("npm@")) || foreignLock) {
        throw new Error("init currently supports npm projects only. No package manager or lockfile was changed.");
    }
    if (value["type"] !== "module")
        throw new Error("init requires a Vite ESM project (package.json type:'module').");
    return value;
}
function transformedFiles(cwd) {
    return [["vite.config.ts", setupVite], ["src/main.tsx", setupEntry]].flatMap(([path, transform]) => {
        const before = readFileSync(resolve(cwd, path), "utf8");
        const after = transform(before);
        return before === after ? [] : [{ path, before, after }];
    });
}
function typescriptFiles(cwd) {
    if (!existsSync(resolve(cwd, "tsconfig.json")))
        throw new Error("tsconfig.json is required.");
    return ["tsconfig.json", "tsconfig.app.json"].flatMap(path => {
        if (!existsSync(resolve(cwd, path)))
            return [];
        const { text } = jsonFile(cwd, path);
        const after = typescriptConfig(text, path);
        return text === after ? [] : [{ path, before: text, after }];
    });
}
function themeState(cwd) {
    const theme = existsSync(resolve(cwd, "src/components/quest/theme.ts"));
    const fonts = existsSync(resolve(cwd, "src/components/quest/fonts.css"));
    if (theme !== fonts) {
        throw new Error("Partial Quest theme installation found. Restore both theme.ts and fonts.css before retrying.");
    }
    return theme && fonts;
}
export function planInit(cwd) {
    safeProjectPaths(cwd);
    validateHtmlEntry(cwd);
    const manifest = validateManifest(cwd);
    const files = [...transformedFiles(cwd), ...typescriptFiles(cwd)];
    const delivery = sourceDelivery(cwd);
    if (delivery)
        files.push(delivery);
    if (!existsSync(resolve(cwd, "src/index.css"))) {
        files.push({ path: "src/index.css", before: undefined, after: "" });
    }
    return { cwd, files, ...dependencyPlan(manifest), themeInstalled: themeState(cwd) };
}
