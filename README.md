<p align="center">
  <img src="./assets/safepi-logo.png" width="140" />
</p>

<h1 align="center">Safeπ – Pi Network Link Safety Scanner</h1>

<p align="center">
  Protecting Pioneers from scams, fake Pi apps, and malicious links.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Framework-Next.js-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Express.js-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Pi%20SDK-v2-orange?style=for-the-badge" />
</p>

---

## 📌 Overview

**Safeπ** is a security-focused web tool built for the Pi Network community.  
Its purpose is simple:

> **Help Pioneers verify whether a website is safe, suspicious, or potentially harmful.**

Safeπ scans URLs using risk signals such as:
- phishing patterns  
- suspicious or fake Pi domains  
- SSL certificate issues  
- redirections  
- scam-like behavior  

Safeπ is fully integrated with the **Pi Platform SDK v2** and has a working, verified **Pi Payment Flow**.

---

## 🎥 Demo Videos

### 🔹 Short Demonstration (YouTube Shorts)

👉 **[Watch Here](https://www.youtube.com/shorts/6wYBQO_D1ok)**

### 🔹 Full App Walkthrough

[![Watch the Demo](https://img.youtube.com/vi/InKNizH_2a8/0.jpg)](https://www.youtube.com/watch?v=InKNizH_2a8)

---

## 🖼️ Screenshots / App Preview

> Full UI demo of Safeπ scanning URLs and providing security results.

### GIF Preview  
*(Click the image to view in full size)*

![Safeπ Preview](./assets/safepi_app_preview.gif)

---

## 🚀 Features

### 🔍 URL Safety Scanner
- Detects phishing attempts  
- Identifies fake Pi websites  
- Flags dangerous redirects  
- Checks SSL validity  
- Fast scan & instant results  

### 🔐 Pi SDK Integration
- Fully functional Pi Payment Flow  
- `onReadyForServerApproval`  
- `onReadyForServerCompletion`  
- Secure server-side approval via Pi API  

### ⚡ Modern Architecture
- Next.js 14 (Frontend)  
- Express.js (Backend)  
- Render.com hosting  
- Clean project structure  

---

## 📁 Project Structure
SafePi_cleanstack/
├── frontend/
│ └── app/
│ └── page.tsx
│ └── components/
│ └── public/
│
├── backend/
│ ├── api/
│ │ ├── create-payment.js
│ │ └── complete-payment.js
│ ├── server.js
│ ├── package.json
│ └── .env (not included)
│
└── assets/
├── safepi-logo.png
└── safepi_app_preview.gif


---

## 🔐 Environment Variables

Create `/backend/.env`:



PI_API_KEY=<your Pi server API key>
PORT=10000


> 🚫 Do NOT commit `.env` to GitHub.

---

## 🛠️ Installation

### ⬛ Backend Setup
```bash
cd backend
npm install
npm start

🟦 Frontend Setup
cd frontend
npm install
npm run dev

💳 Pi Payment Flow (Verified & Working)

Safeπ uses Pi Network’s secure payment API:

✔ Approval Flow

POST https://api.minepi.com/v2/payments/{paymentId}/approve

✔ Completion Flow

POST https://api.minepi.com/v2/payments/{paymentId}/complete

Verified by logs:

developer_approved: true

developer_completed: true

transaction_verified: true

📦 Deployment

Safeπ is deployed using:

Render (backend)

Render / Vercel (frontend)

HTTPS fully enabled

Domain validated in Pi Developer Portal

🧭 Roadmap

 Payment Flow (Testnet)

 URL scanning engine

 Pi Browser compatibility

 Add threat database (v1)

 Auto-detection of link reputation

 User history of scans

 Browser extension (Chrome/Firefox)

 Community-driven reporting

🤝 Contributing

We welcome:

Feature requests

Bug reports

UI improvements

Pull requests

Submit via Issues or Pull Requests tab.

🪪 License

MIT License
Free to use, modify, and distribute with attribution.

👤 Maintainer

Safeπ Development Team – 2025

🎉 Thank you for supporting Safeπ!

Safeπ’s mission is to protect Pioneers and strengthen trust across the Pi ecosystem by preventing scams and making online interactions safer.


