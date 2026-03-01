# <p align="center">🕵️ PROJECT: SOC-AESTHETIC TECHNICAL SHOWCASE</p>

<p align="center">
  <img src="https://img.shields.io/badge/ARCHITECTURE-SECURE_FRONTEND-ff69b4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PIPELINE-AZURE_SWA_/_CLOUDFLARE-00FFFF?style=for-the-badge&logo=microsoft-azure" />
  <img src="https://img.shields.io/badge/COMPLIANCE-OWASP_ALIGNED-32CD32?style=for-the-badge" />
</p>

---

## 🛠️ Project Mission Briefing
This repository is a **Technical Showcase** of a hardened front-end environment. The objective was to build a high-performance, interactive portfolio that adheres to **Defensive Design Patterns** and **Secure SDLC** (Software Development Life Cycle) principles.

### [SYSTEM_URL: LIVE_DEPLOYMENT](https://www.acilasevic.com.au)

---

## 🧪 Technical Implementation Deep-Dive

### 1. Progressive Information Disclosure (Redaction Logic)
Instead of standard text rendering, this project implements a **Classified Redaction System** using GSAP ScrollTriggers.
* **The Logic:** Content exists in the DOM but is visually obscured by a "Black-Bar" overlay that scales to `0` only upon specific viewport intersection.
* **Security Control:** This prevents "Passive Data Scraping." A bot crawling the site sees the structure, but the content remains "locked" until a human-like scroll event is registered.
* **Implementation:** Developed using strictly `appendChild` and `textContent` to mitigate **DOM-based XSS** vulnerabilities.

### 2. Forensic Artifact Inspection (The HUD Loupe)
A custom-built **Forensic Loupe** tool allows for high-fidelity inspection of visual assets without compromising UI integrity.
* **The Logic:** A dynamic `canvas` overlay that calculates mouse coordinates relative to the source image.
* **Security Control:** The "Attack Surface" background utilizes `pointer-events: none` and `tabindex="-1"` to prevent **Clickjacking** and focus-trapping, ensuring the UI remains navigable and secure.

### 3. Hardened Asset Pipeline (Data Sanitisation)
A core requirement of this project was the **Data Destruction** of sensitive PII (Personally Identifiable Information) within public-facing PDFs.
* **The Process:** 1. **Destructive Redaction:** PII physically removed at the source.
    2. **Rasterisation (PDF2Go):** Converting text-based PDFs into flat image layers to defeat **OCR (Optical Character Recognition)** recovery tools.
    3. **Metadata Scrubbing:** Wiping EXIF and document properties to eliminate digital fingerprints (Author, Software, Timestamps).

---

## 🏗️ Infrastructure & DevSecOps

### **Cloud-Native Deployment**
Deployed via **Azure Static Web Apps** with an automated **GitHub Actions** CI/CD pipeline. 
* **Header Hardening:** Custom `staticwebapp.config.json` enforces:
    * `Strict-Transport-Security` (HSTS)
    * `X-Content-Type-Options: nosniff`
    * `X-Frame-Options: DENY`

### **Edge Security (Cloudflare)**
* **Proxy Protection:** Masking origin IP addresses via Cloudflare's Global Edge Network.
* **SSL/TLS:** Configured for **Full (Strict)** encryption with **DNSSEC** enabled to prevent DNS Spoofing/Poisoning.
* **Authentication:** Validated using `_dnsauth` TXT tokens to mitigate **Subdomain Hijacking** risks.

---

## 📂 Repository Structure

```text
├── .github/workflows/   # CI/CD Pipeline (Deployment Automation)
├── assets/
│   ├── docs/           # Sanitised & Rasterised PDF Assets
│   ├── css/            # UI Framework (Neon Pink/True Cyan Hierarchy)
│   └── js/             # Interaction Logic (Redaction & Forensic HUD)
├── staticwebapp.config.json # Azure Security Policy Configuration
├── index.html          # Hardened Entry Point
└── README.md           # Project Documentation
