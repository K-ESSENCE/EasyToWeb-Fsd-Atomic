// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import apiHandler from "../../shared/api/axios";
import { Project } from "../../shared/api/types";

interface ProjectInfos {
  READ_ONLY: Project[];
  EDIT: Project[];
  ADMIN: Project[];
  OWNER: Project[];
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "status">("date");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "published"
  >("all");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 실제 프로젝트 목록 상태
  const [projectInfos, setProjectInfos] = useState<ProjectInfos>({
    READ_ONLY: [],
    EDIT: [],
    ADMIN: [],
    OWNER: [],
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await apiHandler.getProjectList();
      const infos = res.data?.projectInfos ?? {};
      setProjectInfos({
        READ_ONLY: infos.READ_ONLY ?? [],
        EDIT: infos.EDIT ?? [],
        ADMIN: infos.ADMIN ?? [],
        OWNER: infos.OWNER ?? [],
      });
    };
    fetchProjects();
  }, []);

  // 모든 프로젝트를 하나의 배열로 합치기
  const allProjects = [
    ...projectInfos.READ_ONLY,
    ...projectInfos.EDIT,
    ...projectInfos.ADMIN,
    ...projectInfos.OWNER,
  ];

  // 검색/필터/정렬 적용
  const filteredProjects = allProjects
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((project) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "draft") return project.status !== "OPEN";
      if (filterStatus === "published") return project.status === "OPEN";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "date")
        return (
          new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        );
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  const handleDropdownToggle = (projectId: string) => {
    setActiveDropdownId(activeDropdownId === projectId ? null : projectId);
  };

  const handleDeleteClick = (projectId: string) => {
    setDeleteTargetId(projectId);
    setShowDeleteModal(true);
    setActiveDropdownId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    await apiHandler.deleteProject(deleteTargetId);
    setShowDeleteModal(false);
    setDeleteTargetId(null);
    // 삭제 후 목록 새로고침
    const res = await apiHandler.getProjectList();
    const infos = res.data?.projectInfos ?? {};
    setProjectInfos({
      READ_ONLY: infos.READ_ONLY ?? [],
      EDIT: infos.EDIT ?? [],
      ADMIN: infos.ADMIN ?? [],
      OWNER: infos.OWNER ?? [],
    });
  };

  const handleClickOutside = () => {
    setActiveDropdownId(null);
  };

  const handleCreateProject = async () => {
    setCreating(true);
    try {
      const res = await apiHandler.createProject({
        title: newTitle,
        description: newDesc,
      });
      const projectId = res.data?.projectId;
      if (projectId) {
        setShowCreateModal(false);
        setNewTitle("");
        setNewDesc("");
        router.push(`/editor/${projectId}?clear=true`);
      }
    } finally {
      setCreating(false);
    }
  };

  const router = useRouter();

  return (
    <div
      className="min-h-screen text-black bg-gray-50"
      onClick={handleClickOutside}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">내 프로젝트</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-button flex items-center space-x-2 cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-plus"></i>
            <span>새 프로젝트</span>
          </button>
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
                    <option value="date">최근 수정순</option>
                    <option value="name">이름순</option>
                    <option value="status">상태순</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-lg border border-gray-200 overflow-visible hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => router.push(`/editor/${project.id}`)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {/* 썸네일이 있으면 표시, 없으면 기본 이미지 */}
                  <img
                    src={"/default-thumbnail.png"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <div className="relative">
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1 !rounded-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDropdownToggle(project.id);
                        }}
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      {activeDropdownId === project.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center">
                              <i className="fas fa-edit w-4 mr-2"></i>
                              편집하기
                            </button>
                            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center">
                              <i className="fas fa-copy w-4 mr-2"></i>
                              복제하기
                            </button>
                            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center">
                              <i className="fas fa-share w-4 mr-2"></i>
                              공유하기
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(project.id);
                              }}
                            >
                              <i className="fas fa-trash-alt w-4 mr-2"></i>
                              삭제하기
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === "OPEN"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status === "OPEN" ? "배포됨" : "임시저장"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-users text-gray-400"></i>
                      <span>{project.memberCount ?? 1}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      {project.createDate?.slice(0, 10)}
                    </div>
                    <div className="text-gray-500">
                      {project.members?.[0]?.nickname ?? ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              정말로 이 프로젝트를 삭제하시겠습니까?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-button"
                onClick={handleDeleteConfirm}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              새 프로젝트 만들기
            </h3>
            <input
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="프로젝트 이름"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="설명"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
                onClick={() => setShowCreateModal(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-button"
                onClick={handleCreateProject}
                disabled={creating || !newTitle}
              >
                {creating ? "생성 중..." : "생성"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
