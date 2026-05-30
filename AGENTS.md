<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:anchored-summary -->
# Session State (as of 30 May 2026)

## What was built (Security Settings — Phase ~9)
- **Prisma**: Added `twoFactorSecret`, `twoFactorEnabled`, `twoFactorBackupCodes` to `User` model + new `UserSession` model (id, userId, token, device, browser, os, ip, lastActiveAt, createdAt)
- **API**: `POST /api/auth/change-password` — validates current password + hashes new with bcrypt (min 8 chars, requirements check); `POST /api/auth/2fa/setup` — generates TOTP secret + QR code via speakeasy/qrcode; `POST /api/auth/2fa/verify` — verifies TOTP token + enables 2FA + returns 8 backup codes; `POST /api/auth/2fa/disable` — requires password re-auth; `GET /api/auth/sessions` — list active sessions; `DELETE /api/auth/sessions/[id]` — revoke session (ownership check)
- **Components** (`src/components/settings/`): `SecuritySection` — card with 3 security links (password/2FA/sessions); `ChangePasswordModal` — password fields with show/hide toggle + requirements checklist + confirmation; `TwoFactorSetupModal` — 4-step flow (menu → scan QR → verify code → backup codes) + disable flow; `SessionsModal` — list sessions with device/browser/os/ip/lastActive + delete each
- **Integration**: Buyer settings page refactored to server/client split (`page.tsx` → `SettingsContent.tsx`); `twoFactorEnabled` passed as server prop; SecuritySection replaces hardcoded placeholder links
- **Packages added**: `speakeasy`, `qrcode`, `@types/speakeasy`, `@types/qrcode`
- **Fix**: `src/app/cook/dashboard/page.tsx:73` — null safety for nullable `OrderItem.dishId`
- **Cook restructure**: Updated `CookSidebar` — added Page publique + Paramètres nav items; updated `CookHeader` dropdown — 280px, user info header, corrected links (Paramètres → `/cook/settings`); created `/cook/settings` page with SecuritySection, NotificationsSection, DangerZone; created `NotificationsSection` component

## Known remaining issues
- `prisma db push` must be run locally (db unreachable from this env) to apply `UserSession` model + User security fields
<!-- END:anchored-summary -->
