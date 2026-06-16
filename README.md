# FBCA NestJS Example

Companion code for the Habr series **"Feature Based Clean Architecture (FBCA) for NestJS"**:

1. [Эволюция NestJS-приложения в неподдерживаемое состояние](https://habr.com/ru/articles/1038240/)
2. [Декомпозиция на сервисы: анализ ограниченности подхода](https://habr.com/ru/articles/1038416/)
3. [Архитектурный риск циклов в NestJS: ROI решений на горизонте пяти лет](https://habr.com/ru/articles/1038426/)
4. [FBCA: формализация границ ответственности в NestJS-модуле](https://habr.com/ru/articles/1038438/)
5. Масштабирование FBCA и теоретико-графовый анализ зависимостей

This repository is a small but complete API (`users`, `auth`, `follows`) that applies FBCA end to end and, most importantly, **demonstrates how FBCA removes the `users ↔ follows` dependency cycle** that the first three articles describe.

---

## The four layers

Every feature module is split into the same four layers, and dependencies only ever flow **inward**:

```
presentation ──▶ use-case ──▶ infrastructure ──▶ domain
      └──────────▶ external (own or a neighbour's) ──┘
```

| Layer | Responsibility | Knows about | Must NOT know about |
| --- | --- | --- | --- |
| `domain` | Pure business types & rules | nothing | frameworks, ORM, HTTP |
| `infrastructure` | Repositories, ORM entities, JWT, hashing | own `domain` | other modules, HTTP |
| `use-case` | One handler = one operation; orchestration | own `domain` + own `infrastructure` + neighbours' **external** ports | HTTP |
| `presentation` | Controllers, DTOs, guards; maps results to HTTP | own `use-case` + any **external** port | repositories, entities |
| `external` | The module's **public port** | own `use-case` + own `domain` | other modules |

### `Result<T, E>` instead of throwing

Business logic never throws HTTP exceptions. Handlers and repositories return [`neverthrow`](https://github.com/supermacro/neverthrow)'s `Result<T, E>`, and **only the presentation layer** translates a typed error code into an HTTP status:

```ts
// use-case — transport-agnostic
async run(email, password): Promise<Result<AuthSession, SignInError>> { ... }

// presentation — the only place that knows HTTP
if (result.isErr()) {
  switch (result.error) {
    case 'INVALID_CREDENTIALS':
      throw new UnauthorizedException('Invalid email or password');
    default:
      throw new InternalServerErrorException();
  }
}
```

### The port (`external`)

A module exposes exactly one public surface — its `*ExternalService`, re-exported from `external/index.ts`. Neighbours import **only** that. They never see a repository, an entity, or an individual handler. This is the "artificial network boundary inside the monolith": you can refactor a module's internals, or extract it into a microservice, without touching callers.

---

## How FBCA kills the cycle

The articles' classic deadlock: `FollowsModule` needs the user (to validate a follow), and `UsersModule` needs follow data (to show counts on a profile). Naively, each module imports the other → a NestJS `forwardRef` cycle that only gets worse as a third module joins.

FBCA resolves it not with `forwardRef`, but by **placing each direction of the dependency in the right layer**:

| Direction | Where it lives | Why it's safe |
| --- | --- | --- |
| follows **needs** users (business rule) | `follows/use-case/follow-user` → `users/external` | It's a rule, so it belongs in a use-case, talking to the users **port**. |
| users **needs** follows (display only) | `users/presentation` → `follows/external` | It's pure presentation enrichment, and presentation is a **sink** — nothing imports it for data. |

Crucially, **neither external port imports the other**:

- `UsersExternalModule` imports only users' own use-cases.
- `FollowsExternalModule` imports only follows' own use-cases.

So the import graph is acyclic:

```
users/presentation ─▶ follows/external ─▶ follows/use-case(get-follow-counts) ─▶ follows/infra
follows/use-case(follow-user) ─▶ users/external ─▶ users/use-case ─▶ users/infra
auth/use-case ─▶ users/external
follows/presentation ─▶ auth/presentation (JwtAuthGuard, a cross-cutting sink)
```

No edge ever points back into an `external` port from the module it belongs to. No `forwardRef` anywhere in the codebase.

---

## Three levels of enforcement (Part 4)

1. **Convention** — the folder structure makes the intended dependency direction obvious in every diff.
2. **Linter** — [`eslint-plugin-boundaries`](https://github.com/javierbrea/eslint-plugin-boundaries) turns the rules into automated checks. See [`.eslintrc.js`](.eslintrc.js): each file is classified (`domain` / `infrastructure` / `use-case` / `external` / `presentation` / `shared`) by path, and illegal edges (e.g. presentation importing a repository, or a use-case importing a neighbour's `domain` instead of its `external` port) fail `npm run lint`.
3. **Review** — anything the linter can't express is caught on code review.

Try it: make `users.controller.ts` import `UserRepository` directly and run `npm run lint` — the boundary rule rejects it.

---

## Project layout

```
src/
├── shared/
│   └── database/                 # TypeORM connection only (no entities)
└── modules/
    ├── users/
    │   ├── domain/               # User
    │   ├── infrastructure/       # UserEntity (private), UserRepository
    │   ├── use-case/             # create-user, get-user-by-email, get-user-by-id
    │   ├── external/             # UsersExternalService  ← the port
    │   └── presentation/         # GET /users/:id  (reads follows/external)
    ├── auth/
    │   ├── domain/               # AuthSession
    │   ├── infrastructure/       # PasswordHasher, TokenService (JWT)
    │   ├── use-case/             # sign-up, sign-in, verify-token
    │   └── presentation/         # POST /auth/sign-up|sign-in, JwtAuthGuard
    └── follows/
        ├── domain/               # Follow, FollowCounts
        ├── infrastructure/       # FollowEntity (private), FollowRepository
        ├── use-case/             # follow-user (→ users/external), unfollow-user, get-follow-counts
        ├── external/             # FollowsExternalService  ← the port
        └── presentation/         # POST/DELETE /follows/:followeeId  (JwtAuthGuard)
```

Note that **one handler = one folder = one NestJS module**, and an ORM entity never leaves its `infrastructure/repositories` folder.

---

## Running it

Requires Node 20+ and a PostgreSQL instance.

```bash
npm install
cp .env.example .env        # adjust DB credentials to point at your Postgres
npm run start:dev
```

`DB_SYNCHRONIZE=true` (dev default) auto-creates the tables from the entities. Use migrations in production.

### Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/sign-up` | — | Register; returns `{ accessToken, user }` |
| `POST` | `/auth/sign-in` | — | Log in; returns `{ accessToken, user }` |
| `GET` | `/users/:id` | — | Public profile incl. follower/following counts |
| `POST` | `/follows/:followeeId` | Bearer | Follow a user |
| `DELETE` | `/follows/:followeeId` | Bearer | Unfollow a user |

### Quick smoke test

```bash
# 1. sign up two users
A=$(curl -s localhost:3000/auth/sign-up -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"password123","displayName":"Alice"}')
B=$(curl -s localhost:3000/auth/sign-up -H 'content-type: application/json' \
  -d '{"email":"b@example.com","password":"password123","displayName":"Bob"}')

TOKEN_A=$(echo "$A" | npx --yes json accessToken)   # or parse with jq
BOB_ID=$(echo "$B" | npx --yes json user.id)

# 2. Alice follows Bob
curl -s -X POST localhost:3000/follows/$BOB_ID -H "authorization: Bearer $TOKEN_A" -i

# 3. Bob's profile now reports 1 follower — users/presentation read it via follows/external
curl -s localhost:3000/users/$BOB_ID
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run start:dev` | Run with watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint **incl. FBCA boundary checks** |
