import React, {useState} from "react";
import {UseModalReturnType} from "../hooks/useModal";
import BaseModal from "./BaseModal";
import apiHandler from "../shared/api/axios";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/configureStore";
import toast from "react-hot-toast";
import {setProjectPublishUrl} from "../store/slices/editor";

export const FULL_FRONT_URL = `${window.location.protocol}//${window.location.host}`;

interface ProjectPublishModalProps {
	modal: UseModalReturnType;
	projectId: string;
}

const ProjectPublishModal = ({
	                             modal,
	                             projectId,
                             }: ProjectPublishModalProps) => {
	const dispatch = useDispatch();
	const layoutData = useSelector(
			(state: RootState) => state.layouts.layouts[0]
	);

	const publishUrl = useSelector(
			(state: RootState) => state.layouts.projectPublishUrl
	)

	const isPublished = !!publishUrl;
	const [loading, setLoading] = useState(false);

	const handleDeploy = async () => {
		setLoading(true);
		try {
			const response = await apiHandler.publishProject(
					projectId,
					JSON.stringify(layoutData)
			);
			const url = response.data?.url;
			if (url) {
				toast.success("게시가 완료되었습니다.");
				updateUrl(url);

			} else {
				toast.error("게시 결과를 확인할 수 없습니다.");

			}
		} catch (err) {
			console.log(err);

		} finally {
			setLoading(false);
		}
	};

	const handleUndeploy = async () => {
		setLoading(true);
		try {
			await apiHandler.unpublishProject(projectId);
			toast.success("게시가 취소되었습니다.");
			updateUrl(null);

		} catch (err) {
			console.log(err);

		} finally {
			setLoading(false);
		}
	};

	const updateUrl = (url: string | null) => {
		dispatch(setProjectPublishUrl({projectPublishUrl: url}));
	}

	return (
			<BaseModal modal={modal} widthClass="w-[560px] max-h-[90vh]">
				<h3 className="text-lg font-medium text-gray-900 mb-4">프로젝트 게시</h3>

				{/* 본문 */}
				{
					isPublished ? (
							<div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg text-center">
								<p className="text-sm text-gray-700 mb-2">✅ 현재 프로젝트가 게시되어 있습니다.</p>
								<a
										href={`${FULL_FRONT_URL}/publish/${publishUrl}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 underline break-all text-sm font-medium"
								>
									{`${FULL_FRONT_URL}/publish/${publishUrl}`}
								</a>
							</div>
					) : (
							<div className="mb-6 p-4 border border-gray-200 bg-gray-50 rounded-lg text-center">
								<p className="text-sm text-gray-700">
									프로젝트를 게시하면 외부에서 접근 가능한 URL이 생성됩니다.
								</p>
							</div>
					)
				}

				{/* 버튼 */}
				<div className="flex justify-end space-x-3">
					<button
							className={`
								px-4 py-2 text-sm font-medium rounded-button whitespace-nowrap flex items-center
								${isPublished
									? "bg-red-100 hover:bg-red-200 text-red-600"
									: "bg-blue-600 hover:bg-blue-700 text-white"}
							`}
							onClick={isPublished ? handleUndeploy : handleDeploy}
							disabled={loading}
					>
						<i className={`fas mr-2 ${isPublished ? "fa-ban" : "fa-rocket"}`}></i>
						{isPublished ? "게시취소" : "배포"}
					</button>

					{
							isPublished && (
									<button
											className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 rounded-button whitespace-nowrap flex items-center"
											onClick={handleDeploy}
											disabled={loading}
									>
										<i className="fas fa-redo mr-2"></i>
										재배포
									</button>
							)
					}


					<button
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
							onClick={modal.close}
							disabled={loading}
					>
						닫기
					</button>
				</div>
			</BaseModal>
	);
};

export default ProjectPublishModal;