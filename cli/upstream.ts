import { spawnSync } from "node:child_process"
import { constants } from "node:os"

export function fail(message: string): never {
  console.error(`quest-ui: ${message}`)
  process.exit(1)
}

export function runUpstream(packageName: string, binary: string, args: string[], cwd = process.cwd()): boolean {
  // npm's JS entry point avoids invoking a Windows .cmd file through a shell.
  const npmCli = process.env["npm_execpath"]
  const useNpmCli = npmCli !== undefined && /(?:^|[\\/])npm-cli\.js$/.test(npmCli)
  const npmArgs = ["exec", "--yes", `--package=${packageName}`, "--", binary, ...args]
  const child = spawnSync(useNpmCli ? process.execPath : "npm", useNpmCli ? [npmCli, ...npmArgs] : npmArgs, {
    cwd,
    stdio: "inherit",
    shell: false,
  })
  if (child.error) fail(`Could not start npm: ${child.error.message}. Ensure Node.js and npm are available on PATH.`)
  if (child.signal) {
    const signalNumber = constants.signals[child.signal]
    console.error(`quest-ui: upstream ${binary} was terminated by ${child.signal}.`)
    process.exitCode = signalNumber ? 128 + signalNumber : 1
    return false
  }
  process.exitCode = child.status ?? 1
  return child.status === 0
}
