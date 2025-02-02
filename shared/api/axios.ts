import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import {
  ApiResponse,
  Account,
  AccountJoinRequest,
  AccountLoginRequest,
  AccountPasswordChangeRequest,
  MailSendRequest,
  MailCertificationRequest,
  TokenResponse,
  RefreshTokenRequest,
  ApiError,
} from './types';

class ApiHandler {
  private client: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:8080/api';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiError>) => this.handleError(error)
    );

    // Request interceptor for JWT token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          if (!config.headers) {
            config.headers = new AxiosHeaders();
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error:AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): Promise<never> {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject({
      success: false,
      error: errorMessage,
    });
  }

  // Account APIs
  async join(data: AccountJoinRequest): Promise<ApiResponse<Account>> {
    const response = await this.client.post<ApiResponse<Account>>('/account/join', data);
    return response.data;
  }

  async login(data: AccountLoginRequest): Promise<ApiResponse<TokenResponse>> {
    const response = await this.client.post<ApiResponse<TokenResponse>>('/account/login', data);
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data;
  }

  async changePassword(data: AccountPasswordChangeRequest): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>('/account/password/change', data);
    return response.data; 
  }

  // Mail APIs
  async sendJoinMail(data: MailSendRequest): Promise<ApiResponse<void>> {
    const response = await this.client.get<ApiResponse<void>>(`/account/mail/join?email=${encodeURIComponent(data.email)}`);
    return response.data;
  }

  async sendPasswordMail(data: MailSendRequest): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>('/mail/password/send', data);
    return response.data;
  }

  async certifyMail(data: MailCertificationRequest): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(`/account/mail/certification`,data);
    return response.data;
  }

  // Token APIs
  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<TokenResponse>> {
    const response = await this.client.post<ApiResponse<TokenResponse>>('/token/refresh', data);
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>('/account/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  }
}

export const apiHandler = new ApiHandler();
export default apiHandler;
