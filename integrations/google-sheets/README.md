# ZENITH MODEL UNITED NATIONS 2026 — Google Sheets & Backup Form Integrations

This directory contains production-ready Google Apps Scripts for:
1. **Real-time Google Sheets Sync** from Zenvitra web form submissions.
2. **1-Click Backup Google Form Creator** in case the VPS or server experiences downtime.

---

## 1. Real-Time Google Sheets Webhook Integration (`ZenithSecretariatSheetsIntegration.gs`)

This script receives every submission from [`https://zenvitra.xyz/forms/zenith-secretariat-2026`](https://zenvitra.xyz/forms/zenith-secretariat-2026) and appends it to your Google Sheet with the **100% Selection Scorecard** columns pre-formatted.

### Setup Instructions:
1. Open Google Sheets ([sheets.new](https://sheets.new)) and name it:  
   `ZENITH MUN 2026 — Secretariat Application Master`
2. Go to **Extensions** > **Apps Script**.
3. Replace any default code with the contents of [`ZenithSecretariatSheetsIntegration.gs`](./ZenithSecretariatSheetsIntegration.gs).
4. Click **Deploy** > **New deployment**.
5. Select **Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Click **Deploy** and copy the **Web app URL** (e.g., `https://script.google.com/macros/s/.../exec`).
7. Paste this URL into your `.env` as `GOOGLE_SHEETS_WEBHOOK_URL` or directly into the form configuration.

---

## 2. 1-Click Backup Google Form Creator (`CreateZenithGoogleForm.gs`)

In case the Zenvitra VPS is ever temporarily unreachable or undergoing maintenance, you can immediately provision an identical, official Google Form with conditional branching.

### Setup Instructions:
1. Open Google Apps Script ([script.google.com](https://script.google.com)).
2. Click **+ New Project**.
3. Paste the contents of [`CreateZenithGoogleForm.gs`](./CreateZenithGoogleForm.gs).
4. Click **Run** with function `createZenithSecretariatGoogleForm`.
5. Check the **Execution Log**:
   - It will output the **Edit URL**, **Public Form URL**, and the **Linked Google Sheet URL**.
6. The created form includes:
   - All 6 sections & 20 core questions
   - 7 conditional departmental branches (Delegate Affairs, PR, Design, Media, Technical, Events, Research)
   - Mandatory work samples and PDF resume upload
   - Full 100% Evaluation Scorecard rubric in the form description
