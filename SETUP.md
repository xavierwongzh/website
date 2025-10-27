# 🚀 Setup Instructions

Your portfolio has been rebuilt with a modern tech stack! Follow these steps to get started.

## ✅ What Was Changed

### Removed (Old Stack)
- ❌ `index.html` - Vanilla HTML
- ❌ `styles.css` - Plain CSS
- ❌ `script.js` - Vanilla JavaScript

### Added (Modern Stack)
- ✅ **Next.js 15** - React framework with App Router
- ✅ **React 19** - Latest React with improved performance
- ✅ **TypeScript 5** - Full type safety
- ✅ **Tailwind CSS 4** - Utility-first styling
- ✅ **shadcn/ui** - Beautiful, accessible components
- ✅ **GSAP with React hooks** - Professional animations
- ✅ **Lucide Icons** - Modern icon library

## 📦 Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages (~200MB of node_modules).

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production (Optional)

```bash
npm run build
npm start
```

## 🎨 Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles + Tailwind
│   ├── layout.tsx         # Root layout with fonts
│   └── page.tsx           # Main page
├── components/
│   ├── sections/          # Page sections (Hero, About, etc.)
│   ├── ui/               # Reusable UI components
│   ├── Navigation.tsx    # Nav bar
│   ├── BackToTop.tsx     # Scroll to top button
│   └── MouseGlow.tsx     # Mouse follow effect
├── hooks/
│   └── useGSAP.ts        # Animation hooks
├── lib/
│   └── utils.ts          # Utility functions
├── types/
│   └── index.ts          # TypeScript types
└── package.json          # Dependencies
```

## 🎯 Customization Guide

### Update Your Information

1. **About Section** (`components/sections/About.tsx`):
   - Edit the bio text
   - Modify interests array

2. **Education** (`components/sections/Education.tsx`):
   - Update education entries in the `educationData` array

3. **Projects** (`components/sections/Projects.tsx`):
   - Add/edit projects in the `projects` array

### Change Colors

Edit `tailwind.config.ts`:

```typescript
forest: {
  navy: "#your-color",
  teal: "#your-color",
  emerald: "#your-color",
  // ...
}
```

### Add New shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
# Example: npx shadcn@latest add badge
```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npm run build
# This will show any type errors
```

### Port already in use
```bash
# Change port
npm run dev -- -p 3001
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

### Deploy to Other Platforms

- **Netlify**: Works with Next.js
- **Railway**: Easy deployment
- **AWS Amplify**: Enterprise option

## 📚 Learn More

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)

### shadcn/ui
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Component Library](https://ui.shadcn.com/docs/components)

### GSAP
- [GSAP Documentation](https://gsap.com/docs/v3/)
- [ScrollTrigger Plugin](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

## 💡 Tips

1. **Hot Reload**: Save files and see changes instantly
2. **TypeScript**: Hover over components to see type info
3. **Tailwind**: Use VS Code Tailwind IntelliSense extension
4. **Components**: Build new features with shadcn/ui components
5. **Performance**: Next.js automatically optimizes images and fonts

## 🎓 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:3000
4. ✅ Customize your content
5. ✅ Deploy to Vercel

## 🙋 Need Help?

- Next.js: [Discord](https://discord.com/invite/nextjs)
- Tailwind CSS: [Discord](https://discord.com/invite/tailwindcss)
- shadcn/ui: [GitHub Discussions](https://github.com/shadcn-ui/ui/discussions)

---

**Happy coding! 🎉**

Your portfolio now uses the same modern tech stack as professional projects like [Revine](https://github.com/hunchongtan/revine).

