"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CraftEditor } from "../../../components/craft/Editor";
import {
  getAccessTokenFromLocal,
  getAccountInfoFromLocal,
} from "../../../utils/session";
import apiHandler from "../../../shared/api/axios";
import { useModal } from "../../../hooks/useModal";
import HistoryPanel from "../../../components/HistoryPanel";
import PageLoader from "../../../components/PageLoader";
import ProjectPublishModal from "../../../components/ProjectPublishModal";
import { ProjectUpdateRequest } from "../../../shared/api/types";
import { YjsProvider } from "../../../shared/collaboration/YjsProvider";
import { CollaboratorList } from "../../../components/collaboration/CollaboratorList";

const App = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [projectInfo, setProjectInfo] = useState({
    id: "",
    title: "",
    description: "",
  });
  const [projectName, setProjectName] = useState("새 프로젝트");
  const [showProjectNameInput, setShowProjectNameInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectPublishUrl, setProjectPublishUrl] = useState<string | null>(null);
  const [permission, setPermission] = useState<"READ_ONLY" | "EDIT" | "ADMIN" | "OWNER">("READ_ONLY");

  const historyModal = useModal();
  const publishModal = useModal();

  useEffect(() => {
    getProjectInfo();
  }, [projectId]);

  const getProjectInfo = async () => {
    try {
      setIsLoading(true);
      const result = await apiHandler.getProject(projectId);
      const members = result.data?.members ?? [];
      const myAccountEmail = getAccountInfoFromLocal()?.email;
      const per =
        members.find((m) => m.email === myAccountEmail)?.permission ??
        "READ_ONLY";
      const publishUrl =
        result.data?.status === "OPEN" ? result.data.publishUrl : null;
      
      setPermission(per);
      setProjectPublishUrl(publishUrl);
      setProjectName(result.data?.title ?? "프로젝트");
      setProjectInfo({
        id: result.data?.id ?? "",
        title: result.data?.title ?? "",
        description: result.data?.description ?? "",
      });
    } catch (error) {
      console.error("Failed to load project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectNameChange = async (newName: string) => {
    setProjectName(newName);
    setShowProjectNameInput(false);

    try {
      const newInfo = {
        ...projectInfo,
        title: newName,
      } as ProjectUpdateRequest;
      await apiHandler.updateProject(newInfo);
      setProjectInfo(newInfo);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleSave = () => {
    // Save functionality handled by SaveManager component
    const event = new CustomEvent('craft-temp-save');
    document.dispatchEvent(event);
  };

  const handlePreview = () => {
    // Preview functionality - could be implemented with modal
    // Currently handled by publish flow
  };

  const handleContentChange = (content: string) => {
    // Content changes handled by collaboration system
    // Real-time sync managed by SelectionPreservingSync
  };

  if (isLoading) {
    return <PageLoader message="불러오는 중입니다..." />;
  }

  return (
    <YjsProvider projectId={projectId}>
      <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img
              src="/logo_basic.png"
              alt="Logo"
              className="h-[60px] w-auto cursor-pointer"
              onClick={() => router.push("/list")}
            />
            {showProjectNameInput ? (
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => handleProjectNameChange(projectName)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleProjectNameChange(projectName)
                }
                className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent ml-4"
                autoFocus
              />
            ) : (
              <h1
                className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer flex items-center ml-4"
                onClick={() => permission !== "READ_ONLY" && setShowProjectNameInput(true)}
              >
                {projectName}
                {permission !== "READ_ONLY" && (
                  <i className="fas fa-pencil-alt text-sm ml-2 text-gray-400"></i>
                )}
              </h1>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Collaborator List - added next to save button */}
          <CollaboratorList className="mr-2" />
          
          <button
            onClick={handleSave}
            disabled={permission === "READ_ONLY"}
            className={`${
              permission === "READ_ONLY"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-md text-sm font-medium flex items-center`}
          >
            <i className="fas fa-save mr-2"></i>
            저장
          </button>

          <button
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium"
            onClick={handlePreview}
          >
            <i className="fas fa-eye mr-2"></i>미리보기
          </button>

          <button
            onClick={() => publishModal.open()}
            disabled={permission === "READ_ONLY"}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center
              ${permission === "READ_ONLY"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : !!projectPublishUrl
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-600"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            <i
              className={`mr-2 fas ${!!projectPublishUrl ? "fa-check" : "fa-rocket"}`}
            ></i>
            {!!projectPublishUrl ? "배포 완료됨" : "배포"}
          </button>

          <button
            onClick={() => historyModal.open()}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            <i className="fas fa-history mr-2"></i>저장기록
          </button>

          <button
            onClick={() => router.replace("/list")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm font-medium"
          >
            <i className="fas fa-list mr-2"></i>목록으로
          </button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex-1 overflow-hidden">
        <CraftEditor
          onContentChange={handleContentChange}
          className="h-full"
          projectId={projectId}
        />
      </div>

      {/* Modals */}
      {historyModal.show && (
        <HistoryPanel modal={historyModal} projectId={projectId} />
      )}

      {publishModal.show && (
        <ProjectPublishModal modal={publishModal} projectId={projectId} />
      )}
    </div>
    </YjsProvider>
  );
};

export default App;