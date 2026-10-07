# Higher Studies Platform

A comprehensive higher education and study-abroad application platform connecting students, university opportunities, professors, and streamlined tracking.

---

## 🏗️ Architecture & Monorepo Structure

```
higher-studies/
├── web/              # Next.js 16 Frontend (App Router, Tailwind CSS)
│   ├── src/          # Screen views, components, dynamic routes
│   ├── public/       # Optimized static assets & portraits
│   └── package.json
└── apis/             # NestJS 12 Backend (TypeScript ESM, Vitest)
    ├── src/          # Controllers, modules, and services
    ├── test/         # E2E test suites
    └── package.json
```

---

## 🌟 Key Features

### 🖥️ Frontend (`/web`)
- **14 Production Screens**: Aligned with Figma design system.
- **Application Tracker**: Kanban board with HTML5 Drag-and-Drop and mobile stage navigation.
- **University Explorer**: Dynamic filters, match scores, tuition, acceptance rates, and university rankings.
- **Professor Directory & Profile**: Faculty overview, research publications, teaching history, and contact workflows.
- **Email & Communication Tracker**: Status monitoring and outreach log.
- **AI Academic Tools**: Statement of Purpose (SOP) generator, cold email drafter, CV builder, and profile evaluator.
- **Subscription & Pricing**: Free, Starter, Pro, and Premium tiers.
- **Student Profile & Settings**: Academic background, test scores, notifications, and security management.

### ⚙️ Backend (`/apis`)
- **NestJS Architecture**: Modular controllers, services, and dependency injection.
- **CORS Configured**: Pre-configured cross-origin sharing for frontend communication.
- **Modern Tooling**: TypeScript ESM with Vitest runner for fast unit and E2E testing.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20+ (v22 recommended)
- **npm**: v10+

### 2. Frontend Setup (`web`)
```bash
cd web
npm install
npm run dev        # Development server (port 3000/3005)
# or
npm run build      # Production build
npm run start -- -p 3005
```

### 3. Backend Setup (`apis`)
```bash
cd apis
npm install --legacy-peer-deps
npm run start:dev  # Development server (default port 4000)
# or
npm run build      # Build with nest-cli
npm test           # Run Vitest test suite
```

---

## 📄 License
UNLICENSED / Private repository.
