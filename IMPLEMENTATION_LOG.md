# IMPLEMENTATION LOG — Council

## [2026-10-09] — Stage 1: Frontend and User Interface Foundation

### Objective
Build the responsive, mobile-first frontend application shell using Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, and Zustand. Implement all UI components, modals, toasts, PWA manifest, and state management required for room creation, joining, messaging, profile setup, voting, and media authorization.

### Implemented Features & Tasks
- **App Shell & Theme**:
  - Configured Tailwind CSS, PostCSS, Lucide icons, dark mode theme in `apps/web`.
  - Built mobile-responsive layout (`Sidebar` drawer for mobile, fixed sidebar for desktop).
  - Configured PWA manifest (`public/manifest.json`) and viewport meta tags for standalone app experience.
- **Sidebar & Navigation ([`Sidebar.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/Sidebar.tsx))**:
  - User profile preview header with remembered device identity badge.
  - Search bar and room type filter tabs (All, Temporary, Persistent).
  - Create Room & Join via Code action buttons.
  - Room item cards displaying badges (`TEMPORARY`, `PERSISTENT`, `PRIVATE`, `OPEN`), joined member count, unread count badge.
- **Chat Header & Info ([`ChatHeader.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/ChatHeader.tsx))**:
  - Room name, mode status pill, online/joined member count indicator.
  - Action triggers: "Request Save Room", "Pending Requests" badge (for private room creators/substitutes), copy invite link, room details sidebar.
- **Message List & Composer ([`MessageList.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/MessageList.tsx), [`Composer.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/Composer.tsx))**:
  - Message bubble grouping (outgoing sky tint vs incoming slate dark background), sender names, timestamps, checkmark status indicators.
  - Media attachment previews distinguishing downloadable media vs uploader-locked media (with "Vote to Unlock" trigger).
  - Composer input with attachment intent, "Allow download" toggle switch (BR-08), voice note record trigger simulation.
  - Active room vote progress banner displaying live tally toward required 50% approval threshold.
- **Modal Dialogs**:
  - [`CreateRoomModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/CreateRoomModal.tsx): Temporary vs Saved-at-creation toggle (BR-01), Open vs Private admission mode selection (BR-07), optional member capacity limit.
  - [`JoinRoomModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/JoinRoomModal.tsx): Invitation code / link entry.
  - [`ProfileModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/ProfileModal.tsx): Mandatory onboarding for new device identities & profile editor for returning devices (BR-09, FR-06, FR-07), device token reset capability.
  - [`RoomDetailsModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/RoomDetailsModal.tsx): Room summary, member list with role badges (`CREATOR`, `SUBSTITUTE`, `MEMBER`), creator controls to assign/revoke substitutes (BR-07, FR-05).
  - [`SaveRoomVoteModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/SaveRoomVoteModal.tsx): Live tally visualization of eligible member snapshot ($N$), required 50% approval ($\ge \lceil N \times 0.50 \rceil$), required 30% floor ($\ge \lceil N \times 0.30 \rceil$), YES/NO voting triggers.
  - [`MediaVoteModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/MediaVoteModal.tsx): Media unlock vote trigger for locked uploads (BR-08).
  - [`PendingAdmissionsModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/PendingAdmissionsModal.tsx): Approval/rejection queue for private room entrants (BR-07).
- **Toast System & Overlays ([`Toast.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/Toast.tsx))**:
  - Non-blocking notification toasts.
  - Disconnected gateway banner & Pending admission overlay banner for private rooms.

### Files Created or Modified
- [`apps/web/package.json`](file:///d:/PROJECTS/Council/apps/web/package.json)
- [`apps/web/tailwind.config.ts`](file:///d:/PROJECTS/Council/apps/web/tailwind.config.ts)
- [`apps/web/postcss.config.mjs`](file:///d:/PROJECTS/Council/apps/web/postcss.config.mjs)
- [`apps/web/src/app/globals.css`](file:///d:/PROJECTS/Council/apps/web/src/app/globals.css)
- [`apps/web/src/app/layout.tsx`](file:///d:/PROJECTS/Council/apps/web/src/app/layout.tsx)
- [`apps/web/src/app/page.tsx`](file:///d:/PROJECTS/Council/apps/web/src/app/page.tsx)
- [`apps/web/src/types/index.ts`](file:///d:/PROJECTS/Council/apps/web/src/types/index.ts)
- [`apps/web/src/lib/store.ts`](file:///d:/PROJECTS/Council/apps/web/src/lib/store.ts)
- [`apps/web/src/components/Sidebar.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/Sidebar.tsx)
- [`apps/web/src/components/ChatHeader.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/ChatHeader.tsx)
- [`apps/web/src/components/MessageList.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/MessageList.tsx)
- [`apps/web/src/components/Composer.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/Composer.tsx)
- [`apps/web/src/components/Toast.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/Toast.tsx)
- [`apps/web/src/components/modals/CreateRoomModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/CreateRoomModal.tsx)
- [`apps/web/src/components/modals/JoinRoomModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/JoinRoomModal.tsx)
- [`apps/web/src/components/modals/ProfileModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/ProfileModal.tsx)
- [`apps/web/src/components/modals/RoomDetailsModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/RoomDetailsModal.tsx)
- [`apps/web/src/components/modals/SaveRoomVoteModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/SaveRoomVoteModal.tsx)
- [`apps/web/src/components/modals/MediaVoteModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/MediaVoteModal.tsx)
- [`apps/web/src/components/modals/PendingAdmissionsModal.tsx`](file:///d:/PROJECTS/Council/apps/web/src/components/modals/PendingAdmissionsModal.tsx)
- [`apps/web/src/__tests__/store.test.ts`](file:///d:/PROJECTS/Council/apps/web/src/__tests__/store.test.ts)

### Tests Executed & Results
- `npm test`: 10/10 tests passed across workspaces (`@council/shared` 6/6, `@council/api` 1/1, `@council/web` 3/3).
- `npm run typecheck`: 0 errors.
- `npm run build`: Successful compilation across all workspaces.

### Functional vs Visual Placeholder Summary
- **Functional**: Component hierarchy, responsive drawer layout, Zustand client state, modal triggers, voting math calculations, toast notifications, PWA manifest.
- **Visual Placeholder**: Realtime WebSocket socket connection (simulated in store), NestJS REST backend endpoints (connected in Stage 2+), Cloudinary direct upload (connected in Stage 6).
