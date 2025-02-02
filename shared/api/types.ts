// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
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
    type:"VERIFIED_EMAIL"
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
    type:"VERIFIED_EMAIL"
  }
  
  // Token Types
  export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  // Error Types
  export interface ApiError {
    code: string;
    message: string;
  }
  