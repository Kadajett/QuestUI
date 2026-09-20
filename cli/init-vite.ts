import ts from "typescript"
import { addProperty, apply, imports, namedImport, objectValue, property, source, unusedName, type Change } from "./init-syntax.js"

function converterCall(expression: ts.Expression, converter: string): ts.CallExpression | undefined {
  if (!ts.isCallExpression(expression) || expression.arguments.length !== 1) return undefined
  if (!ts.isIdentifier(expression.expression) || expression.expression.text !== converter) return undefined
  return expression
}

function urlArguments(expression: ts.Expression, converter: string): readonly ts.Expression[] | undefined {
  const call = converterCall(expression, converter)
  const url = call?.arguments[0]
  if (!url || !ts.isNewExpression(url)) return undefined
  if (!ts.isIdentifier(url.expression) || url.expression.text !== "URL") return undefined
  return url.arguments?.length === 2 ? url.arguments : undefined
}

function isSourcePath(node: ts.Expression | undefined): boolean {
  return !!node && ts.isStringLiteral(node) && ["./src", "./src/"].includes(node.text)
}

function isImportMetaUrl(node: ts.Expression | undefined): boolean {
  if (!node || !ts.isPropertyAccessExpression(node) || node.name.text !== "url") return false
  if (!ts.isMetaProperty(node.expression)) return false
  return node.expression.keywordToken === ts.SyntaxKind.ImportKeyword && node.expression.name.text === "meta"
}

function sourceAlias(expression: ts.Expression, converter: string): boolean {
  const args = urlArguments(expression, converter)
  return !!args && isSourcePath(args[0]) && isImportMetaUrl(args[1])
}

function configureAlias(file: ts.SourceFile, config: ts.ObjectLiteralExpression, changes: Change[]): void {
  const resolve = property(config, "resolve")
  const urlImport = namedImport(file, "node:url", "fileURLToPath") ?? "questFileURLToPath"
  const entry = `'@': ${urlImport}(new URL('./src', import.meta.url))`
  const addUrlImport = () => {
    if (namedImport(file, "node:url", "fileURLToPath")) return
    unusedName(file, "questFileURLToPath")
    changes.push({ start: 0, end: 0, text: 'import { fileURLToPath as questFileURLToPath } from "node:url"\n' })
  }
  if (!resolve) { addUrlImport(); changes.push(addProperty(config, `resolve: { alias: { ${entry} } }`)); return }
  const object = objectValue(resolve.initializer, "Vite resolve")
  const alias = property(object, "alias")
  if (!alias) { addUrlImport(); changes.push(addProperty(object, `alias: { ${entry} }`)); return }
  const aliases = objectValue(alias.initializer, "Vite resolve.alias")
  const at = property(aliases, "@")
  if (at) {
    if (!sourceAlias(at.initializer, urlImport)) throw new Error("Vite '@' alias conflicts with src. Use fileURLToPath(new URL('./src', import.meta.url)) from node:url.")
    return
  }
  addUrlImport()
  changes.push(addProperty(aliases, entry))
}

function callIndex(elements: readonly ts.Expression[], name: string | undefined): number {
  return elements.findIndex(node =>
    ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === name)
}

function stylexCallIndex(elements: readonly ts.Expression[], name: string | undefined): number {
  return elements.findIndex(node =>
    ts.isCallExpression(node)
    && ts.isPropertyAccessExpression(node.expression)
    && node.expression.expression.getText() === name
    && node.expression.name.text === "vite")
}

function validateStylexPlugin(plugin: ts.Expression | undefined, index: number, reactIndex: number): void {
  if (index < 0 || index >= reactIndex || !plugin || !ts.isCallExpression(plugin) || plugin.arguments.length !== 1) {
    throw new Error("Existing StyleX plugin must precede React and have explicit options.")
  }
  const argument = plugin.arguments[0]
  if (!argument) throw new Error("Existing StyleX plugin must have explicit options.")
  const options = objectValue(argument, "StyleX options")
  for (const key of ["useCSSLayers", "runtimeInjection"]) {
    if (property(options, key)?.initializer.kind !== ts.SyntaxKind.FalseKeyword) {
      throw new Error(`Existing StyleX ${key} must be false. No files were changed.`)
    }
  }
}

function pluginArray(config: ts.ObjectLiteralExpression): ts.ArrayLiteralExpression {
  const pluginProperty = property(config, "plugins")
  if (!pluginProperty || !ts.isArrayLiteralExpression(pluginProperty.initializer)) {
    throw new Error("Vite plugins must be an explicit array containing the React plugin.")
  }
  if (pluginProperty.initializer.elements.some(ts.isSpreadElement)) {
    throw new Error("Spread Vite plugins are unsupported for safe setup.")
  }
  return pluginProperty.initializer
}

function reactPluginIndex(file: ts.SourceFile, plugins: ts.ArrayLiteralExpression): number {
  const react = imports(file, "@vitejs/plugin-react")[0]?.importClause?.name?.text
  const index = callIndex(plugins.elements, react)
  if (index < 0) {
    throw new Error("Expected @vitejs/plugin-react in Vite plugins; SWC and other React compilers require manual integration.")
  }
  return index
}

function validateExistingStylex(file: ts.SourceFile, plugins: ts.ArrayLiteralExpression, reactIndex: number): boolean {
  const stylexImports = imports(file, "@stylexjs/unplugin")
  if (!stylexImports.length) return false
  const name = stylexImports[0]?.importClause?.name?.text
  const index = stylexCallIndex(plugins.elements, name)
  validateStylexPlugin(plugins.elements[index], index, reactIndex)
  return true
}

function configurePlugins(file: ts.SourceFile, config: ts.ObjectLiteralExpression, changes: Change[]): void {
  const plugins = pluginArray(config)
  const reactIndex = reactPluginIndex(file, plugins)
  if (validateExistingStylex(file, plugins, reactIndex)) return
  unusedName(file, "questStylex")
  changes.push({ start: 0, end: 0, text: 'import questStylex from "@stylexjs/unplugin"\n' })
  changes.push({ start: plugins.getStart() + 1, end: plugins.getStart() + 1, text: "questStylex.vite({ useCSSLayers: false, runtimeInjection: false, dev: process.env['NODE_ENV'] !== 'production' }), " })
}

export function setupVite(text: string): string {
  const file = source("vite.config.ts", text)
  const defineConfig = namedImport(file, "vite", "defineConfig")
  const exports = file.statements.filter(ts.isExportAssignment)
  const expression = exports[0]?.expression
  if (exports.length !== 1 || !expression || !ts.isCallExpression(expression) || expression.expression.getText() !== defineConfig || expression.arguments.length !== 1) {
    throw new Error("vite.config.ts must export default defineConfig({ ... }); function/merged configurations are unsupported.")
  }
  const argument = expression.arguments[0]
  if (!argument) throw new Error("Vite configuration is missing.")
  const config = objectValue(argument, "Vite configuration")
  if (property(config, "root")) throw new Error("Custom Vite root requires manual integration; init supports the application root with src/main.tsx.")
  const changes: Change[] = []
  configurePlugins(file, config, changes)
  configureAlias(file, config, changes)
  return apply(text, changes)
}
