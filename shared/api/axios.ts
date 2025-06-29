import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosProgressEvent,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  Account,
  AccountJoinRequest,
  AccountLoginRequest,
  AccountPasswordChangeRequest, AccountResponse, AccountUpdateRequest,
  ApiError,
  ApiResponse,
  MailCertificationRequest,
  MailSendRequest,
  Project,
  ProjectCreateRequest,
  ProjectHistory,
  ProjectHistoryList,
  ProjectInviteAcceptRequest,
  ProjectInviteRequest,
  ProjectMemberKickRequest,
  ProjectMemberPermissionUpdateRequest,
  ProjectPublishContent,
  ProjectPublishResponse,
  ProjectUpdateRequest, ProjectUpdateThumbnailRequest,
  TokenResponse,
} from "./types";
import {
  clearSessionInLocal,
  getAccessTokenFromLocal,
  updateTokenToLocal
} from "../../utils/session";
import toast from "react-hot-toast";

export const BASE_API_PROTOCOL = "https://";
export const BASE_SOCKET_PROTOCOL = "wss://"
export const BASE_API_URL = "dev-api.easytoweb.store"
// export const BASE_API_PROTOCOL = "http://";
// export const BASE_SOCKET_PROTOCOL = "ws://"
// export const BASE_API_URL = "localhost:8080"
export const FULL_API_URL = BASE_API_PROTOCOL + BASE_API_URL;

class ApiHandler {
  private client: AxiosInstance;
  private readonly baseURL: string;

  private showAlertIn3Sec = false;
  private isRefreshing = false;
  private requestQueue: ((token: string) => void)[] = [];

  constructor() {
    this.baseURL = FULL_API_URL + "/api";
    // this.baseURL = "http://localhost:8080/api";
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiResponse<ApiError>>) => this.handleError(error)
    );

    // Request interceptor for JWT token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getAccessTokenFromLocal();
        if (token) {
          if (!config.headers) {
            config.headers = new AxiosHeaders();
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  private async handleError(error: AxiosError<ApiResponse<ApiError>>): Promise<never> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isReissueUrl = error.config?.url?.includes("/account/reissue");
    const isLoginUrl = error.config?.url?.includes("/account/login");

    if (error.response?.status === 401 && !originalRequest._retry && !isReissueUrl && !isLoginUrl) {
      originalRequest._retry = true;

      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.requestQueue.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(this.client(originalRequest));
          });
        });
      }

      this.isRefreshing = true;

      try {
        const { data } = await this.refreshToken();
        if (data?.accessToken){
          const newAccessToken = data.accessToken;
          updateTokenToLocal(data.accessToken);

          this.requestQueue.forEach((cb) => cb(newAccessToken));
          this.requestQueue = [];
          this.isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return this.client(originalRequest);

      } catch (err) {
        this.isRefreshing = false;
        this.requestQueue = [];
        clearSessionInLocal();
        window.location.href = "/"

        return Promise.reject(err);
      }
    }

    const errorMessage = error.response?.data?.errors?.errorDescription || "서버 오류가 발생하였습니다. 잠시후 다시 시도해주세요.";

    if (!isReissueUrl && !this.showAlertIn3Sec) {
      toast.error(errorMessage);
      this.showAlertIn3Sec = true;
      setTimeout(() => {
        this.showAlertIn3Sec = false;
      }, 3000);
    }

    return Promise.reject(error);
  }


  // Account APIs
  async join(data: AccountJoinRequest): Promise<ApiResponse<Account>> {
    const response = await this.client.post<ApiResponse<Account>>(
      "/account/join",
      data
    );
    return response.data;
  }

  async login(data: AccountLoginRequest): Promise<ApiResponse<TokenResponse>> {
    const response = await this.client.post<ApiResponse<TokenResponse>>(
      "/account/login",
      data
    );
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(
        "/account/logout"
    );
    return response.data;
  }

  async me(): Promise<ApiResponse<AccountResponse>> {
    const response = await this.client.get<ApiResponse<AccountResponse>>(
        "/account/me"
    );
    return response.data;
  }

  async updateProfile(data: AccountUpdateRequest): Promise<ApiResponse<void>> {
    const response = await this.client.put<ApiResponse<void>>(
        "/account/me",
        data
    );
    return response.data;
  }

  async changePassword(
    data: AccountPasswordChangeRequest
  ): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(
      "/account/password",
      data
    );
    return response.data;
  }

  // Mail APIs
  async sendJoinMail(
    data: MailSendRequest
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await this.client.get<ApiResponse<TokenResponse>>(
      `/account/mail/join?email=${encodeURIComponent(data.email)}`
    );
    return response.data;
  }

  async sendPasswordMail(data: MailSendRequest): Promise<ApiResponse<void>> {
    const response = await this.client.get<ApiResponse<void>>(
      `/account/mail/password?email=${encodeURIComponent(data.email)}`
    );
    return response.data;
  }

  async certifyMail(
    data: MailCertificationRequest
  ): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(
      `/account/mail/certification`,
      data
    );
    return response.data;
  }

  // Token APIs
  async refreshToken(): Promise<ApiResponse<TokenResponse>> {
    const response = await this.client.post<ApiResponse<TokenResponse>>("/account/reissue");
    return response.data;
  }


  // Project APIs
  async getProject(projectId: string): Promise<ApiResponse<Project>> {
    const response = await this.client.get<ApiResponse<Project>>(
      `/project?projectId=${projectId}`
    );
    return response.data;
  }

  async updateProject(data: ProjectUpdateRequest): Promise<ApiResponse<void>> {
    const response = await this.client.put<ApiResponse<void>>("/project", data);
    return response.data;
  }

  async createProject(
    data: ProjectCreateRequest
  ): Promise<ApiResponse<{ projectId: string }>> {
    const response = await this.client.post<ApiResponse<{ projectId: string }>>(
      "/project",
      data
    );
    return response.data;
  }

  async deleteProject(projectId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(
      `/project?projectId=${projectId}`
    );
    return response.data;
  }

  async exitProject(projectId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(
      `/project/exit?projectId=${projectId}`
    );
    return response.data;
  }

  async getProjectHistory(
    projectId: string,
    historyId: number
  ): Promise<ApiResponse<ProjectHistory>> {
    const response = await this.client.get<ApiResponse<ProjectHistory>>(
      `/project/history?projectId=${projectId}&historyId=${historyId}`
    );
    return response.data;
  }

  async getProjectHistoryList(
    projectId: string,
    page: number,
    size: number,
    sort: string
  ): Promise<ApiResponse<ProjectHistoryList>> {
    const response = await this.client.get<ApiResponse<ProjectHistoryList>>(
      `/project/history/list?projectId=${projectId}&page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  }

  async inviteProject(data: ProjectInviteRequest): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(
      "/project/invite",
      data
    );
    return response.data;
  }

  async acceptProjectInvite(
    projectId: string,
    data: ProjectInviteAcceptRequest
  ): Promise<ApiResponse<{ id: string }>> {
    const response = await this.client.post<ApiResponse<{ id: string }>>(
      `/project/invite/${projectId}`,
      data
    );
    return response.data;
  }

  async getProjectList(): Promise<
    ApiResponse<{ projectInfos: Record<string, Project[]> }>
  > {
    const response =
      await this.client.get<
        ApiResponse<{ projectInfos: Record<string, Project[]> }>
      >("/project/list");
    return response.data;
  }

  async kickProjectMember(
    data: ProjectMemberKickRequest
  ): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(
      "/project/member",
      { data }
    );
    return response.data;
  }

  async updateProjectMemberPermission(
    data: ProjectMemberPermissionUpdateRequest
  ): Promise<ApiResponse<void>> {
    const response = await this.client.put<ApiResponse<void>>(
      "/project/member/permission",
      data
    );
    return response.data;
  }

  async publishProject(
    projectId: string,
    content: string
  ): Promise<ApiResponse<ProjectPublishResponse>> {
    const response = await this.client.post<
      ApiResponse<ProjectPublishResponse>
    >("/project/publish", { projectId, content });
    return response.data;
  }

  async unpublishProject(projectId: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete<ApiResponse<void>>(
      `/project/publish?projectId=${projectId}`
    );
    return response.data;
  }

  async getPublishedProject(
    url: string
  ): Promise<ApiResponse<ProjectPublishContent>> {
    const response = await this.client.get<ApiResponse<ProjectPublishContent>>(
      `/project/publish/${url}`
    );
    return response.data;
  }

  async refreshPublishedProject(projectId: string): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(
      `/project/publish/refresh?projectId=${projectId}`
    );
    return response.data;
  }

  async updateProjectThumbnail(data: ProjectUpdateThumbnailRequest): Promise<ApiResponse<void>> {
    const response = await this.client.put<ApiResponse<void>>("/project/thumbnail", data);
    return response.data;
  }

  async uploadFile({
    file,
    info,
    onUploadProgress,
  }: {
    file: File;
    info: {
      id: string;
      chunkNumber: number;
      totalChunks: number;
      fileName: string;
      contentType: string;
      fileSize: number;
    };
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  }): Promise<unknown> {
    const formData = new FormData();
    formData.append("info", JSON.stringify(info));
    formData.append("file", file, info.fileName);
    formData.append("fileSize", info.fileSize.toString());

    const response = await this.client.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "*/*",
      },
      onUploadProgress,
    });
    return response.data;
  }

  async uploadFileFormData(
    formData: FormData
  ): Promise<{ data?: { fileId?:string, fileUrl?: string } }> {
    const response = await this.client.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "*/*",
      },
    });
    return response.data;
  }
}

export const apiHandler = new ApiHandler();
export default apiHandler;
