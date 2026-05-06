# Vitaxo Front — Dashboard Mutuelle

Application web de gestion pour une mutuelle santé. Espace administrateur et espace client, avec authentification, gestion des adhérents, contrats et sinistres.

---

## Table des matières

- [Stack technique](#stack-technique)
- [Architecture FSD](#architecture-fsd)
- [Structure des dossiers](#structure-des-dossiers)
- [Couches FSD — détail](#couches-fsd--détail)
- [Règles d'import](#règles-dimport)
- [Client HTTP (Axios)](#client-http-axios)
- [Gestion d'état (Zustand)](#gestion-détat-zustand)
- [Data fetching (TanStack Query)](#data-fetching-tanstack-query)
- [Formulaires & Validation (RHF + Zod)](#formulaires--validation-rhf--zod)
- [Composants UI](#composants-ui)
- [Conventions de nommage](#conventions-de-nommage)
- [Tests](#tests)
- [Scripts](#scripts)
- [Variables d'environnement](#variables-denvironnement)

---

## Stack technique

| Catégorie | Outil |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Routing | react-router-dom v6 |
| Data fetching | @tanstack/react-query |
| HTTP client | axios |
| State global | zustand |
| Forms | react-hook-form |
| Validation | zod |
| UI | shadcn/ui + tailwindcss |
| Charts | recharts |
| Dates | date-fns |
| Tests unitaires | vitest + @testing-library/react |
| Mock API | msw |
| Tests e2e | @playwright/test |

---

## Architecture FSD

Ce projet suit la **Feature-Sliced Design (FSD)** — une architecture modulaire organisée par couches et tranches (slices), pensée pour la scalabilité et la maintenabilité.

> Documentation officielle : [feature-sliced.design](https://feature-sliced.design/)
### Vue d'ensemble

![Concept](/docs/images/concept-fsd.jpg)
![FSD Overview](/docs/images/fsd-folders-and-slices.png)

### Principe fondamental

Le code est découpé en **couches** (layers), chaque couche en **tranches** (slices), chaque tranche en **segments** (ui, model, api, lib).

```
Couches (de haut en bas) :
┌─────────────────┐
│      app        │  Initialisation globale (providers, router)
├─────────────────┤
│     pages       │  Assemblage de widgets pour former une page
├─────────────────┤
│    widgets      │  Blocs UI composites réutilisables
├─────────────────┤
│    features     │  Actions et interactions utilisateur
├─────────────────┤
│    entities     │  Entités métier (User, Policy, Claim...)
├─────────────────┤
│     shared      │  Infrastructure partagée (api, ui, hooks, lib)
└─────────────────┘
```

**Règle absolue** : une couche ne peut importer que depuis les couches **en dessous d'elle**, jamais au-dessus.

---

## Structure des dossiers

```
src/
│
├── app/
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   ├── router-provider.tsx
│   │   └── index.tsx
│   ├── router/
│   │   ├── routes.tsx
│   │   └── guards/
│   │       ├── auth-guard.tsx
│   │       └── role-guard.tsx
│   ├── styles/
│   │   └── globals.css
│   └── index.tsx
│
├── pages/
│   ├── login/
│   │   ├── ui/login-page.tsx
│   │   └── index.ts
│   ├── register/
│   │   ├── ui/register-page.tsx
│   │   └── index.ts
│   ├── dashboard-admin/
│   │   ├── ui/
│   │   │   ├── dashboard-admin-page.tsx
│   │   │   └── overview-tab.tsx
│   │   └── index.ts
│   └── dashboard-client/
│       ├── ui/
│       │   ├── dashboard-client-page.tsx
│       │   └── my-contract-tab.tsx
│       └── index.ts
│
├── widgets/
│   ├── header/
│   │   ├── ui/
│   │   │   ├── header.tsx
│   │   │   └── user-nav.tsx
│   │   └── index.ts
│   ├── sidebar/
│   │   ├── ui/
│   │   │   ├── sidebar.tsx
│   │   │   ├── sidebar-admin.tsx
│   │   │   └── sidebar-client.tsx
│   │   └── index.ts
│   ├── stats-overview/
│   │   ├── ui/stats-overview.tsx
│   │   └── index.ts
│   ├── claims-table/
│   │   ├── ui/
│   │   │   ├── claims-table.tsx
│   │   │   └── claims-columns.tsx
│   │   └── index.ts
│   └── contract-card/
│       ├── ui/contract-card.tsx
│       └── index.ts
│
├── features/
│   ├── auth/
│   │   ├── ui/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── model/
│   │   │   ├── auth-store.ts
│   │   │   └── auth-schema.ts
│   │   ├── api/
│   │   │   ├── auth-api.ts
│   │   │   └── auth-queries.ts
│   │   └── index.ts
│   ├── claim-submit/
│   │   ├── ui/claim-submit-form.tsx
│   │   ├── model/claim-schema.ts
│   │   ├── api/claim-submit-api.ts
│   │   └── index.ts
│   ├── member-management/
│   │   ├── ui/
│   │   │   ├── member-create-dialog.tsx
│   │   │   └── member-edit-form.tsx
│   │   ├── model/member-schema.ts
│   │   ├── api/member-api.ts
│   │   └── index.ts
│   └── user-settings/
│       ├── ui/settings-form.tsx
│       ├── model/settings-schema.ts
│       └── index.ts
│
├── entities/
│   ├── user/
│   │   ├── model/
│   │   │   ├── user.types.ts
│   │   │   └── user-store.ts
│   │   ├── api/user-api.ts
│   │   ├── ui/user-avatar.tsx
│   │   └── index.ts
│   ├── policy/
│   │   ├── model/policy.types.ts
│   │   ├── api/policy-api.ts
│   │   ├── ui/policy-badge.tsx
│   │   └── index.ts
│   ├── claim/
│   │   ├── model/claim.types.ts
│   │   ├── api/claim-api.ts
│   │   ├── ui/claim-status-badge.tsx
│   │   └── index.ts
│   └── member/
│       ├── model/member.types.ts
│       ├── api/member-api.ts
│       └── index.ts
│
└── shared/
    ├── api/
    │   ├── axios-instance.ts
    │   └── query-keys.ts
    ├── config/
    │   ├── env.ts
    │   └── constants.ts
    ├── hooks/
    │   ├── use-debounce.ts
    │   └── use-pagination.ts
    ├── lib/
    │   ├── cn.ts
    │   ├── format-date.ts
    │   └── format-currency.ts
    ├── types/
    │   ├── api.types.ts
    │   └── common.types.ts
    └── ui/
        ├── button/
        ├── input/
        ├── data-table/
        ├── page-header/
        └── status-badge/
```

---

## Couches FSD — détail

### `app/` — Initialisation globale

Point d'entrée de l'application. Contient uniquement :
- La composition des providers React (QueryClient, Router, Theme)
- La définition des routes et des guards de navigation
- Les styles globaux

Ne contient **aucune logique métier**.

### `pages/` — Pages

Chaque page assemble des **widgets** pour former un écran complet. Une page ne contient pas de logique directe : elle orchestre des widgets.

```tsx
// pages/dashboard-admin/ui/dashboard-admin-page.tsx
export const DashboardAdminPage = () => (
  <MainLayout>
    <StatsOverview />
    <ClaimsTable />
  </MainLayout>
)
```

### `widgets/` — Blocs composites

Blocs UI autonomes et réutilisables qui combinent features et entities. Un widget peut avoir son propre état local mais ne gère pas de logique métier complexe.

Exemples : `Sidebar`, `Header`, `StatsOverview`, `ClaimsTable`.

### `features/` — Actions utilisateur

Tout ce qui représente une **interaction utilisateur** : soumettre un formulaire, filtrer une liste, changer un statut. Chaque feature contient :

- `ui/` — composants React de la feature
- `model/` — store Zustand local + schémas Zod
- `api/` — appels axios + hooks TanStack Query (useQuery, useMutation)
- `index.ts` — API publique de la feature (exports explicites)

### `entities/` — Entités métier

Représentation des données du domaine (User, Policy, Claim, Member). Chaque entité contient :

- `model/` — types TypeScript + store Zustand si l'entité a un état global
- `api/` — fonctions de fetch brutes (pas de hooks Query ici, seulement axios)
- `ui/` — micro-composants d'affichage (badge, avatar, tag de statut)
- `index.ts` — API publique

### `shared/` — Infrastructure

Code sans dépendance vers le reste du projet. N'importe quelle couche peut l'utiliser. Contient :

- `api/` — instance axios configurée + clés Query centralisées
- `config/` — variables d'environnement typées et constantes
- `hooks/` — hooks génériques (debounce, pagination)
- `lib/` — fonctions utilitaires pures (formatage, calculs)
- `types/` — types génériques (ApiResponse, Pagination...)
- `ui/` — composants shadcn + composants custom partagés

---

## Règles d'import

```
app     → peut importer : pages, widgets, features, entities, shared
pages   → peut importer : widgets, features, entities, shared
widgets → peut importer : features, entities, shared
features→ peut importer : entities, shared
entities→ peut importer : shared
shared  → ne peut rien importer du projet
```

**Interdit :**
- `shared` qui importe depuis `entities` ou plus haut
- `entities` qui importe depuis `features`
- `features` qui importe depuis `widgets` ou `pages`
- Deux slices de la même couche qui s'importent entre elles (ex: `features/auth` → `features/claim-submit`)

**Utiliser les alias de chemin :**

```ts
// tsconfig / vite.config
'@/*' → './src/*'

// Usage
import { useAuthStore } from '@/entities/user'
import { api } from '@/shared/api/axios-instance'
```

**Toujours importer depuis le `index.ts` public d'une slice**, jamais directement dans ses fichiers internes :

```ts
// Correct
import { LoginForm } from '@/features/auth'

// Interdit
import { LoginForm } from '@/features/auth/ui/login-form'
```

---

## Client HTTP (Axios)

Le client HTTP est défini une seule fois dans `shared/api/axios-instance.ts`. Aucun autre fichier ne crée d'instance axios.

```ts
// shared/api/axios-instance.ts
import axios from 'axios'
import { env } from '@/shared/config/env'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor : injecte le token Bearer automatiquement
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor : gère l'expiration du token (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

Les fonctions d'appel API dans chaque couche utilisent toujours cette instance :

```ts
// entities/claim/api/claim-api.ts
import { api } from '@/shared/api/axios-instance'
import type { Claim } from '../model/claim.types'

export const fetchClaims = (filters: ClaimFilters) =>
  api.get<Claim[]>('/claims', { params: filters }).then((r) => r.data)

export const fetchClaimById = (id: string) =>
  api.get<Claim>(`/claims/${id}`).then((r) => r.data)
```

Les **hooks TanStack Query** (useQuery, useMutation) sont dans les `features`, pas dans les `entities` :

```ts
// features/claim-submit/api/claim-submit-api.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitClaim } from '@/entities/claim'
import { queryKeys } from '@/shared/api/query-keys'

export const useSubmitClaim = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: submitClaim,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.claims.all }),
  })
}
```

---

## Gestion d'état (Zustand)

- **État global persistant** (session auth, préférences) → store dans `entities/user/model/`
- **État local d'une feature** → store dans `features/<name>/model/`
- Utiliser le middleware `persist` uniquement pour les données qui doivent survivre au rechargement (token, préférences utilisateur)

```ts
// entities/user/model/user-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: User | null
  setSession: (token: string, user: User) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clear: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

---

## Data fetching (TanStack Query)

Toutes les clés de cache sont centralisées dans `shared/api/query-keys.ts` :

```ts
// shared/api/query-keys.ts
export const queryKeys = {
  claims: {
    all: ['claims'] as const,
    list: (filters: object) => ['claims', 'list', filters] as const,
    detail: (id: string) => ['claims', 'detail', id] as const,
  },
  members: {
    all: ['members'] as const,
    list: (filters: object) => ['members', 'list', filters] as const,
    detail: (id: string) => ['members', 'detail', id] as const,
  },
  policies: {
    all: ['policies'] as const,
    byMember: (memberId: string) => ['policies', memberId] as const,
  },
}
```

---

## Formulaires & Validation (RHF + Zod)

Les schémas Zod sont dans `model/` de la feature ou de l'entité. Les types sont inférés depuis le schéma, jamais dupliqués.

```ts
// features/auth/model/auth-schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

```tsx
// features/auth/ui/login-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '../model/auth-schema'

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })
  // ...
}
```

---

## Composants UI

Les composants shadcn/ui sont dans `shared/ui/`. Ne jamais utiliser un composant shadcn directement depuis `node_modules` dans une feature ou widget — toujours passer par `shared/ui`.

Les composants custom partagés (ex: `DataTable`, `PageHeader`, `StatusBadge`) sont également dans `shared/ui/` et suivent la même structure que les slices FSD :

```
shared/ui/data-table/
├── ui/
│   ├── data-table.tsx
│   └── data-table-pagination.tsx
└── index.ts
```

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Fichiers composants | kebab-case | `login-form.tsx` |
| Fichiers utilitaires | kebab-case | `format-date.ts` |
| Fichiers de types | kebab-case + `.types.ts` | `user.types.ts` |
| Composants React | PascalCase | `LoginForm` |
| Hooks | camelCase + préfixe `use` | `useAuthStore` |
| Fonctions API | camelCase | `fetchClaims`, `createMember` |
| Stores Zustand | camelCase + suffixe `Store` | `useAuthStore` |
| Schémas Zod | camelCase + suffixe `Schema` | `loginSchema` |
| Types inférés Zod | PascalCase + suffixe `Values` | `LoginFormValues` |
| Query keys | camelCase dans objet `queryKeys` | `queryKeys.claims.list(...)` |

---

## Tests

### Structure

```
src/features/auth/
└── __tests__/
    ├── login-form.test.tsx    # test composant UI
    └── auth-queries.test.ts   # test hooks Query avec MSW

tests/
└── e2e/
    ├── login.spec.ts
    └── dashboard.spec.ts
```

### Stack de test

- **vitest** — runner rapide (compatible Vite)
- **@testing-library/react** — test des composants React
- **@testing-library/user-event** — simulation d'interactions
- **msw** — mock des appels HTTP au niveau Service Worker (pas de mock axios)
- **@playwright/test** — tests end-to-end
- **@vitest/coverage-v8** — couverture de code

### Principes

- Tester le comportement, pas l'implémentation
- Mocker l'API via MSW, jamais en stubant axios directement
- Les tests unitaires couvrent les schémas Zod, les fonctions `lib/`, les stores Zustand
- Les tests d'intégration couvrent les features complètes (form → submit → réponse API mockée)
- Les tests e2e couvrent les parcours critiques : connexion, dépôt sinistre, navigation admin/client

---

## Scripts

```bash
pnpm dev          # serveur de développement
pnpm build        # build production (tsc + vite build)
pnpm preview      # prévisualisation du build
pnpm lint         # ESLint
pnpm test         # vitest (watch mode)
pnpm test:run     # vitest (one-shot, CI)
pnpm test:e2e     # playwright
pnpm coverage     # rapport de couverture
```

---

## Variables d'environnement

```env
# .env.local
VITE_API_URL=http://localhost:3000/api
```

Les variables sont validées au démarrage via zod dans `shared/config/env.ts` :

```ts
// shared/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
})

export const env = envSchema.parse(import.meta.env)
```

Si une variable est manquante ou invalide, l'application **crash au démarrage** avec un message explicite.
