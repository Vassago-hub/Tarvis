import { defineConfig } from 'vitest/config'

export default defineConfig({
	root: import.meta.dirname,
	test: {
		environment: 'happy-dom',
		include: ['src/**/*.test.ts'],
	},
})
