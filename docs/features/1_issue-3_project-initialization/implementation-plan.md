# Issue #3: Implementation Plan

สร้างโปรเจค Next.js 14+ (App Router) พร้อม TypeScript สำหรับแอป "The Middle Way" ที่มี Design System แบบ Warm Modern Sanctuary

---

## Proposed Changes

### Core Configuration

#### [NEW] Next.js Project Initialization
- ใช้ `create-next-app` สร้างโปรเจค Next.js 14+ พร้อม:
  - TypeScript
  - Tailwind CSS
  - App Router
  - ESLint

#### [NEW] Dependencies Installation
- `framer-motion` - สำหรับ animations
- `lucide-react` - สำหรับ iconography

---

### Design System

#### [MODIFY] tailwind.config.ts
- เพิ่ม custom colors:
  - `ivory: '#FCF9F6'` (Background)
  - `sage: '#8B9D83'` (Primary Accent)
  - `slate: '#2D3748'` (Text)
  - `sand: '#F3F0ED'` (Surface/Cards)
- เพิ่ม custom border-radius:
  - `pill: '40px'` (สำหรับ buttons)
  - `card: '1rem'` (สำหรับ cards)
- เพิ่ม Google Fonts:
  - `Playfair Display` (headings)
  - `Inter` (body)

#### [MODIFY] globals.css
- Import Google Fonts
- ตั้งค่า CSS variables สำหรับ design tokens
- Base styles สำหรับ typography

---

### Folder Structure

#### [NEW] Directory Hierarchy
```
/app
  /dashboard
  /library
  /courses
  /profile
/components
  /ui
  /layout
/lib
/hooks
```

---

### Initial Shell

#### [MODIFY] layout.tsx
- Root layout พร้อม Google Fonts
- Mobile-first responsive container
- Import `MobileNavigation` component

#### [NEW] MobileNavigation.tsx
- Fixed bottom navigation bar
- 4 tabs: Home, Library, Courses, Profile
- ใช้ Lucide icons
- Active state styling

#### [MODIFY] page.tsx
- Dashboard placeholder
- Ivory background
- Welcome message

---

## Verification Plan

### Automated Testing
```bash
# ทดสอบว่า build สำเร็จ
npm run build

# ทดสอบ linting
npm run lint
```

### Manual Verification
1. **รัน dev server**: `npm run dev`
2. **เปิด browser** ที่ `http://localhost:3000`
3. **ตรวจสอบ**:
   - พื้นหลังสี Ivory (#FCF9F6)
   - Navigation bar อยู่ด้านล่างหน้าจอ
   - มี 4 tabs: Home, Library, Courses, Profile
   - Typography: หัวข้อใช้ Playfair Display, body ใช้ Inter
   - Responsive บน mobile viewport
