import { create } from 'zustand';
import { UserProfile, ChatRoom, ChatMessage, ChatMember, ActiveVote, ToastNotification } from '../types';
import { Role, PrivacyMode, RoomType, RoomStatus, MessageType, AdmissionStatus } from '@council/shared';

interface AppState {
  // User Identity State
  currentUser: UserProfile;
  setCurrentUser: (user: Partial<UserProfile>) => void;

  // Connection & UI State
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  isSidebarOpenMobile: boolean;
  setSidebarOpenMobile: (open: boolean) => void;

  // Rooms State
  rooms: ChatRoom[];
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;

  // Active Chat State
  messages: Record<string, ChatMessage[]>;
  members: Record<string, ChatMember[]>;
  pendingAdmissions: Record<string, { id: string; username: string; avatarUrl: string }[]>;

  // Active Vote State
  activeVotes: Record<string, ActiveVote | null>;

  // Modal Triggers
  modalState: {
    createRoom: boolean;
    joinRoom: boolean;
    profileEditor: boolean;
    roomDetails: boolean;
    saveVote: boolean;
    mediaVote: string | null; // mediaId if open
    pendingAdmissions: boolean;
  };
  openModal: (modal: keyof AppState['modalState'], payload?: any) => void;
  closeModal: (modal: keyof AppState['modalState']) => void;

  // Toast System
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // Mock Actions for Stage 1 UI Demonstration
  createRoomMock: (roomData: { name: string; isSavedAtCreation: boolean; isPrivate: boolean; maxMembers?: number }) => void;
  joinRoomMock: (code: string) => void;
  addMessageMock: (roomId: string, content: string, type?: MessageType, media?: any) => void;
  castVoteMock: (voteId: string, choice: 'YES' | 'NO') => void;
}

const MOCK_USER: UserProfile = {
  id: 'user-001',
  username: 'Alex River',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  deviceToken: 'dev-token-xyz-98765',
  isNewDevice: false,
};

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 'room-1',
    name: 'AI Project Council',
    creatorId: 'user-001',
    roomType: RoomType.TEMPORARY,
    privacyMode: PrivacyMode.PRIVATE,
    status: RoomStatus.ACTIVE,
    joinedMemberCount: 10,
    activeMemberCount: 6,
    unreadCount: 2,
    userRole: Role.CREATOR,
    userAdmissionStatus: AdmissionStatus.APPROVED,
    expiresAt: '2026-10-10T12:00:00Z',
  },
  {
    id: 'room-2',
    name: 'Research Discussion (Saved)',
    creatorId: 'user-002',
    roomType: RoomType.PERSISTENT,
    privacyMode: PrivacyMode.OPEN,
    status: RoomStatus.ACTIVE,
    savedAt: '2026-10-08T10:00:00Z',
    joinedMemberCount: 15,
    activeMemberCount: 4,
    unreadCount: 0,
    userRole: Role.MEMBER,
    userAdmissionStatus: AdmissionStatus.APPROVED,
  },
  {
    id: 'room-3',
    name: 'Secret Design Audit',
    creatorId: 'user-003',
    roomType: RoomType.TEMPORARY,
    privacyMode: PrivacyMode.PRIVATE,
    status: RoomStatus.ACTIVE,
    joinedMemberCount: 5,
    activeMemberCount: 2,
    unreadCount: 0,
    userRole: Role.MEMBER,
    userAdmissionStatus: AdmissionStatus.PENDING,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'room-1': [
    {
      id: 'msg-1',
      roomId: 'room-1',
      senderId: 'user-002',
      senderName: 'Elena Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      type: MessageType.TEXT,
      content: 'Welcome to the AI Project Council room! Note: this room is currently TEMPORARY.',
      createdAt: '10:14 AM',
      status: 'read',
    },
    {
      id: 'msg-2',
      roomId: 'room-1',
      senderId: 'user-001',
      senderName: 'Alex River (You)',
      senderAvatar: MOCK_USER.avatarUrl,
      type: MessageType.TEXT,
      content: 'I uploaded the system architecture diagram. Download is restricted unless requested.',
      createdAt: '10:16 AM',
      status: 'read',
    },
    {
      id: 'msg-3',
      roomId: 'room-1',
      senderId: 'user-001',
      senderName: 'Alex River (You)',
      senderAvatar: MOCK_USER.avatarUrl,
      type: MessageType.IMAGE,
      media: {
        id: 'media-101',
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        mimeType: 'image/jpeg',
        size: 1024 * 512,
        downloadAllowed: false, // Download locked by uploader
      },
      createdAt: '10:17 AM',
      status: 'delivered',
    },
  ],
};

const MOCK_MEMBERS: Record<string, ChatMember[]> = {
  'room-1': [
    { id: 'user-001', username: 'Alex River (You)', avatarUrl: MOCK_USER.avatarUrl, role: Role.CREATOR, joinedAt: '2026-10-09', isOnline: true },
    { id: 'user-002', username: 'Elena Vance', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: Role.SUBSTITUTE, joinedAt: '2026-10-09', isOnline: true },
    { id: 'user-003', username: 'Marcus Brody', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: Role.MEMBER, joinedAt: '2026-10-09', isOnline: false },
  ],
};

const MOCK_PENDING: Record<string, { id: string; username: string; avatarUrl: string }[]> = {
  'room-1': [
    { id: 'user-009', username: 'Jordan Lee', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ],
};

const MOCK_VOTES: Record<string, ActiveVote | null> = {
  'room-1': {
    id: 'vote-save-101',
    roomId: 'room-1',
    targetType: 'ROOM_SAVE',
    targetId: 'room-1',
    eligibleMemberSnapshot: 10,
    yesCount: 4,
    noCount: 1,
    userVote: undefined,
    expiresAt: '2026-10-09T18:00:00Z',
  },
};

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: MOCK_USER,
  setCurrentUser: (user) => set((state) => ({ currentUser: { ...state.currentUser, ...user } })),

  isConnected: true,
  setIsConnected: (connected) => set({ isConnected: connected }),
  isSidebarOpenMobile: false,
  setSidebarOpenMobile: (open) => set({ isSidebarOpenMobile: open }),

  rooms: MOCK_ROOMS,
  activeRoomId: 'room-1',
  setActiveRoomId: (id) => set({ activeRoomId: id, isSidebarOpenMobile: false }),

  messages: MOCK_MESSAGES,
  members: MOCK_MEMBERS,
  pendingAdmissions: MOCK_PENDING,
  activeVotes: MOCK_VOTES,

  modalState: {
    createRoom: false,
    joinRoom: false,
    profileEditor: false,
    roomDetails: false,
    saveVote: false,
    mediaVote: null,
    pendingAdmissions: false,
  },
  openModal: (modal, payload) =>
    set((state) => ({
      modalState: {
        ...state.modalState,
        [modal]: payload !== undefined ? payload : true,
      },
    })),
  closeModal: (modal) =>
    set((state) => ({
      modalState: {
        ...state.modalState,
        [modal]: modal === 'mediaVote' ? null : false,
      },
    })),

  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(2) }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  createRoomMock: ({ name, isSavedAtCreation, isPrivate, maxMembers }) => {
    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      name,
      creatorId: get().currentUser.id,
      roomType: isSavedAtCreation ? RoomType.PERSISTENT : RoomType.TEMPORARY,
      privacyMode: isPrivate ? PrivacyMode.PRIVATE : PrivacyMode.OPEN,
      status: RoomStatus.ACTIVE,
      maxMembers: maxMembers || undefined,
      savedAt: isSavedAtCreation ? new Date().toISOString() : undefined,
      joinedMemberCount: 1,
      activeMemberCount: 1,
      unreadCount: 0,
      userRole: Role.CREATOR,
      userAdmissionStatus: AdmissionStatus.APPROVED,
    };
    set((state) => ({
      rooms: [newRoom, ...state.rooms],
      activeRoomId: newRoom.id,
      modalState: { ...state.modalState, createRoom: false },
    }));
    get().addToast({
      type: 'success',
      title: 'Room Created',
      message: `Room "${name}" created successfully in ${newRoom.roomType} mode.`,
    });
  },

  joinRoomMock: (code) => {
    get().addToast({
      type: 'info',
      title: 'Join Request',
      message: `Processing invitation code ${code}...`,
    });
    set((state) => ({ modalState: { ...state.modalState, joinRoom: false } }));
  },

  addMessageMock: (roomId, content, type = MessageType.TEXT, media) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      roomId,
      senderId: get().currentUser.id,
      senderName: get().currentUser.username,
      senderAvatar: get().currentUser.avatarUrl,
      type,
      content,
      media,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), newMsg],
      },
    }));
  },

  castVoteMock: (voteId, choice) => {
    const vote = get().activeVotes['room-1'];
    if (!vote) return;

    const newYes = choice === 'YES' ? vote.yesCount + 1 : vote.yesCount;
    const newNo = choice === 'NO' ? vote.noCount + 1 : vote.noCount;
    const N = vote.eligibleMemberSnapshot;

    // Check rules: 50% approval (ceil(N*0.5)) & 30% floor (ceil(N*0.3))
    const req50 = Math.ceil(N * 0.5);
    const req30 = Math.ceil(N * 0.3);

    const meets50 = newYes >= req50;
    const meets30 = newYes >= req30;

    let toastMsg = `Vote cast (${choice}). Current: ${newYes}/${req50} YES votes needed.`;
    if (!meets30 && choice === 'YES') {
      get().addToast({
        type: 'warning',
        title: 'Threshold Warning',
        message: 'Action not completed — the minimum 30% member approval has not been reached.',
      });
    } else {
      get().addToast({
        type: meets50 ? 'success' : 'info',
        title: meets50 ? 'Vote Approved!' : 'Vote Recorded',
        message: toastMsg,
      });
    }

    set((state) => ({
      activeVotes: {
        ...state.activeVotes,
        'room-1': {
          ...vote,
          yesCount: newYes,
          noCount: newNo,
          userVote: choice,
        },
      },
    }));
  },
}));
