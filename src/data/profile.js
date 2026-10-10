// Single source of truth for all portfolio content.
// Edit this file to update the site — components only read from here.

// Drop a photo named `profile.jpg` / `profile.png` / `profile.webp` into
// src/assets/Portfolio/ and the hero poster picks it up automatically.
const photos = import.meta.glob('../assets/Portfolio/profile.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

export const profile = {
  firstName: 'Praveen',
  lastName: 'Singh Thakur',
  fullName: 'Praveen Singh Thakur',
  initials: 'PST',
  brand: 'PRAVEEN',
  title: 'Full-Stack MERN Developer',
  currentRole: 'Software Engineer @ Bestpeers InfoSystems',
  location: 'Indore, India',
  email: 'swepraveensinghthakur@gmail.com',
  linkedin: 'https://www.linkedin.com/in/swepraveensingh',
  github: 'https://github.com/praveensinghsendhav',
  photo: Object.values(photos)[0] ?? null,
  summary:
    'Full-stack MERN developer with 2.5+ years of experience building scalable, production-grade web applications — from SEO-first Next.js frontends to AI-powered multi-tenant SaaS platforms.',
};

export const roles = [
  'FULL-STACK // MERN ENGINEER',
  'NEXT.JS // SSR · SSG · SEO',
  'AI SAAS // LLM STREAMING',
  'CLOUD // GCP · DOCKER',
];

// Every figure below comes straight from the resume.
export const stats = [
  { value: '2.5+', label: 'Years shipping' },
  { value: '10M+', label: 'Students served' },
  { value: '50+', label: 'Secure API endpoints' },
  { value: '50+', label: 'Tenant orgs' },
];

export const experience = [
  {
    role: 'Software Engineer',
    company: 'Bestpeers InfoSystems',
    period: 'Oct 2025 — Present',
    location: 'Indore, India',
    stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'GCP', 'Docker', 'RBAC'],
  },
  {
    role: 'Junior MERN Developer',
    company: 'Dexbytes Infotech',
    period: 'Jul 2024 — Sep 2025',
    location: 'Indore, India',
    stack: ['Node.js', 'TypeScript', 'TanStack', 'PostgreSQL', 'Stripe', 'SSE', 'LLMs', 'Redis'],
  },
];

export const education = {
  degree: 'B.Tech in Information Technology',
  school: 'Mahakal Institute of Technology',
  period: '2020 — 2024',
  location: 'Ujjain, India',
  score: '8.7 CGPA',
};

export const expertise = [
  {
    title: 'Frontend & Web Performance',
    text: 'SEO-first Next.js and React interfaces with hybrid SSR / SSG / CSR rendering, Core Web Vitals tuning, structured data (JSON-LD) and accessible, reusable component systems.',
    tag: 'NEXT.JS · SEO · CWV',
  },
  {
    title: 'Backend & API Architecture',
    text: 'Layered Node.js and Express services with REST and SSE, JWT and cookie sessions, RBAC, fail-closed rate limiting and Zod / Yup validation at every boundary.',
    tag: 'NODE · EXPRESS · SECURITY',
  },
  {
    title: 'AI-Powered SaaS Platforms',
    text: 'Multi-tenant products with LLM replies streamed over SSE, safety pre-scans, credit metering, entitlement gates and Stripe subscription billing with signature-verified webhooks.',
    tag: 'LLM · STRIPE · MULTI-TENANT',
  },
  {
    title: 'Cloud, DevOps & Observability',
    text: 'Containerised deployments on GCP Cloud Run and AWS, Secret Manager, IAM and VPC hardening, Docker + PM2, CI/CD pipelines, and monitoring with Grafana, Prometheus and Sentry.',
    tag: 'GCP · AWS · DOCKER',
  },
];

export const skillCategories = [
  {
    title: 'Frontend',
    desc: 'High-performance, responsive interfaces with server rendering, strong SEO and a clean component architecture.',
    tag: 'UI / INTERACTION',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Redux', 'Tailwind CSS', 'TanStack', 'HTML5 / CSS3'],
  },
  {
    title: 'Backend',
    desc: 'Secure, well-structured APIs with real-time streaming, background jobs and defence-in-depth middleware.',
    tag: 'ARCHITECTURE',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'SSE', 'JWT & Sessions', 'Zod / Yup', 'Kafka', 'Microservices'],
  },
  {
    title: 'Databases',
    desc: 'Schema design, compound indexing and aggregation pipelines tuned for real production workloads.',
    tag: 'DATA LAYER',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Mongoose', 'Knex.js', 'Query Optimisation'],
  },
  {
    title: 'Cloud & DevOps',
    desc: 'Shipping containerised services to GCP and AWS with least-privilege access and automated pipelines.',
    tag: 'INFRASTRUCTURE',
    skills: ['GCP Cloud Run', 'Cloud Storage', 'Secret Manager', 'AWS EC2 / S3', 'Docker', 'PM2', 'CI/CD'],
  },
  {
    title: 'AI & SaaS',
    desc: 'LLM-powered products with streaming, safety checks, usage metering and subscription billing built in.',
    tag: 'INTELLIGENCE',
    skills: ['LLM Integration', 'SSE Streaming', 'Stripe Billing', 'Multi-tenancy', 'RBAC', 'Better Auth'],
  },
  {
    title: 'Quality & Observability',
    desc: 'Test-first delivery and production visibility, so issues are caught before users ever see them.',
    tag: 'RELIABILITY',
    skills: ['Vitest', 'mongodb-memory-server', 'ESLint', 'Prettier', 'Grafana', 'Prometheus', 'Sentry'],
  },
];

export const projects = [
  {
    title: 'House of Student',
    company: 'Bestpeers InfoSystems',
    category: 'Student Housing · SEO Platform',
    description:
      'High-performance, SEO-optimised frontend for a global student housing platform serving 10M+ students across 1,000+ cities.',
    highlight: '10M+ students · 1,000+ cities',
    link: 'https://houseofstudent.com',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'SSR / SSG'],
    bullets: [
      'Built a high-performance, SEO-optimised frontend for a global student housing platform serving 10M+ students across 1,000+ cities, using Next.js, TypeScript and Tailwind CSS.',
      'Implemented a hybrid rendering strategy combining SSR, SSG and CSR to balance SEO, performance and interactivity across property listing, city and university landing pages.',
      'Optimised Core Web Vitals and Lighthouse scores through image optimisation, code splitting, lazy loading and caching, significantly improving page load times and search rankings.',
      'Engineered technical SEO with dynamic metadata, structured data (JSON-LD), semantic markup and optimised sitemaps for high-traffic listing pages.',
      'Developed responsive, accessible, reusable UI components and integrated RESTful APIs for real-time property search, filtering and booking workflows.',
    ],
  },
  {
    title: 'TrussHealth AI',
    company: 'Bestpeers InfoSystems',
    category: 'Healthcare SaaS · Remote Monitoring',
    description:
      'Cloud-native, HIPAA-conscious platform for AI-powered remote patient safety monitoring after surgery.',
    highlight: '50+ endpoints · 7 roles · 10K+ data points/day',
    link: '',
    tags: ['MERN', 'TypeScript', 'GCP Cloud Run', 'RBAC'],
    bullets: [
      'Architected and deployed a cloud-native, HIPAA-conscious healthcare SaaS platform for AI-powered remote patient safety monitoring, enabling early detection of post-surgical complications and surgical site infections across orthopaedic, OB/GYN, abdominal and cardiac specialties.',
      'Built on the MERN stack with TypeScript using a clean layered architecture, delivering 50+ secure RESTful endpoints with JWT authentication and RBAC across 7 distinct user roles.',
      'Engineered a real-time monitoring system integrating device/sensor data, daily health assessments, exercise tracking, pain management and ML-based predictive analytics — processing 10,000+ patient data points daily.',
      'Deployed production infrastructure on GCP: Cloud Run for containerised microservices, Cloud Storage with signed URLs for medical files, Secret Manager for credentials, and IAM/VPC for network security.',
      'Optimised MongoDB through compound indexing, aggregation pipeline tuning and asynchronous background job queues for bulk operations and third-party integrations.',
    ],
  },
  {
    title: '3to7',
    company: 'Dexbytes Infotech',
    category: 'Family AI Companion · SaaS',
    description:
      'Multi-tenant family AI companion with PIN-protected household profiles, eight domain AI Helpers and streamed replies.',
    highlight: 'SSE streaming · Stripe billing · test-first',
    link: '',
    tags: ['TanStack Start', 'Express 5', 'MongoDB', 'Stripe', 'SSE'],
    bullets: [
      'Built a multi-tenant family AI companion platform — one parent login, household member profiles with PIN-protected switching and eight domain AI Helpers — as a TypeScript pnpm monorepo pairing a TanStack Start (React 19) web app with an Express 5 / MongoDB API, sharing zod schemas through a contracts package.',
      'Engineered the server-side AI proxy that streams companion replies over SSE, running a safety pre-scan ahead of every turn and metering credits behind an entitlements gate (subscription status, balance, parental approvals, bedtime windows, daily limits).',
      'Implemented Stripe-backed subscription billing and a shared household credit pool — plan tiers, top-ups, customer portal and signature-verified webhooks — plus an admin console for pricing, usage analytics, an immutable audit trail and a support queue.',
      'Hardened the platform with HttpOnly cookie sessions (Better Auth), RBAC, per-identity fail-closed rate limiting on PIN attempts, helmet/HPP, a per-request nonce CSP, and GDPR-style data export, retention purges and de-identification.',
      'Drove delivery test-first with Vitest and mongodb-memory-server, enforced ESLint, Prettier, strict TypeScript and knip in CI, and shipped as a single Docker image running two pm2 processes.',
    ],
  },
  {
    title: 'BookMyStylist',
    company: 'Dexbytes Infotech',
    category: 'Multi-Tenant SaaS · Backend',
    description:
      'Scalable multi-tenant booking backend with database-per-tenant isolation across 50+ organisations.',
    highlight: 'Database-per-tenant · 50+ orgs',
    link: '',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Knex.js', 'JWT'],
    bullets: [
      'Developed a scalable multi-tenant SaaS backend using Node.js, Express.js and PostgreSQL with Knex.js, implementing database-per-tenant isolation for security and performance across 50+ tenant organisations.',
      'Architected a role-based permission system with JWT authentication and authorisation middleware for secure multi-tenant data segregation.',
      'Built industry-compliant API endpoints with input validation, SQL-injection prevention, rate limiting and comprehensive logging to protect sensitive customer and booking data.',
    ],
  },
];

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];
