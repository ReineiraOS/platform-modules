# @reineira-os/modules-app

Platform app starter for ReineiraOS ventures. React 19 + TypeScript + Vite + Zustand + TanStack Router +
TailwindCSS + ZeroDev smart accounts.

## Web3 Integration

- **ZeroDev** — ERC-4337 smart accounts with passkey authentication
- **Auth flow:** Passkey register/login → SIWE signing → backend JWT
- **User operations** via bundler, not traditional signed transactions
- **Session keys** for delegated signing

## Key Layers

| Layer      | Path              | Purpose                                 |
| ---------- | ----------------- | --------------------------------------- |
| Pages      | `src/pages/`      | Route pages with auth layouts           |
| Router     | `src/router/`     | TanStack Router, file-based routing     |
| Stores     | `src/stores/`     | Zustand stores (zerodev, auth, loading) |
| Services   | `src/services/`   | Static async classes wrapping Axios     |
| Hooks      | `src/hooks/`      | Reusable React hooks                    |
| Components | `src/components/` | UI primitives + feature components      |

## Status

Scaffold — production code will be populated from Privara.
