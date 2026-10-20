# Academic & Scientific Portfolio — Ms. Waheedunnisa Nizamuddin Chaudri

Production-grade academic portfolio and research repository for **Ms. Waheedunnisa Nizamuddin Chaudri** (also referenced as **Waheeda Chaudhary**), Ph.D. Research Scholar and Assistant Professor in the Department of Microbiology at **SIES College of Arts, Science and Commerce (Empowered Autonomous)**, Sion West, Mumbai (affiliated with the University of Mumbai).

---

## 1. Academic & Research Summary

* **Discipline:** Microbiology, Waste Valorization, Biotechnology & STEM Pedagogy
* **Doctoral Research Topic:** *“Use of Microflora from ensilage marigold temple waste to efficiently extract phytobiotic pigments (Xanthophyll and Carotene) and study their effect on pigmentation of catfish”* (Supervised by Dr. Shruti L. Samant).
* **Key Peer-Reviewed Article:** *“Study the flora in Marigold ensilage made from temple waste and evaluate the phytobiotic compounds developed”*, Journal of Emerging Technologies and Innovative Research (JETIR), August 2022, Vol. 9, Issue 8, ISSN: 2349-5162, Paper ID: JETIR2208451.
* **Textbook Co-Authorship:** *“B. Sc. Semester II, Major Microbiology Course (Practical)”*, published by My Rays Publishing House, Pune (ISBN: 978-93-94943-21-6).
* **Pedagogical Research:** *“Enhancing Learning Retention through Mind Maps, Pre-lab Worksheets and Interactive Quizzes: An Experiential Approach”* (SIES College & ResearchGate).
* **Conventions:** University of Mumbai *Aavishkar* Inter-Collegiate Research Convention (Animal Husbandry & Agriculture category).
* **Digital Profiles:**
  * LinkedIn: [waheedunnisa-chaudri-51a0b71a1](https://in.linkedin.com/in/waheedunnisa-chaudri-51a0b71a1)
  * Instagram: [@waheedachaudhary1](https://www.instagram.com/waheedachaudhary1/)
  * ResearchGate: [Waheedunnisa-Chaudri](https://www.researchgate.net/profile/Waheedunnisa-Chaudri)

---

## 2. Production Engineering Standards

This project adheres to rigorous production standards:

1. **No AI Slop:** No generic SaaS gradients, no Inter/shadcn generic template, no placeholder text. Bespoke editorial styling using Newsreader and JetBrains Mono with a botanical forest green (`#153E31`) and lutein amber (`#B86E06`) palette.
2. **Accessible UI/UX (WCAG 2.1 AA):** Native light/dark theme switching via CSS variables, screen reader skip links, semantic landmarks, high contrast ratios, touch targets &ge; 44px, and full keyboard operability.
3. **India DPDP Act 2023 & GDPR Compliance:** Dedicated privacy policy, explicit opt-in consent checkboxes, automated data minimization, zero third-party tracker injection, and honeypot spam bot trapping.
4. **Resilient Backend:** Built with Express, Helmet (strict CSP, HSTS, X-Frame-Options), CORS, structured JSON logging, rate limiting (10 inquiries/hr per IP), and schema validation using Zod.
5. **SEO / AEO / GEO Optimization:** Semantic HTML, single H1 hierarchy, OpenGraph, Twitter card tags, Schema.org JSON-LD (`Person`, `ScholarlyArticle`, `FAQPage`), sitemap.xml, robots.txt, and local Mumbai geo tags.
6. **Built-in Citation Tools:** One-click APA (7th Edition) and BibTeX citation generation and clipboard copy for all published papers.
7. **Interactive Mind Map Component:** Three-stage experiential learning framework demonstrator for STEM microbiology educators.

---

## 3. Directory Layout

```text
waheedunnisa-portfolio/
├── .env.example              # Environment variables template
├── .gitignore                # Production ignore patterns
├── package.json              # Scripts and production dependencies
├── server.js                 # Production Express HTTP server
├── vercel.json               # Vercel deployment configuration
├── netlify.toml              # Netlify deployment configuration
├── README.md                 # Complete documentation
├── api/
│   ├── contact.js            # POST /api/contact handler with Zod validation
│   ├── health.js             # GET /api/health and /health endpoint
│   ├── logger.js             # Structured JSON logger with timestamp & request ID
│   └── publications.js       # GET /api/publications handler with category filtering
├── public/
│   ├── index.html            # Main academic portfolio page
│   ├── publications.html     # Dedicated research archive & citation exporter
│   ├── teaching.html         # Courses, practical manual, and experiential pedagogy
│   ├── contact.html          # Academic collaboration and inquiry channel
│   ├── privacy.html          # DPDP Act 2023 & GDPR compliance notice
│   ├── terms.html            # Academic fair-use & citation policy
│   ├── accessibility.html    # WCAG 2.1 AA accessibility statement
│   ├── 404.html              # Custom on-brand 404 page
│   ├── 500.html              # Custom on-brand 500 error recovery page
│   ├── favicon.svg           # Custom cellular / microbial SVG icon
│   ├── robots.txt            # Search crawler directives
│   ├── sitemap.xml           # XML sitemap with canonical URLs
│   ├── css/
│   │   ├── tokens.css        # CSS variables: light/dark themes, spacing, typography
│   │   ├── base.css          # Semantic reset, focus states, typography scale
│   │   ├── components.css    # Navigation, cards, modals, forms, mind map
│   │   └── utilities.css     # Print styles, helper classes
│   ├── js/
│   │   ├── app.js            # Theme toggle, mobile drawer, toast notifications, modals
│   │   ├── error-boundary.js # Global error handler and crash recovery banner
│   │   ├── publications-filter.js # Real-time search, category filter, citation tool
│   │   ├── mindmap-interactive.js # 3-stage interactive pedagogy framework
│   │   └── contact-form.js   # Client-side validation, DPDP consent, API submit
│   └── data/
│       ├── publications.json # Real verified publications dataset
│       ├── courses.json      # SIES microbiology syllabus modules
│       └── research-projects.json # Doctoral investigation dossier
└── tests/
    └── api.test.js           # Automated integration and validation tests
```

---

## 4. Quickstart & Local Execution

### Prerequisites
* Node.js &ge; 18.x (tested on v24.19.0)
* npm &ge; 9.x

### Installation
```bash
cd waheedunnisa-portfolio
npm install
```

### Running Tests
Execute the built-in Node test runner:
```bash
npm test
```
Runs 7 automated tests covering:
* Health check availability (`/health`)
* Publications retrieval & category filtering (`/api/publications`)
* Zod validation failure states (`/api/contact`)
* Bot honeypot trapping
* DPDP consent enforcement
* Valid inquiry submission

### Starting the Server
```bash
# Production Mode
npm start

# Development Mode with File Watching
npm run dev
```

Server will start on `http://localhost:3000`.

---

## 5. API Reference

All API responses follow the consistent shape:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### `GET /health`
Returns system uptime, memory allocation, and environment readiness.

### `GET /api/publications`
Query parameters:
* `category`: Filter by `waste-valorization`, `pedagogy`, `textbook`, `doctoral-research`, `conference`
* `search`: Full-text substring search over titles, abstracts, authors, and keywords

### `POST /api/contact`
Submits an academic or speaking inquiry.
* **Rate limit:** 10 requests / hour / IP
* **Payload:**
```json
{
  "fullName": "Dr. Ramesh Kumar",
  "email": "ramesh@university.ac.in",
  "affiliation": "Department of Biotechnology",
  "subject": "research_collaboration",
  "message": "We would like to propose a collaborative study on carotenoid stability.",
  "dpdpConsent": true,
  "website": ""
}
```

---

## 6. Deployment Guides

### A. Vercel
1. Install Vercel CLI or import repository to Vercel dashboard.
2. Root directory: `waheedunnisa-portfolio`.
3. Pre-configured `vercel.json` automatically manages clean URLs, security headers, and page routing.

### B. Netlify
1. Connect repository to Netlify.
2. Base directory: `waheedunnisa-portfolio`.
3. Publish directory: `public`.
4. Pre-configured `netlify.toml` sets strict security headers and clean URL rewrites.

### C. VPS / Docker / PM2
```bash
cd waheedunnisa-portfolio
npm install --omit=dev
PORT=8080 NODE_ENV=production pm2 start server.js --name "waheedunnisa-portal"
```

---

## 7. Pre-Deployment Verification Checklist

- [x] Zero secrets or API keys exposed in client bundles.
- [x] All 7 automated backend tests passing (`npm test`).
- [x] Custom on-brand 404 (`404.html`) and 500 (`500.html`) pages tested.
- [x] Mobile, tablet, and desktop responsive breakpoints verified.
- [x] Client-side AND server-side Zod input validation active.
- [x] Structured JSON request and error logger in place.
- [x] SEO meta tags, OpenGraph, Twitter Cards, sitemap.xml, and robots.txt verified.
- [x] Schema.org `Person`, `ScholarlyArticle`, and `FAQPage` JSON-LD configured.
- [x] DPDP Act 2023 explicit opt-in consent and data minimization notice active.
- [x] WCAG 2.1 AA keyboard accessibility and contrast compliance tested.
