# Page Agent Dependencies

This document summarizes all dependencies across the monorepo packages.

## Runtime Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | `^22.22.1 || >=24` |
| npm | `^11.6.3` |

---

## Package Dependencies Summary

### Core Packages (Published to npm)

#### `page-agent` (Main Entry)
The primary package that combines all components with UI Panel.

| Type | Package | Version |
|------|---------|---------|
| dependencies | `@page-agent/core` | `1.10.0` |
| dependencies | `@page-agent/llms` | `1.10.0` |
| dependencies | `@page-agent/page-controller` | `1.10.0` |
| dependencies | `@page-agent/ui` | `1.10.0` |
| dependencies | `chalk` | `^5.6.2` |
| peerDependencies | `zod` | `^3.25.0 || ^4.0.0` |

#### `@page-agent/core` (Headless Agent)
Core agent logic without UI.

| Type | Package | Version |
|------|---------|---------|
| dependencies | `@page-agent/llms` | `1.10.0` |
| dependencies | `@page-agent/page-controller` | `1.10.0` |
| dependencies | `chalk` | `^5.6.2` |
| peerDependencies | `zod` | `^3.25.0 || ^4.0.0` |

#### `@page-agent/llms` (LLM Client)
LLM client with reflection-before-action mental model.

| Type | Package | Version |
|------|---------|---------|
| dependencies | `chalk` | `^5.6.2` |
| peerDependencies | `zod` | `^3.25.0 || ^4.0.0` |

#### `@page-agent/page-controller` (DOM Operations)
Page controller for DOM operations and element interactions.

| Type | Package | Version |
|------|---------|---------|
| dependencies | `ai-motion` | `^0.4.8` |

#### `@page-agent/ui` (UI Components)
Panel and i18n components.

| Type | Package | Version |
|------|---------|---------|
| (no external dependencies) | — | — |

#### `@page-agent/website` (Documentation Site)
React docs and landing page.

| Type | Package | Version |
|------|---------|---------|
| devDependencies | `@radix-ui/react-icons` | `^1.3.2` |
| devDependencies | `@radix-ui/react-separator` | `^1.1.10` |
| devDependencies | `@radix-ui/react-slot` | `^1.3.0` |
| devDependencies | `@radix-ui/react-switch` | `^1.3.1` |
| devDependencies | `@radix-ui/react-tooltip` | `^1.2.10` |
| devDependencies | `@types/react` | `^19.2.17` |
| devDependencies | `@types/react-dom` | `^19.2.3` |
| devDependencies | `class-variance-authority` | `^0.7.1` |
| devDependencies | `clsx` | `^2.1.1` |
| devDependencies | `lucide-react` | `^1.18.0` |
| devDependencies | `motion` | `^12.40.0` |
| devDependencies | `next-themes` | `^0.4.6` |
| devDependencies | `react` | `^19.2.6` |
| devDependencies | `react-dom` | `^19.2.6` |
| devDependencies | `rough-notation` | `^0.5.1` |
| devDependencies | `sonner` | `^2.0.7` |
| devDependencies | `tailwind-merge` | `^3.6.0` |
| devDependencies | `tailwindcss` | `^4.3.0` |
| devDependencies | `tw-animate-css` | `^1.4.0` |
| devDependencies | `wouter` | `^3.10.0` |

---

## Root DevDependencies (Shared Across All Packages)

| Package | Version | Purpose |
|---------|---------|---------|
| `@eslint-react/eslint-plugin` | `^5.9.0` | React ESLint rules |
| `@eslint/js` | `^10.0.1` | ESLint JavaScript config |
| `@microsoft/api-extractor` | `^7.58.9` | API documentation generation |
| `@tailwindcss/vite` | `^4.3.1` | Tailwind CSS Vite plugin |
| `@trivago/prettier-plugin-sort-imports` | `^6.0.2` | Import sorting |
| `@types/node` | `^25.9.3` | Node.js type definitions |
| `@vitejs/plugin-react` | `^6.0.2` | React Vite plugin |
| `chalk` | `^5.6.2` | Terminal colors |
| `concurrently` | `^10.0.3` | Parallel command execution |
| `dotenv` | `^17.4.2` | Environment variables |
| `eslint` | `^10.5.0` | Code linting |
| `globals` | `^17.6.0` | Global variables for ESLint |
| `happy-dom` | `^20.10.4` | DOM simulation for tests |
| `prettier` | `^3.8.4` | Code formatting |
| `typescript` | `^6.0.3` | TypeScript compiler |
| `typescript-eslint` | `^8.61.1` | TypeScript ESLint plugin |
| `unplugin-dts` | `^1.0.1` | TypeScript declaration bundling |
| `vite` | `^8.0.14` | Build tool |
| `vite-plugin-css-injected-by-js` | `^5.0.1` | CSS injection plugin |
| `vitest` | `^4.1.9` | Unit testing framework |

---

## Dependency Graph

```
page-agent (npm entry)
├── @page-agent/core
│   ├── @page-agent/llms
│   │   └── chalk
│   │   └── zod (peer)
│   ├── @page-agent/page-controller
│   │   └── ai-motion
│   └── chalk
│   └── zod (peer)
├── @page-agent/ui
│   └── ai-motion (via motion-css)
├── @page-agent/llms (see above)
├── @page-agent/page-controller (see above)
└── chalk
└── zod (peer)

```

---

## Installation

```bash
# Install all dependencies
npm install

# Build all library packages
npm run build:libs

# Run tests
npm test

# Start development server (website)
npm start

```

---

## Notes

1. **Peer Dependencies**: `zod` is a peer dependency for all agent packages. Users must install it separately:
   ```bash
   npm install zod
   ```

2. **Overrides**: The root `package.json` includes overrides for:
   - `typescript`: `^6.0.3` (enforced version)
   - `node-notifier.uuid`: `11.1.1` (security fix)

3. **Internal Packages**: All `@page-agent/*` packages are versioned together (`1.10.0`) and managed via npm workspaces.
