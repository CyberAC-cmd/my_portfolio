# Almir Cilasevic | Cyber Security Portfolio

A hardened, OWASP-aligned portfolio site demonstrating secure front-end architecture, defensive design patterns, and professional cyber security credentials.

---

## Technical Overview

| Stack | Details |
|-------|---------|
| **Front-end** | HTML5, CSS3, JavaScript (vanilla + GSAP) |
| **Hosting** | Azure Static Web Apps / GitHub Pages compatible |
| **Security** | CSP, SRI, no inline scripts, semantic HTML, ARIA |

---

## Security-First Features

The following capabilities are implemented as **intentional security controls**, not merely aesthetic choices. They reflect defensive design principles applicable to high-assurance web applications.

### Classified Redaction (Progressive Disclosure)

A controlled information-release mechanism applied to the About section. Content is initially presented in a redacted state and revealed progressively on scroll, enforcing:

- **Need-to-know disclosure:** Information is exposed only when the user has scrolled into view, reducing passive information leakage to automated scrapers or casual observers.
- **Controlled DOM manipulation:** Implementation uses `appendChild` and `insertBefore` exclusively—no `innerHTML`—to eliminate XSS vectors if content were ever dynamically sourced.
- **Classified-document metaphor:** Mirrors real-world handling of sensitive material where content is obscured until authorisation context is established.

### Forensic Loupe (Artifact Inspection HUD)

A digital investigation-style magnifier over the About portrait. Designed as a secure, isolated inspection tool:

- **Input isolation:** The loupe overlay is constructed via `createElement` and `textContent` only—no HTML injection. The underlying canvas (Attack Surface) uses `pointer-events: none` and `tabindex="-1"` to prevent input hijacking or focus capture.
- **Controlled enhancement:** Provides a fixed 2.5× zoom window without exposing raw image data or allowing arbitrary script execution in the inspection context.
- **HUD semantics:** Reinforces the cyber/forensic theme while demonstrating disciplined client-side behaviour—no event leakage, no keyboard traps.

---

## Project Structure

```
├── assets/
│   ├── css/          # Styles (style, responsive, cyber-interactions)
│   ├── docs/        # PDFs (CV, transcripts – redacted/sanitised)
│   ├── images/      # Icons, backgrounds, badges
│   └── js/          # main.js – application logic
├── lib/             # Bootstrap, GSAP, Slick, WOW (vendored)
├── index.html       # Single-page entry
├── staticwebapp.config.json
└── README.md
```

---

## Deployment

### GitHub Pages

1. Push to a GitHub repository.
2. **Settings → Pages → Source:** Deploy from branch (e.g. `main`) or `docs/` folder.
3. All asset paths are relative (`./assets/`, `./lib/`) and resolve correctly under GitHub Pages base URLs.

### Azure Static Web Apps

Configured via `staticwebapp.config.json` with security headers (X-Content-Type-Options, X-Frame-Options, HSTS, X-XSS-Protection).

---

## Security Documentation

| Document | Purpose |
|----------|---------|
| `APPSEC_AUDIT_REPORT.md` | Pre-deployment audit (info disclosure, assets, logic, spelling) |
| `SECURITY_HEADERS_CSP.md` | CSP recommendations and header hardening |

---

## Licence

Portfolio content © Almir Cilasevic. Third-party libraries retain their respective licences.
