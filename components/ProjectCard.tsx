import {Project} from "../shared/api/types";
import {FULL_API_URL} from "../shared/api/axios";
import React from "react";
import {useRouter} from "next/navigation";
import {useModal} from "../hooks/useModal";
import ProjectDeleteModal from "./ProjectDeleteModal";
import toast from "react-hot-toast";
import ProjectUpdateModal from "./ProjectUpdateModal";

export const FULL_FRONT_URL = `${window.location.protocol}//${window.location.host}`;

interface ProjectCardProps {
	project: Project & { role: string },
	activeDropdownId: string | null,
	setActiveDropdownId: (id: string | null) => void,
	onReload: () => void,
}

const ProjectCard = ({
	                     project,
	                     activeDropdownId,
	                     setActiveDropdownId,
	                     onReload
                     }: ProjectCardProps) => {

	const router = useRouter();
	const deleteModal = useModal();
	const updatingModal = useModal();


	const handleDropdownToggle = () => {
		setActiveDropdownId(project.id);
	};

	const handleDeleteClick = () => {
		deleteModal.open();
		setActiveDropdownId(null);
	};

	const handleUpdateClick = () => {
		updatingModal.open();
		setActiveDropdownId(null);
	}

	const copyToClipboard = () => {
		const url = `${FULL_FRONT_URL}/editor/${project.id}`;
		navigator.clipboard.writeText(url)
		.then(() => {
			toast.success("링크가 복사되었습니다.");
		})
		.catch(() => {
			toast.error("복사에 실패했습니다.");
		}).finally(() => {
			setActiveDropdownId(null);
		});
	}

	const renderRoleBadge = () => {
		const roleColorMap: Record<string, string> = {
			OWNER: "bg-blue-100 text-blue-800",
			ADMIN: "bg-purple-100 text-purple-800",
			EDIT: "bg-yellow-100 text-yellow-800",
			READ_ONLY: "bg-gray-200 text-gray-700",
		};

		const roleLabelMap: Record<string, string> = {
			OWNER: "소유자",
			ADMIN: "관리자",
			EDIT: "편집자",
			READ_ONLY: "읽기",
		};

		const color = roleColorMap[project.role] || "bg-gray-100 text-gray-700";
		const label = roleLabelMap[project.role] || "알 수 없음";

		return (
				<span
						className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}
				>
			{label}
		</span>
		);
	};

	const renderStatusBadge = () => {
		const isOpen = project.status === "OPEN";

		const colorClass = isOpen
				? "bg-green-100 text-green-800"
				: "bg-gray-100 text-gray-800";

		const label = isOpen ? "게시" : "비공개";

		return (
				<span
						className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
				>
			{label}
		</span>
		);
	};

	return (
			<>
				<ProjectDeleteModal modal={deleteModal}
				                    projectId={project.id}
				                    onReload={onReload}
				/>

				<ProjectUpdateModal modal={updatingModal}
				                    project={project}
				                    onReload={onReload}
				/>

				<div
						className="group relative bg-white rounded-lg border border-gray-200 overflow-visible hover:shadow-lg transition-shadow duration-200 cursor-pointer"
						onClick={() => router.push(`/editor/${project.id}`)}
				>
					<div className="aspect-[4/3] overflow-hidden">
						{/* 썸네일이 있으면 표시, 없으면 기본 이미지 */}
						<img
								src={project.thumbnailUrl ? `${FULL_API_URL}${project.thumbnailUrl}` : "/project.jpg"}
								alt={project.title}
								onError={(e) => {
									e.currentTarget.src = "/project.jpg";
								}}
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
											handleDropdownToggle();
										}}
								>
									<i className="fas fa-ellipsis-h"></i>
								</button>

								{
										(activeDropdownId === project.id) && (
												<div
														className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
													<div className="py-1">
														{
																!(project.role === "READ_ONLY" || project.role === "EDIT") && (
																		<button
																				className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
																				onClick={(e) => {
																					e.stopPropagation();
																					handleUpdateClick();
																				}}
																		>
																			<i className="fas fa-edit w-4 mr-2"></i>
																			편집하기
																		</button>
																)
														}


														{/*<button
																className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center">
															<i className="fas fa-copy w-4 mr-2"></i>
															복제하기
														</button>*/}

														<button
																className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
																onClick={(e) => {
																	e.stopPropagation();
																	copyToClipboard();
																}}
														>
															<i className="fas fa-share w-4 mr-2"></i>
															공유하기
														</button>

														{
																(project.role === "OWNER") && (
																		<button
																				className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center"
																				onClick={(e) => {
																					e.stopPropagation();
																					handleDeleteClick();
																				}}
																		>
																			<i className="fas fa-trash-alt w-4 mr-2"></i>
																			삭제하기
																		</button>
																)
														}
													</div>
												</div>
										)
								}
							</div>
						</div>
						<div
								className="flex items-center justify-between text-sm text-gray-500">
							<div className="flex items-center space-x-2">
								{
									renderStatusBadge()
								}
								{
									renderRoleBadge()
								}
							</div>
							<div className="flex items-center space-x-2">
								<i className="fas fa-users text-gray-400"></i>
								<span>{project.memberCount ?? 1}</span>
							</div>
						</div>
						<div
								className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500 grid grid-cols-1 grid-rows-2 min-h-[3.5rem]"
						>
							<div
									className="row-start-1 col-start-1 line-clamp-2 break-all min-h-[2.5rem]"
									dangerouslySetInnerHTML={{
										__html: project.description?.replace(/\n/g, '<br />') || '',
									}}
							/>
							<div
									className="row-start-2 col-start-1 text-xs text-gray-400 text-right self-end"
							>
								{project.joinedDate?.slice(0, 10)}
							</div>
						</div>
					</div>
				</div>
			</>
	)
}

export default ProjectCard