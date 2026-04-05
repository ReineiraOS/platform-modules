# Contributing to Reineira Modules

Thank you for your interest in contributing. This document explains how to contribute to
`platform-modules`.

## Before You Start

By submitting a contribution, you agree to the [Contributor License Agreement](CLA.md).

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic
versioning and changelog generation.

```
feat(backend): add invoice creation endpoint
fix(app): correct wallet connection flow
chore: update shared dependencies

BREAKING CHANGE: restructure backend API routes
```

| Prefix             | Version bump           | When to use                    |
| ------------------ | ---------------------- | ------------------------------ |
| `feat:`            | Minor (0.1.0 → 0.2.0) | New feature                    |
| `fix:`             | Patch (0.1.0 → 0.1.1) | Bug fix                        |
| `docs:`            | No bump                | Documentation only             |
| `chore:`           | No bump                | Tooling, deps                  |
| `BREAKING CHANGE:` | Major (0.1.0 → 1.0.0) | API change, platform bump      |

Use scope to indicate package: `feat(backend):`, `fix(app):`.

## Development Workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/platform-modules.git
cd platform-modules
pnpm install

# 2. Create a branch
git checkout -b feat/my-feature

# 3. Work on a specific package
cd packages/backend  # or packages/app

# 4. Test
pnpm test

# 5. Commit with conventional format
git commit -m "feat(backend): add escrow status endpoint"

# 6. Push and open PR
git push origin feat/my-feature
```

## Platform Compatibility

All contributions must be compatible with the platform version declared in `reineira.json`.

## Questions?

- [Telegram](https://t.me/ReineiraOS)
- [Documentation](https://reineira.xyz/docs)
