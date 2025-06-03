import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
  AxiosProgressEvent,
} from "axios";
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
  Project,
  ProjectUpdateRequest,
  ProjectCreateRequest,
  ProjectHistory,
  ProjectHistoryList,
  ProjectInviteRequest,
  ProjectInviteAcceptRequest,
  ProjectMemberKickRequest,
  ProjectMemberPermissionUpdateRequest,
  ProjectPublishResponse,
  ProjectPublishContent,
} from "./types";

class ApiHandler {
  private client: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = "https://dev-api.easytoweb.store/api";
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
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
        const token = localStorage.getItem("accessToken");
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

  private handleError(error: AxiosError<ApiError>): Promise<never> {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return Promise.reject({
      success: false,
      error: errorMessage,
    });
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
    if (response.data.success && response.data.data) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
    return response.data;
  }

  async changePassword(
    data: AccountPasswordChangeRequest
  ): Promise<ApiResponse<void>> {
    const response = await this.client.post<ApiResponse<void>>(
      "/account/password/change",
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
    const response = await this.client.post<ApiResponse<void>>(
      "/mail/password/send",
      data
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
  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await this.client.post<ApiResponse<TokenResponse>>(
      "/token/refresh",
      data
    );
    if (response.data.success && response.data.data) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response =
      await this.client.post<ApiResponse<void>>("/account/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
    sort: string[]
  ): Promise<ApiResponse<ProjectHistoryList>> {
    const response = await this.client.get<ApiResponse<ProjectHistoryList>>(
      `/project/history/list?projectId=${projectId}&page=${page}&size=${size}&sort=${sort.join(",")}`
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
  ): Promise<{ data?: { fileUrl?: string } }> {
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
