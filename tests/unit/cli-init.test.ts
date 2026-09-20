import { afterEach, describe, expect, it } from "vitest"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, resolve } from "node:path"
import { planInit } from "../../cli/init-project"

const directories: string[] = []
const vite = `import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// User's development server must survive setup.
export default defineConfig({plugins: [react()], server: {port: 4317}})
`
const entry = `import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'
const root = createRoot(document.getElementById('root')!)
root.render(<StrictMode><App /></StrictMode>)
`

function save(cwd: string, path: string, content: string): void {
  mkdirSync(dirname(resolve(cwd, path)), { recursive: true })
  writeFileSync(resolve(cwd, path), content)
}

function fixture(): string {
  const cwd = mkdtempSync(resolve(tmpdir(), "quest-init-"))
  directories.push(cwd)
  save(cwd, "index.html", '<div id="root"></div><script type="module" src="/src/main.tsx"></script>')
  save(cwd, "package.json", JSON.stringify({ type: "module", dependencies: { react: "19.2.6", "react-dom": "19.2.6" }, devDependencies: { vite: "8.0.13", typescript: "5.9.3", "@vitejs/plugin-react": "6.0.2" } }))
  save(cwd, "vite.config.ts", vite)
  save(cwd, "src/main.tsx", entry)
  save(cwd, "src/index.css", "/* user stylesheet */\nbody { margin: 0 }\n")
  save(cwd, "tsconfig.json", '{\n// retain this comment\n"compilerOptions": {}, "references": [{"path":"./tsconfig.app.json"}]\n}')
  save(cwd, "tsconfig.app.json", '{"compilerOptions":{"strict":true,"jsx":"react-jsx"},"include":["src"]}')
  return cwd
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

describe("Vite initialization preflight", () => {
  it("plans without writes and becomes a no-op after applying setup while preserving user configuration", () => {
    const cwd = fixture()
    const beforeCss = readFileSync(resolve(cwd, "src/index.css"), "utf8")
    const first = planInit(cwd)
    expect(readFileSync(resolve(cwd, "vite.config.ts"), "utf8")).toBe(vite)
    expect(readFileSync(resolve(cwd, "src/main.tsx"), "utf8")).toBe(entry)
    for (const file of first.files) save(cwd, file.path, file.after)
    save(cwd, "src/components/quest/theme.ts", "export const questTheme = {}\n")
    save(cwd, "src/components/quest/fonts.css", "/* consumer customized fonts */\n")
    const second = planInit(cwd)
    expect(second.files).toEqual([])
    expect(second.themeInstalled).toBe(true)
    expect(readFileSync(resolve(cwd, "src/index.css"), "utf8")).toBe(beforeCss)
    expect(readFileSync(resolve(cwd, "vite.config.ts"), "utf8")).toContain("server: {port: 4317}")
    expect(readFileSync(resolve(cwd, "src/main.tsx"), "utf8")).toContain("<StrictMode><App /></StrictMode>")
    expect(readFileSync(resolve(cwd, "tsconfig.json"), "utf8")).toContain("// retain this comment")
  })

  it("rejects conflicting aliases before any setup writes", () => {
    const cwd = fixture()
    const conflict = vite.replace("server:", "resolve: {alias: {'@': '/unrelated'}}, server:")
    save(cwd, "vite.config.ts", conflict)
    expect(() => planInit(cwd)).toThrow(/alias conflicts/)
    expect(readFileSync(resolve(cwd, "vite.config.ts"), "utf8")).toBe(conflict)
    expect(readFileSync(resolve(cwd, "src/main.tsx"), "utf8")).toBe(entry)
  })

  it("rejects executable configuration rather than guessing its merge semantics", () => {
    const cwd = fixture()
    save(cwd, "vite.config.ts", "import {defineConfig} from 'vite'; export default defineConfig(() => ({plugins: []}))")
    expect(() => planInit(cwd)).toThrow(/explicit object literal/)
    expect(readFileSync(resolve(cwd, "src/main.tsx"), "utf8")).toBe(entry)
  })

  it("does not adopt an incompatible StyleX extraction configuration", () => {
    const cwd = fixture()
    save(cwd, "vite.config.ts", "import stylex from '@stylexjs/unplugin'\n" + vite.replace("plugins: [", "plugins: [stylex.vite({useCSSLayers: true, runtimeInjection: true}), "))
    expect(() => planInit(cwd)).toThrow(/useCSSLayers must be false/)
  })

  it("refuses ambiguous Theme wiring and partial source delivery", () => {
    const cwd = fixture()
    save(cwd, "src/main.tsx", "import {Theme} from '@astryxdesign/core/theme'\n" + entry)
    expect(() => planInit(cwd)).toThrow(/Theme wiring is ambiguous/)
    save(cwd, "src/main.tsx", entry)
    save(cwd, "src/components/quest/theme.ts", "export const questTheme = {}")
    expect(() => planInit(cwd)).toThrow(/Partial Quest theme/)
  })

  it("retains other package managers without attempting conversion", () => {
    const cwd = fixture()
    save(cwd, "pnpm-lock.yaml", "lockfileVersion: '9.0'\n")
    expect(() => planInit(cwd)).toThrow(/npm projects only/)
    expect(readFileSync(resolve(cwd, "vite.config.ts"), "utf8")).toBe(vite)
  })
})
