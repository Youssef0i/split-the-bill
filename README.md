# Split the Bill

Mobile Application Development project. React Native + Expo + TypeScript + NativeWind.
Split group expenses (trips, outings) and see who owes whom. See `docs/product-brief.md`.

## Run it

```bash
npm install
npx expo start --clear
```

Scan the QR code with **Expo Go** (phone and laptop on the same Wi-Fi).

```bash
npm test          # 3 unit tests (split calculator)
npm run typecheck # TypeScript check
```

## Architecture decisions

### Pattern: MVVM inside feature folders

| Layer | Where | Role |
|---|---|---|
| Model | `src/models`, `src/services/storage.ts`, `src/context` | Data types, local storage (AsyncStorage), shared app state |
| ViewModel | `src/features/*/hooks` | Screen state, validation, calls to the context |
| View | `src/features/*/screens`, `src/components/ui` | UI only (NativeWind), reads a ViewModel hook |
| Domain logic | `src/lib/splitCalculator.ts` | Pure split/balance maths, unit tested |

Data flow: **Screen → hook (ViewModel) → AppContext → storage**. Screens never touch storage.

### Folder structure (feature-based)

```
src/
  app/            App.tsx (entry)
  navigation/     AppNavigator.tsx, types.ts (typed routes)
  components/ui/  AppButton, Card, Chip, Avatar, HeroCard, StateViews (no business data)
  features/
    groups/       screens/, hooks/   (Member A)
    expenses/     screens/, hooks/   (Member B)
    settlements/  screens/, hooks/   (Member C)
  context/        AppContext.tsx (shared state)
  lib/            splitCalculator.ts, selectGroup.ts, categories.ts
  models/         types.ts
  services/       storage.ts
  theme/          tokens.ts
```

Rules: features may import shared code (`@/components`, `@/lib`, ...); shared code never imports a
feature. Inside a feature use `./` or `../`; across boundaries use the `@/` alias.

### Navigation

React Navigation native **stack** with typed routes in `src/navigation/types.ts`.
Routes pass only small ids (`groupId`), and the screen reads the rest from the context.

### Design tokens

Colors and spacing live in `src/theme/tokens.ts` and the same values in `tailwind.config.js`,
so NativeWind classes (`bg-primary`, `text-ink`, `text-muted`, `border-line`) stay consistent.
Every screen has **loading, empty and error** states (`@/components/ui/StateViews`).

### Environments

`app.config.ts` gives development, staging and production different names and bundle ids
(`APP_VARIANT`), `eas.json` has one build profile per environment, and `.env.example` documents
public values. No secrets are committed (`.env` is in `.gitignore`).

## Screens

| Member | Screens | Status |
|---|---|---|
| A | Home, Create Group, Group Details (+ delete group) | Done |
| B | Add / Edit Expense, Expense Details, Statistics | Done |
| C | Balances, Record Payment, Payment History | Done |

### Adding a screen

1. Create `src/features/<feature>/screens/MyScreen.tsx` (UI with NativeWind `className`).
2. Put its logic in `src/features/<feature>/hooks/useMyScreen.ts`.
3. Add the route to `src/navigation/types.ts` and a `Stack.Screen` in `AppNavigator.tsx`.

## Git workflow

```bash
git switch <your-branch>
git add .
git commit -m "Add Balances screen" --author="Full Name <github-email>"
git push origin <your-branch>
```
