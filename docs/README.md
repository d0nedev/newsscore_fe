# Make This Nuxt Frontend Production-Ready

You are a senior frontend engineer specializing in Nuxt 4, Vue 3, TypeScript, frontend architecture, performance, security, testing, and maintainable production applications.

I have an existing Nuxt project that must be prepared for production.

## Project Context

This project is **frontend-only**.

Architecture:

```text
Browser
   ↓
Nuxt Frontend
   ↓ HTTP/JSON
Go REST API
   ↓
PostgreSQL
```

Important:

- Do NOT turn this project into a full-stack Nuxt application.
- Do NOT use Nuxt/Nitro server APIs as the application backend.
- Do NOT add database access to Nuxt.
- Do NOT move backend business logic into Nuxt.
- The Go API remains the only backend.
- Nuxt should consume the Go REST API through HTTP.
- The frontend may eventually be deployed as a static application/CDN.
- SSR is not currently required.
- Prefer simple, maintainable architecture over unnecessary abstraction.

## Existing Stack

Use and preserve these technologies where appropriate:

- Nuxt 4
- Vue 3
- TypeScript
- pnpm
- ESLint
- Prettier
- `$fetch`
- Zod
- Tailwind CSS
- TanStack Vue Query
- Pinia only when client-side global state is actually needed
- Vitest
- Playwright

Do NOT add dependencies just because they are popular.

Every new dependency must have a clear architectural reason.

---

# Primary Goal

Transform the existing Nuxt project into a **production-ready frontend** with:

1. Maintainable architecture
2. Strong TypeScript usage
3. Consistent API communication
4. Proper server-state management
5. Robust error handling
6. Form validation
7. Authentication-ready architecture
8. Good UX for loading/error/empty states
9. Security-conscious frontend design
10. Testing
11. Performance optimization
12. Production build/deployment readiness
13. Clean code and consistent conventions

---

# Step 1 — Audit Before Changing Anything

First inspect the entire project.

Analyze:

- directory structure
- `nuxt.config.ts`
- package.json
- TypeScript configuration
- ESLint configuration
- Prettier configuration
- pages
- components
- composables
- services
- types
- schemas
- plugins
- middleware
- state management
- API calls
- environment variables
- runtime configuration
- forms
- error handling
- loading states
- authentication
- tests
- build configuration

Do NOT immediately rewrite the project.

First provide an audit with:

```text
Current architecture
Problems
Risks
Missing production concerns
Unnecessary complexity
Recommended changes
Priority
```

Classify issues as:

```text
P0 = critical
P1 = important
P2 = improvement
P3 = optional
```

Do not fix P2/P3 issues before P0/P1 issues.

---

# Step 2 — Establish Architecture

Use this architecture unless there is a strong reason to change it:

```text
app/
├── app.vue
├── assets/
├── components/
├── composables/
├── layouts/
├── middleware/
├── pages/
├── plugins/
├── services/
│   ├── api-client.ts
│   ├── product.service.ts
│   └── ...
├── types/
│   ├── api.ts
│   ├── product.ts
│   └── ...
├── schemas/
│   └── ...
└── utils/
    └── ...
```

Responsibilities:

### pages/

Page-level composition only.

Avoid putting API/business logic directly inside pages.

### components/

Reusable UI components.

Components should not directly know how the backend works.

### composables/

Reusable frontend logic and state.

Examples:

```text
useProducts()
useProduct()
useCreateProduct()
useUpdateProduct()
```

### services/

Domain-specific API communication.

Example:

```text
product.service.ts
order.service.ts
auth.service.ts
```

### api-client.ts

Centralize common HTTP behavior:

- base URL
- headers
- authentication headers
- API errors
- request ID
- common fetch configuration

Do not duplicate `$fetch` configuration throughout the application.

### types/

Keep API/domain TypeScript types centralized and strongly typed.

### schemas/

Frontend validation schemas using Zod.

Remember:

Frontend validation is for UX.

Backend validation in Go remains authoritative.

---

# Step 3 — API Contract

The Go API uses this response format.

## Single resource

```json
{
  "data": {
    "id": "123",
    "name": "Keyboard"
  }
}
```

## Paginated response

The API uses cursor-based pagination:

```json
{
  "data": [],
  "meta": {
    "nextCursor": "..."
  }
}
```

The frontend should NOT depend on the internal structure of the cursor.

Use:

```text
GET /api/products?limit=20
```

Then:

```text
GET /api/products?limit=20&cursor=...
```

## Error

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found",
    "details": null
  }
}
```

Validation:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "name": "Name is required",
      "price": "Price must be greater than or equal to 0"
    }
  }
}
```

HTTP statuses:

```text
200 OK
201 Created
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

Respect these contracts.

Do not invent a different API response format in the frontend.

---

# Step 4 — API Client

Create or improve a centralized API client.

Target architecture:

```text
Component
   ↓
Composable
   ↓
Service
   ↓
apiFetch()
   ↓
$fetch()
   ↓
Go API
```

The API client should handle common concerns consistently.

Example direction:

```ts
apiFetch<T>(path, options);
```

It should support:

- runtime-configured base URL
- typed responses
- API error mapping
- authentication headers when authentication is implemented
- request ID propagation when appropriate
- consistent fetch configuration

Do not use Axios unless there is a concrete requirement that `$fetch` cannot satisfy.

---

# Step 5 — Server State

Use TanStack Vue Query for server state.

Server state includes:

```text
products
orders
users
profiles
notifications
```

Do not unnecessarily store server responses in Pinia.

Use:

```text
TanStack Vue Query
```

for:

- fetching
- caching
- refetching
- mutations
- invalidation
- loading state
- error state
- pagination
- cursor pagination

Use Pinia only for actual client-side application state.

Examples:

```text
sidebar state
UI preferences
theme
temporary client state
```

---

# Step 6 — Cursor Pagination

Implement cursor pagination properly.

Expected flow:

```text
Initial request

GET /api/products?limit=20

        ↓

data + nextCursor

        ↓

GET /api/products?limit=20&cursor=<nextCursor>
```

Use TanStack Query's appropriate pagination/infinite-query mechanism.

Do not implement pagination by manually storing arbitrary page numbers if the backend API is cursor-based.

Handle:

- first page
- next page
- loading next page
- end of list
- retry
- errors
- duplicate requests
- cache behavior

---

# Step 7 — Forms and Validation

Use Zod for frontend validation.

Example:

```ts
const productSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  active: z.boolean(),
});
```

Forms must properly handle:

```text
initial state
validation
field errors
submit state
API errors
success state
cancel
reset
double submission
```

Do not rely exclusively on frontend validation.

The Go API remains authoritative.

---

# Step 8 — Error Handling

Create a consistent error model.

Distinguish:

```text
Validation error
Authentication error
Authorization error
Not found
Conflict
Network error
Server error
Unknown error
```

Do not show raw backend exceptions or stack traces to users.

User-facing errors should be understandable.

Developer-facing logging should contain enough context for debugging.

---

# Step 9 — Loading / Empty / Error UX

Every data-driven page should explicitly handle:

```text
Loading
Success with data
Success with empty data
Error
Retry
```

Avoid pages that simply render nothing while requests are loading.

Example:

```text
Loading:
Skeleton

Empty:
"No products found"

Error:
"Unable to load products"
[Retry]
```

For mutations:

```text
Submitting
Success
Validation error
API error
Network error
```

Prevent accidental double submissions.

---

# Step 10 — Authentication Architecture

Prepare the frontend for authentication with the Go API.

Architecture:

```text
Login page
    ↓
authService
    ↓
Go API
    ↓
access token / session
    ↓
authenticated API requests
```

Implement route protection using Nuxt route middleware where appropriate.

Consider carefully:

- access token storage
- refresh token strategy
- XSS
- CSRF
- expiration
- logout
- unauthorized API responses
- redirect to login
- avoiding token leakage

Do NOT automatically store sensitive tokens in localStorage without evaluating the security implications.

If the existing backend authentication contract is insufficiently specified, identify what is missing instead of inventing a security model.

---

# Step 11 — Runtime Configuration

Use Nuxt runtime configuration.

Example:

```ts
runtimeConfig: {
  public: {
    apiBaseUrl: '',
  },
}
```

Environment:

```env
NUXT_PUBLIC_API_BASE_URL=https://api.example.com
```

Never hardcode production API URLs inside components or services.

Separate:

```text
development
staging
production
```

configuration where appropriate.

Do not put secrets in `runtimeConfig.public`.

Remember:

Anything under `public` runtime config is visible to the browser.

---

# Step 12 — Security

Review the frontend for:

- XSS
- unsafe `v-html`
- token leakage
- secrets in frontend bundles
- unsafe URL handling
- dependency vulnerabilities
- sensitive information in logs
- insecure authentication storage
- CORS assumptions
- production HTTPS
- source maps exposure strategy
- accidental debug endpoints
- development-only code

Do not claim frontend code can protect backend authorization.

Authorization must remain enforced by Go.

---

# Step 13 — Performance

Review:

- unnecessary client-side JavaScript
- component rendering
- large dependencies
- unnecessary watchers
- unnecessary computed state
- image optimization
- lazy loading
- route-level code splitting
- bundle size
- duplicate API requests
- Vue Query caching
- unnecessary refetching

Do not optimize prematurely.

Only introduce complexity when there is a measurable or architectural reason.

---

# Step 14 — SEO / SSR

This application is currently an internal/admin-style application.

Do NOT introduce SSR merely because Nuxt supports it.

Evaluate SSR/SSG only if the application later requires:

- SEO
- public pages
- search engine indexing
- social preview rendering
- initial HTML rendering requirements

For the current application, prioritize frontend-only production deployment.

---

# Step 15 — Testing

Set up:

## Unit tests

Use Vitest.

Test:

```text
utils
schemas
composables
important business-related frontend logic
```

## E2E tests

Use Playwright.

At minimum test critical flows:

```text
Login
Product list
Product creation
Product editing
Product deletion
Pagination
API error handling
Authorization
Logout
```

Avoid writing meaningless tests just to increase coverage percentage.

Prioritize critical user flows.

---

# Step 16 — Code Quality

Ensure:

- strict TypeScript
- no unnecessary `any`
- no duplicated API logic
- no duplicated validation
- no dead code
- no unused imports
- consistent naming
- consistent file organization
- small focused components
- composables with clear responsibilities
- services with clear responsibilities

Avoid:

```text
god components
god composables
god stores
god services
```

Do not create abstractions that are only used once unless they provide a clear architectural benefit.

---

# Step 17 — Environment and Build

Verify:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If commands are missing, add the appropriate scripts.

Verify the production build actually works.

Do not assume that development mode behavior equals production behavior.

---

# Step 18 — Deployment

The frontend is intended to be deployable independently from the Go API.

Target architecture:

```text
                  Internet
                     │
                     ▼
              CDN / Static Host
                     │
                     ▼
              Nuxt Frontend
                     │
                     │ HTTPS
                     ▼
                  Go API
                     │
                     ▼
                PostgreSQL
```

Prefer static deployment if the current application does not need SSR.

Ensure:

- production API URL is configurable
- HTTPS is used
- environment variables are correct
- SPA routing works correctly
- cache headers are appropriate
- assets are cacheable
- API errors are handled gracefully

---

# Step 19 — Documentation

Create or update a concise README containing:

```text
Project overview
Architecture
Directory structure
Requirements
Installation
Development
Environment variables
Linting
Formatting
Testing
Production build
Deployment
API configuration
Authentication architecture
```

Do not create excessive documentation.

---

# Important Rules

1. Inspect first.
2. Explain the current architecture before modifying it.
3. Make incremental changes.
4. Prefer simple solutions.
5. Do not introduce unnecessary dependencies.
6. Do not convert Nuxt into a backend.
7. Do not duplicate Go business logic in Nuxt.
8. Do not use Pinia as a replacement for server-state management.
9. Do not use Axios unless justified.
10. Do not hardcode environment-specific values.
11. Do not expose secrets to the browser.
12. Do not weaken backend security assumptions.
13. Do not silently change API contracts.
14. Keep TypeScript strongly typed.
15. Keep production concerns explicit.
16. Preserve working code unless there is a reason to change it.

---

# Execution Strategy

Work in phases.

## Phase 1

Audit only.

Return:

```text
Current architecture
P0 issues
P1 issues
P2 issues
P3 issues
Recommended architecture
Dependencies that should be added
Dependencies that should be removed
```

Do NOT modify files yet.

## Phase 2

Fix architecture and API layer.

## Phase 3

Implement TanStack Vue Query and server-state management.

## Phase 4

Implement forms, validation, loading, empty, and error states.

## Phase 5

Implement authentication architecture.

## Phase 6

Add testing.

## Phase 7

Optimize performance and security.

## Phase 8

Production build and deployment verification.

After every phase:

```text
Changes made
Files changed
Why they changed
Remaining issues
How to verify
```

Before making a potentially destructive change, explain the impact.

The final result should be a **lean, maintainable, production-ready Nuxt 4 frontend consuming a Go REST API**, not an over-engineered framework showcase.
