---
name: preserve-existing-features
description: Mandatory skill & sovereign rule for website updates. NEVER delete, strip, wipe, or drop existing features, UI sections, widgets, routes, buttons, modals, or data when updating or redesigning the website. All updates must be strictly additive and non-destructive.
---

# PRESERVE EXISTING FEATURES & NON-DESTRUCTIVE UPDATES

## Sovereign Principle & Iron Law

> **"When updating our website, DO NOT delete the stuff which is already on the website."**

Under **NO circumstances** may an update, redesign, polish pass, refactor, or new feature addition delete, strip, break, or silently drop any existing components, UI blocks, routes, modals, settings, tools, or data hooks—unless the user has **explicitly and specifically commanded** that exact element to be removed (e.g. *"remove the workshop button"*).

---

## 1. Additive Evolution Over Blanket Replacement

1. **Enhance, Never Erase**:
   - Treat all existing pages, layouts, and components as established foundations.
   - When asked to "upgrade", "make better", "modernize", or "transform" a page, preserve **100% of existing functionality**, interactive controls, timers, modals, shortcuts, and data flows.
   - Add new features on top of, alongside, or refined within the existing ecosystem.

2. **No Regressive Feature Drops**:
   - Never replace a rich 800-line component with a generic 200-line component.
   - Never remove secondary tools, tabs, sidebars, action buttons, export tools, or modal triggers during a visual refresh.
   - If an existing screen has 5 sub-features (e.g. Pomodoro timer, speaker list, country matrix, roll call, document editor), an update must retain all 5 while adding or improving requested capabilities.

---

## 2. Surgical Edits & Code Integrity

1. **Read Before Writing**:
   - Always read the complete existing file or section before making modifications.
   - Understand all existing props, state variables, hooks, event handlers, and subcomponents so none are orphaned or omitted.

2. **Targeted Diffs**:
   - Use surgical edits (`edit_file`) for specific modifications.
   - Avoid blanket overwrites of large files unless explicitly necessary—and if rewriting, verify that every single existing prop, handler, and UI section is carried forward.

3. **Preserve Compatibility & Data Structures**:
   - When updating state providers, database schemas, or local storage structures, always maintain backward compatibility.
   - Never rename or drop existing fields that would corrupt or wipe out existing user data, forms, submissions, tickets, or configurations.

---

## 3. Explicit User Consent Required For Any Removal

- **Rule of Intentional Removal**: A feature, button, route, or section may **ONLY** be removed if the user explicitly orders its deletion in plain text (e.g., *"remove the workshop button"*, *"delete the old timer"*).
- **Assumed Retention**: If the user asks to "redesign the host page", "make the checkout better", or "update the event cards", **ALL existing capabilities MUST be retained**. Do not assume any feature is obsolete or unwanted.
- **When in Doubt, Ask**: If a new layout appears to conflict with an existing feature, do not discard the feature—either fit both harmoniously or ask the user how they would like it presented.

---

## 4. Mandatory Pre-Commit & Verification Checklist

Before finalizing any changes, commit, or pull request:
1. **Diff Verification (`git diff`)**: Inspect the diff specifically looking for red deletions (`-`). Ask: *"Did I delete any existing button, modal, route, input field, or section that the user didn't ask me to remove?"*
2. **Functionality Parity**: Verify all existing buttons and interactive paths still click, navigate, and render properly.
3. **No Regressions**: Confirm existing routes and companion pages (e.g. `/host/timer`, `/committee`, `/forms`, `/events`) remain fully intact and operational.
