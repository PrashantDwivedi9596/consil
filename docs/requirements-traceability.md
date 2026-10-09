# Comprehensive Requirements Traceability Matrix — Council (TempChat)

| ID | Requirement Description | Category | Target Stage | Verification Method | Status |
|---|---|---|---|---|---|
| **BR-01** | Default room state (Temporary unless saved at creation) | Core Business Rule | Stage 3 (Backend) / Stage 1 (UI) | CreateRoomModal toggle & visual indicator | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **BR-02** | Daily creation limit (Max 15 rooms per user/device per calendar day) | Core Business Rule / Security | Stage 3 | REST API Guard Test (16th attempt rejected) | PENDING |
| **BR-03** | 50% consent threshold ($\ge \lceil N \times 0.50 \rceil$) | Core Business Rule / Voting | Stage 7 (Backend) / Stage 1 (UI) | SaveRoomVoteModal & `voting-math.ts` unit test | **VISUALLY IMPLEMENTED & UNIT VERIFIED** |
| **BR-04** | Minimum 30% agreement floor ($\ge \lceil N \times 0.30 \rceil$) | Core Business Rule / Voting | Stage 7 (Backend) / Stage 1 (UI) | Toast callout warning & `voting-math.ts` test | **VISUALLY IMPLEMENTED & UNIT VERIFIED** |
| **BR-05** | Joined-member denominator (Frozen $N$, active count ignored) | Core Business Rule / Voting | Stage 7 (Backend) / Stage 1 (UI) | Vote modal snapshot $N$ & member list | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **BR-06** | One save initiation per non-creator member | Core Business Rule / Voting | Stage 7 | Save Request trigger & DB constraint | PENDING |
| **BR-07** | Private room admission approval (Creator/Substitute only) | Core Business Rule / Security | Stage 4 (Backend) / Stage 1 (UI) | PendingAdmissionsModal & Pending overlay banner | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **BR-08** | Media download permission & vote unlock | Core Business Rule / Media | Stage 8 (Backend) / Stage 1 (UI) | Media lock badge & MediaVoteModal | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **BR-09** | New device profile setup & returning device recognition | Core Business Rule / Identity | Stage 2 (Backend) / Stage 1 (UI) | ProfileModal onboarding & device token display | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-01** | Create room with unique ID and secure invitation link/code | Functional Requirement | Stage 3 (Backend) / Stage 1 (UI) | CreateRoomModal & Copy invite button | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-02** | Enforce maximum 15 created rooms per user per day on backend | Functional Requirement | Stage 3 | Integration Test | PENDING |
| **FR-03** | Allow temporary or saved-at-creation room mode | Functional Requirement | Stage 3 (Backend) / Stage 1 (UI) | CreateRoomModal toggle | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-04** | Allow open invitation or private admission-controlled room | Functional Requirement | Stage 3 & 4 (Backend) / Stage 1 (UI) | Room list privacy badges & CreateRoomModal | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-05** | Allow creator to assign/revoke substitutes for private-room admission | Functional Requirement | Stage 4 (Backend) / Stage 1 (UI) | RoomDetailsModal substitute management controls | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-06** | Require username and avatar setup for new device identity | Functional Requirement | Stage 2 (Backend) / Stage 1 (UI) | ProfileModal mandatory onboarding | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-07** | Remember edited username/avatar for returning use | Functional Requirement | Stage 2 (Backend) / Stage 1 (UI) | ProfileModal settings editor | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-08** | Provide real-time text messaging | Functional Requirement | Stage 5 (Backend) / Stage 1 (UI) | ChatHeader, MessageList, Composer | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-09** | Provide image, video, and audio sharing | Functional Requirement | Stage 6 (Backend) / Stage 1 (UI) | Composer attachment controls & media preview | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-10** | Allow uploader to grant/deny official media download | Functional Requirement | Stage 8 (Backend) / Stage 1 (UI) | Composer "Allow download" toggle & locked badge | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-11** | Allow one save initiation per non-creator member | Functional Requirement | Stage 7 | API & DB Constraint | PENDING |
| **FR-12** | Allow creator repeated save initiations when room was not saved at creation | Functional Requirement | Stage 7 | API Unit Test | PENDING |
| **FR-13** | Require 50% joined-member approval for protected decisions | Functional Requirement | Stage 7 | SaveRoomVoteModal & `voting-math.ts` test | **VISUALLY IMPLEMENTED & UNIT VERIFIED** |
| **FR-14** | Require minimum 30% joined-member YES agreement for protected decisions | Functional Requirement | Stage 7 | Toast notification & `voting-math.ts` test | **VISUALLY IMPLEMENTED & UNIT VERIFIED** |
| **FR-15** | Show toast feedback when a decision is blocked by 30% minimum threshold | Functional Requirement | Stage 7 & 10 (Backend) / Stage 1 (UI) | ToastContainer & warning toast trigger | **VISUALLY IMPLEMENTED & UNIT VERIFIED** |
| **FR-16** | Expire/delete temporary rooms according to configured lifecycle | Functional Requirement | Stage 9 | BullMQ Worker & Grace Period Job | PENDING |
| **FR-17** | Provide PWA installability and standalone app-like UI | Functional Requirement | Stage 10 (Full) / Stage 1 (Shell) | Manifest, viewport config, mobile drawer, responsive dark mode | **SATISFIED (PWA SHELL COMPLETE)** |
| **FR-18** | Support pagination and scalable storage | Functional Requirement | Stage 5 & 18 | Cursor Pagination Test | PENDING |
| **FR-19** | Support message reactions, replies, and search | Functional Requirement | Stage 5 / V2 | Message reply preview UI | **VISUALLY IMPLEMENTED (STAGE 1 UI)** |
| **FR-20** | AI moderation / anti-spam (Future extension) | Functional Requirement | Future | Deferred | DEFERRED |
| **NFR-01** | Performance: Sub-second message delivery | Non-Functional | Stage 5 | Socket.IO Latency Test | PENDING |
| **NFR-02** | Security: Server-side authorization on every REST & WS event | Non-Functional | All Stages | Security Guard Audit Test | PENDING |
| **NFR-03** | Privacy: Minimal device identity data, no raw MAC exposure | Non-Functional | Stage 2 | Device Token Security Audit | **SATISFIED (SPECIFIED & UI PROTOTYPED)** |
| **NFR-04** | Maintainability: Monorepo with strict TS, Tailwind CSS, Zustand, Next.js App Router | Non-Functional | Stage 1 | Typecheck & Next.js production build | **SATISFIED (STAGE 1 BUILD COMPLETE)** |
