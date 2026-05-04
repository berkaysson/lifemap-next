# Jest Testing Strategy — LifeMap Next (80% Coverage, No UI)

## Overview

Your project has four distinct, testable non-UI layers. The strategy prioritizes pure/logic-heavy code first (highest ROI), then
moves to integration-style tests for service and action layers using mocks.

```
Priority   Layer                 What to Mock         Expected Coverage Contribution
─────────  ────────────────────  ───────────────────  ──────────────────────────────
🔴 HIGH    src/helpers/          Nothing (pure logic)  ~25%
🔴 HIGH    src/schema.ts         Nothing (pure logic)  ~10%
🟠 MEDIUM  src/services/         prisma mock           ~30%
🟠 MEDIUM  src/actions/          prisma + auth mocks   ~15%
🟡 LOW     src/lib/ utilities    Nothing/light mocks  ~10%
```

---

## Layer-by-Layer Breakdown

### 1. `src/helpers/` — Highest Priority (Pure Logic)

These are your **best tests to write first** because many functions are pure or near-pure.

#### `helpers/note.ts` — 100% pure, no DB
- `extractMentionsFromJSON`: test with flat doc, nested doc, duplicate mentions, missing `id` attr, nodes with no `.content`
- `getContentPreview`: test truncation at `maxLength`, string passthrough, empty/null input, `@mention` label extraction

#### `helpers/habit.ts` — Mix of pure and DB-dependent
**Pure functions (mock nothing):**
- `calculateIsHabitCompleted`: all progresses completed → `true`; one incomplete → `false`; empty array edge case
- `calculateTotalDurationForDateRange` (private but indirectly tested via `calculateProgress`): activities before range not counted, activities on boundary included
- `validateHabitPeriodAndDate`: periods < 2 → fail; periods > 90 → fail; end date > 1 year from start → fail; valid input → success
- `getEndDate` (implicitly via `calculateProgress`): correct date offset for DAILY / WEEKLY / MONTHLY / unknown

**DB functions — mock `prisma`:**
- `calculateProgress`: mock nothing — it receives `activities[]` as arg, so it is testable by passing fixture data directly
- `calculateStreaks`: streak resets correctly on gap; bestStreak persists through resets
- `updateHabitsCompletedDurationByActivityDate`: mock `prisma.habitProgress.findMany` and `prisma.habitProgress.update`; verify `newlyCompletedCount` returned correctly
- `updateHabitCompleted`: mock `prisma.habitProgress.findMany` + `prisma.habit.update`; verify it calls update with correct `completed`, `currentStreak`, `bestStreak`

#### `helpers/task.ts`
- `updateTasksCompletedDurationByActivityDate`: mock `prisma.task.findMany` + `prisma.task.update`; verify `newlyCompletedCount` and that tasks with no change are NOT sent to update (`filter(null)`)

#### `helpers/category.ts`
- `checkIsCategoryExistsByCategoryId`: mock `prisma.category.findFirst` → null (false) / object (true)
- `checkIsCategoryExistByCategoryName`: same pattern
- `checkIsCategoryUsed`: mock all three prisma calls (`activity`, `task`, `habit`) with all-null → `true`; any one non-null → `false`

#### `helpers/tokens.ts`
- `generateVerificationToken`: mock `uuid`, `prisma.verificationToken.delete`, `prisma.verificationToken.create`; verify it deletes existing token before creating; verify expiry is ~1 hour
- `generateResetPasswordToken`: same pattern

#### `helpers/user.ts`, `helpers/activity.ts`, etc.
- These are typically thin wrappers around `prisma.xxx.findFirst/findMany`
- Test null return (user not found), happy path return

---

### 2. `src/schema.ts` — High Priority (Zero deps, pure Zod)

Zod schemas are extremely easy to test and give you **free coverage** with high confidence.

- **`LoginSchema`**: invalid email formats, missing password, empty fields
- **`RegisterSchema`**: password regex rules — missing uppercase, missing number, missing special char; valid pass
- **`passwordSchema`**: each rule independently (min length, lowercase, uppercase, digit, special char)
- **`TodoSchema`**: past `endDate` should fail the `.refine()`, future date passes
- **`TaskSchema`**: `startDate >= endDate` cross-field `.refine()` fails; all fields valid passes
- **`HabitSchema`**: `numberOfPeriods` below 2, above 90 (mirrors your `validateHabitPeriodAndDate` logic in schema layer too)
- **`NoteSchema`**: optional fields absent and present; `mentions` with invalid `entityType` enum value

> **Pattern:** For each schema, have at least one "happy path" test and one test per validation rule/refine.

---

### 3. `src/services/` — Medium Priority (Mock Prisma)

Services coordinate DB + helpers. Use **`jest.mock('@/lib/prisma')`** (manual mock or `jest-mock-extended`).

#### `services/archivingService.ts`
- `archiveOutdatedEntities`: when last run < 24h ago → returns early without archiving; when last run > 24h → calls `archiveTask` and `archiveHabit` for each outdated entity; `prisma` errors → returns `success: false`
- `getLastExecutionTime`: returns `null` on no record; returns `Date` on record; handles prisma error gracefully
- `getArchiveStats`: verify it returns correct totals; handles prisma error

#### `services/habit/createHabit.ts`
- Invalid schema input → `{ success: false, message: "Invalid fields!" }`
- Category not found → returns error
- `startDate >= endDate` → returns error
- `validateHabitPeriodAndDate` returns failure → propagates
- Happy path: prisma calls happen, streaks updated if needed
- `createHabitProgresses` returns empty array → returns failure

> **Important:** The services call `calculateProgress` from `helpers/habit` — you can either let it run (since it's testable) or mock the helper module to keep unit tests isolated.

#### `services/habit/archiveHabits.ts`, `services/task/archiveTask.ts`
- Mock prisma; verify archived entity is created and original is deleted

---

### 4. `src/actions/` — Medium Priority (Mock Prisma + Auth)

Server Actions are similar to services but also depend on `next-auth`.

#### `actions/login.ts`
- Invalid schema → `{ success: false }`
- User not found → `{ success: false, message: "Invalid credentials!" }`
- No password on user → `{ success: false }`
- Wrong password (bcrypt mock returns `false`) → `{ success: false }`
- Email not verified → sends verification email, returns confirmation message
- Valid credentials, `signIn` succeeds → calls `archiveOutdatedEntities`, returns success
- `signIn` throws `CredentialsSignin` AuthError → returns invalid credentials error
- `signIn` throws unknown AuthError → returns generic auth error

#### `actions/register.ts`
- Duplicate email → error; new email → creates user and sends verification

#### `actions/reset.ts` / `actions/new-password.ts`
- Token expired → fail; valid token → password updated

#### `actions/new-verification.ts`
- Token not found → fail; token expired → fail; valid → marks `emailVerified`

---

### 5. `src/lib/` Utilities

Check for pure utility functions (e.g. `time.ts` likely has `parseDate`, `removeOneDay`, `calculateEndDateWithPeriod`). These are zero-dependency and easy to test.

- `removeOneDay`: verify it subtracts exactly 1 day
- `calculateEndDateWithPeriod`: for each `Period` enum value, verify the date offset
- `checkIsStartDateBeforeEndDate`: before → true; same → false; after → false

---

## Mocking Strategy

| Dependency | How to Mock |
|---|---|
| `prisma` | `jest.mock('@/lib/prisma')` with `jest-mock-extended` for type safety |
| `bcryptjs` | `jest.mock('bcryptjs')` — control `compare` return |
| `next-auth` | `jest.mock('@/auth')` — control `signIn` |
| `uuid` | `jest.mock('uuid')` — return deterministic token string |
| `date-fns` | **Don't mock** — use real date-fns with controlled input `Date` objects |
| `sendVerificationEmail` | `jest.mock('@/lib/mail')` |

---

## File Structure

```
src/
└── __tests__/
    ├── helpers/
    │   ├── note.test.ts
    │   ├── habit.test.ts
    │   ├── task.test.ts
    │   ├── category.test.ts
    │   ├── tokens.test.ts
    │   └── user.test.ts
    ├── schema.test.ts
    ├── services/
    │   ├── archivingService.test.ts
    │   ├── habit/
    │   │   └── createHabit.test.ts
    │   └── ...
    ├── actions/
    │   ├── login.test.ts
    │   ├── register.test.ts
    │   └── ...
    └── lib/
        └── time.test.ts
```

---

## Coverage Targets by Layer

| Layer | Target | Rationale |
|---|---|---|
| `helpers/note.ts` | 100% | Pure functions, trivially testable |
| `schema.ts` | 100% | Pure Zod, free coverage |
| `helpers/habit.ts` | 85%+ | Mix of pure + mocked DB |
| `helpers/task.ts` | 90%+ | DB mocked, simple logic |
| `helpers/category.ts` | 90%+ | Thin prisma wrappers |
| `services/` | 80%+ | Service layer with mocks |
| `actions/` | 75%+ | Auth + DB mocked |
| `lib/time.ts` | 90%+ | Pure date utilities |

---

## Order of Implementation

1. **`schema.test.ts`** — Quick wins, zero setup, familiarizes you with the test runner
2. **`helpers/note.test.ts`** — Pure functions, deepens TipTap JSON tree understanding
3. **`helpers/habit.test.ts`** (pure functions only first) — `validateHabitPeriodAndDate`, `calculateIsHabitCompleted`
4. **`lib/time.test.ts`** — Foundational utilities tested before services that use them
5. **`helpers/habit.test.ts`** (with prisma mock) — Complete the helper tests
6. **`helpers/task.test.ts`**, **`helpers/category.test.ts`**, **`helpers/tokens.test.ts`**
7. **`services/archivingService.test.ts`** — Medium complexity
8. **`services/habit/createHabit.test.ts`** — Most complex service
9. **`actions/login.test.ts`** — Most scenarios to cover, finish with actions

> Following this order means you reach ~50% coverage by step 4, and 80%+ by step 9.

---

## Key Industry Principles to Follow

- **Arrange-Act-Assert (AAA)**: Every test has clear setup, execution, and assertion sections
- **One assertion concept per test**: Don't combine unrelated assertions in one `it()`
- **Mock at the boundary**: Mock `prisma` and external services, never mock internal pure functions
- **Test the specification, not the implementation**: Assert what comes out, not how it was computed
- **Descriptive test names**: `it('returns false when category is used by a task')` not `it('works')`
- **Avoid test interdependency**: Each test must be runnable in isolation (`beforeEach` to reset mocks)
- **Use `describe` blocks** to group by function name, with sub-groups for scenarios

---

## Current Coverage Progress (Status: May 2026)

| Layer | Weight | Status | Est. Coverage | Coverage Gap |
|---|---|---|---|---|
| **`src/helpers/`** | 25% | 🟢 COMPLETED | **95%** | Minor getters (`verification-token.ts`) |
| **`src/schema.ts`** | 10% | 🟢 COMPLETED | **100%** | None |
| **`src/lib/`** | 10% | 🟡 PARTIAL | **30%** | `mail.ts`, `utils.ts` pending |
| **`src/services/`** | 30% | 🔴 PENDING | **0%** | All services pending |
| **`src/actions/`** | 15% | 🔴 PENDING | **0%** | All server actions pending |
| **`src/lib/ utilities`** | 10% | 🟢 COMPLETED | **100%** | `time.ts` utilities |

### **Total Progress: ~45% of Final Target**

**Next Steps Milestone:**
- [ ] Implement `services/archivingService.test.ts`
- [ ] Implement `services/habit/createHabit.test.ts`
- [ ] Implement `actions/login.test.ts`
