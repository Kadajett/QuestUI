import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, extname, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"
import { componentCatalog } from "../cli/catalog.ts"
import { astryxLicense } from "../cli/license.ts"

interface RegistryFile {
  path: string
  target: string
  type: "registry:component" | "registry:ui" | "registry:lib" | "registry:file"
  content: string
}
interface Closure {
  files: Map<string, RegistryFile>
  dependencies: Set<string>
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const destination = resolve(root, "public/r")
const manifest: unknown = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"))
const compilerOptions: ts.CompilerOptions = {
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  baseUrl: root,
  paths: { "@/*": ["./*"] },
  jsx: ts.JsxEmit.ReactJSX,
}
const modules = new Map<string, { content: string; imports: readonly ts.FileReference[] }>()
const fontMime: Record<string, string> = {
  ".ttf": "font/ttf", ".otf": "font/otf", ".woff": "font/woff", ".woff2": "font/woff2",
}

function packageVersion(name: string, section: "dependencies" | "devDependencies"): string {
  const dependencies = (manifest as Record<string, unknown>)[section]
  const version = typeof dependencies === "object" && dependencies !== null
    ? (dependencies as Record<string, unknown>)[name]
    : undefined
  if (typeof version !== "string") throw new Error(`Undeclared ${section} package: ${name}`)
  return `${name}@${version}`
}

function projectPath(absolute: string): string {
  const path = relative(root, absolute).split(sep).join("/")
  if (path.startsWith("../") || path === "..") throw new Error(`Source dependency escapes project: ${absolute}`)
  return path
}

function registryFile(path: string, content: string): RegistryFile {
  if (path.startsWith("components/")) {
    return { path, content, type: extname(path) === ".css" ? "registry:file" : "registry:component",
      target: path.replace("components/", "@components/") }
  }
  if (path.startsWith("lib/")) {
    return { path, content, type: "registry:lib", target: path.replace("lib/", "@lib/") }
  }
  return { path, content, type: "registry:file", target: `~/${path}` }
}

function sourceModule(path: string) {
  const cached = modules.get(path)
  if (cached) return cached
  const content = readFileSync(resolve(root, path), "utf8")
  const source = { content, imports: ts.preProcessFile(content, true, true).importedFiles }
  modules.set(path, source)
  return source
}

function localDependency(specifier: string, importer: string): string {
  const importingFile = resolve(root, importer)
  if (specifier.endsWith(".css")) {
    const base = specifier.startsWith("@/") ? root : dirname(importingFile)
    return projectPath(resolve(base, specifier.replace(/^@\//, "")))
  }
  const result = ts.resolveModuleName(specifier, importingFile, compilerOptions, ts.sys)
  if (!result.resolvedModule) throw new Error(`Cannot resolve ${specifier} imported by ${importer}`)
  return projectPath(result.resolvedModule.resolvedFileName)
}

function addPackage(specifier: string, dependencies: Set<string>): void {
  const count = specifier.startsWith("@") ? 2 : 1
  const name = specifier.split("/").slice(0, count).join("/")
  if (name === "react" || name === "react-dom") return
  dependencies.add(packageVersion(name, "dependencies"))
}

function visitSource(path: string, closure: Closure): void {
  if (closure.files.has(path)) return
  if (extname(path) === ".css") {
    closure.files.set(path, registryFile(path, bundleStyles(resolve(root, path))))
    return
  }
  const source = sourceModule(path)
  closure.files.set(path, registryFile(path, source.content))
  for (const { fileName } of source.imports) {
    if (fileName.startsWith(".") || fileName.startsWith("@/")) visitSource(localDependency(fileName, path), closure)
    else addPackage(fileName, closure.dependencies)
  }
}

function stylesheetPath(specifier: string, importer: string): string {
  if (specifier.startsWith(".")) return resolve(dirname(importer), specifier)
  if (specifier.startsWith("/")) return resolve(root, "public", specifier.slice(1))
  return require.resolve(specifier)
}

function embeddedFont(url: string, stylesheet: string): string {
  if (url.startsWith("data:") || /^(?:https?:)?\/\//.test(url) || url.startsWith("#")) return `url(${JSON.stringify(url)})`
  const path = url.startsWith("/") ? resolve(root, "public", url.slice(1)) : resolve(dirname(stylesheet), url)
  const mime = fontMime[extname(path).toLowerCase()]
  if (!mime) throw new Error(`Unsupported stylesheet asset: ${url} in ${stylesheet}`)
  return `url("data:${mime};base64,${readFileSync(path).toString("base64")}")`
}

function embedStyleAssets(content: string, path: string): string {
  return content.replace(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g,
    (_match: string, url: string) => embeddedFont(url, path))
}

function inlineStyleImport(match: RegExpExecArray, path: string, stack: Set<string>): string {
  const specifier = match[1] ?? match[2]
  if (!specifier) throw new Error(`Invalid CSS import in ${path}`)
  if (match[3]?.trim()) throw new Error(`Qualified CSS import requires explicit bundling: ${match[0]}`)
  return bundleStyles(stylesheetPath(specifier, path), stack)
}

function bundleStyles(path: string, stack = new Set<string>()): string {
  if (stack.has(path)) throw new Error(`Circular stylesheet import: ${path}`)
  stack.add(path)
  const content = readFileSync(path, "utf8")
  const imports = /@import\s+(?:["']([^"']+)["']|url\(\s*["']?([^"')\s]+)["']?\s*\))([^;]*);/g
  let output = ""
  let offset = 0
  for (const match of content.matchAll(imports)) {
    output += embedStyleAssets(content.slice(offset, match.index), path)
    output += inlineStyleImport(match, path, stack)
    offset = match.index + match[0].length
  }
  output += embedStyleAssets(content.slice(offset), path)
  stack.delete(path)
  return output
}

function fontLicenses(): RegistryFile[] {
  return readdirSync(resolve(root, "public/fonts")).filter(name => /^OFL.*\.txt$/.test(name)).sort().map(name => {
    const path = `public/fonts/${name}`
    return registryFile(path, readFileSync(resolve(root, path), "utf8"))
  })
}

const setup = `Editable QuestUI source built on Astryx; Astryx and StyleX remain npm dependencies.
Configure your StyleX compiler before importing copied TSX and .stylex.ts files. For Vite, install
@stylexjs/unplugin and add stylex.vite({useCSSLayers:false,runtimeInjection:false}) before your React
plugin, importing stylex from '@stylexjs/unplugin'. useCSSLayers:false lets QuestUI styles override
Astryx theme layers. Other bundlers need the equivalent StyleX compile/extraction setup.
Import '@astryxdesign/core/reset.css', '@astryxdesign/core/astryx.css', and the copied quest/fonts.css
once at the application entry. Wrap the app in Theme from '@astryxdesign/core/theme' with the copied
questTheme from quest/theme. Import individual components; no whole-catalog barrel is installed.
Use the components alias configured in components.json. Font data and OFL licenses are included.
shadcn init configures source delivery only; it does not configure Astryx or StyleX.
For deeper customization use quest-ui swizzle NAME, then repoint imports to the ejected source.
Swizzling preserves upstream headers/license but retains Astryx imports and the compiler requirement.`

function buildItem(name: string, shared: RegistryFile[]) {
  const closure: Closure = { files: new Map(), dependencies: new Set() }
  if (name !== "theme") visitSource(`components/quest/${name}.tsx`, closure)
  visitSource("components/quest/theme.ts", closure)
  for (const file of shared) closure.files.set(file.path, file)
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `quest-${name}`,
    type: "registry:ui",
    title: `QuestUI ${name}`,
    description: `Editable pixel ${name} composition built with Astryx and StyleX.`,
    docs: setup,
    dependencies: [...closure.dependencies].sort(),
    devDependencies: [packageVersion("@stylexjs/unplugin", "devDependencies")],
    files: [...closure.files.values()].sort((left, right) => left.path.localeCompare(right.path)),
  }
}

function writeJson(name: string, value: unknown): void {
  writeFileSync(resolve(destination, name), `${JSON.stringify(value, null, 2)}\n`)
}

function writePublicDocuments(): void {
  const publicRoot = resolve(root, "public")
  const docsRoot = resolve(publicRoot, "docs")
  mkdirSync(docsRoot, { recursive: true })
  for (const name of ["getting-started.md", "components.md", "ai.md"]) {
    writeFileSync(resolve(docsRoot, name), readFileSync(resolve(root, "docs", name), "utf8"))
  }
  writeFileSync(resolve(docsRoot, "questui-home.webp"), readFileSync(resolve(root, "docs/questui-home.webp")))
  for (const name of ["llms.txt", "README.md"]) {
    writeFileSync(resolve(publicRoot, name), readFileSync(resolve(root, name), "utf8"))
  }
}

function buildRegistry(): void {
  const fontPath = "components/quest/fonts.css"
  const shared = [registryFile(fontPath, bundleStyles(resolve(root, fontPath))), ...fontLicenses(),
    registryFile("components/quest/LICENSE.astryx", astryxLicense)]
  const items = componentCatalog.map(({ name }) => buildItem(name, shared))
  mkdirSync(destination, { recursive: true })
  writePublicDocuments()
  for (const file of readdirSync(destination)) {
    if (/^quest-.*\.json$/.test(file)) rmSync(resolve(destination, file))
  }
  for (const item of items) writeJson(`${item.name}.json`, item)
  writeJson("quest-theme.json", buildItem("theme", shared))
  writeJson("registry.json", {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "quest-ui",
    homepage: process.env["QUEST_REGISTRY_HOMEPAGE"] ?? "https://questui.yougotserved.dev",
    items,
  })
  console.log(`Generated ${items.length} editable Astryx registry items in public/r (StyleX compilation required).`)
}

buildRegistry()
