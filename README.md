# Praveen Singh Thakur — Portfolio

A cinematic, streaming-inspired portfolio for **Praveen Singh Thakur**, Full-Stack MERN Developer.

Built with React 19, Vite, Tailwind CSS v4, GSAP (ScrollTrigger), Framer Motion and Lenis smooth scrolling.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Editing content

All text lives in **`src/data/profile.js`**: name, links, stats, experience, skills, expertise and projects. Components only read from it, so you rarely need to touch JSX.

- **Profile photo**: replace `src/assets/Portfolio/profile.webp` (a `profile.jpg` / `.png` also works). Without a photo the hero shows a monogram poster.
- **Social links**: `linkedin` and `github` in `profile.js` feed the contact section and footer.

## Contact form

The form has no backend. On submit it validates the input, then opens the visitor's email app (`mailto:`) with the recipient, subject and full message already filled in. A follow-up screen offers **Open in Gmail**, **Open in Outlook** and **Copy message** for visitors without a desktop email app.

## Sections

Preloader → Hero → About (bio, career timeline, education) → Expertise (stacked cards) → Skills (pinned arc carousel) → Projects (folder reveal + detail modal) → Contact → Footer.

Animations respect `prefers-reduced-motion`. The custom cursor only turns on for mouse and trackpad users.
