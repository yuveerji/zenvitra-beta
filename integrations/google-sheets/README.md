# ZENITH MODEL UNITED NATIONS 2026 — Google Sheets & Backup Form Integrations

This directory contains production-ready Google Apps Scripts for:
1. **Multi-Tab Department-Specific Google Sheets Sync** from Zenvitra web form submissions.
2. **1-Click Backup Google Form Creator** in case the VPS or server experiences downtime.

---

## 1. Multi-Tab Google Sheets Webhook Integration (`ZenithSecretariatSheetsIntegration.gs`)

This script receives every submission from [`https://zenvitra.xyz/forms/zenith-secretariat-2026`](https://zenvitra.xyz/forms/zenith-secretariat-2026) and automatically routes applicants into dedicated department tabs:

### Dedicated Department Tabs Created:
1. 📋 **`Master - All Responses`**: Contains every application submitted.
2. 🌐 **`Dept - Delegate Affairs`**: With specific practical questions for delegate attraction, grievance redressal, network expansion, and tracking.
3. 📣 **`Dept - PR & Marketing`**: With specific questions for first-time awareness campaigns, marketing strategy, criticism handling, and social media.
4. 🎨 **`Dept - Design & Creative`**: With specific questions for design tools, 3 portfolio sample links, visual consistency, and turnaround speed.
5. 🎙️ **`Dept - Media & Comms`**: With specific questions for writing comfort, draft announcements, communication consistency, and corrections.
6. 💻 **`Dept - Technical & Website`**: With specific questions for programming stack, live project links, troubleshooting website issues, and data accuracy.
7. 🏛️ **`Dept - Events & Ops`**: With specific questions for Udaipur summit coordination, conference-day contingencies, tripartite coordination, and stage management.
8. 📜 **`Dept - Research & Content`**: With specific questions for research verification, background guides, unbiased content, and writing samples.

### Automated 100% Merit Evaluation Scorecard:
Every department tab includes pre-configured scoring columns:
- **Experience (15)**
- **Department Suitability (20)**
- **Motivation & Vision (15)**
- **Situational Judgement (20)**
- **Commitment & Reliability (20)**
- **Communication (10)**
- **Total Score (100)**: Automated with `=SUM(...)` formula
- **Evaluation Status** (SUBMITTED / SHORTLISTED / INTERVIEW / APPOINTED)
- **Reviewer Notes**

### Setup Instructions:
1. Open Google Sheets ([sheets.new](https://sheets.new)) and name it:  
   `ZENITH MUN 2026 — Secretariat Application Master`
2. Go to **Extensions** > **Apps Script**.
3. Replace any code with the contents of [`ZenithSecretariatSheetsIntegration.gs`](./ZenithSecretariatSheetsIntegration.gs) and click **Save** (💾).
4. Click **Deploy** > **New deployment**.
5. Select **Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Click **Deploy**, authorize permissions, and copy the **Web app URL** (e.g., `https://script.google.com/macros/s/.../exec`).
7. Paste this URL into your `.env` as:
   ```env
   ZENITH_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
   ```
8. Refresh your Google Sheet. You will see a new menu in the top toolbar:  
   **🏛️ ZENITH MUN** > **Initialize All Department Tabs**. Click it to create and style all 8 department tabs instantly.

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
