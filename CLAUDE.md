# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a freshly scaffolded Vue 3 + TypeScript + Vite project (the official `npm create vue` starter). `src/App.vue` is still a "Hello World" stub and `src/style.css` is empty — there is no real application architecture yet. Expect to build features from scratch rather than fitting into existing patterns.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check with `vue-tsc -b` then bundle with Vite (the build fails on type errors)
- `npm run preview` — serve the production build locally

There is no test runner, linter, or formatter configured.

## Architecture notes

- **SFC style:** Use `<script setup lang="ts">` Single File Components (the existing `App.vue` follows this). Entry point is `src/main.ts`, which calls `createApp(App).mount('#app')`.
- **TypeScript config is split:** `tsconfig.json` is a solution file referencing `tsconfig.app.json` (app code, DOM lib) and `tsconfig.node.json` (Vite config). Adjust `tsconfig.app.json` for app-level compiler options.
- **Strict linting via tsconfig:** `tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`, so unused variables/params break the build, not just `dev`. `erasableSyntaxOnly` is on, which bans TS-only runtime constructs (enums, parameter properties, namespaces) — use type-only alternatives.
- **Static assets:** Files in `public/` (e.g. `favicon.svg`, `icons.svg`) are served from the root path `/`.
