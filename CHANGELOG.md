## [0.3.0](https://github.com/ReineiraOS/platform-modules/compare/v0.2.0...v0.3.0) (2026-04-28)

### Features

* **landing:** add landing package to monorepo ([d3e5b08](https://github.com/ReineiraOS/platform-modules/commit/d3e5b08ff7f42d2ed74afce617d1d7647b105f45))

### Bug Fixes

* **ci:** pin eslint to v9 to match plugin peer deps ([bbf386b](https://github.com/ReineiraOS/platform-modules/commit/bbf386bd34e345650821e1dc7147d0117e92680f))

## [0.2.0](https://github.com/ReineiraOS/platform-modules/compare/v0.1.1...v0.2.0) (2026-04-22)

### Features

* add ESLint v9 flat config for monorepo ([f34ef56](https://github.com/ReineiraOS/platform-modules/commit/f34ef565c1432d859a457400e5386182b7389dd4))
* add Postgres schema and repository implementations ([48cdaba](https://github.com/ReineiraOS/platform-modules/commit/48cdaba93e2f9a3cf0107ce54baeceea6d6d2eba))
* implement OpenAPI generation pipeline ([5097b90](https://github.com/ReineiraOS/platform-modules/commit/5097b90a262e7934a420cbe74ca0bbbb3fe89a21))

### Bug Fixes

* update vercel.json install commands for monorepo root directory ([46a8cda](https://github.com/ReineiraOS/platform-modules/commit/46a8cda910df730356d7d9ad03fb872b46d056a7))

## [0.1.1](https://github.com/ReineiraOS/platform-modules/compare/v0.1.0...v0.1.1) (2026-04-06)

### Bug Fixes

- **ci:** remove explicit pnpm version to avoid packageManager conflict ([f6d4724](https://github.com/ReineiraOS/platform-modules/commit/f6d4724e84aaa3a1a085eba2f9922fec148192ae))

# Changelog

All notable changes to this project will be documented in this file.

This project uses [Semantic Versioning](https://semver.org/) and
[Conventional Commits](https://www.conventionalcommits.org/).

## [0.1.0] — 2026-03-20

### Added

- Initial release — monorepo scaffold for ReineiraOS application modules
- Backend package: TypeScript, Clean Architecture, Vercel-ready, DB-agnostic
- App package: React 19, ZeroDev smart accounts, passkey auth
- Platform versioning via `reineira.json`

### Platform

- Compatible with ReineiraOS platform 0.1
