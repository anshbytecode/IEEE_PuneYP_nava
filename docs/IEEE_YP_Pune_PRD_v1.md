**IEEE YP Pune — Product Requirements Document v1.0**   |   AI Agent Knowledge Base

**IEEE YOUNG PROFESSIONALS**

**Pune Section — Official Website**


**Product Requirements Document**

AI Agent Knowledge Base & Complete Build Specification

|<p>Version 1.0   |   May 2025</p><p>**Project Deadline: 31 July 2025**</p><p>Mentor: Vineet Patil   |   Lead: Rakshit Jain</p><p>Team: Harsh Lal  |  Ayush Sahare  |  Anshul  |  Harsh Khairnar</p>|
| :-: |

*This document is the single source of truth for the IEEE YP Pune website project.*

*All sections are cross-referenced. Use this as context for every AI-assisted build session.*



**1. Product Requirements Document (PRD)**

This section defines what is being built, why it exists, who it is for, what success looks like, and the exact boundaries of the project scope. Every build decision must be justified against this section.

**1.1 Product Overview**

The IEEE Young Professionals (YP) Pune Section website is a full-stack web application that serves as the official digital presence of the IEEE YP Pune chapter. It has two distinct audiences: the general public (website visitors, students, engineers, IEEE members) and internal IEEE committee members who manage the site's content.

The public-facing site provides information about events, campaigns, blog posts, resources, and membership. The admin-facing Custom CMS allows committee members to manage all content through a secure dashboard — without writing any code or touching deployment pipelines.

**1.2 Problem Statement**

The existing IEEE Gujarat and Kerala section websites (the reference benchmarks) are largely static — content is updated by manually editing code or WordPress entries, requiring developer involvement for every change. This creates a bottleneck: non-technical committee members cannot update event listings, team bios, or announcements without requesting developer support. The Pune section website must solve this with a dynamic CMS-driven architecture from day one.

**1.3 Target Users**

|**User Type**|**Who They Are**|**Primary Goal**|
| :- | :- | :- |
|Public Visitor|Students, engineers, prospective IEEE members browsing the site|Discover events, read blog posts, download resources, register for events, learn about IEEE YP|
|IEEE Member|Existing IEEE YP members|Stay informed about campaigns, upcoming events, YP Talks, newsletters|
|Chapter Admin|Non-technical IEEE committee members — Chairs, Secretaries, Event Leads|Update events, publish blog posts, manage team bios, toggle announcements — without any code|
|Developer / Intern|The 4 interns building the project|Build, test, and maintain the codebase using this PRD as specification|

**1.4 Core Features**

**Public-Facing Features**

- Dynamic Events page — upcoming and past events with filters, photo gallery, in-page RSVP registration form
- About Us page — chapter story, mission & vision, IEEE affiliation, office bearers with photos, milestone timeline
- Campaigns page — IEEE YP campaign showcase (e.g. #Engineer4Life) with hero images and archive
- Blog / Resources page — published articles, webinar recordings (YouTube embeds), downloadable PDFs
- YP Talks page — speaker profiles, video embeds, upcoming workshop registration links
- Join Us page — IEEE membership benefits, sign-up CTA to IEEE.org, membership inquiry form
- Contact page — contact form with email notification to chapter leads
- Newsletter subscription — email capture in footer/homepage
- Site-wide announcement banner — dismissible, driven by admin toggle
- Fully responsive design — 320px to 1920px, IEEE Brand compliant

**Admin CMS Features**

- Secure admin login — PIN/password + JWT authentication
- Events management — full CRUD: create, edit, soft-delete, image upload via Cloudinary
- Team management — add/edit/remove office bearers with photo upload
- Blog management — create/edit/delete posts with rich text and images
- Media library — upload images and PDFs to Cloudinary, delete with cleanup
- Announcements — toggle site-wide banner on/off, edit text
- Registrations viewer — see all event registrations by event or date
- Dashboard — summary stats: event count, registration count, recent activity

**1.5 Success Criteria**

The project is considered DONE when ALL of the following are true:

|**Criteria**|**Metric**|**How Verified**|
| :- | :- | :- |
|Performance|Lighthouse Performance score ≥ 90 on mobile + desktop|GitHub Actions Lighthouse CI on every PR + manual audit on production URL|
|Accessibility|Lighthouse Accessibility score ≥ 90, WCAG 2.1 Level AA|axe-core automated testing + Lighthouse CI|
|SEO|Lighthouse SEO score ≥ 95|Lighthouse CI + meta tags present on all pages|
|Best Practices|Lighthouse Best Practices score ≥ 90|Lighthouse CI|
|First Contentful Paint|< 1.5 seconds on 4G mobile|Chrome DevTools Throttled + WebPageTest|
|Mobile Responsiveness|Works correctly from 320px to 1920px|Chrome DevTools device emulation + BrowserStack|
|IEEE Brand Compliance|Sign-off from exd-team@ieee.org|Submit for brand review in Week 9|
|Content Management|Non-technical admin can add event with image in < 5 minutes|User acceptance test with a real committee member|
|Email Delivery|Registration confirmation email received in < 30 seconds|Manual end-to-end test on production|
|CI/CD|PR with Lighthouse score < 90 is automatically blocked|GitHub Actions workflow validation|
|Deployment|Live site updates within 2 minutes of merge to main|Time merge → verify live site|

**1.6 In Scope**

- Public website with all 11 pages listed in the App Flow section
- Custom CMS Admin Panel with full CRUD for events, team, blog, media, announcements
- REST API backend — Node.js + Express with all public and admin endpoints
- PostgreSQL database on Supabase with PgBouncer connection pooling
- Cloudinary media CDN — image upload pipeline with auto WebP compression
- Resend email service — event registration confirmations + chapter lead notifications
- JWT + bcrypt authentication for the admin panel
- GitHub Actions CI/CD — Lighthouse CI gate + auto-deploy to Vercel + Railway
- Google Analytics 4 integration
- IEEE Brand compliant design — #006699 blue, Open Sans font, WCAG 2.1 AA
- Fully responsive design — mobile first, 320px to 1920px

**1.7 Out of Scope**

|<p>**❌  User authentication for public visitors (no public login/signup system)**</p><p>**❌  Payment processing (no paid events or membership fees handled in-app)**</p><p>**❌  Real-time features (no WebSockets, live chat, or push notifications)**</p><p>**❌  Multi-language / i18n support**</p><p>**❌  Native mobile app (iOS / Android)**</p><p>**❌  Third-party SSO (no Google/GitHub OAuth for admin)**</p><p>**❌  AI chatbot or AI-powered features**</p><p>**❌  Forum, discussion boards, or community features**</p><p>**❌  Email newsletter sending (Resend only handles transactional — not bulk newsletters)**</p><p>**❌  Automated content migration from existing Gujarat/Kerala sites**</p>|
| :- |

**1.8 Constraints & Non-Negotiables**

- All IEEE Brand Guidelines are mandatory — primary colour #006699, Open Sans font, real photography only (no AI-generated images)
- IEEE brand review required before launch — submit to exd-team@ieee.org in Week 9
- Footer must include: IEEE Privacy Policy, Terms & Conditions, and Nondiscrimination Policy links — non-negotiable
- All images must have descriptive alt text — WCAG 2.1 AA is mandatory per IEEE
- Budget: free tiers only (Vercel, Railway, Supabase, Cloudinary, Resend) unless mentor provides otherwise
- Deadline: 31 July 2025 — fixed



**2. App Flow & Navigation**

This section defines every page in the application, how users navigate between them, the complete user journeys, and what data is required on each page. This is the authoritative reference for routing and UX behaviour.

**2.1 Route Map**

|**Route**|**Page Name**|**Public/Protected**|**Data Source**|**Owner**|
| :- | :- | :- | :- | :- |
|/|Homepage|Public|GET /api/announcements + static|Harsh Khairnar|
|/about|About Us|Public|GET /api/team + static|Harsh Lal|
|/events|Events Listing|Public|GET /api/events|Ayush Sahare|
|/events/:id|Event Detail|Public|GET /api/events/:id|Ayush Sahare|
|/campaigns|Campaigns|Public|GET /api/campaigns|Anshul|
|/blog|Blog Listing|Public|GET /api/blog|Anshul|
|/blog/:id|Blog Post|Public|GET /api/blog/:id|Anshul|
|/resources|Resources|Public|GET /api/resources|Anshul|
|/yp-talks|YP Talks|Public|Static + API|Harsh Khairnar|
|/join|Join Us|Public|Static + POST /api/newsletter|Harsh Khairnar|
|/contact|Contact|Public|POST /api/contact|Harsh Khairnar|
|/admin|Admin Login|Protected (pre-auth)|POST /api/admin/login|All interns|
|/admin/dashboard|CMS Dashboard|Protected (JWT)|GET /api/admin/dashboard|All interns|
|/admin/events|Events CMS|Protected (JWT)|CRUD /api/admin/events|All interns|
|/admin/team|Team CMS|Protected (JWT)|CRUD /api/admin/team|All interns|
|/admin/blog|Blog CMS|Protected (JWT)|CRUD /api/admin/blog|All interns|
|/admin/media|Media Library|Protected (JWT)|POST/DELETE /api/admin/media|All interns|
|/admin/registrations|Registrations Viewer|Protected (JWT)|GET /api/admin/registrations|All interns|
|\*|404 Not Found|Public|Static|Any|

**2.2 Navigation Structure**

**Primary Navbar (all public pages)**

- IEEE YP Pune logo (left) — links to /
- Navigation links: About | Events | Campaigns | Blog | Resources | YP Talks | Join
- CTA button: Contact Us (links to /contact)
- Hamburger menu on mobile (< 768px) — slides in from right
- Active link highlighted with #006699 underline

**Footer (all public pages)**

- IEEE YP Pune logo + short description
- Quick links: all main nav pages
- Social media icons: LinkedIn, Instagram, Twitter/X, YouTube
- Newsletter email signup input
- MANDATORY IEEE links: Privacy Policy | Terms & Conditions | Nondiscrimination Policy
- Copyright: © 2025 IEEE Young Professionals Pune Section

**Admin Sidebar (all /admin/\* pages)**

- Dashboard | Events | Team | Blog | Media | Registrations | Announcements
- Logout button at bottom — clears sessionStorage JWT and redirects to /admin
- Current page highlighted

**2.3 User Journeys**

**Journey 1: Public Visitor Discovers and Registers for an Event**

1. Visitor lands on / (Homepage) — sees upcoming events preview section
1. Clicks 'View All Events' CTA — navigates to /events
1. Browses events, uses filters (upcoming/past, category) — finds an interesting event
1. Clicks event card — navigates to /events/:id (Event Detail page)
1. Reads full event details, sees photo gallery
1. Scrolls to registration form — fills name, email, IEEE member number (optional), college
1. Clicks 'Register' — sees loading state — sees 'Registration Successful!' message
1. Receives confirmation email in inbox within 30 seconds

**Journey 2: Admin Adds a New Event**

1. Admin navigates to /admin — sees PIN/password login form
1. Enters credentials — clicks 'Login'
1. On success — redirected to /admin/dashboard
1. Clicks 'Events' in sidebar — sees /admin/events with list of all events
1. Clicks 'Add New Event' button — sees event creation form
1. Fills: title, description, date, time, venue, category, selects image file
1. Sees image preview — clicks 'Create Event'
1. Sees success toast — new event appears in list — new event visible on public /events page immediately

**Journey 3: Public Visitor Explores About Page and Joins Newsletter**

1. Clicks 'About' in navbar — navigates to /about
1. Reads chapter story, mission & vision
1. Scrolls down — sees office bearers section with photos, names, roles
1. Scrolls to footer — sees newsletter input
1. Enters email — clicks 'Subscribe' — sees 'Subscribed!' confirmation

**2.4 Page-by-Page Specification**

**Homepage (/)**

- Hero section: IEEE YP Pune title, tagline, two CTAs — 'Explore Events' and 'Join IEEE YP'
- Announcement banner (conditional): if GET /api/announcements returns active, show dismissible banner at top
- About snippet: 3-line description of IEEE YP Pune + 'Learn More' button
- Upcoming Events: 3 EventCards from GET /api/events (limit=3, upcoming only)
- Animated stats counter: X Members | Y Events | Z Student Branches — numbers from static config
- Recent Blog Posts: 3 BlogCards
- Social media links row

**Events Page (/events)**

- Page hero with title 'Events'
- Filter bar: 'Upcoming' / 'Past' toggle + Category dropdown (Workshop, Seminar, Competition, Networking)
- Event grid: EventCard components — title, date, venue, category badge, image, 'Learn More' button
- Empty state: 'No events found' illustration if filters return nothing
- Pagination or 'Load More' if more than 12 events

**Event Detail Page (/events/:id)**

- Full-width hero image (Cloudinary URL)
- Event title, date, time, venue, category badge
- Full description (rich text rendered)
- Photo gallery (if multiple images)
- Registration Form: name (required), email (required), IEEE member no. (optional), college (required), checkbox consent, Submit button
- Success state: replaces form with success message + email confirmation note
- Error state: inline validation errors on each field

**Admin Login (/admin)**

- Centered card layout on dark background
- IEEE YP Pune logo at top
- PIN input + Password input
- 'Login' button — shows loading spinner during API call
- Error message if 401 returned
- On success: stores JWT in sessionStorage under key 'admin_jwt'
- Frontend redirects to /admin/dashboard

**Admin Dashboard (/admin/dashboard)**

- Stats cards: Total Events | Total Registrations | Active Announcements | Team Members
- Recent registrations table: last 10 registrations with event name, registrant name, email, date
- Quick action buttons: Add Event | Add Team Member | Write Blog Post



**3. Tech Stack — Exact Versions**

Every library, framework, and service is pinned to an exact version. No vagueness. When installing, use the exact versions below. Do not upgrade without testing.

**3.1 Frontend Dependencies**

|**Package**|**Version**|**Purpose**|
| :- | :- | :- |
|react|18\.2.0|Core UI library|
|react-dom|18\.2.0|React DOM renderer|
|vite|5\.2.0|Build tool + dev server|
|@vitejs/plugin-react|4\.2.1|Vite plugin for React JSX transform|
|react-router-dom|6\.22.3|Client-side routing — BrowserRouter, Routes, Route, useParams, useNavigate, Navigate|
|tailwindcss|3\.4.3|Utility-first CSS framework|
|autoprefixer|10\.4.19|PostCSS plugin — required by Tailwind|
|postcss|8\.4.38|CSS processing — required by Tailwind|
|axios|1\.6.8|HTTP client for all API calls — supports interceptors for JWT|
|@radix-ui/react-dialog|1\.0.5|Accessible modal/dialog component (shadcn/ui base)|
|@radix-ui/react-dropdown-menu|2\.0.6|Accessible dropdown component|
|@radix-ui/react-toast|1\.1.5|Toast notification primitives|
|@radix-ui/react-select|2\.0.0|Accessible select/dropdown|
|class-variance-authority|0\.7.0|shadcn/ui utility — variant management|
|clsx|2\.1.0|Conditional className merging|
|tailwind-merge|2\.2.2|Merges Tailwind classes without conflicts|
|lucide-react|0\.363.0|Icon library — clean SVG icons|
|framer-motion|11\.0.20|Animations — used minimally, user-controlled only|
|react-helmet-async|2\.0.4|Manages <head> meta tags per page for SEO|
|react-hook-form|7\.51.3|Form state management + validation|
|@hookform/resolvers|3\.3.4|Zod resolver bridge for react-hook-form|
|zod|3\.22.4|Schema validation for forms|

**3.2 Backend Dependencies**

|**Package**|**Version**|**Purpose**|
| :- | :- | :- |
|express|4\.18.3|Web framework — routing, middleware, request handling|
|cors|2\.8.5|CORS middleware — restricts origins to frontend domain|
|dotenv|16\.4.5|Loads .env variables into process.env|
|jsonwebtoken|9\.0.2|Signs and verifies JWT tokens for admin auth|
|bcrypt|5\.1.1|Password hashing with salt rounds for admin credentials|
|multer|1\.4.5-lts.1|Multipart form data parser — memory storage for Cloudinary upload|
|cloudinary|2\.2.0|Cloudinary Node.js SDK — upload_stream, destroy|
|resend|3\.2.0|Resend email SDK — sends transactional emails|
|pg|8\.11.5|node-postgres — direct PostgreSQL queries|
|express-validator|7\.0.1|Request body validation middleware|
|helmet|7\.1.0|Security headers middleware|
|express-rate-limit|7\.2.0|Rate limiting on auth endpoints (prevents brute force)|
|morgan|1\.10.0|HTTP request logging for development|
|nodemon|3\.1.0|Dev-only: auto-restarts server on file changes|

**3.3 External Services & APIs**

|**Service**|**Plan**|**Purpose**|**Key Config**|
| :- | :- | :- | :- |
|Vercel|Free Hobby|Frontend hosting — React SPA on global CDN. Auto-deploy on push to main.|Connect to GitHub repo. Set VITE_API_URL env var.|
|Railway|Free Starter|Backend hosting — Node.js + Express API server.|Connect to GitHub repo. Set all backend env vars.|
|Supabase|Free|Managed PostgreSQL + PgBouncer connection pooling. 512MB storage.|Create project. Use pooled connection string (port 6543) for app. Direct string (port 5432) for migrations only.|
|Cloudinary|Free|Image and PDF CDN. Auto WebP. 25GB storage, 25GB bandwidth/month.|Create upload preset. Enable auto-format and auto-quality.|
|Resend|Free|Transactional emails. 3,000 emails/month.|Verify sender domain. Use API key.|
|Google Analytics 4|Free|Traffic tracking — required by IEEE brief.|Create GA4 property. Inject Measurement ID via VITE_GA_MEASUREMENT_ID.|
|GitHub|Free (Private)|Source control. Branch-per-intern workflow. CI/CD via Actions.|Private repo. Enable branch protection on main.|
|GitHub Actions|Free (2000 min/mo)|Lighthouse CI gate on every PR. Blocks merge if score < 90.|lighthouse.yml workflow file.|

**3.4 Development Tools**

- Node.js 20.x LTS — minimum version required
- npm 10.x — package manager
- VS Code — recommended editor
- Prettier 3.2.5 + ESLint 8.57.0 — code formatting and linting
- @typescript-eslint/* — optional but recommended
- Postman or Insomnia — API testing during development
- axe DevTools Chrome extension — WCAG accessibility testing
- Chrome DevTools — performance profiling and responsive testing


**4. Frontend Design Guidelines**

This section is the complete design system for the IEEE YP Pune website. Every visual decision — colours, typography, spacing, components, animations — is defined here. All four interns must follow this exactly. Any deviation must be discussed with the team first.

**4.1 Colour System**

The Young Professionals branding philosophy dictates that **IEEE Blue remains the dominant interface color**, while Young Professionals Green and Orange are reserved as supporting accent colors. 

As a conceptual design guideline (not a strict implementation rule), the visual balance should approximately be:
- 60% IEEE Blue
- 25% White
- 10% Neutral
- 3% YP Green
- 2% YP Orange

### Official Brand Palette

|**Token Name**|**Hex Value**|**Semantic Usage & Intent**|
| :- | :- | :- |
|ieee-primary|#006699|**Main CTA, Links, Navigation, Active states**. IEEE Blue remains the visually dominant color.|
|ieee-secondary|#005E85|**Decorative gradients, Hover states, Secondary icons**.|
|yp-green|#007035|**Awards, Recognition, Success, Impact, Positive metrics**.|
|yp-orange|#F17927|**Featured, Upcoming, Callouts, Small highlights**.|
|neutral / gray-800|#1F2937|**Typography, Body text**.|
|white|#FFFFFF|**Card surfaces, Modal backgrounds, Input fields**.|

*(Note: Legacy tokens like `ieee-teal` (#00B2A9) and `ieee-light` (#E8F4F8) are retained in the codebase for backward compatibility. Do not modify existing component implementations solely to increase the visibility of the new colors. Existing components should continue to look consistent unless they violate the centralized design system.)*

**4.2 Tailwind CSS Configuration**

The Tailwind V4 configuration is defined centrally in `frontend/src/index.css` via `@theme`. All interns must use these CSS variables and semantic utilities. **Never hardcode hex values.**

`      `fontFamily: {

`        `sans: ['Open Sans', 'system-ui', 'sans-serif'],

`      `},

`      `fontSize: {

`        `base: ['15px', { lineHeight: '1.5' }],  // IEEE minimum body size

`      `},

`      `spacing: {

`        `'18': '4.5rem',  // Custom spacing token

`      `},

`    `},

`  `},

`  `plugins: [],

};

**4.3 Typography**

|**Element**|**Font**|**Size**|**Weight**|**Colour**|**Notes**|
| :- | :- | :- | :- | :- | :- |
|Page Title (H1)|Open Sans|36px / 2.25rem|700 Bold|#003D5C|Hero sections, page headers|
|Section Heading (H2)|Open Sans|28px / 1.75rem|700 Bold|#006699|Section titles|
|Card Title (H3)|Open Sans|20px / 1.25rem|600 SemiBold|#1F2937|Card and component titles|
|Body Text|Open Sans|15px / 0.9375rem|400 Regular|#1F2937|Minimum size per IEEE rules|
|Small / Meta|Open Sans|13px / 0.8125rem|400 Regular|#6B7280|Dates, categories, captions|
|Button Text|Open Sans|15px / 0.9375rem|600 SemiBold|Varies|All button labels|
|Nav Links|Open Sans|15px / 0.9375rem|500 Medium|#1F2937|Active state: #006699|
|Code / Monospace|Courier New|13px / 0.8125rem|400 Regular|#1E293B|Code snippets only|

Import Open Sans in index.html:

<link rel="preconnect" href="https://fonts.googleapis.com">

<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

**4.4 Spacing & Layout System**

- Base unit: 4px (Tailwind's default 1 = 4px)
- Page max-width: 1280px (max-w-7xl in Tailwind) — centered with auto margins
- Page horizontal padding: px-4 (mobile) → px-6 (tablet) → px-8 (desktop)
- Section vertical padding: py-16 (64px) on desktop, py-10 (40px) on mobile
- Card padding: p-6 (24px)
- Grid gap: gap-6 (24px) for cards, gap-4 (16px) for form elements
- Border radius: rounded-lg (8px) for cards, rounded-md (6px) for buttons, rounded-full for badges
- Shadow: shadow-md on cards (default), shadow-lg on hover

**4.5 Component Specifications**

**Primary Button**

- Background: bg-ieee-blue (#006699)
- Text: text-white, font-semibold, text-[15px]
- Padding: px-6 py-3 (24px × 12px)
- Border radius: rounded-md
- Hover: bg-ieee-dark (#003D5C), transition-colors duration-200
- Disabled: opacity-50 cursor-not-allowed
- Loading: show spinner icon + 'Loading...' text, disabled

**Secondary Button**

- Background: bg-white
- Border: border border-ieee-blue text-ieee-blue
- Hover: bg-ieee-light

**Event Card**

- Container: bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200
- Image: w-full h-48 object-cover (from Cloudinary URL, WebP format)
- Body: p-6
- Category badge: inline-block px-3 py-1 rounded-full text-xs font-semibold bg-ieee-light text-ieee-blue
- Title: text-xl font-bold text-gray-900 mt-2
- Date + Venue: text-sm text-ieee-gray with calendar/location icons from lucide-react
- CTA: 'Learn More' button — text-ieee-blue font-semibold hover:underline

**Navbar**

- Position: sticky top-0, z-50, bg-white/95 backdrop-blur-sm
- Border: border-b border-gray-100
- Height: h-16 (64px)
- Logo: height 40px, IEEE blue version
- Nav links: gap-8, text-[15px] font-medium text-gray-700, hover:text-ieee-blue
- Active link: text-ieee-blue border-b-2 border-ieee-blue
- Mobile: hamburger icon (Menu from lucide-react), slide-in drawer on right, w-72

**Announcement Banner**

- Full width, bg-ieee-blue text-white
- Content: centered text + dismiss X button on right
- Padding: py-3 px-4
- Dismiss: stores 'banner_dismissed' in sessionStorage — does not reappear in same session

**4.6 Responsive Breakpoints**

|**Breakpoint**|**Tailwind Prefix**|**Screen Width**|**Behaviour**|
| :- | :- | :- | :- |
|Mobile (default)|(none)|320px – 767px|Single column, hamburger menu, stacked layout|
|Tablet|md:|768px – 1023px|2-column cards, expanded nav visible|
|Desktop|lg:|1024px – 1279px|3-column cards, full nav, wider sections|
|Wide|xl:|1280px+|Max-width 1280px centered, same as desktop layout|

**4.7 Animation Guidelines**

Framer Motion is used minimally. ALL animations must respect prefers-reduced-motion. Never autoplay without user control.

- Page entrance: fade in + slight translateY — initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
- Card hover: scale(1.02) — use Tailwind hover:scale-[1.02] transition-transform duration-200 (no Framer needed)
- Staggered lists: staggerChildren: 0.08s — only for card grids on initial load
- Stats counter: count up animation on scroll into view — use framer-motion whileInView
- NO looping animations, NO autoplay videos, NO animations that block interaction


**5. Backend Schema & Architecture**

This section is the complete backend specification — every database table, every column, every relationship, the authentication flow, and all security rules. This is the authoritative reference for all backend development.

**5.1 Database: PostgreSQL on Supabase**

- Database: PostgreSQL 15
- Hosting: Supabase (managed) with PgBouncer connection pooling built in
- Connection strings: use port 6543 (pooled) for the app, port 5432 (direct) for migrations only
- SSL: required on all connections (ssl: { rejectUnauthorized: false } in pg config)
- Soft deletes: events and blogs use is_deleted BOOLEAN DEFAULT false — never hard delete
- Timestamps: all tables have created_at TIMESTAMPTZ DEFAULT NOW()

**5.2 Complete Table Schema**

**Table: events**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()|Auto-generated|
|title|VARCHAR(255)|NOT NULL|Event title|
|description|TEXT|NOT NULL|Full event description — may contain HTML|
|date|DATE|NOT NULL|Event date|
|time|TIME||Event start time — nullable|
|venue|VARCHAR(255)||Location or 'Online'|
|category|VARCHAR(50)|NOT NULL DEFAULT 'General'|Workshop | Seminar | Competition | Networking | General|
|image_url|TEXT||Cloudinary CDN URL — nullable for text-only events|
|is_deleted|BOOLEAN|NOT NULL DEFAULT false|Soft delete flag — never hard delete|
|is_published|BOOLEAN|NOT NULL DEFAULT true|Draft support — false = not visible on public site|
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||
|updated_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()|Updated via trigger|

**Table: event_registrations**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|event_id|UUID|NOT NULL REFERENCES events(id) ON DELETE CASCADE|FK to events|
|full_name|VARCHAR(255)|NOT NULL||
|email|VARCHAR(255)|NOT NULL|Confirmation email sent here|
|ieee_member_no|VARCHAR(50)||Optional|
|college|VARCHAR(255)|NOT NULL||
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()|Registration timestamp|

**Table: team**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|name|VARCHAR(255)|NOT NULL|Full name|
|role|VARCHAR(255)|NOT NULL|Title/role in IEEE YP Pune|
|photo_url|TEXT||Cloudinary CDN URL|
|bio|TEXT||Short bio — nullable|
|linkedin_url|TEXT||LinkedIn profile URL — nullable|
|order_index|INTEGER|NOT NULL DEFAULT 0|Controls display order|
|is_active|BOOLEAN|NOT NULL DEFAULT true|false = not shown on public site|
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||

**Table: blogs**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|title|VARCHAR(255)|NOT NULL||
|content|TEXT|NOT NULL|HTML or Markdown content|
|author|VARCHAR(255)|NOT NULL|Author display name|
|cover_image_url|TEXT||Cloudinary CDN URL|
|is_published|BOOLEAN|NOT NULL DEFAULT false|false = draft|
|is_deleted|BOOLEAN|NOT NULL DEFAULT false|Soft delete|
|published_at|TIMESTAMPTZ||Set when is_published becomes true|
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||
|updated_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||

**Table: campaigns**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|title|VARCHAR(255)|NOT NULL|e.g. #Engineer4Life|
|description|TEXT|NOT NULL||
|hero_image_url|TEXT||Cloudinary CDN URL|
|start_date|DATE||| 
|end_date|DATE||nullable = ongoing|
|is_active|BOOLEAN|NOT NULL DEFAULT true||
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||

**Table: resources**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|title|VARCHAR(255)|NOT NULL|Resource display name|
|category|VARCHAR(50)|NOT NULL DEFAULT 'General'|PDF | Video | Article | Guide|
|file_url|TEXT|NOT NULL|Cloudinary CDN URL (PDF) or YouTube URL|
|description|TEXT||Short description|
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||

**Table: announcements**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|message|TEXT|NOT NULL|Announcement text shown in banner|
|is_active|BOOLEAN|NOT NULL DEFAULT false|Only ONE active at a time — enforce in API logic|
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||
|expires_at|TIMESTAMPTZ||Nullable — auto-deactivate after date|

**Table: newsletter_subscribers**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|email|VARCHAR(255)|NOT NULL UNIQUE|UNIQUE prevents duplicate subscriptions|
|name|VARCHAR(255)||Optional|
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||

**Table: contact_submissions**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|name|VARCHAR(255)|NOT NULL||
|email|VARCHAR(255)|NOT NULL||
|subject|VARCHAR(255)|NOT NULL||
|message|TEXT|NOT NULL||
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||

**Table: admin_users**

|**Column**|**Type**|**Constraints**|**Notes**|
| :- | :- | :- | :- |
|id|UUID|PRIMARY KEY DEFAULT gen_random_uuid()||
|email|VARCHAR(255)|NOT NULL UNIQUE|Admin email|
|password_hash|TEXT|NOT NULL|bcrypt hash — NEVER store plain text|
|pin_hash|TEXT||Optional PIN hash — alternative login|
|created_at|TIMESTAMPTZ|NOT NULL DEFAULT NOW()||

**5.3 Database Indexes**

|**Table**|**Column(s)**|**Index Type**|**Reason**|
| :- | :- | :- | :- |
|events|is_deleted, is_published, date|Composite|Speeds up public events query with filters|
|event_registrations|event_id|B-tree|Speeds up 'registrations for event X' admin query|
|event_registrations|email|B-tree|Speeds up duplicate check on registration|
|blogs|is_deleted, is_published, published_at|Composite|Speeds up public blog listing|
|team|is_active, order_index|Composite|Speeds up team page query|
|announcements|is_active|B-tree|Speeds up announcement banner check on every page load|
|newsletter_subscribers|email|Unique Index|Enforces uniqueness + speeds up duplicate check|

**5.4 Authentication Flow**

**Registration / Seed (one-time setup)**

1. Admin user is created via a seed script (never through a public API endpoint)
1. Seed script: takes plain-text password → bcrypt.hash(password, 12) → stores hash in admin_users table
1. bcrypt cost factor: 12 (strong, ~250ms on modern hardware — acceptable for a single admin)

**Login Flow**

1. Admin POST /api/admin/login with { email, password } (or { pin })
1. Express queries admin_users WHERE email = $1
1. bcrypt.compare(plainPassword, storedHash) → returns boolean
1. If false: return 401 { error: 'Invalid credentials' } — no hint about which field is wrong
1. If true: jwt.sign({ adminId, email }, JWT_SECRET, { expiresIn: '8h' }) → returns token
1. Frontend stores token in sessionStorage under key 'admin_jwt'
1. Frontend redirects to /admin/dashboard

**Protected Request Flow**

1. Every admin API call: React includes header Authorization: Bearer <token>
1. verifyToken middleware: extracts token from header → jwt.verify(token, JWT_SECRET)
1. If invalid/expired: 401 Unauthorized immediately — no downstream handler executes
1. If valid: attaches req.admin = decoded payload → calls next()
1. Route handler executes with confirmed admin identity

|<p>**★  JWT STORAGE DECISION — sessionStorage vs localStorage:**</p><p>`    `We use sessionStorage. This clears when the browser tab is closed.</p><p>`    `PROS: automatic logout if admin walks away and closes tab — more secure for shared terminals.</p><p>`    `CONS: admin must re-login if they close the tab accidentally.</p><p>`    `TRADEOFF ACCEPTED: security > convenience for an admin panel managing public-facing content.</p><p>`    `If mentor requests localStorage, change only the storage key — all other auth logic stays identical.</p>|
| :- |

**5.5 API Security Rules**

- CORS: only allow requests from VITE_FRONTEND_URL — reject all others
- Rate limiting: POST /api/admin/login limited to 10 requests per 15 minutes per IP (express-rate-limit)
- Helmet.js: sets security headers — X-Content-Type-Options, X-Frame-Options, etc.
- Input validation: express-validator on ALL POST/PUT endpoints — never trust client data
- SQL: use parameterised queries via pg — never string-concatenate user input into SQL
- Environment secrets: JWT_SECRET minimum 32 random characters — generated with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
- HTTPS: enforced by Railway/Render and Vercel — never serve over plain HTTP in production


**6. Implementation Plan**

This is the exact build sequence for the AI agent or any intern working on the project. Follow this order strictly. Each step has a clear definition of done. Do not proceed to the next step until the current one passes its done criteria.

[...the rest of the original file continues unchanged...]
