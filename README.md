## VitalPulse

VitalPulse is a React + Vite web application that acts as a personal health companion. It provides an authentication flow with a modern UI, local persistence, and a component-driven architecture designed for quick iteration.

---

## Tech stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, custom utility helpers (`cn`)
- **UI Icons & Motion**: `lucide-react`, `motion`
- **Data & State**: Local storage helpers (`storage` utilities) plus React state
- **Tooling**: TypeScript, Vite dev server, simple lint step via `tsc`

---

## Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **Package manager**: `npm` (bundled with Node)

Check your versions:

```bash
node -v
npm -v
```

---

## Getting started (for developers)

1. **Clone the repository**

   ```bash
   git clone https://github.com/BashirMohamedAli/VitalPulse.git
   cd VitalPulse
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables (if needed)**

   - This project uses `dotenv`.  
   - Create a `.env` file in the project root if your features require API keys or secrets (for example, Gen AI keys or backend URLs).
   - Keep `.env` out of version control and follow the security guidelines in `SECURITY.md` if/when that file is added.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   - By default Vite starts on `http://localhost:3000`.
   - The site should auto-reload when you edit source files.

5. **Build for production**

   ```bash
   npm run build
   ```

   - Outputs static assets into the `dist` directory.

6. **Preview the production build**

   ```bash
   npm run preview
   ```

   - Serves the built app locally so you can verify the optimized bundle.

7. **Type-check / lint**

   ```bash
   npm run lint
   ```

   - Runs TypeScript in no-emit mode to catch type issues.

---

## Auth flow overview

- **Login / Sign Up** UI is implemented in `src/components/Auth.tsx`.
- Users can:
  - **Sign up** with name, email, and password.
  - **Log in** with an existing email and password combination.
- User data is stored via the `storage` utilities (see `src/lib/storage`), which persist users and the current user in browser storage.
- On successful login, `Auth` calls the `onLogin` prop with the authenticated user object so the rest of the app can react.

---

## Conventions for contributors

- **TypeScript-first**: Prefer adding/maintaining type definitions in `src/types.ts` (and related files).
 - **Components**: Keep components small and focused. Co-locate component-specific hooks and utilities in the same folder when it aids clarity.
- **Styling**: Use the existing Tailwind design tokens and the `cn` helper where appropriate, instead of introducing ad-hoc class string concatenation.
---

## Running in a clean state

If you run into build or dev server issues:

```bash
npm run clean
npm install
npm run dev
```

This removes the `dist` directory, reinstalls dependencies, and restarts the dev server.