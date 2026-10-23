---
name: preserve-database-data
description: Mandatory skill & sovereign rule for website and database updates. NEVER delete, reset, drop, or wipe existing database records, tables, conferences, forms, passes, or user data when updating the website. All migrations, schema updates, and deployments must be strictly non-destructive and preserve all pre-existing data.
---

# PRESERVE DATABASE RECORDS & NON-DESTRUCTIVE UPDATES

## Sovereign Principle & Iron Law

> **"When we update our website, DO NOT delete the stuff which is already on the website (Database & User Data)."**

Under **NO circumstances** may any build, deployment, code update, schema migration, script, or bug fix wipe, reset, drop, or delete data already created on the website. Every conference, event, pass tier, booking, registration form, user submission, and profile already stored in the database must remain 100% intact and preserved across all updates.

---

## 1. Absolute Prohibition on Destructive Database Commands

1. **NO FORCE RESETS (`prisma db push --force-reset` / `prisma migrate reset`)**:
   - **FORBIDDEN**: Never run `prisma db push --force-reset`, `prisma migrate reset`, or any CLI command that drops tables or recreates the database from scratch.
   - **MANDATORY**: Always use non-destructive schema synchronization. If schema changes are needed, apply them additively.

2. **NO UNCONSTRAINED DELETIONS IN SCRIPTS OR SEEDS**:
   - **FORBIDDEN**: Never execute scripts or seed files containing `deleteMany()`, `DROP TABLE`, `TRUNCATE`, or unconstrained `DELETE FROM` statements.
   - Any database maintenance script must target only specific, verified records and must never wipe entire tables.

3. **NEVER OVERWRITE OR REPLACE DATABASE FILES**:
   - **FORBIDDEN**: Never replace SQLite `dev.db`, `prisma/dev.db`, or database volume files with a blank or empty copy during builds or updates.
   - Always preserve the existing `.db` file and treat it as the live system of record.

---

## 2. Non-Destructive Schema Evolution

When modifying `prisma/schema.prisma` or database models:

1. **Additive Changes Only**:
   - New fields must always be either:
     - **Optional** (e.g. `formId String?`, `paymentGoLiveDate String?`), OR
     - **Configured with a safe default** (e.g. `status String @default("upcoming")`).
   - Never add required fields without defaults to an existing table with live data.

2. **No Silent Column or Table Drops**:
   - Never remove or rename existing columns without first ensuring existing data is migrated or safely accessible.
   - Never drop tables that contain existing live data (`ConferenceListing`, `User`, `Application`, `Post`, etc.).

---

## 3. Client-Side & Local Storage Data Preservation

In addition to Prisma / SQL, the website utilizes client-side stores (`localStorage`, React contexts) to persist user configurations, custom forms, tickets, and event rosters:

1. **Never Overwrite Existing Keys with Blank Arrays**:
   - When a state provider initializes (e.g. `ZenEventsPlatformContext`, `MunContext`, `formsStorage`), it must read and preserve existing stored items:
     - `zenvitra_platform_events_v2`
     - `zenvitra_public_forms_v1`
     - `zenvitra_form_submissions_v1`
     - `zenvitra_pulse_passes_v1`
   - If extending the format, perform a **non-destructive merge/hydration**: read existing stored data, preserve all existing records, and append or update.
   - NEVER call `localStorage.clear()` or overwrite keys with `[]` on deploy or app start.

2. **Cache Key Migration Safety**:
   - Never arbitrarily increment a storage key (e.g. `v1` → `v2`) without providing a migration fallback that reads from the old key and copies existing data to the new key.
   - Bumping a key without a migration wipes out the user's view of their existing data.

---

## 4. Pre-Update & Pre-Deployment Checklist

Before deploying any update, running migrations, or modifying database code:

1. **Backup Verification**:
   - If touching schema or database files, ensure the existing database (`dev.db` or remote snapshot) is preserved.
2. **Review Command Flags**:
   - Ensure no `--force-reset`, `--drop-database`, or `--destructive` flags are present in npm scripts or CI/CD pipelines.
3. **Verify Existing Records After Build**:
   - Test that pre-existing events, conferences, and forms are still queryable and display on the website after the update.
