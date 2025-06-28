import {UseModalReturnType} from "../hooks/useModal";
import BaseModal from "./BaseModal";
import React, {useState} from "react";
import toast from "react-hot-toast";
import apiHandler from "../shared/api/axios";
import {useRouter} from "next/navigation";

interface ProjectCreateModalProps {
	modal: UseModalReturnType
}

const ProjectCreateModal = ({
	                            modal
                            }: ProjectCreateModalProps) => {

	const router = useRouter();
	const [newTitle, setNewTitle] = useState("");
	const [newDesc, setNewDesc] = useState("");
	const [creating, setCreating] = useState(false);

	const handleCreateProject = async () => {
		if (!newTitle.trim()) {
			toast.error("프로젝트 이름을 입력해주세요.");
			return;
		}

		setCreating(true);
		try {
			const res = await apiHandler.createProject({title: newTitle, description: newDesc});
			const projectId = res.data?.projectId;
			if (projectId) {
				toast.success("프로젝트가 생성되었습니다.");
				router.push(`/editor/${projectId}`);

			}
		} catch (err) {
			console.error(err);
			toast.error("프로젝트 생성 실패");
		} finally {
			setCreating(false);
		}
	};

	return (
			<BaseModal modal={modal}>
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					새 프로젝트 만들기
				</h3>
				<input
						className="w-full mb-3 px-3 py-2 border text-gray-800 border-gray-300 rounded text-sm"
						placeholder="프로젝트 이름"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
				/>

				<textarea
						className="w-full mb-3 px-3 py-2 border text-gray-800 border-gray-300 rounded text-sm resize-none"
						placeholder="설명"
						value={newDesc}
						onChange={(e) => setNewDesc(e.target.value)}
						rows={4}
				/>

				<div className="flex justify-end space-x-3">
					<button
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
							onClick={() => modal.close()}
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
			</BaseModal>
	)
}

export default ProjectCreateModal;