# The Middle Way(Web Frontend) 🧘

A mindfulness and learning application built with Next.js 14+ and TypeScript.

## ✨ Features

- **Dashboard** - Overview of your journey with recent activity
- **Library** - Collection of mindfulness resources
- **Courses** - Structured learning paths with progress tracking
- **Profile** - Personal settings and preferences

## 🎨 Design System

**Warm Modern Sanctuary** palette:

| Token | Color | Usage |
|-------|-------|-------|
| Ivory | `#FCF9F6` | Background |
| Sage | `#8B9D83` | Primary Accent |
| Slate | `#2D3748` | Text |
| Sand | `#F3F0ED` | Surface/Cards |

**Typography:**
- Headings: Playfair Display (Serif)
- Body: Inter (Sans-serif)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout + Navigation
│   ├── page.tsx         # Dashboard
│   ├── globals.css      # Design tokens
│   ├── library/         # Library page
│   ├── courses/         # Courses page
│   └── profile/         # Profile page
├── components/
│   ├── ui/              # Atomic components
│   └── layout/          # Navigation, Headers
├── lib/                 # Utilities
├── hooks/               # Custom React hooks
└── docs/                # Documentation
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 Documentation

- [Features Documentation](./docs/features/)
- [Changelog](./CHANGELOG.md)

## 📝 License

MIT
