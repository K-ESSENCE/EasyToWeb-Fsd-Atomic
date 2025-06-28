import React, {useEffect, useState} from "react";
import {UseModalReturnType} from "../hooks/useModal";
import BaseModal from "./BaseModal";
import apiHandler from "../shared/api/axios";
import toast from "react-hot-toast";
import {Project, ProjectUpdateRequest} from "../shared/api/types";

interface ProjectUpdateModalProps {
	modal: UseModalReturnType;
	project: Project;
	onReload: (updated: Project) => void;
}

const ProjectUpdateModal = ({
	                            modal,
	                            project,
	                            onReload
                            }: ProjectUpdateModalProps) => {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		if (project) {
			setTitle(project.title ?? "");
			setDesc(project.description ?? "");
		}
	}, [project]);

	const handleProjectUpdate = async () => {
		if (!title) return;

		setUpdating(true);
		try {
			const updated: ProjectUpdateRequest = {
				id: project.id,
				title,
				description: desc,
			};
			await apiHandler.updateProject(updated);

			toast.success("프로젝트가 수정되었습니다.");
			onReload?.({...project, ...updated});
			modal.close();
		} catch (error) {
			console.error(error);
			toast.error("프로젝트 수정 중 오류가 발생했습니다.");
		} finally {
			setUpdating(false);
		}
	};

	return (
			<BaseModal modal={modal}>
				<h3 className="text-lg font-medium text-gray-900 mb-4">프로젝트 정보 수정</h3>

				<input
						className="w-full mb-3 px-3 py-2 border text-gray-800 border-gray-300 rounded text-sm"
						placeholder="프로젝트 이름"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
				/>

				<textarea
						className="w-full mb-3 px-3 py-2 border text-gray-800 border-gray-300 rounded text-sm resize-none"
						placeholder="설명"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						rows={4}
				/>


				<div className="flex justify-end space-x-3">
					<button
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
							onClick={modal.close}
							disabled={updating}
					>
						취소
					</button>
					<button
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-button disabled:opacity-50"
							onClick={handleProjectUpdate}
							disabled={updating || !title}
					>
						{updating ? "수정 중..." : "수정"}
					</button>
				</div>
			</BaseModal>
	);
};

export default ProjectUpdateModal;