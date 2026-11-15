# LawShastra – Existing Project Audit Report (Phase 1)

**Date:** 2026-11-15  
**Scope:** `D:\ProjectX\LawShastra` (frontend: `client/`, backend: `client/server/`)  
**Live refs (provided):** https://law-shastra.vercel.app/ (public), admin dashboard in-repo  
**Baseline tests (observed):** Client `vitest` **8 files / 30 tests passed**. Server `jest --runInBand` **6 suites / 23 tests passed**.

> This audit is based on repository inspection and local test runs. It is **not** a substitute for live production traffic, penetration testing, or full browser E2E verification. Major implementation should follow this audit per project instructions.

## 1. Executive Summary

- **Stack (actual):** React 19 + Vite 8 SPA (`client/`), TypeScript; Express 4 + Prisma 5 + PostgreSQL (`client/server/`, ESM). Not a Next.js/SSR app (prompt references Next.js revalidation patterns; implementation must be adapted to SPA + API/cache strategy).
- **Core capability exists:** Admin auth/RBAC scaffolding, admin UI modules/routes, file-backed CMS store (`client/server/data/cms-store.json`) with `/api/v1/admin/bootstrap` + CRUD, public categories endpoint, laws/categories/courses CRUD services, seeded DB (lexQuora) and newly created CMS Prisma tables.
- **Primary gaps:** Public site is largely **hardcoded/static** (home sections, law detail content, courses page, branding), admin-managed CMS data is **not the source of truth** for public rendering, CMS persistence is **JSON file not DB**, several **unprotected public write routes**, inconsistent branding (LexQuora/EduSphere/LawShastra), missing public CMS/search/SEO APIs, limited security hardening and test coverage.
- **Risk posture:** **Critical/High** issues around exposed CRUD endpoints, unpublished-content exposure potential, and no reliable admin?public sync/cache invalidation path.

## 2. Architecture Snapshot

| Layer | Current State | Notes |
|---|---|---|
| Frontend | React 19, Vite, React Router v7, TanStack Query present, Tailwind v4 | SPA routes in `client/src/app/router.tsx`; public routes `/`, `/courses`, `/courses/:courseId`, `/categories`, `/categories/:lawSlug` |
| Backend | Express app `client/server/src/app.js`, routes mounted in `src/routes/index.js` | `/api/v1` prefix, Swagger at `/api/docs`, rate limit on `/api/v1` |
| Database | Prisma schema `client/server/prisma/schema.prisma`, PostgreSQL `lexQuora` | Core: User/RefreshToken/Category/Law/Subcategory/Chapter/Course/AuditLog/ApiKey. **New (created 2026-11-15):** CmsSubcategory, Article, Page, Media, Tag, HomepageBlock, Banner, MenuItem, VisibilityRule, SeoEntry, AdminRole, FeatureFlag, SiteSetting, AdminActivityLog, Notification, Backup, MaintenanceTask |
| Auth | JWT access/refresh, cookies + bearer (`auth.controller.js`, `auth.js`) | Default admin provisioning/fallback logic exists; admin token stored in localStorage on client |
| RBAC | Role/permission maps in `config/rbac.js`, middleware `authenticate`/`requirePermission`/`requireRole` | Applied on admin routes/users/cms in parts; **not applied** on legacy public-mounted resource routes |
| CMS (admin) | File-backed `services/admin/cms.service.js` + `controllers/admin/cms.controller.js` + `routes/admin/cms.routes.js` | Persists to `client/server/data/cms-store.json`; **does not use Prisma CMS tables** |
| Public content | Mixed: `lawService`/`apiClient` fetch categories/laws with fallbacks; large static datasets in components/data files | Home sections and Law detail largely hardcoded |
| Tests | Vitest (client UI/unit-ish), Jest+Supertest (server integration/unit) | Baseline green; no Playwright/E2E, limited coverage of public/admin flows and security cases |

## 3. Route & Module Inventory

### 3.1 Frontend Routes (`client/src/app/router.tsx`)
- **Public:** `/` (HomePage), `/courses`, `/courses/:courseId`, `/categories`, `/categories/:lawSlug` (renders `LawDetailPage`), `*` NotFound via MainLayout.
- **Admin auth:** `/admin/login`.
- **Admin (protected):** `/admin` index + analytics, activities, categories, subcategories, articles, laws, pages, tags, media, homepage-builder, sections, banners, menus, footer, visibility, seo, redirects, users, roles, permissions, user-activity, feature-flags, settings, audit-logs, notifications, backups, maintenance (many aliases share components).

### 3.2 Backend API Mounts (`client/server/src/routes/index.js`)
- `GET /api/v1/admin/dashboard` (authenticated)
- `/api/v1/auth` (login/me/logout/register placeholder)
- `/api/v1/admin/users` (authenticated + permissions via route file)
- `/api/v1/admin/categories` (authenticated + permissions)
- `/api/v1/admin/*` (CMS routes, `authenticate` at router level)
- `/api/v1/public/categories` (public)
- **Legacy/back-compat (mounted without auth middleware):** `/api/v1/categories`, `/api/v1/laws`, `/api/v1/courses`

### 3.3 Key Frontend Modules
- Layouts: `components/layout/MainLayout.tsx`, `Navbar.tsx`, `Footer.tsx`, admin layout/sidebar/header.
- Public pages: `features/home/*`, `features/categories/pages/CategoriesPage.tsx`, `LawDetailPage.tsx`, `features/courses/pages/*`, `NotFoundPage`.
- Admin: `features/admin/*` pages, `shared/adminStore.ts`, `shared/AdminPrimitives.tsx`.
- Services/data: `services/apiClient.ts`, `adminApi.ts`, `lawService.ts`, static `src/data/*`, types `src/types/index.ts`.

### 3.4 Key Backend Modules
- Controllers/services for auth, category, law, course, dashboard, admin CMS.
- Middlewares: auth/RBAC, error handler, not-found.
- Config: env, db, logger, rbac, swagger.

## 4. Detailed Audit Findings

| # | Module | Existing Status | Identified Issue | Proposed Solution | Priority |
|---|---|---|---|---|---|
| 1 | Legacy resource routes | `/categories`, `/laws`, `/courses` mounted without auth | **POST/PUT/DELETE exposed without authentication/authorization** (e.g. `category.routes.js`, `law.routes.js`, `course.routes.js` define mutating handlers; `law.controller/service` have no auth checks) allowing unauthenticated data modification/deletion | Restrict legacy write routes to admin+permissions or remove/deprecate; keep read-only public endpoints explicit; add integration tests for 401/403 on writes | **Critical** |
| 2 | Public content exposure | `getAllLaws`/`/laws` return all laws regardless of status (service fetches all) | **Draft/Review content may be publicly accessible** via legacy/public-ish endpoints; no consistent published-only filtering for public consumers | Introduce explicit public endpoints/services that filter `PUBLISHED` (+ visibility flags) only; guard legacy endpoints; add tests for draft inaccessibility | **Critical** |
| 3 | CMS persistence | Admin CMS uses `cms.service.js` JSON file store | **DB/Prisma CMS tables unused**; data not durable/scalable/transactional; split-brain with `adminStore` localStorage fallback; `cms-store.json` path/seeding behavior risks in deploy | Migrate CMS service to Prisma models (created tables), add migrations/seed for CMS config, transactional writes, remove JSON as primary store (or keep as dev fallback behind flag) | **Critical** |
| 4 | Admin?Public sync | No public config/homepage/article APIs; frontend renders static/hardcoded sections | Admin changes (homepage blocks, menus, banners, visibility, SEO, settings, articles/pages) **do not reflect on public site**; no cache invalidation/versioning/publication workflow | Implement `/api/v1/public/{homepage,website-config,articles,search,...}` reading published DB state; connect frontend sections; add revalidation/cache-bust/version fields (SPA: fetch strategy, ETag/cache headers, SWR/react-query invalidation hooks) | **Critical** |
| 5 | Homepage | `HomePage.tsx` composes static sections; `CategoriesSection`/`FeaturedCourses` read `@/data/*`; branding "EduSphere" in sections | **Not admin-driven** (hero/CTAs/featured/latest/trending/banners/sections visibility-order not from backend) | Build homepage config schema/API + renderer that maps enabled, ordered, published sections; replace static data with API-driven components and sensible empty/loading/error states | **High** |
| 6 | Categories (public) | `CategoriesPage.tsx` fetches `/categories` & `/laws` with fallbacks to hardcoded sections/acts | Mixed dynamic/static; no server-side pagination/filter/search params; hardcoded descriptions/icons/accents; no empty/loading/error UX beyond fallbacks | Drive categories/subcategories from public API with status/visibility/order/featured/SEO/media; add search/filter/pagination/lazy loading and skeleton/error/empty states | **High** |
| 7 | Category/Law detail | `/categories/:lawSlug` renders `LawDetailPage.tsx` containing a **large hardcoded `lawDetails` array** (CPC/acts text, chapters/parts/sections) and mojibake/encoding artifacts; partial API use for sidebar acts | **Not CMS/DB-driven detail content**, URL/content coupling fragile, duplicated static legal text, poor maintainability, accessibility/encoding issues | Refactor to fetch law by slug from public API (DB: Law/Chapter/Subcategory + CMS fields), render sanitized rich/structured content, keep slug compatibility/redirects, move static seed content to DB/migrations | **High** |
| 8 | Articles/CMS content pages | Admin has Articles/Pages modules; no public article routes/pages consuming them | Articles/pages not publicly delivered; no slug-based published views, no draft protection in public layer | Add public article/page endpoints and frontend routes (`/articles/:slug`, CMS pages) with publish checks, SEO/meta, breadcrumbs/TOC/related/share as applicable | **High** |
| 9 | Navigation/Footer/Breadcrumbs | `Navbar`/`Footer` hardcoded (LexQuora/EduSphere branding, static links, `window.location.href` navigations, placeholder hrefs) | Not admin-configurable; broken/placeholder links (`#`, `/home`, `/courses?category...` mismatch), brand inconsistency | Drive header/footer/breadcrumb config from `website-config` API; validate links, prevent unsafe URLs/open redirects; keep accessible mobile nav | **High** |
| 10 | Branding & consistency | Mixed names: LawShastra, LexQuora, EduSphere across UI (`Navbar.tsx`, `Footer.tsx`, `CoursesPage.tsx`, `NotFoundPage.tsx`, `CategoriesPage` hints) and encoded glyphs/mojibake in strings | Confusing identity, unprofessional UI, potential encoding bugs | Unify branding to LawShastra (or configured site name) via settings; fix encoding; remove stale EduSphere/LexQuora remnants where not intended | **High** |
| 11 | Courses module | `CoursesPage.tsx` is a fully hardcoded static "LexQuora" page with embedded `<style>` and fake topbar; `CourseDetails`/catalog rely on static `data/courses` | **Not integrated** with backend courses/admin; duplicates layout/nav; broken IA vs rest of site | Decide scope: integrate courses with DB/admin + public APIs or clearly separate/feature-flag; remove duplicate chrome, align styling/data source | **Medium** |
| 12 | Search & filtering | No backend search endpoint; frontend filters limited/static in places | Cannot search categories/articles/pages/tags server-side; no debouncing/cancellation guarantees; scalability issues | Implement `/api/v1/public/search` with validated params, indexed queries, pagination; frontend debounced requests with abort/cancellation | **High** |
| 13 | SEO | SPA with minimal dynamic head management evident; no sitemap/robots/structured data/canonical generation found | Weak discoverability; drafts/private risk if added incorrectly; missing OG/Twitter/schema | Add SEO service/config (per-page meta from admin where applicable), sitemap/robots generation, structured data, canonical/404/redirect handling; ensure unpublished excluded | **High** |
| 14 | Media | Admin media is metadata/URL strings in JSON store; public assets often hardcoded paths | No upload pipeline/validation/optimization/responsive delivery/alt enforcement evident | Integrate Media Library with storage, validated uploads, alt/dimensions, lazy loading/fallbacks, safe URLs; connect public rendering | **Medium** |
| 15 | API design & validation | Mixed response shapes/normalization in services; some controllers lack strict validation; `app.js` rate-limits only `/api/v1` (ok) but trust/proxy/CORS/env nuances need review | Inconsistent errors, potential bad input reaching DB, limited pagination/filtering contracts | Adopt schema validation (zod/joi) per route, consistent `{success,message,data,errors}` envelope, pagination/sort/filter standards, transactions where needed | **Medium** |
| 16 | Auth & session security | JWT in cookies/localStorage; admin token persisted client-side; default credentials/fallback provisioning in code paths; registration endpoint placeholder | Token theft/XSS impact increased with localStorage; hardcoded/default admin flows risky; cookie flags depend on env; CSRF considerations for cookie auth | Prefer HttpOnly secure cookies, CSRF protection if cookie-authenticated state-changing requests, remove insecure fallbacks in prod, rotate secrets, harden login/me flows | **High** |
| 17 | RBAC enforcement | Permissions checked on many admin routes; some areas rely on frontend | Any missed server-side check becomes privilege escalation; CMS routes allow broad access to authenticated users (need per-resource permission review) | Enforce least-privilege per endpoint/resource, audit all admin/public routes, add authorization tests | **High** |
| 18 | Security hardening | Helmet/CORS/rate-limit present; no evidence of upload scanning, CSP tuning, output sanitization for rich text, redirect allowlisting | XSS via stored/rich content, IDOR on predictable IDs, info leakage via errors/logs possible | Sanitize rich HTML, validate/encode outputs, add security headers/CORS policy, IDOR checks (ownership/tenant as applicable), safe redirects, OWASP ASVS-aligned review | **High** |
| 19 | Performance | SPA bundle warning previously noted (~641kB chunk); hardcoded large in-component datasets (`LawDetailPage`); no confirmed query indexing/caching strategy; images not systematically optimized | Slow loads/render, poor Core Web Vitals risk, unnecessary client payload | Code-split routes/components, move static law content to API/DB, optimize queries/indexes, image optimization/lazy loading, react-query caching/deduping | **Medium** |
| 20 | UI/UX & accessibility | Mixed styles (Tailwind + bespoke CSS/inline page styles), inconsistent components, encoding artifacts ("ðŸ", "â€º" etc.) visible in source, focus/loading/error states uneven | Broken characters, inconsistent experience, accessibility gaps (labels/contrast/keyboard/heading order) | Normalize design system usage, fix encoding, add skeletons/empty/error states, audit WCAG 2.2 AA basics (focus, semantics, contrast) | **Medium** |
| 21 | Responsive behavior | Layouts generally responsive classes used but some custom pages (Courses/Law detail) have bespoke behavior and overflow risks | Potential mobile/tablet regressions, duplicated headers/sidebars in static pages | Responsive QA per route, unify layouts, remove duplicate embedded navs | **Medium** |
| 22 | Testing coverage | Baseline unit/integration tests pass; gaps in public E2E, admin?public sync, draft visibility, RBAC matrix, XSS/upload, SEO, mobile | Regressions likely during refactor; acceptance criteria unmet | Add regression tests before changes (Red?Green?Refactor), expand Jest/Vitest, introduce Playwright for critical flows; avoid destructive tests on prod data | **High** |
| 23 | Data model alignment | Prisma has `Law/Subcategory/Chapter` and separate `CmsSubcategory`; `Article/Page` models exist but unused; categories in DB vs mock fallbacks in service | Ambiguity/duplication (subcategories represented differently), mapping complexity frontend?backend | Define canonical content model (laws/articles/pages/categories/relations), migration/backfill plan, compatibility layer for existing URLs/IDs | **Medium** |
| 24 | Deployment/config | Env files created locally (`client/.env`, `client/server/.env`); CORS origin/rate limits/secrets configurable; Vercel deployment referenced but not fully audited here | Risk of env drift, secret leakage, CORS mismatch, missing prod hardening | Document envs, validate production config, ensure secrets not committed, define rollback/build steps | **Medium** |
| 25 | Error handling & observability | Central error handler exists; some controllers `next(error)` vs custom responses; client often catches and falls back silently | Hidden failures, hard-to-debug sync issues, stale fallback content masking outages | Consistent operational errors, structured logging, user-visible error states, no empty catches for critical paths | **Medium** |

## 5. Hardcoded / Configurable Content (Initial Inventory)

- **Hardcoded/static:** `features/home/sections/*` (hero, featured, why-us, instructors, testimonials, CTA), `src/data/{categories,courses,instructors,testimonials}.ts`, `features/courses/pages/CoursesPage.tsx` (entire page), most of `LawDetailPage.tsx` (`lawDetails`), Navbar/Footer links/labels/socials/branding, `NotFoundPage` branding.
- **Partially dynamic:** `CategoriesPage.tsx` (API + fallback), `lawService.ts` consumers, admin modules via `adminStore` + CMS bootstrap (but file-backed).
- **Should be admin-managed (config/content):** site identity/tagline/contact, navigation/footer items, homepage sections/ordering/visibility/CTAs/banners, categories/subcategories metadata & visibility, articles/pages/SEO, media references, feature flags, visibility rules, searchable/public config.
- **Should remain in code (app/system):** routing architecture, auth/RBAC enforcement logic, UI components/primitives, validation/business rules, build/deploy scripts (with env-driven config).

## 6. Baseline Verification (Observed)

| Check | Result | Evidence |
|---|---|---|
| Client tests | **PASS** (8 files, 30 tests) | `cd client && npx vitest run` |
| Server tests | **PASS** (6 suites, 23 tests) | `cd client/server && npm test` |
| Client production build | **PASS** (prior session) | `cd client && npm run build` (chunk-size warning noted) |
| DB migrate/seed | **PASS** (this session) | Admin tables migrated; `db:seed` completed on `lexQuora` after env fixes |

## 7. Recommended Implementation Order (aligned to request)

1. **Stabilize & secure foundations (Critical):** lock down legacy write endpoints, enforce published-only public reads, confirm auth/RBAC server-side on all admin mutations.
2. **Canonical data model & CMS-to-DB:** migrate file-backed CMS to Prisma, seed/default config, define publish/visibility/feature-flag semantics.
3. **Public API layer:** homepage/website-config/categories(slug)/articles(slug)/pages/search with pagination/filtering and safe responses.
4. **Frontend integration:** replace static home/categories/law/article rendering with API-driven components, loading/error/empty states, preserve URLs/slugs.
5. **Navigation/SEO/media:** dynamic header/footer/breadcrumbs, metadata/sitemap/robots/schema, media integration & optimization.
6. **Search, performance, accessibility:** server search, code-splitting, image/query optimizations, WCAG fixes.
7. **Testing & hardening:** regression suite expansion (Vitest/Jest + Playwright), security fixes per OWASP ASVS-minded checks, staging verification and rollback docs.

## 8. Audit Status & Next Actions

- **Phase 1 (Audit):** **Completed (initial, repository-based).**
- **Major implementation:** **Not started** pending prioritized plan approval/selection; recommended to proceed in small, test-backed increments preserving existing behavior and URLs.
- **Immediate next move (proposed):** Phase 2 prep — write/extend regression tests for current critical behaviors (public reads, admin auth, existing routes) and remediate **Critical #1/#2** (route protection & published-only exposure) before CMS/public integration refactor.

## 9. Limitations of This Audit

- Did not execute full manual browser walkthrough of every route in this pass; findings rely on source inspection + existing automated tests.
- Did not perform dependency vulnerability scan, live pentest, or production environment review.
- Some generated/vendor files appeared in broad file searches; audit conclusions focus on first-party source (`client/src`, `client/server/src`, config, schema).
- Prompt requests Next.js-specific mechanisms (ISR/revalidation/tags) in places; current app is Vite SPA—equivalent behavior must be implemented via API/cache/versioning strategies appropriate to this architecture.