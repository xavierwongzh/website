# Xavier's Portfolio - Dark Mythical Forest Theme

A stunning personal portfolio website designed as a continuous scrolling journey through a mystical forest, from sky to forest floor. Built with modern web technologies for optimal performance and developer experience.

## 🌟 Features

- **Immersive Scrolling Experience**: Smooth parallax scrolling from sky → canopy → mid-forest → forest floor
- **Dark Fantasy Aesthetic**: Deep navy, emerald green, and teal glows inspired by moonlight and bioluminescence
- **Animated Elements**: 
  - Twinkling stars and floating lights
  - Falling leaves and glowing wisps
  - Particle effects and ambient animations
  - Mouse-following glow effect
- **Interactive Sections**:
  - Hero landing with tagline
  - About section with profile and interests
  - Education timeline with glowing milestone markers
  - Projects showcase with hover effects
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Smooth Navigation**: Fixed navbar with smooth scroll-to-section functionality
- **Optional Ambient Music**: Toggle background music for enhanced atmosphere
- **Type-Safe**: Full TypeScript support for robust development

## 🎨 Design System

### Color Palette
- **Deep Navy**: `#0a1628` - Primary background
- **Navy Light**: `#1a2f3f` - Secondary background
- **Emerald Green**: `#26a69a` - Accent color
- **Dark Green**: `#1b5e20` - Nature elements
- **Teal Glow**: `#4dd0e1` - Primary accent & glow effects
- **Silver**: `#b0bec5` - Secondary text
- **Soft White**: `#e8f5e9` - Primary text

### Typography
- **Headings**: Cinzel (elegant serif) - Fantasy-style titles
- **Body**: Inter (clean sans-serif) - Readable content

### Animations
- Powered by GSAP 3.12.5 with ScrollTrigger
- Tailwind CSS custom animations
- Smooth parallax scrolling effects
- Staggered reveal animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/xavierwongzh/website.git

# Navigate to project directory
cd website

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── globals.css         # Global styles & Tailwind directives
│   ├── layout.tsx          # Root layout with fonts & metadata
│   └── page.tsx            # Main page component
├── components/
│   ├── sections/
│   │   ├── Hero.tsx        # Hero section with stars & lights
│   │   ├── About.tsx       # About section with profile
│   │   ├── Education.tsx   # Education timeline
│   │   └── Projects.tsx    # Projects grid
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── Navigation.tsx      # Navigation bar
│   ├── BackToTop.tsx       # Back to top button
│   └── MouseGlow.tsx       # Mouse glow effect
├── hooks/
│   └── useGSAP.ts          # GSAP animation hooks
├── lib/
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
├── public/                 # Static assets
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js configuration
├── components.json         # shadcn/ui configuration
└── README.md
```

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.7.3** - Type safety and better DX

### Styling & UI
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible component primitives
- **class-variance-authority** - Component variants
- **tailwindcss-animate** - Animation utilities

### Animations
- **GSAP 3.12.5** - Professional-grade animation library
- **ScrollTrigger** - Scroll-based animations
- **Framer Motion 11.15.0** - React animation library

### Icons & Typography
- **Lucide React** - Beautiful icon library
- **Google Fonts** - Cinzel & Inter fonts

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 🎯 Customization

### Update Personal Information

1. **Edit Content** (`components/sections/*.tsx`):
   - Update bio in `About.tsx`
   - Modify education entries in `Education.tsx`
   - Add/edit projects in `Projects.tsx`

2. **Interests Tags** (`components/sections/About.tsx`):
```typescript
const interests: Interest[] = [
  { id: "1", name: "Your Interest" },
  // Add more...
];
```

3. **Projects** (`components/sections/Projects.tsx`):
```typescript
const projects: Project[] = [
  {
    id: "1",
    icon: "🚀",
    title: "Your Project",
    description: "Project description",
    tags: ["Tech1", "Tech2"],
    link: "https://your-project.com",
  },
];
```

### Customize Theme Colors

Edit `tailwind.config.ts`:

```typescript
forest: {
  navy: "#your-color",
  teal: "#your-color",
  // ...
}
```

### Add New Components

```bash
# Using shadcn/ui CLI
npx shadcn@latest add [component-name]
```

## 📱 Responsive Design

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

Mobile menu automatically activates on small screens.

## 🌙 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📄 License

© Xavier 2025 - Crafted under the moonlight

---

**Tip**: For the best experience, view on a desktop with a dark room setting! ✨

Built with modern web technologies following best practices from [Revine](https://github.com/hunchongtan/revine).