# @reineira-os/modules-app

Platform app starter for ReineiraOS ventures. Vue 3 + TypeScript + Vite + Pinia + TailwindCSS +
ZeroDev smart accounts.

## Web3 Integration

- **ZeroDev** — ERC-4337 smart accounts with passkey authentication
- **Auth flow:** Passkey register/login → SIWE signing → backend JWT
- **User operations** via bundler, not traditional signed transactions
- **Session keys** for delegated signing

## Key Layers

| Layer | Path | Purpose |
| ----- | ---- | ------- |
| Views | `src/views/` | AuthorizedView + UnauthorizedView layout |
| Router | `src/router/` | Routes with meta-based auth, lazy loading |
| Stores | `src/stores/` | zerodevStore, authStore, loadingStore |
| Services | `src/services/` | Static async classes wrapping Axios |
| Composables | `src/composables/` | Reusable Vue composables |
| Components | `src/components/` | UI primitives + feature components |

## Status

Scaffold — production code will be populated from Privara.
