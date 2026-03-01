# Content Security Policy (CSP) Recommendations

**Purpose:** Prevent unauthorised scripts from running and mitigate XSS, clickjacking, and data injection.

---

## Current CSP (index.html)

```
default-src 'self';
script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
style-src 'self' https://fonts.cdnfonts.com https://cdnjs.cloudflare.com;
font-src 'self' https://fonts.cdnfonts.com https://cdnjs.cloudflare.com;
img-src 'self' data: https:;
connect-src 'self';
frame-src https://tryhackme.com;
```

---

## Recommended CSP Meta Tags (Hardened)

Add or replace your existing CSP meta tag with the following. **Note:** Meta tags cannot set `report-uri` or `report-to`; use HTTP headers for reporting.

### Option A: Strict (Recommended for Portfolio)

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
  style-src 'self' https://fonts.cdnfonts.com https://cdnjs.cloudflare.com 'unsafe-inline';
  font-src 'self' https://fonts.cdnfonts.com https://cdnjs.cloudflare.com;
  img-src 'self' data: https: blob:;
  connect-src 'self';
  frame-src https://tryhackme.com;
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  object-src 'none';
  upgrade-insecure-requests;
">
```

### Option B: With Report-Only (Testing)

If your host supports CSP reporting, use HTTP headers instead of meta. Example header:

```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri https://your-csp-report-endpoint.com/csp
```

---

## Directive Explanations

| Directive | Purpose |
|-----------|---------|
| `default-src 'self'` | Fallback for unspecified directives; only allow same-origin |
| `script-src` | Restricts script sources; CDNs must be explicit |
| `style-src` | Stylesheets; `'unsafe-inline'` may be needed for some libs (Bootstrap, WOW) |
| `font-src` | Web fonts from CDNs |
| `img-src` | Images; `data:` for inline SVG favicon; `https:` for external; `blob:` if canvas exports |
| `connect-src` | XHR/fetch; `'self'` for same-origin API calls |
| `frame-src` | iframes; TryHackMe badge only |
| `base-uri 'self'` | Prevents base-tag injection |
| `form-action 'self'` | Forms can only submit to same origin |
| `frame-ancestors 'self'` | Prevents clickjacking (X-Frame-Options equivalent) |
| `object-src 'none'` | Blocks Flash, Java, other plugins |
| `upgrade-insecure-requests` | Auto-upgrade HTTP to HTTPS |

---

## Additional Security Headers (Server-Side)

For Azure Static Web Apps, configure in `staticwebapp.config.json`:

```json
{
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  }
}
```

---

## SRI Note

With SRI on CDN scripts, ensure `crossorigin="anonymous"` is present. Scripts without it will fail integrity checks.
