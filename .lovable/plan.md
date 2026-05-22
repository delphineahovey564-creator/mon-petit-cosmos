
# EducEnfant — Build Plan

Your spec is large (15+ screens with detailed interactions). I'll deliver it in **two phases** so you get a working app fast, then iterate on the deep activity screens.

## Phase 1 — Foundation + all "shell" screens (this turn)

Covers everything you described in detail, end-to-end navigable:

1. **Design tokens** in `src/styles.css` (Tailwind v4 `@theme`) — all colors, radii, shadows, Nunito font (loaded via Google Fonts in `__root.tsx`).
2. **State layer** — `src/lib/storage.ts` with typed `getChild/setChild/getParent/setParent/getOnboardingDone` helpers, demo-data seeding on first load.
3. **Shared components** — `BottomNav`, `Leo` illustration (emoji-based placeholder 🦁 with framer-motion float), `Field` input, `PrimaryButton`.
4. **Routes** (TanStack file-based, not React Router — this template uses TanStack Start, which is functionally equivalent and what the project is wired for):
   - `/splash` — gradient + logo card + loader bar, auto-advance
   - `/` — redirect logic (onboarding → login → home)
   - `/onboarding` — 3-slide flow with AnimatePresence
   - `/signup` — full form, password strength meter, social buttons
   - `/login` — gradient top, child name greeting
   - `/create-profile` — 8 avatars, name, age 3-10
   - `/home` — hero, progress, 5 module cards (1 full + 4 half), daily challenge
   - `/module/$id` — module landing (already exists, refresh to match spec)
   - `/profile` — child profile w/ stars, streak, badges
   - `/parent` + `/parent/settings` — basic shells
5. **BottomNav** on `/home`, `/profile`, `/module/*`.

## Phase 2 — Deep activity screens (next turn, after Phase 1 ships)

These need extra libs (Konva, Howler, jsPDF) and complex interaction logic:

- `/module/alphabet/letter/$letter` — Konva tracing canvas, audio, tools, PDF export
- `/module/numbers/number/$num` — number tracing
- `/module/maths/exercise/$level` — math exercise UI
- `/module/drawing/canvas` — Konva free drawing
- `/module/stories/story/$storyId` — story reader w/ TTS
- `/victory` — celebration screen

## Technical notes

- **Routing**: project uses **TanStack Router** (file-based), not React Router v6. All `<Link to="/x">` and `useNavigate` calls use `@tanstack/react-router`. Behavior is identical for your needs.
- **Icons**: Lucide for UI; emoji 🦁 for Leo placeholder (you can swap in `src/assets/lion.png` later — I'll wire the component so it's a one-line swap).
- **State**: pure localStorage, no backend yet (matches your spec).
- **Existing files** `/dashboard`, `/profil`, `/module/$id` will be replaced/renamed to match the new routes (`/home`, `/create-profile`, etc.).

Confirm and I'll ship Phase 1.
