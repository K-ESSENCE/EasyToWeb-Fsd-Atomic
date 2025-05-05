// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const App: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "status">("date");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "published"
  >("all");

  const projects = [
    {
      id: 1,
      name: "새 프로젝트",
      thumbnail:
        "https://readdy.ai/api/search-image?query=modern%20minimalist%20website%20interface%20design%20with%20clean%20layout%20and%20soft%20color%20palette%2C%20featuring%20organized%20content%20blocks%20and%20intuitive%20navigation%20elements%20on%20light%20background&width=400&height=300&seq=1&orientation=landscape",
      status: "draft",
      lastModified: "2025-05-04",
      author: "김철수",
      collaborators: 3,
    },
    {
      id: 2,
      name: "회사 소개 페이지",
      thumbnail:
        "https://readdy.ai/api/search-image?query=professional%20business%20website%20design%20with%20modern%20corporate%20aesthetic%2C%20showcasing%20company%20information%20and%20services%20in%20an%20elegant%20layout%20with%20subtle%20animations&width=400&height=300&seq=2&orientation=landscape",
      status: "published",
      lastModified: "2025-05-03",
      author: "이영희",
      collaborators: 5,
    },
    {
      id: 3,
      name: "제품 소개 페이지",
      thumbnail:
        "https://readdy.ai/api/search-image?query=product%20showcase%20website%20with%20high%20quality%20product%20photography%2C%20detailed%20specifications%2C%20and%20interactive%20features%20on%20clean%20white%20background%20with%20minimal%20design%20elements&width=400&height=300&seq=3&orientation=landscape",
      status: "draft",
      lastModified: "2025-05-02",
      author: "박지민",
      collaborators: 2,
    },
    {
      id: 4,
      name: "이벤트 랜딩 페이지",
      thumbnail:
        "https://readdy.ai/api/search-image?query=vibrant%20landing%20page%20design%20for%20special%20event%20promotion%20with%20eye%20catching%20graphics%2C%20countdown%20timer%2C%20and%20call%20to%20action%20buttons%20on%20modern%20gradient%20background&width=400&height=300&seq=4&orientation=landscape",
      status: "published",
      lastModified: "2025-05-01",
      author: "최민수",
      collaborators: 4,
    },
  ];

  return (
    <div className=" text-black min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">내 프로젝트</h1>
          <button
            onClick={() => {
              router.push("/editor");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-button flex items-center space-x-2 cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-plus"></i>
            <span>새 프로젝트</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
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
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {project.name}
                    </h3>
                    <div className="flex items-center">
                      <button className="text-gray-400 hover:text-gray-600 p-1 !rounded-button">
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status === "published" ? "배포됨" : "임시저장"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-users text-gray-400"></i>
                      <span>{project.collaborators}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                    <div className="text-gray-500">{project.lastModified}</div>
                    <div className="text-gray-500">{project.author}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
