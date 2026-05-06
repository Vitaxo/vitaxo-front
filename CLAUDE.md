# Instructions pour agents IA — Vitaxo Front

Ce fichier définit les règles **non négociables** que tout agent IA doit respecter lorsqu'il travaille sur ce projet. Lire intégralement avant toute modification de code.

---

## Architecture obligatoire : Feature-Sliced Design (FSD)

Ce projet suit strictement l'architecture **Feature-Sliced Design**. Toute modification, ajout de composant, hook, fonction ou type doit respecter cette architecture.

### Les 6 couches (ordre strict, de haut en bas)

```
app → pages → widgets → features → entities → shared
```

### Règle d'import absolue

Une couche ne peut importer que depuis les couches **en dessous** d'elle dans la hiérarchie ci-dessus.

```
app     → peut importer : pages, widgets, features, entities, shared
pages   → peut importer : widgets, features, entities, shared
widgets → peut importer : features, entities, shared
features→ peut importer : entities, shared
entities→ peut importer : shared uniquement
shared  → n'importe rien du projet
```

**Ne jamais faire :**
- `shared` qui importe depuis `entities`, `features`, `widgets`, `pages`, ou `app`
- `entities` qui importe depuis `features`, `widgets`, `pages`, ou `app`
- `features` qui importe depuis `widgets`, `pages`, ou `app`
- Une slice qui importe depuis une autre slice de la même couche (ex: `features/auth` → `features/member-management`)

---

## Où placer le code — décisions obligatoires

### Un appel API (fonction axios) → `[layer]/[slice]/api/[slice]-api.ts`

```ts
// entities/claim/api/claim-api.ts   ← fonction de fetch brute
export const fetchClaims = (filters) =>
  api.get<Claim[]>('/claims', { params: filters }).then((r) => r.data)
```

Jamais d'appel axios dans un composant, un store, ou une page directement.

### Un hook TanStack Query (useQuery / useMutation) → `features/[slice]/api/[slice]-queries.ts`

```ts
// features/claim-submit/api/claim-submit-api.ts
export const useSubmitClaim = () =>
  useMutation({ mutationFn: submitClaim })
```

Les hooks Query vivent dans les `features`, **pas dans les `entities`**.

### Un store Zustand → `[layer]/[slice]/model/[slice]-store.ts`

- État global persistant (session, token) → `entities/user/model/user-store.ts`
- État local d'une feature → `features/[slice]/model/[slice]-store.ts`

### Un type TypeScript métier → `[entity]/model/[entity].types.ts`

```ts
// entities/claim/model/claim.types.ts
export type Claim = { id: string; status: ClaimStatus; ... }
```

### Un type générique (ApiResponse, Pagination) → `shared/types/`

### Un schéma Zod → `[feature]/model/[feature]-schema.ts`

Toujours inférer le type TypeScript depuis le schéma Zod, ne jamais dupliquer :

```ts
export const loginSchema = z.object({ ... })
export type LoginFormValues = z.infer<typeof loginSchema>  // ← inférence, pas re-déclaration
```

### Une fonction utilitaire pure → `shared/lib/[nom].ts`

```ts
// shared/lib/format-date.ts
export const formatDate = (date: Date) => format(date, 'dd/MM/yyyy', { locale: fr })
```

Pas de logique métier dans `shared/lib/`. Fonctions pures uniquement (entrée → sortie, sans effets de bord).

### Un composant UI partagé → `shared/ui/[component-name]/`

### Un composant UI d'une feature → `features/[slice]/ui/`

### Un micro-composant d'affichage d'entité (badge, tag) → `entities/[slice]/ui/`

---

## Client HTTP — règles strictes

**Une seule instance axios** existe dans tout le projet : `shared/api/axios-instance.ts`.

- Ne jamais créer une nouvelle instance `axios.create()` ailleurs
- Ne jamais importer `axios` directement dans une feature, entity, widget ou page
- Toujours importer `{ api }` depuis `@/shared/api/axios-instance`

```ts
// Correct
import { api } from '@/shared/api/axios-instance'

// Interdit — ne jamais faire ça dans une feature/entity
import axios from 'axios'
const response = await axios.get('/claims')
```

---

## Query Keys — règles strictes

Toutes les clés TanStack Query sont centralisées dans `shared/api/query-keys.ts`.

- Ne jamais écrire une clé query en dur dans un hook (`['claims']` dans un fichier feature)
- Toujours référencer depuis `queryKeys.claims.list(...)` etc.
- Quand on ajoute un nouvel endpoint, ajouter sa clé dans `query-keys.ts` d'abord

---

## Exports publics — API publique des slices

Chaque slice expose son API publique **uniquement** via son fichier `index.ts`. Les imports depuis l'intérieur d'une slice sont interdits en dehors d'elle.

```ts
// Correct
import { LoginForm, useLogin } from '@/features/auth'

// Interdit
import { LoginForm } from '@/features/auth/ui/login-form'
import { useLogin } from '@/features/auth/api/auth-queries'
```

Quand on crée un nouveau fichier dans une slice, exporter ce qu'il faut depuis `index.ts`.

---

## Alias de chemin

Utiliser systématiquement l'alias `@/` pour les imports internes, jamais de chemins relatifs remontants (`../../`).

```ts
// Correct
import { api } from '@/shared/api/axios-instance'
import { useAuthStore } from '@/entities/user'

// Interdit
import { api } from '../../shared/api/axios-instance'
```

---

## Conventions de nommage obligatoires

| Élément | Convention | Exemple |
|---|---|---|
| Fichiers | kebab-case | `login-form.tsx`, `user.types.ts` |
| Composants React | PascalCase | `LoginForm`, `ClaimsTable` |
| Hooks | `use` + PascalCase | `useAuthStore`, `useSubmitClaim` |
| Fonctions API (axios) | `fetch`/`create`/`update`/`delete` + entité | `fetchClaims`, `createMember` |
| Stores | `use` + PascalCase + `Store` | `useAuthStore` |
| Schémas Zod | camelCase + `Schema` | `loginSchema` |
| Types inférés Zod | PascalCase + `Values` | `LoginFormValues` |
| Fichiers de types | `[entité].types.ts` | `claim.types.ts` |

---

## Ce qu'il ne faut jamais faire

- Mettre de la logique dans une `page/` — une page assemble des widgets, rien d'autre
- Appeler axios dans un composant React directement
- Créer une deuxième instance axios
- Écrire des clés query en dur dans les hooks
- Dupliquer un type TypeScript qui peut être inféré depuis un schéma Zod
- Importer depuis l'intérieur d'une slice (bypasser `index.ts`)
- Importer une couche supérieure depuis une couche inférieure
- Importer une slice depuis une autre slice de la même couche
- Mettre de la logique métier dans `shared/`
- Créer un nouveau dossier en dehors des 6 couches FSD

---

## Avant d'ajouter du code — checklist

1. Dans quelle couche appartient ce code ? (app / pages / widgets / features / entities / shared)
2. Dans quelle slice de cette couche ?
3. Dans quel segment ? (ui / model / api / lib)
4. Est-ce que ce fichier doit exporter depuis `index.ts` ?
5. Est-ce que les imports respectent la hiérarchie des couches ?
6. Est-ce qu'il y a déjà un fichier existant à enrichir plutôt qu'un nouveau à créer ?

---

## Variables d'environnement

Toujours accéder aux variables d'environnement via `env` depuis `@/shared/config/env.ts`, jamais via `import.meta.env` directement dans le code applicatif.

```ts
// Correct
import { env } from '@/shared/config/env'
const url = env.VITE_API_URL

// Interdit
const url = import.meta.env.VITE_API_URL
```

---

## Tests

- Mocker les appels HTTP via **MSW** (Mock Service Worker), jamais en stubant `api` ou `axios`
- Les tests de composants utilisent `@testing-library/react` (tester le comportement visible, pas l'implémentation)
- Un test ne doit jamais importer depuis l'intérieur d'une slice (utiliser l'`index.ts` public)
- Les handlers MSW sont dans `src/shared/api/__mocks__/handlers.ts`
