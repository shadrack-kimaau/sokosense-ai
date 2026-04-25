# 🌾 SokoSense AI
### *Sema Shamba, Upate Senti.* 
**Smart Market Negotiation & Price Forecasting for the Kenyan Farmer.**

[![Live Demo](https://img.shields.io/badge/Demo-Live_on_Cloud_Run-2D5A27?style=for-the-badge)]([Live Demo Link])
[![Video Demo](https://img.shields.io/badge/Video-Product_Walkthrough-F27D26?style=for-the-badge)]([Video Demo Link])

---

## 🛑 The Problem
Kenya's small-scale farmers lose up to **30-40% of their potential income** due to extreme information asymmetry. 
*   **Broker Exploitation:** Middlemen often quote prices far below the actual market rate, taking advantage of a farmer's lack of real-time data.
*   **Market Fragmentation:** Prices in Eldoret, Nairobi, and Nakuru fluctuate independently based on hyper-local supply/demand.
*   **Language Barrier:** Traditional market reports are often dry, technical, and only in formal English or Swahili, failing to connect with the natural **Sheng/English code-switching** used by the modern Kenyan farmer.

## 💡 The Solution
**SokoSense AI** is a mobile-first, voice-enabled intelligent negotiator. It leverages **Gemini 1.5 Flash** to provide localized, culturally resonant advice that empowers farmers to stand their ground during a sale.

*   **Sheng-First AI:** Responses feel like a conversation with a smart friend in the market.
*   **Predictive Reasoning:** Doesn't just show prices; it explains *why* they are changing (e.g., "Mvua imechelewa Nairobi, bei itapanda wiki ijayo").
*   **Voice Capability:** Farmers can speak their queries directly in Swahili, Sheng, or English—crucial for on-the-go accessibility.

---

## 🏗️ System Architecture
SokoSense is built for speed, scalability, and production-readiness.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18+ (Vite) | High-performance, mobile-first interface. |
| **Backend** | Node.js Express | Secure API proxying and serving the SPA. |
| **AI Orchestration** | Gemini 1.5 Flash | Core intelligence, reasoning, and code-switching. |
| **Styling**| Tailwind CSS | "Geometric Balance" design system for mobile clarity. |
| **JSON Integrity** | Gemini JSON Mode | Guarantees structured data for reliable UI rendering. |
| **Deployment** | Google Cloud Run | Serverless, auto-scaling deployment. |

---

## ✨ Key Features
-   **🗣️ Voice-to-Action:** Integrated Web Speech API for hands-free market queries.
-   **🔊 Audio Feedback:** Text-to-Speech (TTS) integration so the AI can "read" back the negotiation advice. 
-   **📊 Market Intelligence:** Real-time (simulated) data comparison across Nairobi, Eldoret, Kitale, and Nakuru.
-   **🤝 Strategic Scripting:** Dynamic "Counter-Offer" suggestions based on current market trends.
-   **🌍 Multi-Lingual:** Toggle between English, Swahili, Sheng, or "Auto" (Mix) modes.

---

## 🎯 Buildathon Alignment: AI for Agriculture
SokoSense AI was developed for the **Build with AI Pwani 2026 Buildathon** under the **AI for Agriculture** track.

*   **Impact:** Directly addresses post-harvest income loss (SDG 1: No Poverty, SDG 2: Zero Hunger).
*   **Novelty:** Moves beyond simple "price lookup" apps by adding a **Negotiation Layer**—coaching the user on *how* to talk to brokers.
*   **GCP Integration:** Fully utilizes the Google Cloud stack (Gemini API + Cloud Run).

---

## 🛠️ Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   A Google AI Studio API Key (`GEMINI_API_KEY`)

### Local Setup
1.  **Clone the Repo**
    ```bash
    git clone https://github.com/[your-username]/sokosense-ai.git
    cd sokosense-ai
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Configure Environment**
    Create a `.env` file in the root:
    ```env
    GEMINI_API_KEY=your_key_here
    ```
4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000`

---

## 🚀 Future Roadmap
*   **👁️ Computer Vision:** Photo-based crop quality grading (Grade A/B/C) to justify higher prices.
*   **📱 USSD Integration:** Expanding access to non-smartphone users via basic SMS-style menus.
*   **🔗 Blockchain Ledger:** Immutable records of agreed deals to prevent broker backtracking.

---
**Build with AI Pwani 2026 | SokoSense AI - Empowering the backbone of Kenya.**
