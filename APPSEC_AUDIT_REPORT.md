# Application Security Audit Report
**Pre-Deployment | GitHub Readiness**  
**Auditor:** Senior AppSec Engineer  
**Date:** 2026-02-01

---

## 1. Information Disclosure Check

### ✅ PASS – No Local Paths
- **Scan:** No `C:/Users/`, `C:\`, `/home/`, `localhost`, `127.0.0.1`, or `file://` paths found in project HTML, CSS, or JS.

### ⚠️ LOW – Third-Party SVG Metadata
| File | Finding |
|------|---------|
| `assets/images/wireshark.svg` | Inkscape metadata: `inkscape:export-filename="/home/gerald/devel/wsweb/material/wsicon256.png"` |
| `assets/images/nmap.svg` | Inkscape metadata: `inkscape:export-filename="/home/david/nmap-logo.png"` |

**Risk:** Third-party creator paths (not yours) could leak in asset inspection.  
**Recommendation:** Strip `inkscape:export-filename` attributes from SVGs before deployment, or use cleaned/minified versions.

### ℹ️ INFORMATIONAL – Developer Comments
- `assets/js/main.js` contains section headers (e.g. `/* [A] Classified Redaction */`, `/* GSAP plugin registration */`). These are benign and do not expose environment details.
- No `TODO`, `FIXME`, `XXX`, or `HACK` notes in project code.

---

## 2. Metadata & Asset Integrity

### ✅ PASS – No Original/Unredacted References
- No links to filenames containing `original`, `unredacted`, or `Unredacted` in the codebase.

### ✅ Document Links (assets/docs/)
| Link in Code | Target File | Status |
|--------------|-------------|--------|
| `Almir_Cilasevic_Resume_Re.pdf` | Present | `Re` may denote Redacted – confirm intent |
| `UNSW_AHEGS.pdf` | Present | AHEGS transcript |
| `Almir Cilasevic_SoC.pdf` | Present | Statement of Completion |

**Recommendation:** If `Resume_Re` is intended to mean "Redacted", consider renaming to `Almir_Cilasevic_Resume_Redacted.pdf` for clarity. Similarly, if AHEGS/SoC are sanitised versions, consider `UNSW_AHEGS_Sanitised.pdf` etc. to align with your stated policy.

---

## 3. Logic Sanitisation (Forensic Loupe & Redaction)

### ✅ Forensic Loupe (`main.js` ~608–638)
- **Console:** No `console.log`, `console.debug`, or `console.warn`.
- **Memory:** Event listeners (`mouseenter`, `mouseleave`, `mousemove`) are scoped to `loupeZone`; no obvious leaks.
- **Note:** Loupe div remains in DOM when inactive; acceptable for static site.

### ✅ Classified Redaction (`main.js` ~574–606)
- **Console:** None.
- **Memory:** Single DOM injection; GSAP ScrollTrigger handles lifecycle.
- **Idempotency:** `if (p.querySelector('.redacted-wrapper')) return` prevents duplicate injection.

### ✅ Attack Surface Canvas (`main.js` ~673–736)
- **Console:** None.
- **Animation:** `requestAnimationFrame` loop runs while canvas is active; stops on page unload.
- **Note:** Loop continues if viewport resizes below 768px (canvas hidden but loop not cancelled). Acceptable for static portfolio; optional improvement: cancel loop when `matchMedia` no longer matches.

### ✅ Project-Wide Console Usage
- **assets/:** Zero `console.*` calls in project JS/CSS/HTML.
- **lib/:** WOW.js and Slick contain `console.warn` in source; these are third-party and typically not in production bundles.

---

## 4. Australian English Audit

### ✅ Security Terminology
| Term | Location | Spelling |
|------|----------|----------|
| analysing | `index.html` (About), `main.js` (loupe label) | ✓ Australian |
| neutralising | `index.html` (Projects) | ✓ Australian |
| ANALYSING_ARTIFACT | `main.js` | ✓ Australian |
| Initialising | `main.js` comment | ✓ Australian |
| maximise | `GSAP_REVIEW_AND_IDEAS.md` | ✓ Australian |

### ⚠️ Typo (Not Spelling)
- **`index.html` line 112:** "SANS news letters" → should be **"SANS newsletters"** (one word).

### ℹ️ Third-Party
- `lib/` (jQuery, Slick, WOW): US spellings (e.g. "unrecognized") – do not modify.

---

## 5. Summary & Remediation

| Category | Status | Action |
|----------|--------|--------|
| Information Disclosure | ✅ Pass (⚠️ SVG metadata) | Optional: strip SVG export paths |
| Asset Integrity | ✅ Pass | Optional: rename docs for explicit Redacted/Sanitised |
| Logic Sanitisation | ✅ Pass | No changes required |
| Australian English | ✅ Pass (⚠️ typo) | Fix "news letters" → "newsletters" |

**Verdict:** Project is suitable for GitHub deployment.

### Applied Fixes
- ✅ "SANS news letters" → "SANS newsletters" in `index.html`
- ✅ Stripped `inkscape:export-filename` from `wireshark.svg` and `nmap.svg` (removes third-party path disclosure)
