🛠️ Project Mission Briefing
This repository is a Technical Showcase of a hardened front-end environment. Beyond standard UI/UX, this project focuses on Defensive Design Patterns, Strict CSP Compliance, and Edge-Level Security Enforcement.

SYSTEM_URL: LIVE_DEPLOYMENT
🧪 Technical Implementation & Workarounds
1. The "A+ Security" Refactor (WOW.js Replacement)
To achieve a perfect A+ Security Score, we had to eliminate all "Insecure Patterns."

The Conflict: Industry-standard animation libraries (like WOW.js) rely on eval() and unsafe-inline styles, which are flagged by modern security scanners.

The Solution: Conducted a structural refactor to remove WOW.js. Implemented a custom Intersection Observer API in main.js to trigger CSS animations.

Result: Successfully removed 'unsafe-eval' from the Content Security Policy (CSP), reaching the maximum security grade without sacrificing the interactive "Redaction" experience.

<img width="1193" height="306" alt="image" src="https://github.com/user-attachments/assets/ca9d212b-ff06-4b60-8067-51f998b02ef4" />


2. Edge-Enforced HSTS (Zero-Trust Transport)
Rather than relying on application-level redirects, this project utilizes Cloudflare Edge HSTS.

The Logic: HSTS is enforced at the network edge before a single byte of the application is loaded.

Preload Compliance: Configured for the HSTS Preload List, ensuring browsers never attempt an unencrypted HTTP connection.

Verification: Validated via SecurityHeaders.com and Mozilla Observatory to ensure Strict-Transport-Security is correctly propagated across all subdomains.

3. Progressive Information Disclosure (Redaction Logic)
Content exists in the DOM but is visually obscured by a "Black-Bar" overlay that scales to 0 only upon specific viewport intersection.

Security Control: Prevents "Passive Data Scraping" by automated crawlers that do not simulate human scroll behavior.

Implementation: Built using strictly textContent and appendChild to mitigate DOM-based XSS vulnerabilities.

4. Hardened Asset Pipeline
Metadata Scrubbing: All PDF assets undergo destructive redaction and EXIF wiping to eliminate digital fingerprints.

Rasterisation: Converting sensitive documents into flattened image layers to defeat OCR (Optical Character Recognition) recovery attempts.

🏗️ DevSecOps Stack
Automated CI/CD (GitHub Actions)
The deployment pipeline is fully automated but hardened:

Custom Headers: staticwebapp.config.json enforces X-Frame-Options: DENY and X-Content-Type-Options: nosniff.

CSP Splitting: Utilises script-src-elem and style-src-attr to provide granular control over CDN-hosted assets vs. local logic.

Edge Security (Cloudflare)
SSL/TLS: Full (Strict) encryption with CNAME Flattening on the Apex domain.

DNSSEC: Enabled to prevent DNS hijacking and cache poisoning.

Identity Validation: Authenticated via _dnsauth TXT tokens for Azure domain ownership.

📂 Repository Structure
Plaintext
├── .github/workflows/    # CI/CD Pipeline (Deployment Automation)
├── assets/
│   ├── docs/             # Sanitised & Rasterised PDF Assets
│   ├── css/              # UI Framework (Neon Pink/True Cyan Hierarchy)
│   └── js/               # Hardened Interaction Logic (Intersection Observer)
├── staticwebapp.config.json # Hardened Azure Security Policy
├── index.html            # Hardened Entry Point (No inline scripts)
└── README.md             # System Documentation
