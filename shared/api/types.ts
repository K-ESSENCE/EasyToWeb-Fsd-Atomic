// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: ApiError | null;
}

// Account Types
export interface Account {
  id: string;
  email: string;
  nickname?: string;
  password: string;
  profileUrl?: string;
}

export interface AccountJoinRequest {
  email: string;
  password: string;
  nickname?: string;
  certificationCode: string;
  type: "VERIFIED_EMAIL";
}

export interface AccountLoginRequest {
  email: string;
  password: string;
}

export interface AccountUpdateRequest {
  nickname: string;
  profileUrl: string;
}

export interface AccountPasswordChangeRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

// Mail Types
export interface MailSendRequest {
  email: string;
}

export interface MailCertificationRequest {
  email: string;
  certificationCode: string;
  type: "VERIFIED_EMAIL";
}

// Token Types
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  account: AccountResponse;
}

export interface AccountResponse {
  id: string;
  nickname: string;
  email: string;
  profileUrl:string;
}


// Error Types
export interface ApiError {
  errorCode: string;
  errorDescription: string;
}

export interface PromiseError {
  success: boolean,
  error: string
}

// Project Types
export interface Project {
  id: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  status: "CLOSED" | "OPEN";
  createDate: string;
  members: ProjectMember[];
  memberCount: number;
}

export interface ProjectMember {
  accountId: string;
  email: string;
  nickname: string;
  profileUrl: string;
  permission: Permission;
}

export const PERMISSION_ORDER = {
  OWNER: 3,
  ADMIN: 2,
  EDIT: 1,
  READ_ONLY: 0,
} as const;

export type Permission = keyof typeof PERMISSION_ORDER;

export interface ProjectCreateRequest {
  title: string;
  description: string;
}

export interface ProjectUpdateRequest {
  id: string;
  title: string;
  description: string;
  status: "CLOSED" | "OPEN";
}

export interface ProjectInviteRequest {
  projectId: string;
  email: string;
}

export interface ProjectInviteAcceptRequest {
  code: string;
}

export interface ProjectMemberPermissionUpdateRequest {
  projectId: string;
  accountId: string;
  permission: Permission;
}

export interface ProjectMemberKickRequest {
  projectId: string;
  accountId: string;
}

export interface ProjectHistory {
  id: number;
  content: string;
  editTime: string;
  editor: string[];
}

export interface ProjectHistoryList {
  totalCount: number;
  projectHistories: ProjectHistory[];
}

export interface ProjectPublishResponse {
  url: string;
}

export interface ProjectPublishContent {
  content: string;
}

export interface ProjectUpdateThumbnailRequest {
  id: string;
  thumbnailFileId: string;
}
