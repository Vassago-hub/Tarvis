#!/usr/bin/env node
import { existsSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const packagesDir = join(rootDir, 'packages')

const packageNames = [
	'page-controller',
	'ui',
	'llms',
	'core',
	'page-agent',
	'mcp',
	'website',
]
const targets = ['dist', '.output']

for (const packageName of packageNames) {
	for (const target of targets) {
		const targetPath = join(packagesDir, packageName, target)
		if (!existsSync(targetPath)) continue

		rmSync(targetPath, { recursive: true, force: true })
	}
}
