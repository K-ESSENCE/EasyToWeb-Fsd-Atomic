import React, {useState, useEffect} from "react";
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
	const [currentCraftContent, setCurrentCraftContent] = useState<string | null>(null);
	
	// Fallback을 위한 Redux state
	const legacyLayoutData = useSelector(
		(state: RootState) => state.layouts.layouts[0]
	);

	const publishUrl = useSelector(
			(state: RootState) => state.layouts.projectPublishUrl
	)

	const isPublished = !!publishUrl;
	const [loading, setLoading] = useState(false);

	// Craft.js 현재 상태를 실시간으로 가져오기
	useEffect(() => {
		const getCraftContent = () => {
			// craft-publish 이벤트를 통해 현재 Craft.js 상태 요청
			const event = new CustomEvent('craft-get-state');
			document.dispatchEvent(event);
		};

		const handleCraftState = (event: CustomEvent) => {
			if (event.detail && typeof event.detail === 'string') {
				setCurrentCraftContent(event.detail);
			}
		};

		// 상태 받기 이벤트 리스너
		document.addEventListener('craft-state-response', handleCraftState as EventListener);
		
		// 모달이 열릴 때 현재 상태 요청
		if (modal.show) {
			getCraftContent();
		}

		return () => {
			document.removeEventListener('craft-state-response', handleCraftState as EventListener);
		};
	}, [modal.show]);

	const handleDeploy = async () => {
		setLoading(true);
		try {
			// Craft.js 현재 상태가 없으면 요청해서 가져오기
			let contentToPublish = currentCraftContent;
			console.log("ProjectPublishModal: 현재 Craft 상태:", currentCraftContent);
			
			if (!contentToPublish) {
				console.log("ProjectPublishModal: Craft 상태가 없음. 요청 중...");
				// 최신 상태 요청
				const event = new CustomEvent('craft-get-state');
				document.dispatchEvent(event);
				
				// 잠시 대기 후 다시 확인
				await new Promise(resolve => setTimeout(resolve, 500));
				contentToPublish = currentCraftContent;
				console.log("ProjectPublishModal: 재시도 후 상태:", contentToPublish);
			}

			// Craft.js 상태를 가져오지 못했으면 fallback으로 Redux state 사용
			if (!contentToPublish) {
				console.warn("ProjectPublishModal: Craft 상태를 가져올 수 없음. Fallback으로 Redux state 사용");
				if (legacyLayoutData && legacyLayoutData.layoutId !== "init") {
					contentToPublish = JSON.stringify(legacyLayoutData);
					console.log("ProjectPublishModal: Redux fallback 사용:", contentToPublish);
				} else {
					console.error("ProjectPublishModal: 사용할 수 있는 데이터가 없음");
					toast.error("발행할 데이터가 없습니다. 에디터에서 콘텐츠를 생성한 후 다시 시도해주세요.");
					setLoading(false);
					return;
				}
			}

			// 데이터 형식 확인 및 타입 결정
			let isLegacyFormat = false;
			try {
				const parsed = JSON.parse(contentToPublish);
				if (parsed.ROOT && parsed.ROOT.type) {
					console.log("ProjectPublishModal: Craft.js 형식으로 발행");
					isLegacyFormat = false;
				} else if (parsed.layoutId && parsed.sections !== undefined) {
					console.log("ProjectPublishModal: 레거시 형식으로 발행");
					isLegacyFormat = true;
				} else {
					console.error("ProjectPublishModal: 알 수 없는 데이터 형식:", parsed);
					toast.error("에디터 데이터 형식을 인식할 수 없습니다.");
					setLoading(false);
					return;
				}
			} catch (e) {
				console.error("ProjectPublishModal: JSON 파싱 실패:", e);
				toast.error("에디터 데이터를 읽을 수 없습니다.");
				setLoading(false);
				return;
			}

			console.log("ProjectPublishModal: 발행 요청 전송 중...", contentToPublish.substring(0, 100) + "...");
			const response = await apiHandler.publishProject(
					projectId,
					contentToPublish // Craft.js serialize된 상태 직접 사용
			);
			const url = response.data?.url;
			if (url) {
				toast.success("게시가 완료되었습니다.");
				updateUrl(url);

			} else {
				toast.error("게시 결과를 확인할 수 없습니다.");

			}
		} catch {
			toast.error("게시 중 오류가 발생했습니다.");

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

		} catch {
			toast.error("게시 취소 중 오류가 발생했습니다.");

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