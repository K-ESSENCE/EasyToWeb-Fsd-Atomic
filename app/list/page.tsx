// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

"use client";

import React, { useEffect, useState } from "react";
import apiHandler, { FULL_API_URL } from "../../shared/api/axios";
import { Project } from "../../shared/api/types";
import CenteredStatus from "../../components/CenteredStatus";
import { useModal } from "../../hooks/useModal";
import ProfileModal from "../../components/ProfileModal";
import { getAccountInfoFromLocal } from "../../utils/session";
import toast from "react-hot-toast";
import ProjectCard from "../../components/ProjectCard";
import ProjectCreateModal from "../../components/ProjectCreateModal";
import { useRouter } from "next/navigation";

interface ProjectInfos {
  READ_ONLY: Project[];
  EDIT: Project[];
  ADMIN: Project[];
  OWNER: Project[];
}

const App: React.FC = () => {
  const router = useRouter();
  const profileModal = useModal();
  const creatingModal = useModal();

  // 상태 정의
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "status">("date");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "published"
  >("all");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [projectInfos, setProjectInfos] = useState<ProjectInfos>({
    READ_ONLY: [],
    EDIT: [],
    ADMIN: [],
    OWNER: [],
  });

  // 프로젝트 병합
  const allProjects = [
    ...projectInfos.READ_ONLY.map((p) => ({ ...p, role: "READ_ONLY" })),
    ...projectInfos.EDIT.map((p) => ({ ...p, role: "EDIT" })),
    ...projectInfos.ADMIN.map((p) => ({ ...p, role: "ADMIN" })),
    ...projectInfos.OWNER.map((p) => ({ ...p, role: "OWNER" })),
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  // 프로젝트 가져오기
  const fetchProjects = async () => {
    try {
      const res = await apiHandler.getProjectList();
      const infos = res.data?.projectInfos ?? {};
      setProjectInfos({
        READ_ONLY: infos.READ_ONLY ?? [],
        EDIT: infos.EDIT ?? [],
        ADMIN: infos.ADMIN ?? [],
        OWNER: infos.OWNER ?? [],
      });
    } catch (err) {
      console.error(err);
      toast.error("프로젝트 목록 불러오기 실패");
    } finally {
      setInitLoading(false);
    }
  };

  // 필터 + 정렬
  const filteredProjects = allProjects
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((project) => {
      if (filterStatus === "all") return true;
      return filterStatus === "published"
        ? project.status === "OPEN"
        : project.status !== "OPEN";
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "date")
        return (
          new Date(b.joinedDate ?? "").getTime() -
          new Date(a.joinedDate ?? "").getTime()
        );
      if (sortBy === "status") return b.status.localeCompare(a.status);
      return 0;
    });

  const handleClickOutside = () => setActiveDropdownId(null);

  return (
    <div
      className="min-h-screen text-black bg-gray-50"
      onClick={handleClickOutside}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <img
            src="/logo_full.png"
            alt="Logo"
            className="h-[60px] w-auto cursor-pointer"
            onClick={() => router.push("/list")}
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={() => creatingModal.open()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-button flex items-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-plus"></i>
              <span>새 프로젝트</span>
            </button>
            <button
              className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-300 flex-shrink-0"
              onClick={() => profileModal.open()}
            >
              <img
                src={`${FULL_API_URL}${getAccountInfoFromLocal()?.profileUrl}?format=WEBP`}
                onError={(e) => {
                  e.currentTarget.src = "/profile.png";
                }}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[280px] max-w-md relative">
                <input
                  type="text"
                  placeholder="프로젝트 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">상태:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as "all" | "draft" | "published"
                      )
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">전체</option>
                    <option value="draft">임시저장</option>
                    <option value="published">배포됨</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">정렬:</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "name" | "date" | "status")
                    }
                    className="border border-gray-300 rounded-lg pr-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="date">참여 날짜순</option>
                    <option value="name">이름순</option>
                    <option value="status">상태순</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            initLoading ? (
              <div className="flex flex-col items-center justify-center w-full py-24 text-gray-400">
                <CenteredStatus type={"loading"} message={"로딩중..."} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-24 text-gray-400">
                <i className="fas fa-folder-open text-6xl mb-4" />
                <h2 className="text-xl font-medium text-gray-600 mb-2">
                  프로젝트가 없습니다
                </h2>
                <p className="text-sm text-gray-500">
                  지금 새로운 프로젝트를 시작해보세요.
                </p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  activeDropdownId={activeDropdownId}
                  setActiveDropdownId={setActiveDropdownId}
                  onReload={() => {
                    fetchProjects();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProjectCreateModal modal={creatingModal} />

      <ProfileModal modal={profileModal} />
    </div>
  );
};

export default App;
