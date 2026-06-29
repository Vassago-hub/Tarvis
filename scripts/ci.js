#!/usr/bin/env node
/**
 * Local check script for the submission package.
 *
 * Usage:
 *   node scripts/ci.js            # run all checks
 *   node scripts/ci.js --no-build # skip build step
 */
import chalk from 'chalk'
import { execSync } from 'child_process'

import { parallelTask } from './parallel-task.js'

const args = new Set(process.argv.slice(2))
const skipBuild = args.has('--no-build')

function run(label, command) {
	console.log(chalk.bgBlue.white.bold(` ▸ ${label} `))
	execSync(command, { stdio: 'inherit' })
}

console.log(chalk.bgBlue.white.bold(' ▸ lint + format + typecheck + test '))
await parallelTask(
	[
		{ label: 'lint', command: 'npm run lint' },
		{ label: 'format', command: 'npx prettier --check .' },
		{ label: 'typecheck', command: 'npm run typecheck' },
		{ label: 'test', command: 'npm test' },
	],
	{ timeoutMs: 120_000 }
)

if (skipBuild) {
	console.log(chalk.dim(' ▸ build (skipped)'))
} else {
	run('build', 'npm run build')
}
