/**
 * homePageData.js
 * Static data for the IEEE YP Pune Homepage.
 * All data is hardcoded here for the initial build.
 * Each section is annotated with the API endpoint to replace it with.
 *
 * Future agents: READ docs/IMPLEMENTED.md before editing this file.
 */

// ---------------------------------------------------------------------------
// ANNOUNCEMENT BANNER
// TODO: Replace with GET /api/announcements (returns active announcement)
// ---------------------------------------------------------------------------
export const announcement = {
  id: "ann-2026-ypscoop",
  text: "🎉 YP Scoop — our quarterly e-newsletter — is now live! Subscribe below to stay connected.",
};

// ---------------------------------------------------------------------------
// HERO CAROUSEL SLIDES — Real YP Pune activities from PDF
// TODO: Replace with GET /api/carousel-slides
// ---------------------------------------------------------------------------
export const heroSlides = [
  {
    id: 1,
    badge: "FLAGSHIP PROGRAMME",
    title: "IEEE CODEBhoomi",
    subtitle:
      "Enabling digital literacy and technology education in rural communities near Pune. USD 5000 funded initiative.",
    imageUrl: "/pic_ieeeupload/CB1.jpeg",
    imageAlt:
      "IEEE CODEBhoomi — digital literacy programme for rural communities",
  },

  {
    id: 2,
    badge: "NETWORKING",
    title: "Industry Conclave",
    subtitle:
      "Structured interaction between Young Professionals, student members, and mentors focused on career pathways.",
    imageUrl: "/pic_ieeeupload/IC1.jpeg",
    imageAlt:
      "IEEE YP Networking Meet — Pune Young Professionals community",
  },

  {
    id: 3,
    badge: "INNOVATION",
    title: "Up Skills",
    subtitle:
      "Empowering students with industry-relevant knowledge, practical skills, and continuous learning opportunities to grow professionally.",
    imageUrl: "/pic_ieeeupload/s1.png",
    imageAlt: "IEEE Up Skills",
  },

  {
    id: 4,
    badge: "INITIATIVE",
    title: "YP-Funded Event",
    subtitle:
      "Supporting impactful student-led initiatives through funding, mentorship, and opportunities to turn innovative ideas into reality.",
    imageUrl: "/pic_ieeeupload/ypf.jpg",
    imageAlt: "YP Funded Event",
  },

  {
    id: 5,
    badge: "CAREER",
    title: "YP Team",
    subtitle:
      "A passionate community of young professionals driving innovation, collaboration, and leadership across the IEEE Pune Section.",
    imageUrl: "/pic_ieeeupload/ieeep1.png",
    imageAlt: "YP Team",
  },

 {
  id: 6,
  badge: "POSTER",
  title: "Posters",
  subtitle:
    "Engaging and creative visual content designed to showcase YP initiatives, events, achievements, and opportunities across the IEEE Pune Section.",
  imageUrl: "/pic_ieeeupload/p2.png",
  imageAlt: "YP Posters — IEEE YP Pune visual content",
  imageSize: "90%",
},
];

// ---------------------------------------------------------------------------
// ACHIEVEMENT CARD (right column of hero)
// TODO: Replace with GET /api/achievements?featured=true
// ---------------------------------------------------------------------------

export const featuredAchievement = {
  id: "ach-yp-10years",
  badge: "MILESTONE",
  title: "10 Years of Continuous Activity — IEEE YP Pune",
  imageUrl: "/pic_ieeeupload/ten.jpg",
  imageAlt:
    "IEEE YP Pune celebrating a decade of engagement and contribution",
  body:
    "Established in 2016, the IEEE Pune Section Young Professionals Affinity Group celebrates a decade of engagement, learning, and contribution to the regional technology ecosystem with 500+ members across industry, academia, and government.",
  linkText: "Learn about our journey →",
  linkHref: "#",
};


// ---------------------------------------------------------------------------
// STATS BAR — YP-specific numbers
// TODO: Replace with GET /api/stats
// ---------------------------------------------------------------------------
export const stats = [
  { id: "members",    value: 500,  suffix: "+",  display: "500+", label: "YP MEMBERS" },
  { id: "activities", value: 100,  suffix: "+",  display: "100+", label: "ACTIVITIES IN 2026" },
  { id: "years",      value: 10,   suffix: "",   display: "10",   label: "YEARS OF EXCELLENCE" },
  { id: "ous",        value: 25,   suffix: "+",  display: "25+",  label: "OUs ENABLED" },
];

// ---------------------------------------------------------------------------
// UPCOMING EVENTS — Real 2026 planned events from PDF
// TODO: Replace with GET /api/events?limit=3&type=upcoming
// ---------------------------------------------------------------------------
export const upcomingEvents = [
  {
    id: "evt-codebhoomi-2026",
    type: "FLAGSHIP",
    date: "Mar–Apr 2026",
    title: "IEEE CODEBhoomi — Tech for Humanity Hackathon",
    description:
      "Closing phase hackathon of the CODEBhoomi initiative. Teams build solutions for rural community challenges in digital literacy and accessibility.",
    location: "Pune (Venue TBD)",
    imageUrl:
      "/pics/p1.PNG",
  },
  {
    id: "evt-congress-2026",
    type: "CONGRESS",
    date: "2026 (Date TBD)",
    title: "IEEE Pune Section Congress 2026",
    description:
      "Section-level congress bringing together volunteers, leaders and chapter representatives for governance and planning.",
    location: "Pune",
    imageUrl:
      "/pics/p2.PNG",
  },
  {
    id: "evt-cpds-2026",
    type: "CAREER",
    date: "2026 (Virtual)",
    title: "Career Path Discovery Series — Revival",
    description:
      "Two virtual sessions with experienced professionals sharing structured insights on career pathways for early-career engineers.",
    location: "Online",
    imageUrl:
      "/pics/p3.PNG",
  },
];

// ---------------------------------------------------------------------------
// EXPLORE SECTION — YP-specific programmes from PDF
// TODO: Static — no API needed (fixed navigation sections)
// ---------------------------------------------------------------------------
export const exploreCards = [
  {
    id: "explore-codebhoomi",
    icon: "BookOpen",
    title: "IEEE CODEBhoomi",
    description:
      "Digital literacy and technology education programme for rural communities near Pune. USD 5000 IEEE-funded initiative establishing computer labs in 3 schools.",
    href: "#codebhoomi",
  },
  {
    id: "explore-mm",
    icon: "Users",
    title: "M&M Research Initiative",
    description:
      "International Mentor-Mentee programme connecting Pune students with global IEEE YP mentors for research and publication opportunities.",
    href: "#mm-initiative",
  },
  {
    id: "explore-cpds",
    icon: "Briefcase",
    title: "Career Path Discovery",
    description:
      "Structured career sessions with experienced professionals across domains — guidance on entering and growing in technology careers.",
    href: "#cpds",
  },
  {
    id: "explore-eureka",
    icon: "Award",
    title: "EU-REKA Initiative",
    description:
      "Jury participation, evaluation support and volunteer coordination for the IEEE EU-REKA international innovation programme.",
    href: "#eureka",
  },
];

// ---------------------------------------------------------------------------
// GRANTS & AWARDS DATA
// ---------------------------------------------------------------------------
export const grantsAndAwards = [
  {
    id: "grant-codebhoomi",
    category: "Grants & Funding",
    title: "IEEE CODEBhoomi Rural Literacy Grant",
    organization: "IEEE Humanitarian Activities Committee (HAC)",
    amount: "USD $60,000+",
    year: "2024 – 2026",
    status: "Active Grant",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: "Coins",
    description: "Prestigious IEEE global funding allocated to establish computer laboratories and digital literacy programs across rural schools surrounding Pune.",
    impact: "Impacted 1,200+ rural students with hands-on digital education.",
  },
  {
    id: "award-r10-exemplary",
    category: "Awards & Recognition",
    title: "IEEE R10 Outstanding YP Affinity Group Award",
    organization: "IEEE Region 10 (Asia-Pacific)",
    amount: "Regional Trophy & Certificate",
    year: "2024",
    status: "Award Winner",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: "Trophy",
    description: "Recognized as the top Young Professionals Affinity Group across IEEE Region 10 for exceptional volunteer engagement, technical webinars, and membership growth.",
    impact: "Ranked #1 YP Group in Region 10 Asia-Pacific.",
  },
  {
    id: "grant-mm-research",
    category: "Grants & Funding",
    title: "M&M International Research Support Grant",
    organization: "IEEE Young Professionals Committee",
    amount: "USD $2,500",
    year: "2025",
    status: "Active Grant",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: "GraduationCap",
    description: "Travel and publication grant supporting undergraduate research papers authored by Pune Section students under international IEEE YP mentorship.",
    impact: "Funded 8 peer-reviewed IEEE conference publications.",
  },
  {
    id: "award-section-volunteer",
    category: "Awards & Recognition",
    title: "IEEE Pune Section Outstanding Leadership Award",
    organization: "IEEE Pune Section Executive Committee",
    amount: "Honorary Citation & Grant",
    year: "2024",
    status: "Annual Award",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: "Award",
    description: "Annual section accolade honoring young professional officers for leading flagship technical congresses and mentoring student branch chapters.",
    impact: "Recognized 5 student branch executive counselors.",
  },
  {
    id: "grant-eureka-sponsorship",
    category: "Sponsorships",
    title: "IEEE EU-REKA Innovation Sponsorship",
    organization: "IEEE India Council & Industry Partners",
    amount: "INR ₹1,50,000",
    year: "2025",
    status: "Active Sponsorship",
    badgeColor: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    icon: "Sparkles",
    description: "Innovation funding and jury mentorship sponsorship supporting engineering student projects showcased at the annual EU-REKA National Competition.",
    impact: "Sponsored prototype builds for 15 student teams.",
  },
];

// ---------------------------------------------------------------------------
// NAVBAR LINKS
// ---------------------------------------------------------------------------
export const navLinks = [
  { id: "nav-home",       label: "HOME",        emoji: "🏠", href: "/" },
  { 
    id: "nav-about",      
    label: "ABOUT",       
    emoji: "ℹ️", 
    href: "/about",
    subLinks: [
      { id: "sub-msg-chair", label: "Message from Chair", href: "/about#chair-message" },
      { id: "sub-execom",    label: "Execom 2026",        href: "/about#execom2026" },
      { id: "sub-about-yp",  label: "About IEEE YP Pune", href: "/about#about" },
    ]
  },
  { id: "nav-activities", label: "ACTIVITIES",  emoji: "📅", href: "/activities" },
  { id: "nav-blogs",      label: "BLOGS",       emoji: "✍️", href: "/public-blogs" },
  { id: "nav-gallery",    label: "GALLERY",     emoji: "🖼️", href: "/public-gallery" },
  { id: "nav-contact",    label: "CONTACT",     emoji: "📞", href: "/contact" },
];

export const utilityLinks = [
  { id: "util-ieee",      label: "ieee.org",                href: "https://www.ieee.org" },
  { id: "util-xplore",   label: "IEEEXplore Digital Library", href: "https://ieeexplore.ieee.org" },
  { id: "util-standards", label: "IEEE Standards",          href: "https://standards.ieee.org" },
  { id: "util-spectrum",  label: "IEEE Spectrum",           href: "https://spectrum.ieee.org" },
  { id: "util-more",      label: "More Sites",              href: "#" },
];

// ---------------------------------------------------------------------------
// FOOTER LINKS — YP-specific
// ---------------------------------------------------------------------------
export const footerQuickLinks = [
  { id: "fl-activities",  label: "Activities",   href: "/activities" },
  { id: "fl-about",       label: "About",        href: "/about" },
  { id: "fl-blogs",       label: "Blogs",        href: "/public-blogs" },
  { id: "fl-gallery",     label: "Gallery",      href: "/public-gallery" },
  { id: "fl-contact",     label: "Contact",      href: "/contact" },
];

export const footerResourceLinks = [
  { id: "fr-scoop",       label: "YP Scoop Newsletter", href: "#" },
  { id: "fr-opportunities", label: "Opportunities",     href: "#" },
  { id: "fr-eureka",      label: "EU-REKA",             href: "#" },
  { id: "fr-xplore",      label: "IEEE Xplore",         href: "https://ieeexplore.ieee.org" },
  { id: "fr-join",        label: "Join IEEE YP",        href: "https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMYP060" },
];

// ---------------------------------------------------------------------------
// ACTIVITIES PAGE DATA
// TODO: Replace with GET /api/events  (full listing, pagination, filters)
// ---------------------------------------------------------------------------

/** Header stats shown on the Activities page */
export const activitiesPageStats = [
  { id: "aps-events",   value: "50+",  label: "Events Conducted",  icon: "Calendar" },
  { id: "aps-members",  value: "500+", label: "Active Members",    icon: "Users" },
  { id: "aps-partners", value: "10+",  label: "Industry Partners", icon: "Building2" },
];

/** Categories for sidebar + filter dropdown */
export const activitiesCategories = [
  { id: "cat-all",        label: "All Events",        count: 20, color: "bg-ieee-blue" },
  { id: "cat-technical",  label: "Technical",          count: 7,  color: "bg-blue-500" },
  { id: "cat-workshop",   label: "Workshops",          count: 6,  color: "bg-amber-500" },
  { id: "cat-networking", label: "Networking",          count: 6,  color: "bg-emerald-500" },
  { id: "cat-industry",   label: "Industry Connect",   count: 3,  color: "bg-purple-500" },
  { id: "cat-leadership", label: "Leadership",          count: 2,  color: "bg-rose-500" },
  { id: "cat-flagship",   label: "Flagship Programs",   count: 4,  color: "bg-ieee-teal" },
];

/** The hero / featured event on the Activities page */
export const featuredActivity = {
  id: "fa-genai-workshop",
  badge: "FEATURED EVENT",
  category: "WORKSHOP",
  date: "31 MAY 2025",
  day: "31",
  month: "MAY",
  year: "2025",
  title: "Generative AI Workshop",
  description: "Build. Innovate. Transform. A hands-on deep dive into the latest generative AI tools, prompt engineering patterns, and deployment strategies for real-world applications.",
  venue: "PCCOE, Pune",
  time: "09:30 AM – 04:30 PM",
  ctaText: "Register Now →",
  ctaHref: "#",
  imageUrl: "/pics/b1.PNG",
  imageAlt: "Generative AI Workshop at PCCOE Pune — IEEE YP event",
};

/** Full event listing — drives both "Upcoming" and "Past" tabs */
export const activitiesList = [
  {
    id: "act-yp-networking",
    category: "Networking",
    status: "upcoming",
    day: "07",
    month: "JUN",
    year: "2025",
    title: "YP Networking Meet",
    subtitle: "Connect. Collaborate. Grow.",
    venue: "Startup Cafe, Pune",
    time: "06:00 PM – 08:00 PM",
    imageUrl: "/pics/p4.PNG",
    imageAlt: "YP Networking Meet — young professionals gathering",
  },
  {
    id: "act-tech-talk-cloud",
    category: "Tech Talk",
    status: "upcoming",
    day: "14",
    month: "JUN",
    year: "2025",
    title: "Tech Talk: Future of Cloud",
    subtitle: "Exploring cloud-native architectures.",
    venue: "COEP Technological University",
    time: "11:00 AM – 01:00 PM",
    imageUrl: "/pics/p5.PNG",
    imageAlt: "Tech Talk on cloud computing — IEEE YP Pune",
  },
  {
    id: "act-ds-workshop",
    category: "Workshop",
    status: "upcoming",
    day: "22",
    month: "JUN",
    year: "2025",
    title: "Data Science Hands-on Lab",
    subtitle: "From data wrangling to ML pipelines.",
    venue: "PCCOE, Pune",
    time: "10:00 AM – 04:00 PM",
    imageUrl: "/pics/p3.PNG",
    imageAlt: "Data Science Workshop — IEEE YP Pune",
  },
  {
    id: "act-industry-connect",
    category: "Industry Connect",
    status: "upcoming",
    day: "05",
    month: "JUL",
    year: "2025",
    title: "Industry Connect Session",
    subtitle: "Bridging academia and industry.",
    venue: "TBD",
    time: "05:00 PM – 07:30 PM",
    imageUrl: "/pic_ieeeupload/IC.jpeg",
    imageAlt: "Industry Connect session — IEEE YP Pune",
  },
  {
    id: "act-codebhoomi-hack",
    category: "Flagship",
    status: "upcoming",
    day: "15",
    month: "JUL",
    year: "2025",
    title: "CODEBhoomi Hackathon",
    subtitle: "Tech solutions for rural India.",
    venue: "MIT-WPU, Pune",
    time: "09:00 AM – 06:00 PM",
    imageUrl: "/pics/p1.PNG",
    imageAlt: "CODEBhoomi Hackathon at MIT-WPU",
  },
  {
    id: "act-leadership-summit",
    category: "Leadership",
    status: "upcoming",
    day: "28",
    month: "JUL",
    year: "2025",
    title: "YP Leadership Summit",
    subtitle: "Shaping the next generation of tech leaders.",
    venue: "ITC Grand, Pune",
    time: "10:00 AM – 05:00 PM",
    imageUrl: "/pics/p6.PNG",
    imageAlt: "YP Leadership Summit — IEEE Pune",
  },
  // Past events
  {
    id: "act-genai-2025",
    category: "Workshop",
    status: "past",
    day: "31",
    month: "MAY",
    year: "2025",
    title: "Generative AI Workshop",
    subtitle: "Build. Innovate. Transform.",
    venue: "PCCOE, Pune",
    time: "09:30 AM – 04:30 PM",
    imageUrl: "/pics/p3.PNG",
    imageAlt: "Generative AI Workshop — past event",
  },
  {
    id: "act-ieee-day-2024",
    category: "Flagship",
    status: "past",
    day: "01",
    month: "OCT",
    year: "2024",
    title: "IEEE Day — Innoverse",
    subtitle: "Build the Future through innovation.",
    venue: "MMCOE, Pune",
    time: "10:00 AM – 05:00 PM",
    imageUrl: "/pics/b3.PNG",
    imageAlt: "IEEE Day Innoverse — MMCOE Pune",
  },
  {
    id: "act-wit-panel",
    category: "Networking",
    status: "past",
    day: "08",
    month: "MAR",
    year: "2025",
    title: "Women in Tech Panel",
    subtitle: "Inspiring the next wave of women engineers.",
    venue: "Symbiosis Institute, Pune",
    time: "02:00 PM – 05:00 PM",
    imageUrl: "/pics/p7.PNG",
    imageAlt: "Women in Tech Panel — IEEE YP Pune",
  },
  {
    id: "act-siemens-visit",
    category: "Industry Connect",
    status: "past",
    day: "15",
    month: "FEB",
    year: "2025",
    title: "Industry Visit — Siemens",
    subtitle: "Behind the scenes of automation engineering.",
    venue: "Siemens Technology Center, Pune",
    time: "10:00 AM – 01:00 PM",
    imageUrl: "/pic_ieeeupload/IC1.jpeg",
    imageAlt: "Industry Visit to Siemens — IEEE YP Pune",
  },
  {
    id: "act-cybersec-talk",
    category: "Technical",
    status: "past",
    day: "20",
    month: "JAN",
    year: "2025",
    title: "Cybersecurity Essentials",
    subtitle: "Securing the digital frontier.",
    venue: "VIT Pune",
    time: "11:00 AM – 01:30 PM",
    imageUrl: "/pics/p5.PNG",
    imageAlt: "Cybersecurity Essentials — IEEE YP Pune talk",
  },
  {
    id: "act-mentor-connect",
    category: "Leadership",
    status: "past",
    day: "10",
    month: "DEC",
    year: "2024",
    title: "M&M Mentor Connect",
    subtitle: "International mentor matchmaking session.",
    venue: "Online",
    time: "06:00 PM – 08:00 PM",
    imageUrl: "/pics/b4.PNG",
    imageAlt: "M&M Mentor Connect — IEEE YP Pune virtual event",
  },
];

/**
 * Past moments gallery — bottom strip on Activities page
 * TODO: Connect this array to the Cloudinary Media CDN gallery folders
 */
export const pastMoments = [
  {
    id: "pm-ieee-day",
    label: "IEEE Day 2024",
    imageUrl: "/pic_ieeeupload/n1.jpg",
    imageAlt: "IEEE Day 2024 celebration — group photo",
  },
  {
    id: "pm-wit",
    label: "Women in Tech Panel",
    imageUrl: "/pic_ieeeupload/n2.jpg",
    imageAlt: "Women in Tech Panel — audience and speakers",
  },
  {
    id: "pm-codebhoomi",
    label: "CODEBhoomi 2024",
    imageUrl: "/pic_ieeeupload/CB.jpeg",
    imageAlt: "CODEBhoomi 2024 — volunteers and participants",
  },
  {
    id: "pm-siemens",
    label: "Industry Visit — Siemens",
    imageUrl: "/pic_ieeeupload/IC.jpeg",
    imageAlt: "Industry Visit to Siemens Technology Center",
  },
  {
    id: "pm-retreat",
    label: "Leadership Retreat",
    imageUrl: "/pic_ieeeupload/ieeep1.png",
    imageAlt: "YP Leadership Retreat — outdoor team activity",
  },
];
