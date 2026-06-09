# Raed Kenaan — Personal Portfolio

A premium, responsive one-page portfolio for a telecom / digital-transformation
executive. Built with semantic HTML5, modern CSS (custom properties + grid), and
vanilla JavaScript — no build step, no framework, fast to load and trivial to deploy.

## ✨ Features
- **Business-card ready**: one-tap **"Save my contact"** downloads a vCard (.vcf)
  straight into the visitor's phone, plus quick **Call / WhatsApp / Email / LinkedIn** buttons
- Personal hero with a profile avatar (drop a photo at `assets/profile.jpg`;
  it falls back to gradient "RK" initials automatically)
- Light / dark theme toggle (remembers your choice)
- Animated network-graph hero canvas (telecom-inspired, pauses when tab hidden)
- Animated KPI counters and skill meters
- Interactive experience timeline with hover effects
- KPI dashboard / consulting-style cards
- Scroll-reveal animations + smooth scrolling
- Accessible: keyboard nav, ARIA labels, `prefers-reduced-motion` respected
- SEO: meta tags, Open Graph, JSON-LD Person schema
- Secure contact form (honeypot anti-spam) with Formspree + mailto fallback
- Fully responsive: desktop / tablet / mobile

## 🧱 Tech stack
| Layer | Choice | Why |
|-------|--------|-----|
| Markup | HTML5 (semantic) | Accessibility + SEO |
| Styling | CSS3 (custom properties, grid, `color-mix`) | Theming, zero dependencies |
| Behavior | Vanilla JS (ES modules-free) | No build, instant load |
| Fonts | Sora + Inter (Google Fonts) | Premium corporate feel |
| Form | [Formspree](https://formspree.io) (free tier) | Sends email with no backend |
| Hosting | Netlify / Vercel / GitHub Pages | Free static hosting + HTTPS |

## 📁 File structure
```
raed-portfolio/
├── index.html          # All page sections
├── css/
│   └── styles.css      # Design tokens, themes, layout, components
├── js/
│   └── main.js         # Theme, nav, reveals, counters, canvas, form
├── assets/             # (optional) profile photo, favicon, CV PDF
└── README.md
```

## 🚀 Setup (local)
No tooling required — just open the file, or run a tiny static server:

```bash
# Python
python -m http.server 5500
# then visit http://localhost:5500

# or Node
npx serve .
```

## ✉️ Contact form
The form posts to [FormSubmit.co](https://formsubmit.co) — no account or API key
required. Submissions are emailed to `kanaan5g@gmail.com`.

**One-time activation:** the first time the form is submitted, FormSubmit emails
`kanaan5g@gmail.com` a confirmation link — click **"Activate Form"** once and all
future submissions are delivered automatically. The JS submits via AJAX and shows
inline success/error states without leaving the page.

To change the recipient, edit the email in the `<form action="https://formsubmit.co/ajax/…">`
in `index.html`.

## 🌍 Deployment
**Netlify (drag & drop):** go to https://app.netlify.com/drop and drop the
`raed-portfolio` folder. Live in seconds with HTTPS.

**Vercel:** `npm i -g vercel` → `vercel` in the folder → follow prompts.

**GitHub Pages:** push to a repo → Settings → Pages → deploy from `main` / root.

**Custom domain:** add e.g. `raedkenaan.com` in your host's domain settings and
update the `<link rel="canonical">` + `og:url` in `index.html`.

## 🔧 Suggestions to take it further
- Add a professional headshot in the hero and an Open Graph share image.
- Add a downloadable PDF CV button (`assets/raed-kenaan-cv.pdf`).
- Add a world-map SVG marking the 8 countries you've operated in.
- Add testimonials / references from CEOs and partners.
- Add Plausible or Google Analytics to track recruiter visits.
- Wire reCAPTCHA / Formspree spam filtering for extra form protection.
- Convert to Astro or Next.js later if you want a blog or CMS.
