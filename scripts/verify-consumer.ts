import {spawnSync} from 'node:child_process'
import {mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {componentCatalog} from '../cli/catalog.ts'
import {consumerPage} from './consumer-page.ts'
import {consumerControls} from './consumer-controls.ts'

// Run only after the repository's unit, browser, and screenshot gates pass.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const registry = 'http://127.0.0.1:5173/r'
const names = componentCatalog.map(({name}) => name)
const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
  name: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

function run(command: string, args: string[], cwd: string, capture = false): string {
  console.log(`\n> ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, {
    cwd, encoding: 'utf8', shell: false,
    stdio: capture ? ['inherit', 'pipe', 'inherit'] : 'inherit',
  })
  if (result.error) throw result.error
  if (result.signal) throw new Error(`${command} terminated by ${result.signal}`)
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status}`)
  return result.stdout ?? ''
}

function npm(args: string[], cwd: string, capture = false): string {
  const cli = process.env['npm_execpath']
  return cli && /(?:^|[\\/])npm-cli\.js$/.test(cli)
    ? run(process.execPath, [cli, ...args], cwd, capture)
    : run('npm', args, cwd, capture)
}

function save(directory: string, path: string, content: string | object): void {
  const target = resolve(directory, path)
  mkdirSync(dirname(target), {recursive: true})
  writeFileSync(target, typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`)
}

function versions(packages: string[]): Record<string, string> {
  return Object.fromEntries(packages.map(name => {
    const version = manifest.dependencies[name] ?? manifest.devDependencies[name]
    if (!version) throw new Error(`Missing consumer dependency version: ${name}`)
    return [name, version]
  }))
}

function tarball(directory: string, argument: string | undefined): string {
  if (argument) {
    const path = resolve(argument)
    if (!statSync(path).isFile()) throw new Error(`Not a package tarball: ${path}`)
    return path
  }
  npm(['run', 'build:cli'], root)
  npm(['run', 'registry'], root)
  const packed: unknown = JSON.parse(npm(['pack', '--json', '--pack-destination', directory], root, true))
  if (!Array.isArray(packed) || packed.length !== 1 || typeof packed[0]?.filename !== 'string') {
    throw new Error('npm pack did not return exactly one package filename')
  }
  return resolve(directory, packed[0].filename)
}

const viteConfig = `import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`


function scaffold(directory: string): void {
  save(directory, 'package.json', {
    name: 'quest-ui-cli-consumer', version: '0.0.0', private: true, type: 'module',
    scripts: {
      build: 'tsc --noEmit && vite build',
      dev: 'vite --host 127.0.0.1 --port 4174 --strictPort',
      preview: 'vite preview --host 127.0.0.1 --port 4174 --strictPort',
    },
    dependencies: versions(['react', 'react-dom']),
    devDependencies: versions(['typescript', 'vite', '@vitejs/plugin-react', '@types/node', '@types/react', '@types/react-dom']),
  })
  save(directory, 'tsconfig.json', {
    compilerOptions: {
      target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'Bundler',
      jsx: 'react-jsx', strict: true, skipLibCheck: true, esModuleInterop: true, noEmit: true,
      allowImportingTsExtensions: true,
    },
    include: ['src', 'vite.config.ts'],
  })
  save(directory, 'vite.config.ts', viteConfig)
  save(directory, 'index.html', '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>QuestUI CLI consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n')
  save(directory, 'src/index.css', '#root { min-height: 100dvh; }\n')
  save(directory, 'src/vite-env.d.ts', '/// <reference types="vite/client" />\n')
  save(directory, 'src/main.tsx', consumerPage)
  save(directory, 'src/consumer-controls.tsx', consumerControls)
  for (const section of ['layout', 'navigation', 'overlays', 'form', 'data', 'conversation']) {
    const filename = `demo-${section}-extra.tsx`
    save(directory, `src/${filename}`, readFileSync(resolve(root, filename), 'utf8'))
  }
}

async function verify(): Promise<void> {
  if (process.argv.length > 3) throw new Error('Usage: node scripts/verify-consumer.ts [package.tgz]')
  const workspace = mkdtempSync(resolve(tmpdir(), 'quest-ui-consumer-'))
  const consumer = resolve(workspace, 'app')
  console.log(`Consumer verification workspace: ${workspace}`)
  console.log('Prerequisite: unit, browser, and screenshot gates have passed; local registry server is running on :5173.')
  const archive = tarball(workspace, process.argv[2])
  for (const name of names) {
    const url = `${registry}/quest-${name}.json`
    const response = await fetch(url, {signal: AbortSignal.timeout(10_000)})
    if (!response.ok) throw new Error(`Registry unavailable: ${url} returned ${response.status}`)
    const item = await response.json() as {name?: string}
    if (item.name !== `quest-${name}`) throw new Error(`Unexpected registry item at ${url}`)
  }
  scaffold(consumer)
  npm(['install', archive, '--no-audit', '--no-fund'], consumer)
  const packageRoot = resolve(consumer, 'node_modules', manifest.name)
  const installed = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8')) as {bin: Record<string, string>}
  const binary = installed.bin['quest-ui']
  if (!binary) throw new Error('Installed package has no quest-ui binary')
  const entry = resolve(packageRoot, binary)
  run(process.execPath, [entry, 'init', '--framework', 'vite', '--registry', registry, '--cwd', consumer, '--yes'], consumer)
  for (const name of names) {
    run(process.execPath, [entry, 'add', name, '--registry', registry, '--cwd', consumer, '--yes', '--overwrite'], consumer)
    if (!statSync(resolve(consumer, 'src/components/quest', `${name}.tsx`)).isFile()) {
      throw new Error(`CLI did not install ${name}.tsx in the consumer`)
    }
  }
  npm(['run', 'build'], consumer)
  console.log(`\nPASS: packaged CLI init, ${names.length} separate packaged CLI installs, and consumer TypeScript/StyleX production build.\nConsumer: ${consumer}`)
  console.log(`Browser proof: npm --prefix ${JSON.stringify(consumer)} run preview`)
  console.log('Open http://127.0.0.1:4174 and exercise allCatalogScenario exported by scripts/consumer-scenario.ts (desktop viewport, fresh page).')
}

verify().catch(error => {
  console.error(error)
  process.exitCode = 1
})
