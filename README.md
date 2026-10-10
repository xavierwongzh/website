# Koi Valley — Xavier Wong's portfolio

An explorable isometric island that holds my portfolio. A mountain with a waterfall, a koi pond, autumn trees, a small runway and a few wandering foxes float in the sky, and each landmark opens a part of the site.

**Live:** [xavierwongzh.vercel.app](https://xavierwongzh.vercel.app/) · **Classic site:** [/old](https://xavierwongzh.vercel.app/old)

![Koi Valley on an autumn afternoon](docs/koi-valley.jpg)

## What's on the island

| Landmark | Opens |
| --- | --- |
| The cabin | About |
| The pavilion | Experience |
| The torii on the mountain | Education |
| The lantern | Contact |
| The koi pond | Projects (every koi is a project) |

Tap a landmark or a koi to open its card. On a phone the card slides up from the bottom: swipe down to close it, and on a project page swipe right to go back to the list. Tap the mountain or empty ground to zoom back out.

There are some small things to find as well. The plane on runway 03 takes off when you tap it, the foxes hop when you poke them, tapping the water feeds the koi, and I'm coding at a desk behind the mountain.

## It follows the visitor's real world

- **Time of day:** the sky, sun, moon and lights follow the visitor's local clock. It's bright at midday, warm at golden hour and lit by lanterns and fireflies at night. The "Scrub the day" slider is endless: drag past either end and the day keeps rolling. About 50 seconds after you let go, it eases back to the live time.
- **Seasons:** the season comes from the visitor's month and hemisphere, so a visitor in Sydney in October sees spring while Singapore and London see autumn. The Season buttons switch it by hand, and `?season=winter` (or `spring`, `summer`, `autumn`) in the URL sets it directly.
- **Views:** there are three views, isometric, perspective and top-down. Drag to turn the island, and pinch or scroll to zoom. After you let go, the island waits 5 seconds and then turns back to its home angle.

## Running it locally

You need Node.js 18.17 or newer.

```bash
git clone https://github.com/xavierwongzh/website.git
cd website
npm install
npm run dev        # http://localhost:3000
```

`npm run build` makes a production build and `npm start` serves it. Every push to a branch gets a Vercel preview, and merging to `main` deploys the live site.

## How it's built

The site is a Next.js 15 (App Router) app. The two sites are kept apart with route groups, so each one has its own root layout and styles.

```
app/
├── (koi)/                 # "/" — Koi Valley
│   ├── layout.tsx         # fonts, metadata, Vercel Analytics
│   ├── page.tsx           # renders the shell and loads the scene script
│   ├── markup.ts          # static HTML shell (name, time panel, drawer)
│   └── koi.css            # all Koi Valley styles
└── (classic)/             # "/old" — the previous site, unchanged
    ├── layout.tsx
    ├── globals.css        # Tailwind
    └── old/page.tsx
public/koi-valley/
├── koi.js                 # the whole scene: terrain, sky, koi, foxes, plane, panels and their content
└── banners/               # project banner images
lib/siteMetadata.ts        # page title and description, shared by both sites
components/, hooks/        # classic site only
```

The island is drawn on a single `<canvas>` with plain JavaScript. It has no 3D library: a low-poly heightfield is projected by hand and painted back to front. All the panel content (About, Experience, Education, Contact and the project detail pages) lives at the top of `public/koi-valley/koi.js`, so that's the place to edit text, add a project or swap a banner.

## Contact

[xavierwongzh@gmail.com](mailto:xavierwongzh@gmail.com) · [LinkedIn](https://www.linkedin.com/in/xavierwongzh) · [GitHub](https://github.com/xavierwongzh)

© Xavier Wong
