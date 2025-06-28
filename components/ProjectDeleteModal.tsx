import BaseModal from "./BaseModal";
import {UseModalReturnType} from "../hooks/useModal";
import React from "react";
import apiHandler from "../shared/api/axios";
import toast from "react-hot-toast";

interface ProjectDeleteModalProps {
	modal: UseModalReturnType;
	projectId: string;
	onReload: () => void
}

const ProjectDeleteModal = ({
	                            modal,
	                            projectId,
	                            onReload
                            }: ProjectDeleteModalProps) => {

	const handleDeleteConfirm = async () => {
		try {
			await apiHandler.deleteProject(projectId);
			toast.success("프로젝트가 삭제되었습니다.");
			onReload();

		} catch (err) {
			console.error(err);
			toast.error("삭제 실패");
		}
	};

	return (
			<BaseModal modal={modal}>
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					정말로 이 프로젝트를 삭제하시겠습니까?
				</h3>
				<p className="text-sm text-gray-500 mb-6">
					이 작업은 되돌릴 수 없습니다.
				</p>
				<div className="flex justify-end space-x-3">
					<button
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
							onClick={() => modal.close()}
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
			</BaseModal>
	)
}

export default ProjectDeleteModal