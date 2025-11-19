<p align="center">
  <img src="./assets/safepi-logo.png" width="140" />
</p>

<h1 align="center">Safeπ – Pi Network Link Safety Scanner</h1>

<p align="center">
  Protecting Pioneers from scams, fake Pi apps, and malicious links.
</p>

---

## 📌 Overview

**Safeπ** is a security-focused web tool built for the Pi Network community.  
Its purpose is simple:

> **Help Pioneers verify whether a website is safe, suspicious, or potentially harmful.**

Safeπ now includes a **powerful AI-based phishing analyzer**, built using OpenAI’s latest models.  
It scans URLs using signals such as:

- phishing patterns  
- suspicious or fake Pi domains  
- malicious redirects  
- scam-like behavior  
- SSL issues  
- prior known malicious links (via internal database)

Safeπ is also prepared for **Pi SDK v2 integration** (domain validation pending).

---

## 🎥 Demo Videos

### 🔹 Short Demonstration (YouTube Shorts)

👉 **[Watch Here](https://www.youtube.com/shorts/6wYBQO_D1ok)**

### 🔹 Full App Walkthrough

[![Watch the Demo](https://img.youtube.com/vi/InKNizH_2a8/0.jpg)](https://www.youtube.com/watch?v=InKNizH_2a8)

---

## 🚀 Features

### 🔍 AI-Powered URL Safety Scanner (New)
- OpenAI Model: **gpt-4.1-mini**
- Detects phishing and fake Pi websites  
- Classifies scam type (wallet drain, fake airdrop, malware, etc.)
- Confidence scoring  
- JSON-based risk assessment  
- Lightning-fast scanning

API Route:
POST /api/analyze-link

arduino
Copy code

Returns:
```json
{
  "suspicious": true,
  "threatLevel": "medium",
  "reason": "...",
  "category": "phishing",
  "confidence": 0.78
}
🔍 Local Scam Database
Located at: frontend/lib/scamDatabase.ts

Contains hundreds of verified scam URLs

Search UI included

Manual “Add New Scam Link” UI included

🔐 Pi SDK Integration (Pending Approval)
The app is fully ready for:

Pi authentication

Pi payment flow

Events: onReadyForServerApproval, onReadyForServerCompletion

⚠️ Pi Developer Portal approval + domain validation are pending for the new Vercel URL.
Once approved, Pi SDK will function inside Pi Browser.

⚡ Modern Architecture
Next.js 14 (App Router)

Vercel frontend deployment

Render deployment (mirror)

OpenAI direct SDK integration

Fully client-friendly structure (no Express backend needed)

📁 Project Structure
pgsql
Copy code
SafePi_cleanstack/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── api/
│   │   │   └── analyze-link/route.ts   ← AI Scanner API
│   ├── lib/
│   │   ├── openai.ts                   ← OpenAI client
│   │   └── scamDatabase.ts             ← Local scam DB
│   ├── public/
│
└── assets/
    ├── safepi-logo.png
    └── safepi_app_preview.gif
🔐 Environment Variables
Create Vercel & Render environment variable:

ini
Copy code
OPENAI_API_KEY=<your OpenAI key>
⚠️ No Supabase keys needed anymore.
The project now uses a local TypeScript scam database instead of the old App Studio backend.

🛠️ Installation
🟦 Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
⚙️ AI Scanner Test (optional)
bash
Copy code
POST /api/analyze-link
{
  "url": "https://example.com"
}
💳 Pi Payment Flow (Prepared)
Safeπ is ready for server-side Pi payments via:

bash
Copy code
POST https://api.minepi.com/v2/payments/{paymentId}/approve
POST https://api.minepi.com/v2/payments/{paymentId}/complete
Status:

✔ SDK included

✔ UI prepared

⏳ Waiting for Pi Developer Portal to approve & validate domain

📦 Deployment
🟩 Vercel (Primary)
https://safepi.vercel.app

🟧 Render (Secondary)
Used for testing API behavior.

🔐 Pi Domain Validation
Pending approval.
Once validated, Pi Browser compatibility becomes fully active.

🧭 Roadmap
AI result → “Add to database” (automatic)

Payment Flow (Testnet)

Pi Browser compatibility (post-approval)

Threat database expansion

Community reporting v2

Chrome/Firefox extension

Full scam-pattern analytics

🤝 Contributing
We welcome:

Feature requests

Bug reports

UI improvements

Pull requests

Submit via GitHub Issues or Pull Requests.

🪪 License
MIT License
Free to use, modify, and distribute with attribution.

👤 Maintainer
Safeπ Development Team – 2025

🎉 Thank you for supporting Safeπ!
Our mission is to protect Pioneers and strengthen trust across the Pi ecosystem.


