<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:anchored-summary -->
# Session State (as of 30 May 2026)

## What was built (Search & Filtering — Phase 9)
- **Prisma**: Added `searchVector`, `orderCount`, `rating`, `reviewCount` + indexes to `Dish`; added `searchVector`, `specialties` (String[]) + indexes to `CookProfile`
- **API routes**:
  - `GET /api/search/dishes` — full-text search with filters (q, category, city/wilaya, price range, min rating, availability) + sort (newest, popular, rating, price_asc/desc) + pagination
  - `GET /api/search/cooks` — search cooks by name/bio/city with filters (specialty, min rating) + sort (rating, orders) + pagination
  - `GET /api/search/suggestions` — real-time autocomplete (dishes, cooks, categories) with debounce
  - `GET /api/search/filters` — returns available categories (with counts), wilayas, price range
- **Hooks** (`src/hooks/`): `useDebounce` — generic debounce hook; `useSearch` — reusable search state machine
- **Components** (`src/components/search/`):
  - `SearchBar` — 3 variants (hero/compact/navbar) with autocomplete suggestions dropdown, debounced API calls
  - `FilterDrawer` — slide-in drawer with categories (count badges), wilaya select, price range (min/max inputs), min rating chips, availability toggle; fetches filter options from `/api/search/filters`
  - `ActiveFilters` — pill display with individual remove + "Effacer tout"
  - `SortSelect` — dropdown with 5 options (newest/popular/rating/price_asc/price_desc)
- **Page updates**:
  - `/dishes` — refactored to use `DishesSearchControls` (SearchBar + FilterDrawer + SortSelect), server-side pagination, URL-based filter state
  - `/cooks` — refactored to use `CooksSortSelect` client component, server-side pagination with `page` param
  - `/` — `HomeClient` uses the shared `SearchBar` hero variant
  - `Navbar` — includes compact `SearchBar` on `/dishes` and `/cooks` pages
- **Pre-existing** (Security Settings): `twoFactorSecret/Enabled/BackupCodes` + `UserSession` model; change-password, 2fa setup/verify/disable, sessions API; SecuritySection, ChangePasswordModal, TwoFactorSetupModal, SessionsModal; `/cook/settings` page with sidebar/header restructure

## Known remaining issues
- `prisma db push` must be run locally (db unreachable from this env) to apply new models + fields
<!-- END:anchored-summary -->
