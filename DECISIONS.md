# ARCHITECTURAL AND IMPLEMENTATION DECISIONS — Council

## 1. Monorepo and Repository Architecture

### Decision
Use a clean monorepo structure using standard workspace tools (pnpm or npm workspaces):
```
Council/
├── apps/
│   ├── web/           # Next.js 14+ (App Router), React, Tailwind CSS, Zustand, TanStack Query, Socket.IO Client, PWA
│   └── api/           # NestJS (REST + WebSockets gateway, DTO validation, Guards, BullMQ background jobs)
├── packages/
│   ├── shared/        # Shared DTOs, TypeScript Interfaces, Validation Schemas, Enums, Constants
│   └── ui/            # Reusable UI Design System & Component Primitives
├── prisma/
│   ├── schema.prisma  # PostgreSQL relational schema
│   └── migrations/    # Version-controlled migrations
├── docs/              # Traceability matrix, design diagrams, operational guides
├── .env.example
├── README.md
├── PROJECT_STATUS.md
├── IMPLEMENTATION_LOG.md
├── DECISIONS.md
└── TEST_REPORT.md
```

### Rationale
Separating frontend (`apps/web`), backend (`apps/api`), and shared validation contracts (`packages/shared`) ensures clean separation of concerns, enables type safety across API/WebSocket boundaries without duplication, and avoids monolithic coupling.

---

## 2. Device Identity & Privacy-Preserving User Model (BR-09, FR-06, FR-07)

### Decision
- Standard web browsers cannot access raw hardware MAC addresses due to web sandbox security restrictions.
- As required by Section 5 of the SRS, "Device Identity" is implemented as a cryptographically random, high-entropy installation token (`installationToken`) generated on first visit and stored securely in browser `localStorage` / HTTP-only cookie.
- The server hashes this token (`sha256(installationToken)`) to create the `DeviceIdentity` record.
- **New Device Flow**: When an un-hashed installation token is presented without an associated `User` profile, the frontend mandates mandatory username and avatar setup before permitting room creation or joining.
- **Returning Device Flow**: When a recognized token hash is presented, the server returns the existing `User` profile and session token automatically.
- **Profile Updates**: Users may edit their username or avatar at any time; updates immediately save as default for subsequent visits on that device identity.
- **Privacy Guarantee**: Raw device tokens or hashes are never broadcast or exposed to other room members.

---

## 3. Room Creation & Daily Limit Enforcement (BR-01, BR-02, BR-07)

### Decision
- **Default Room Mode**: Rooms are `TEMPORARY` unless the creator explicitly sets `isSavedAtCreation = true`. If saved at creation, the room becomes `PERSISTENT` immediately without a vote.
- **Daily Room Creation Limit**: Enforced strictly server-side on NestJS REST endpoint `POST /rooms`.
  - Max 15 rooms per device identity per calendar day (determined in application timezone, e.g., UTC / local configured).
  - Tracked via `DailyRoomCounter` table in PostgreSQL and atomic Redis counter (`INCRBY`).
  - Attempting to create a 16th room returns `429 Too Many Requests` with a clear message: `"Daily room creation limit of 15 rooms reached for today."`
- **Private Room Admission**: When `privacyMode = PRIVATE`, possessing the invite link/code places the user in `PENDING_ADMISSION` state. Entry requires explicit approval from the room creator or a creator-assigned `Substitute`.

---

## 4. Consent and Voting Engine Architecture (BR-03, BR-04, BR-05, BR-06, FR-13, FR-14, FR-15)

### Decision
- **Single Centralized Implementation**: All voting calculations are handled exclusively by a central `ConsentEngineService` in NestJS. Neither frontend components nor WebSocket gateway handlers independently calculate vote pass/fail criteria.
- **Voting Denominator Freeze (BR-05)**:
  - At the moment a vote request (e.g. Save Room or Download Media) is created, the system snapshots the exact list of current `JOINED` members (`eligible_member_snapshot`).
  - Active/online count is **never** used as the denominator $N$.
- **Two Independent Formulae**:
  1. **50% Approval Threshold**: $\text{YES Votes} \ge \lceil N \times 0.50 \rceil$
  2. **30% Minimum Agreement Floor**: $\text{YES Votes} \ge \lceil N \times 0.30 \rceil$
  - Final decision executes **only** if both conditions evaluate to `true`.
- **Active Voter Trap Prevention & Toast Notification**:
  - Example: If 6 out of 8 active voters in a 20-member room vote YES ($6/8 = 75\%$ of voters), but $N=20$:
    - 50% threshold requires $\lceil 20 \times 0.50 \rceil = 10$ YES votes.
    - 30% floor requires $\lceil 20 \times 0.30 \rceil = 6$ YES votes.
    - Here YES votes = 6. Condition 1 fails ($6 < 10$). Action is NOT executed.
  - If 50% of *voters* approved but total YES votes $< \lceil N \times 0.30 \rceil$ (e.g., $N=10$, 2 voters active, 2 YES votes $= 20\% < 30\%$), the backend emits a WebSocket event / REST payload triggering a non-blocking toast:
    > `"Action not completed — the minimum 30% member approval has not been reached."`
- **Save Request Limits (BR-06)**:
  - **Non-creator member**: Allowed exactly 1 save initiation attempt per room lifetime (`SaveRequest` table unique constraint `[room_id, initiator_id]`).
  - **Creator**: May initiate multiple save requests over the room's lifetime if previous attempts fail, but every creator request remains subject to the full 50% + 30% consent engine rules.

---

## 5. Media Upload, Storage & Download Permission (BR-08, FR-09, FR-10)

### Decision
- **Cloudinary Integration**:
  - Direct upload from browser using signed Cloudinary parameters generated by NestJS backend (`POST /media/upload-intent`).
  - Supported resource types: Image, Video, Audio.
  - Validate file size, mime type, and user room membership before issuing upload intent.
- **Metadata in PostgreSQL**:
  - Only Cloudinary asset ID (`public_id`), `storage_key`, `mime_type`, `size`, `duration`, and `download_allowed` boolean are stored in DB. No binary BLOBs in PostgreSQL.
- **Download Authorization**:
  - If `download_allowed = true` (set by uploader at time of sharing), official download URL is immediately available to room members.
  - If `download_allowed = false`, official download links are locked until a media download vote passes via the Consent Engine.
  - Media URLs served to clients are signed, short-lived URLs.
- **Technical Limitation Acknowledgment**:
  - The application controls official download buttons and signed URLs, but cannot physically prevent screen capture, external recording, or browser element inspection. This is explicitly documented to users.

---

## 6. Temporary Room Retention, Expiration & Deletion Lifecycle (FR-16)

### Decision
- **Lifecycle States**: `CREATED_TEMPORARY` $\rightarrow$ `ACTIVE` $\rightarrow$ `EXPIRING` (in grace period) $\rightarrow$ `DELETING` $\rightarrow$ `DELETED`.
- **Grace Period Mechanics**:
  - When the last member leaves a temporary room, BullMQ schedules a room expiration job with a 24-hour grace period (configurable via `ROOM_GRACE_PERIOD_HOURS`).
  - If any eligible member rejoins during the grace period, the background worker job is cancelled, and room state returns to `ACTIVE`.
  - If the grace period expires with no returning members, the deletion job runs idempotently:
    1. Mark room as `DELETING` (prevents race conditions).
    2. Revoke active invitation codes/tokens.
    3. Delete media assets from Cloudinary via API.
    4. Delete messages, votes, media metadata, and room membership records from PostgreSQL.
    5. Delete room record.

---

## 7. PostgreSQL Database Schema (Prisma)

### Schema Specification
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CREATOR
  SUBSTITUTE
  MEMBER
}

enum PrivacyMode {
  OPEN
  PRIVATE
}

enum RoomType {
  TEMPORARY
  PERSISTENT
}

enum RoomStatus {
  ACTIVE
  EXPIRING
  DELETING
  DELETED
}

enum AdmissionStatus {
  PENDING
  APPROVED
  REJECTED
}

enum TargetType {
  ROOM_SAVE
  MEDIA_DOWNLOAD
}

enum VoteStatus {
  OPEN
  APPROVED
  REJECTED
  EXPIRED
}

enum VoteChoice {
  YES
  NO
}

enum MessageType {
  TEXT
  IMAGE
  VIDEO
  AUDIO
  SYSTEM
}

model User {
  id               String          @id @default(uuid())
  username         String
  avatarUrl        String?
  status           String          @default("active")
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  deviceIdentities DeviceIdentity[]
  memberships      RoomMember[]
  createdRooms     Room[]          @relation("RoomCreator")
  substitutes      Substitute[]    @relation("AssignedUser")
  messages         Message[]
  voteResponses    VoteResponse[]
  saveRequests     SaveRequest[]
}

model DeviceIdentity {
  id                    String    @id @default(uuid())
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  installationTokenHash String    @unique
  firstSeenAt           DateTime  @default(now())
  lastSeenAt            DateTime  @updatedAt
  revokedAt             DateTime?
}

model Room {
  id                 String              @id @default(uuid())
  creatorId          String
  creator            User                @relation("RoomCreator", fields: [creatorId], references: [id])
  name               String
  roomType           RoomType            @default(TEMPORARY)
  privacyMode        PrivacyMode         @default(OPEN)
  status             RoomStatus          @default(ACTIVE)
  maxMembers         Int?
  savedAt            DateTime?
  expiresAt          DateTime?
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  members            RoomMember[]
  substitutes        Substitute[]
  invites            Invite[]
  messages           Message[]
  votes              Vote[]
  admissionRequests  AdmissionRequest[]
  saveRequests       SaveRequest[]
}

model RoomMember {
  id         String    @id @default(uuid())
  roomId     String
  room       Room      @relation(fields: [roomId], references: [id], onDelete: Cascade)
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  role       Role      @default(MEMBER)
  joinedAt   DateTime  @default(now())
  leftAt     DateTime?
  status     String    @default("JOINED") // JOINED, LEFT, REMOVED

  @@unique([roomId, userId])
}

model Substitute {
  id         String   @id @default(uuid())
  roomId     String
  room       Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  userId     String
  user       User     @relation("AssignedUser", fields: [userId], references: [id], onDelete: Cascade)
  assignedBy String
  assignedAt DateTime @default(now())
  revokedAt  DateTime?

  @@unique([roomId, userId])
}

model AdmissionRequest {
  id         String          @id @default(uuid())
  roomId     String
  room       Room            @relation(fields: [roomId], references: [id], onDelete: Cascade)
  userId     String
  status     AdmissionStatus @default(PENDING)
  reviewedBy String?
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
}

model SaveRequest {
  id          String   @id @default(uuid())
  roomId      String
  room        Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  initiatorId String
  initiator   User     @relation(fields: [initiatorId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@unique([roomId, initiatorId])
}

model Invite {
  id        String    @id @default(uuid())
  roomId    String
  room      Room      @relation(fields: [roomId], references: [id], onDelete: Cascade)
  tokenHash String    @unique
  code      String    @unique
  expiresAt DateTime?
  revokedAt DateTime?
  createdAt DateTime  @default(now())
}

model Message {
  id         String      @id @default(uuid())
  roomId     String
  room       Room        @relation(fields: [roomId], references: [id], onDelete: Cascade)
  senderId   String
  sender     User        @relation(fields: [senderId], references: [id])
  type       MessageType @default(TEXT)
  content    String?
  replyToId  String?
  replyTo    Message?    @relation("MessageReplies", fields: [replyToId], references: [id], onDelete: SetNull)
  replies    Message[]   @relation("MessageReplies")
  createdAt  DateTime    @default(now())
  editedAt   DateTime?
  deletedAt  DateTime?
  media      Media?
}

model Media {
  id              String   @id @default(uuid())
  messageId       String   @unique
  message         Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
  storageKey      String   // Cloudinary public_id
  url             String
  mimeType        String
  size            Int
  duration        Int?
  downloadAllowed Boolean  @default(false)
  createdAt       DateTime @default(now())
}

model Vote {
  id                     String         @id @default(uuid())
  roomId                 String
  room                   Room           @relation(fields: [roomId], references: [id], onDelete: Cascade)
  targetType             TargetType
  targetId               String         // roomId for ROOM_SAVE, mediaId for MEDIA_DOWNLOAD
  status                 VoteStatus     @default(OPEN)
  eligibleMemberSnapshot Int            // Snapshot of joined member count when vote was opened
  expiresAt              DateTime
  createdAt              DateTime       @default(now())
  updatedAt              DateTime       @updatedAt
  responses              VoteResponse[]
}

model VoteResponse {
  id        String     @id @default(uuid())
  voteId    String
  vote      Vote       @relation(fields: [voteId], references: [id], onDelete: Cascade)
  memberId  String
  member    User       @relation(fields: [memberId], references: [id], onDelete: Cascade)
  choice    VoteChoice
  createdAt DateTime   @default(now())

  @@unique([voteId, memberId])
}

model DailyRoomCounter {
  id           String   @id @default(uuid())
  identityKey  String   // userId or installationTokenHash
  calendarDate String   // YYYY-MM-DD
  roomCount    Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([identityKey, calendarDate])
}
```
