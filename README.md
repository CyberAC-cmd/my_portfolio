# <p align="center">🕵️ PROJECT: CLOUD-NATIVE_SECURITY_IMPLEMENTATION</p>

<p align="center">
  <img src="https://img.shields.io/badge/SECURITY_RATING-A+-brightgreen?style=for-the-badge&logo=securityscorecard&logoColor=white" />
  <img src="https://img.shields.io/badge/HSTS-PRELOADED-blue?style=for-the-badge&logo=locklizard&logoColor=white" />
  <img src="https://img.shields.io/badge/COMPLIANCE-OWASP_ALIGNED-32CD32?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=azure,cloudflare,github,html,css,js,gsap,visualstudio" />
</p>

---

## 🛠️ Project Mission Briefing
This repository is a **Technical Showcase** of a hardened front-end environment. The objective was to build a high-performance, interactive portfolio that adheres to **Defensive Design Patterns** and **Secure SDLC** principles.

> **[SYSTEM_URL: LIVE_DEPLOYMENT](https://www.acilasevic.com.au)**

---

## 🧪 Technical Implementation & Workarounds

### 1. The "A+ Security" Refactor (WOW.js Removal)
To achieve a perfect **A+ Security Score**, I had to eliminate all "Insecure Patterns" that typical animation libraries introduce.
* **The Challenge:** Industry-standard libraries like WOW.js require `eval()` and `unsafe-inline` styles, which trigger Content Security Policy (CSP) violations.
* **The Workaround:** I surgically removed WOW.js and replaced it with a custom **Intersection Observer API** implementation in `main.js`. 
* **The Result:** This allowed the removal of `'unsafe-eval'` from the CSP, hardening the site against **XSS injection** while maintaining smooth scroll animations.

<img width="1193" height="306" alt="image" src="https://github.com/user-attachments/assets/0b113b56-7540-466b-8f9f-ca07acb9a079" />

### 2. Edge-Enforced HSTS (Zero-Trust Transport)
Enforcing security at the application layer isn't enough; this project enforces it at the **Network Edge**.
* **HSTS Preloading:** Configured via Cloudflare and Azure to meet strict browser preloading requirements.
* **The Logic:** By using **CNAME Flattening** on the Apex domain and **Full (Strict) TLS**, the site ensures a secure handshake before a single byte of UI is transmitted.

### 3. Progressive Information Disclosure (Redaction Logic)
Content is visually obscured by a "Black-Bar" overlay that scales to `0` only upon specific viewport intersection.
* **Security Control:** Prevents "Passive Data Scraping" by automated bots that do not simulate human scroll patterns.
* **Logic:** Built using strictly `textContent` to mitigate **DOM-based XSS** vulnerabilities.

---

## 🏗️ DevSecOps & Infrastructure

### **Hardened Pipeline (GitHub Actions)**
Deployed via **Azure Static Web Apps** with an automated CI/CD pipeline that enforces policy-as-code:
* **Header Hardening:** `staticwebapp.config.json` is configured to block sniffing and framing.
* **Asset Sanitisation:** All PDF artifacts are physically redacted, rasterised to defeat **OCR recovery**, and stripped of EXIF metadata.

### **Edge Security (Cloudflare)**
* **Proxy Protection:** Masking origin IP addresses to prevent direct-to-ip attacks.
* **DNSSEC:** Enabled to mitigate DNS Spoofing/Poisoning.
* **Authentication:** Validated using `_dnsauth` TXT tokens to prevent **Subdomain Hijacking**.

---

## 📂 Repository Structure

```text
├── .github/workflows/    # CI/CD Pipeline (Deployment Automation)
├── assets/
│   ├── docs/             # Sanitised & Rasterised PDF Assets
│   ├── css/              # UI Framework (Neon Pink/True Cyan Hierarchy)
│   └── js/               # Hardened Logic (Intersection Observer + HUD)
├── staticwebapp.config.json # Azure Security Policy Configuration
├── index.html            # Hardened Entry Point (CSP Compliant)
└── README.md             # Project Documentation
