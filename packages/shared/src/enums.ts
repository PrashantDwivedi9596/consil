export enum Role {
  CREATOR = 'CREATOR',
  SUBSTITUTE = 'SUBSTITUTE',
  MEMBER = 'MEMBER',
}

export enum PrivacyMode {
  OPEN = 'OPEN',
  PRIVATE = 'PRIVATE',
}

export enum RoomType {
  TEMPORARY = 'TEMPORARY',
  PERSISTENT = 'PERSISTENT',
}

export enum RoomStatus {
  ACTIVE = 'ACTIVE',
  EXPIRING = 'EXPIRING',
  DELETING = 'DELETING',
  DELETED = 'DELETED',
}

export enum AdmissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TargetType {
  ROOM_SAVE = 'ROOM_SAVE',
  MEDIA_DOWNLOAD = 'MEDIA_DOWNLOAD',
}

export enum VoteStatus {
  OPEN = 'OPEN',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum VoteChoice {
  YES = 'YES',
  NO = 'NO',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  SYSTEM = 'SYSTEM',
}
