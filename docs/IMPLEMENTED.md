# IEEE YP Pune CMS — Full Implementation Log

> **⚠️ Mandatory reading for every agent.** Read this file fully before writing a single line of code in this codebase. This log contains the minute details of the entire implementation (Frontend, Backend, and Database) up to the current point.

---

## 1. Changelog & Project Evolution

| Date | Component | Change Details |
|------|-----------|----------------|
| Current | **Full Stack Integration** | Established full end-to-end integration between Vite/React Frontend and Express/Prisma Backend. Replaced mock data with live API endpoints in the admin dashboard. |
| Current | **Backend Architecture** | Configured `app.js` and `server.js` with complete security middleware (`helmet`, `cors`, `hpp`, `express-rate-limit`). Integrated Cloudinary for media uploads using `multer.memoryStorage()`. Built complete REST APIs for Events, Team, Blogs, Announcements, and Student Branches. |
| Current | **Database Schema** | Finalized Prisma models for `Admin`, `Event`, `TeamMember`, `Blog`, `Media`, `Announcement`, `Contact`, `NewsletterSubscriber`, `EventRegistration`, `StudentBranch`, and `BranchOfficer`. Handled soft-deletes (`isDeleted`) and JSON arrays correctly. |
| Current | **Admin Dashboard** | Completed React Admin Portal (`/dashboard`, `/events`, `/blogs`, `/team`, `/gallery`). Wired up JWT authentication with protected routes. Used Ant Design (`Table`, `Form`) and React Query for state management. |
| 2026-06-16 | **Activities Page** | Built `/activities` with Hero banner, Filter bar (Upcoming/Past toggle, Category dropdown), `ActivityCard` grid, Explore sidebar, and Moments gallery. |
| 2026-06-16 | **YP Pune Rebrand** | Redesigned Homepage with YP specific branding, dynamic StatsBar, `AboutSection`, `HighlightsSection`, and `YPScoopStrip` (Newsletter CTA). |

---

## 2. Tech Stack Summary

| Concern | Package | Version / Detail |
|---------|---------|------------------|
| **Frontend Core** | React | 19.x (Vite Native ESM) |
| **Frontend Styling** | Tailwind CSS v4 | `@tailwindcss/vite` (No PostCSS) |
| **Frontend UI** | Ant Design (AntD) | Used for Admin tables, forms, modals |
| **Frontend State** | React Query v5 | Server-state caching and refetching |
| **Frontend State (Local)** | Zustand | Complex local UI state |
| **Frontend Routing** | react-router-dom | v7.x |
| **Backend Core** | Node.js / Express | 5.x |
| **Backend ORM** | Prisma | v5.x |
| **Database** | PostgreSQL | Relational DB enforcing foreign keys |
| **Authentication** | JWT + bcrypt | Stateless bearer tokens, hashed passwords |
| **File Storage** | Cloudinary + Multer | In-memory parsing streaming to Cloudinary |

> **Tailwind CSS v4 note:** Colors are defined in `frontend/src/index.css` inside `@theme { }`. Consume as utility classes (`bg-ieee-blue`). **Never hardcode hex values.**

---

## 3. Database Schema (Prisma Models)

The following models are fully implemented in `backend/prisma/schema.prisma` and synced with PostgreSQL:

### Core Content Models
- **`Admin`**: `id`, `name`, `email` (unique), `passwordHash`, `role`, `createdAt`, `updatedAt`. One-to-Many relation with `Blog`.
- **`Event`**: `id`, `title`, `shortDescription`, `fullDescription`, `bannerUrl`, `galleryUrls` (JSON array), `videoUrl`, `eventDate`, `venue`, `registrationLink`, `sdgAlignment`, `category`, `status` (Upcoming/Completed), `isDeleted` (boolean soft delete).
- **`TeamMember`**: `id`, `name`, `position`, `affiliation`, `contact`, `profileImageUrl`, `linkedinUrl`, `orderIndex`.
- **`Blog`**: `id`, `title`, `content`, `thumbnailUrl`, `tags` (JSON array), `publishStatus` (Draft/Published), `authorId` (relation to Admin).
- **`Media`**: `id`, `fileName`, `fileUrl`, `fileType`, `fileSize`, `cloudinaryPublicId`, `eventId` (relation to Event).

### Interaction & Branch Models
- **`Announcement`**: `id`, `title`, `content`, `link`, `isActive`.
- **`Contact`**: `id`, `name`, `email`, `subject`, `message`, `isResolved`.
- **`NewsletterSubscriber`**: `id`, `email` (unique), `subscribedAt`.
- **`EventRegistration`**: `id`, `eventId`, `name`, `email`, `contact`, `registrationDetails` (JSON string).
- **`StudentBranch`**: `id`, `name` (unique), `code`, `established`, `logoUrl`.
- **`BranchOfficer`**: `id`, `name`, `role`, `ieeeNumber`, `email`, `year`, `branchId` (relation to StudentBranch).

---

## 4. Backend Implementation (Express.js)

The backend (`/backend`) serves as a purely decoupled REST API.

### 4.1 Folder Structure
```
backend/src/
├── config/       ← DB and third-party API configs
├── controllers/  ← Business logic functions (req, res)
├── middleware/   ← Auth (JWT verification), Validation, Multer (file uploads)
├── models/       ← Prisma client initializers
├── routes/       ← Express Routers mapping endpoints to controllers
├── services/     ← External services (Cloudinary upload logic, Resend email logic)
├── app.js        ← Security configs, CORS, global error handlers
└── server.js     ← Database connection, port listening
```

### 4.2 Implemented API Routes (Mounted in `app.js`)
- `POST /api/auth/login` (Returns JWT)
- `GET /api/dashboard/stats` (Aggregated statistics)
- `GET/POST/PUT/DELETE /api/events` (Including Multer multipart parsing for images)
- `GET/POST/PUT/DELETE /api/team`
- `GET/POST/PUT/DELETE /api/blogs`
- `GET/DELETE /api/media` (Handles Cloudinary asset deletion)
- `GET/POST/PUT/DELETE /api/announcements`
- `GET/POST/PUT /api/contacts` (Marking messages as resolved)
- `POST /api/newsletter/subscribe`
- `GET/POST/PUT/DELETE /api/student-branches`

---

## 5. Frontend Implementation (React 19)

The frontend (`/frontend`) handles client-side routing, protected dashboards, and public interfaces.

### 5.1 Routing & Security (`App.tsx`)
**Public Routes:** 
- `/` (Home), `/activities`, `/about`, `/public-events/:id`, `/public-blogs`, `/contact`.

**Guest Routes (Blocked if Logged In):**
- `/admin-portal` (Login form).

**Protected Routes (Requires valid JWT & `@ieee.org` / `@ieeepune.org` email):**
- `/dashboard`, `/events` (List, New, Edit), `/blogs`, `/team`, `/gallery`, `/announcements`, `/subscribers`, `/contacts`.

### 5.2 Key Components
- **`Navbar.jsx`**: 3-layer sticky header (utility bar, brand bar, navigation).
- **`HeroSection.jsx`**: Auto-advancing carousel with side-by-side layout.
- **`StatsBar.jsx`**: Animated counter (uses `framer-motion` and custom hooks).
- **`AdminLayout.jsx`**: Standardized sidebar/header shell for the admin portal.
- **`EventForm.tsx`**: Uses React Hook Form + Ant Design + Dropzone for image uploading. Connected to React Query for mutations.

### 5.3 Data Flow Example (Saving a Blog)
1. **Frontend:** Admin submits Form. `useMutation` triggers `axios.post('/api/blogs')`.
2. **Network:** Axios interceptor automatically appends `Authorization: Bearer <JWT>`.
3. **Backend:** Express routes to `/api/blogs`. Middleware verifies JWT. 
4. **Processing:** Controller parses data, uploads image to Cloudinary, and saves to Prisma.
5. **Response:** Backend returns `201`.
6. **Frontend UI:** React Query automatically invalidates `['blogs']` cache, instantly updating the Admin table UI without a manual refresh.

---

## 6. Color Tokens (`frontend/src/index.css`)

| Token | Utility class | Hex | Semantic Usage & Intent |
|-------|--------------|-----|-------|
| `--color-ieee-primary` | `text-ieee-primary` | `#006699` | Main CTA, Links, Navigation, Active states |
| `--color-ieee-blue` | `bg-ieee-blue` | `#006699` | Primary alias (Legacy compatibility) |
| `--color-ieee-secondary` | `text-ieee-secondary` | `#005E85` | Decorative gradients, Hover states, Secondary icons |
| `--color-yp-green` | `text-yp-green` | `#007035` | Awards, Recognition, Success, Impact, Positive metrics |
| `--color-yp-orange` | `text-yp-orange` | `#F17927` | Featured, Upcoming, Callouts, Small highlights |
| `--color-ieee-teal` | `bg-ieee-teal` | `#00B2A9` | Badges, icon boxes, accents (Legacy) |
| `--color-ieee-dark` | `bg-ieee-dark` | `#003D5C` | Footer, navbar utility bar (Legacy) |
| `--color-ieee-light` | `bg-ieee-light` | `#E8F4F8` | Card tint backgrounds (Legacy) |
| `--color-ieee-gray` | `text-ieee-gray` | `#6B7280` | Secondary text (Legacy) |

---

## 7. Next Steps & Known TODOs
- Replace all static imports in `frontend/src/data/homePageData.js` with direct API calls via React Query.
- Ensure automated cron tasks for vTools syncing (if applicable) are actively registered.
- Wire final external links on `CTABanner.jsx`.
