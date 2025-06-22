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
  account: {
    id: string;
    name: string;
    email: string;
  };
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
  permission: "READ_ONLY" | "EDIT" | "ADMIN" | "OWNER";
}

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
  permission: "READ_ONLY" | "EDIT" | "ADMIN" | "OWNER";
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
