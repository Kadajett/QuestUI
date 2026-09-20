import ts from "typescript";
import { apply, imports, namedImport, source, unusedName } from "./init-syntax.js";
function isCreateRootCall(node, createRoot) {
    return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === createRoot;
}
function rootNames(file, createRoot) {
    const roots = new Set();
    for (const statement of file.statements) {
        if (!ts.isVariableStatement(statement))
            continue;
        for (const declaration of statement.declarationList.declarations) {
            if (!ts.isIdentifier(declaration.name) || !declaration.initializer)
                continue;
            if (isCreateRootCall(declaration.initializer, createRoot))
                roots.add(declaration.name.text);
        }
    }
    return roots;
}
function renderCall(statement, roots, createRoot) {
    if (!ts.isExpressionStatement(statement) || !ts.isCallExpression(statement.expression))
        return undefined;
    const call = statement.expression;
    if (!ts.isPropertyAccessExpression(call.expression) || call.expression.name.text !== "render")
        return undefined;
    const receiver = call.expression.expression;
    if (isCreateRootCall(receiver, createRoot))
        return call;
    return ts.isIdentifier(receiver) && roots.has(receiver.text) ? call : undefined;
}
function renderArgument(file) {
    const createRoot = namedImport(file, "react-dom/client", "createRoot");
    if (!createRoot)
        throw new Error("src/main.tsx must import createRoot from react-dom/client.");
    const roots = rootNames(file, createRoot);
    const renders = file.statements.flatMap(statement => {
        const call = renderCall(statement, roots, createRoot);
        return call ? [call] : [];
    });
    const render = renders[0];
    const argument = render?.arguments[0];
    if (renders.length !== 1 || !render || render.arguments.length !== 1 || !argument) {
        throw new Error("src/main.tsx must have one top-level createRoot(...).render(...) or root.render(...) call.");
    }
    return argument;
}
function isThemeWrapper(argument, provider, theme) {
    if (!theme || !ts.isJsxElement(argument) || argument.openingElement.tagName.getText() !== provider)
        return false;
    return argument.openingElement.attributes.properties.some(attribute => ts.isJsxAttribute(attribute)
        && attribute.name.getText() === "theme"
        && !!attribute.initializer
        && ts.isJsxExpression(attribute.initializer)
        && attribute.initializer.expression?.getText() === theme);
}
function missingStyleImports(file) {
    const additions = [];
    for (const path of ["@astryxdesign/core/reset.css", "@astryxdesign/core/astryx.css", "@/components/quest/fonts.css"]) {
        if (!imports(file, path).length)
            additions.push(`import ${JSON.stringify(path)}`);
    }
    return additions;
}
function themeSetup(file, argument, theme, wrapped) {
    if (wrapped)
        return { additions: [], changes: [] };
    unusedName(file, "QuestThemeProvider");
    const additions = ['import { Theme as QuestThemeProvider } from "@astryxdesign/core/theme"'];
    if (!theme) {
        unusedName(file, "questTheme");
        additions.unshift('import { questTheme } from "@/components/quest/theme"');
    }
    const themeName = theme ?? "questTheme";
    const text = `<QuestThemeProvider theme={${themeName}}>{${argument.getText()}}</QuestThemeProvider>`;
    return { additions, changes: [{ start: argument.getStart(), end: argument.end, text }] };
}
export function setupEntry(text) {
    const file = source("src/main.tsx", text);
    const argument = renderArgument(file);
    const provider = namedImport(file, "@astryxdesign/core/theme", "Theme");
    const theme = namedImport(file, "@/components/quest/theme", "questTheme");
    const wrapped = provider ? isThemeWrapper(argument, provider, theme) : false;
    if (provider && !wrapped) {
        throw new Error("Existing Astryx Theme wiring is ambiguous. Keep a single Theme with questTheme at the root render expression before retrying.");
    }
    const setup = themeSetup(file, argument, theme, wrapped);
    const additions = [...missingStyleImports(file), ...setup.additions];
    const changes = [...setup.changes];
    if (additions.length)
        changes.push({ start: 0, end: 0, text: `${additions.join("\n")}\n` });
    return apply(text, changes);
}
