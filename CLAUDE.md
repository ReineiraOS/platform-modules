# Reineira Modules — Application Starters

## Version

- **Modules version:** 0.1.0
- **Platform version:** 0.1
- **Version config:** `reineira.json` at project root

## What this repo is

A pnpm monorepo with plug-and-play application starters for ventures building on ReineiraOS.
Builders clone this repo, pick the packages they need, and customize for their use case.

## Structure

```
packages/
  backend/       — @reineira-os/modules-backend
  app/           — @reineira-os/modules-app
  payment-link/  — @reineira-os/modules-payment-link
```

## Packages

### backend/ — Backend API

- **Stack:** TypeScript + Clean Architecture (DDD) + Vercel-ready + DB-agnostic
- **Layers:** Domain → Application → Infrastructure → Interface → Core
- **DB:** Repository pattern — swap Postgres, DynamoDB, Supabase, Turso, or any store
- **Deploy:** Vercel (fastest path), also supports AWS, Railway, etc.

### app/ — Platform App

- **Stack:** Vue 3 + TypeScript + Vite + Pinia + TailwindCSS + ZeroDev
- **Wallet:** ZeroDev ERC-4337 smart accounts with passkey authentication
- **Auth:** WebAuthn passkeys → SIWE signing → backend JWT
- **Layers:** Views, Router, Stores, Services, Composables, Components, Helpers

### payment-link/ — Shareable Payment Link

- **Stack:** Vue 3 + TypeScript + Vite + TailwindCSS + Wagmi + RainbowKit
- **Flow:** External party clicks link → sees invoice → connects wallet → pays cross-chain USDC via CCTP
- **Wallet:** Any wallet via RainbowKit/WalletConnect (external payers)
- **Stores:** invoiceStore, paymentStore, walletStore, chainStore, balanceStore

## Ecosystem

| Repo                 | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| **platform-modules** (this repo) | App starters — backend, platform app, payment link |
| **reineira-atlas**   | Startup OS — strategy, ops, growth, compliance, pitch     |
| **reineira-code**    | Smart contracts — resolvers, policies, tests, deploy      |

## Key facts

- **Stablecoin-agnostic** — escrow accepts any IFHERC20 token
- **Contract addresses** — query from MCP or protocol docs, never hardcode
- **Platform version** — all packages track the same platform version in `reineira.json`

## Build & Dev

```bash
pnpm install                    # Install all deps
pnpm dev:backend                # Run backend dev server
pnpm dev:app                    # Run platform app (port 4831)
pnpm dev:payment-link           # Run payment link app
pnpm build                      # Build all packages
pnpm test                       # Test all packages
```

_This repo will be populated with production code from Privara. Currently a scaffold._
