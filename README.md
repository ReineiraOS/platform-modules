# Reineira Modules

[![Platform](https://img.shields.io/badge/ReineiraOS-v0.1-blue)](https://reineira.xyz)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Plug-and-play application starters for ventures building on ReineiraOS — open settlement
infrastructure for confidential programmable finance.

> **Platform 0.1** — Compatible with ReineiraOS contracts v0.1. Check `reineira.json` for version
> details.

## Packages

| Package | Stack | Purpose |
| ------- | ----- | ------- |
| `packages/backend` | TypeScript, Clean Architecture, Vercel-ready, DB-agnostic | Backend API |
| `packages/app` | React 19, ZeroDev smart accounts, passkey auth | Platform app |

## Setup

```bash
git clone https://github.com/ReineiraOS/platform-modules.git
cd platform-modules
pnpm install
```

## Development

```bash
pnpm dev:backend          # Backend dev server
pnpm dev:app              # Platform app (port 4831)
pnpm build                # Build all packages
pnpm test                 # Test all packages
```

## The ecosystem

| Repo | What you do there | Platform |
| ---- | ----------------- | -------- |
| [reineira-atlas](https://github.com/ReineiraOS/reineira-atlas) | Run the startup — strategy, ops, growth, compliance, pitch | 0.1 |
| [reineira-code](https://github.com/ReineiraOS/reineira-code) | Build smart contracts — resolvers, policies, tests, deploy | 0.1 |
| **platform-modules** (this repo) | Ship the product — backend, platform app | 0.1 |

All repos declare their platform compatibility in `reineira.json`. When the platform version bumps,
breaking contract interface changes may require upgrading.

## Compatibility

| Component | Requirement |
| --------- | ----------- |
| Platform | ReineiraOS 0.1 |
| Node.js | 18+ |
| pnpm | 9+ |
| SDK | @reineira-os/sdk ^0.1.0 |

## Documentation

- [ReineiraOS Docs](https://reineira.xyz/docs)
- [Quick Start](https://reineira.xyz/docs/getting-started/quick-start)
- [Telegram](https://t.me/ReineiraOS)

## License

MIT
