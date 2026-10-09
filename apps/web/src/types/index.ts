import { Role, PrivacyMode, RoomType, RoomStatus, MessageType, AdmissionStatus } from '@council/shared';

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  deviceToken: string;
  isNewDevice: boolean;
}

export interface ChatMember {
  id: string;
  username: string;
  avatarUrl: string;
  role: Role;
  joinedAt: string;
  isOnline: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  creatorId: string;
  roomType: RoomType;
  privacyMode: PrivacyMode;
  status: RoomStatus;
  maxMembers?: number;
  savedAt?: string;
  expiresAt?: string;
  joinedMemberCount: number;
  activeMemberCount: number;
  unreadCount: number;
  userRole: Role;
  userAdmissionStatus: AdmissionStatus;
  saveRequestInitiatedBy?: string; // userId if active vote open
}

export interface ChatMedia {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  downloadAllowed: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: MessageType;
  content?: string;
  media?: ChatMedia;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ActiveVote {
  id: string;
  roomId: string;
  targetType: 'ROOM_SAVE' | 'MEDIA_DOWNLOAD';
  targetId: string;
  eligibleMemberSnapshot: number;
  yesCount: number;
  noCount: number;
  userVote?: 'YES' | 'NO';
  expiresAt: string;
}

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}
