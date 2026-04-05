# @reineira-os/modules-backend

Backend API starter for ReineiraOS ventures. TypeScript, Clean Architecture (DDD), Vercel-ready,
DB-agnostic.

## Architecture

| Layer          | Path                  | Rule                                                |
| -------------- | --------------------- | --------------------------------------------------- |
| Domain         | `src/domain/`         | Business entities, value objects. No external deps. |
| Application    | `src/application/`    | Use cases, DTOs, mappers. Orchestrates domain.      |
| Infrastructure | `src/infrastructure/` | Repository implementations, external clients.       |
| Interface      | `src/interface/`      | API handlers. Thin — delegates to application.      |
| Core           | `src/core/`           | Cross-cutting: logging, errors, config.             |

## Status

Scaffold — production code will be populated from Privara.
