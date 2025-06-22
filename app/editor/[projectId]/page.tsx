"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import SectionList from "../../../components/SideMenu/SectionList";
import SideMenu from "../../../components/SideMenu/SideMenu";
import SettingDialog from "../../../components/settingDialog";
import {SectionData} from "../../../components/types/common/layoutStyle";
import {
	addSection,
	resetLayoutState,
	setAllImageStyles,
	setAllImageUploadStatus,
	setAllImageUrls,
	setLayoutData,
	setProjectPermission,
} from "../../../store/slices/layouts";
import {useDispatch, useSelector} from "react-redux";
import MainContent from "../../../components/organisms/MainContent";
import {RootState} from "../../../store/configureStore";
import {cleanupYjsProvider, createYjsDocument, updateUserSelection,} from "../../../utils/yjs";
import ActiveUsers from "../../../components/ActiveUsers";
import {Awareness} from "y-protocols/awareness";
import apiHandler from "../../../shared/api/axios";
import {useParams, useRouter} from "next/navigation";
import * as Y from 'yjs';
import {
	getAccessTokenFromLocal,
	getUserIdFromLocal,
	getUserNameFromLocal
} from "../../../utils/session";


interface ComponentItem {
	id: string;
	type: string;
	position: { x: number; y: number };
}

interface HistoryState {
	droppedComponents: ComponentItem[];
}

type PublishStatus =
		| { type: "success"; url: string }
		| { type: "error"; message: string }
		| null;

const App = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const router = useRouter();
	const projectId = params.projectId as string;
	// const query = useSearchParams().get("clear");

	/**
	 * selector
	 */
	const layoutDatas = useSelector(
			(state: RootState) => state.layouts.layoutDatas.sectionValues
	);

	const nowSectionKey = useSelector(
			(state: RootState) => state.keys.nowSectionKey
	);
	const selectedItemKey = useSelector(
			(state: RootState) => state.keys.nowItemKey
	);

	const uploadStatus = useSelector(
			(state: RootState) => state.layouts.uploadStatus
	);

	const imageUrls = useSelector(
			(state: RootState) => state.layouts.imageUrls
	);

	const imageStyles = useSelector(
			(state: RootState) => state.layouts.imageStyles
	);

	const projectPermission = useSelector(
			(state: RootState) => state.layouts.projectPermission
	)

	/**
	 * state
	 */
	const [yjsDoc, setYjsDoc] = useState<Y.Doc | null>(null);
	const [awareness, setAwareness] = useState<Awareness | null>(null);
	const [uploadStatusMap, setUploadStatusMap] = useState<Y.Map<unknown> | null>(null);
	const [imageStylesMap, setImageStylesMap] = useState<Y.Map<unknown> | null>(null);
	const [imageUrlsMap, setImageUrlsMap] = useState<Y.Map<unknown> | null>(null);
	const [sharedLayoutMap, setSharedLayoutMap] = useState<Y.Map<unknown> | null>(null);

	const [syncInfo, setSyncInfo] = useState<{isSync:boolean, lastSyncDate:Date | null}>(
			{isSync:false, lastSyncDate: null}
	)
	const [showSettings, setShowSettings] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isFullscreen, setIsFullscreen] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	// const [showToast, setShowToast] = useState(false);

	const [droppedComponents, setDroppedComponents] = useState<ComponentItem[]>([]);

	const [history, setHistory] = useState<HistoryState[]>([]);
	const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
	const [projectName, setProjectName] = useState("새 프로젝트");
	const [showProjectNameInput, setShowProjectNameInput] = useState(false);
	const [showUsersPopover, setShowUsersPopover] = useState(false);
	const [publishStatus, setPublishStatus] = useState<PublishStatus>(null);
	const [offlineMessage, setOfflineMessage] = useState("");

	/**
	 * ref
	 */
	const canvasRef = useRef<HTMLDivElement>(null);
	const usersPopoverRef = useRef<HTMLDivElement>(null);
	const uploadStatusRef = useRef(uploadStatus);
	const imageStylesRef = useRef(imageStyles);
	const imageUrlsRef = useRef(imageUrls);


	/**
	 * ref init
	 */
	useEffect(() => {
		uploadStatusRef.current = uploadStatus;
	}, [uploadStatus]);

	useEffect(() => {
		imageStylesRef.current = imageStyles;
	}, [imageStyles]);

	useEffect(() => {
		imageUrlsRef.current = imageUrls;
	}, [imageUrls]);


	/**
	 * 기본 초기화 및 provider 관리
	 */
	useEffect(() => {
		if (!projectId) return;

		const getRandomColor = () =>
				`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

		const roomName = projectId;
		const accessToken = getAccessTokenFromLocal() || "";
		const user = {
			id: getUserIdFromLocal() || "guest",
			name: getUserNameFromLocal() || "게스트",
			color: getRandomColor(),
		};
		const closeEvent = () => router.back();

		const {
			doc,
			provider,
			awareness,
			uploadStatusMap,
			imageStylesMap,
			imageUrlsMap,
			sharedLayoutMap,
		} = createYjsDocument({ roomName, accessToken, user, closeEvent });

		setYjsDoc(doc);
		setAwareness(awareness);
		setUploadStatusMap(uploadStatusMap);
		setImageStylesMap(imageStylesMap);
		setImageUrlsMap(imageUrlsMap);
		setSharedLayoutMap(sharedLayoutMap);

		const handleSync = (isSynced: boolean) => {
			console.log("Yjs synced with server:", isSynced);

			if (isSynced) {
				setSyncInfo({ isSync: true, lastSyncDate: new Date() });
			} else {
				setSyncInfo((info) => ({ ...info, isSync: false }));
			}
		}

		provider.on("sync", handleSync);


		return () => {
			dispatch(resetLayoutState());
			cleanupYjsProvider(provider);
			provider.off("sync", handleSync);
		};
	}, [projectId]);


	/**
	 * yjs -> state 변동사항 적용 effect
	 */
	useEffect(() => {
		if (!sharedLayoutMap) return;

		const handleSharedLayoutChange = (events: Array<unknown>) => {
			const targetMap = events[0] as Y.YMapEvent<unknown>;
			const remoteLayoutDatas = targetMap.target.get("sections") as SectionData[];
			if (!remoteLayoutDatas) return;
			dispatch(setLayoutData({ layoutId: "default", sectionValues: remoteLayoutDatas }));
		};

		sharedLayoutMap.observeDeep(handleSharedLayoutChange);
		return () => {
			sharedLayoutMap.unobserveDeep(handleSharedLayoutChange);
		};
	}, [sharedLayoutMap, syncInfo]);

	useEffect(() => {
		if (!uploadStatusMap) return;

		const handleUploadStatusChange = (event: Y.YMapEvent<unknown>) => {
			const yjsUploadStatus = event.target.toJSON();
			if (JSON.stringify(yjsUploadStatus) !== JSON.stringify(uploadStatusRef.current)) {
				dispatch(setAllImageUploadStatus(yjsUploadStatus));
			}
		};

		uploadStatusMap.observe(handleUploadStatusChange);
		return () => {
			uploadStatusMap.unobserve(handleUploadStatusChange);
		};
	}, [uploadStatusMap]);


	useEffect(() => {
		if (!imageStylesMap) return;

		const handleImageStylesChange = (event: Y.YMapEvent<unknown>) => {
			const yjsImageStyles = event.target.toJSON();
			if (JSON.stringify(yjsImageStyles) !== JSON.stringify(imageStylesRef.current)) {
				dispatch(setAllImageStyles(yjsImageStyles));
			}
		};

		imageStylesMap.observe(handleImageStylesChange);
		return () => {
			imageStylesMap.unobserve(handleImageStylesChange);
		};
	}, [imageStylesMap]);

	useEffect(() => {
		if (!imageUrlsMap) return;

		const handleImageUrlsChange = (event: Y.YMapEvent<unknown>) => {
			const yjsImageUrls = event.target.toJSON();
			if (JSON.stringify(yjsImageUrls) !== JSON.stringify(imageUrlsRef.current)) {
				dispatch(setAllImageUrls(yjsImageUrls));
			}
		};

		imageUrlsMap.observe(handleImageUrlsChange);
		return () => {
			imageUrlsMap.unobserve(handleImageUrlsChange);
		};
	}, [imageUrlsMap]);



	/**
	 * state -> yjs 변경사항 적용 effect
	 */
	// nowSectionKey나 selectedItemKey가 변경될 때 awareness 상태 업데이트
	useEffect(() => {
		if (awareness) {
			updateUserSelection(awareness, nowSectionKey, selectedItemKey);
		}
	}, [awareness, nowSectionKey, selectedItemKey]);

	useEffect(() => {
		if (!yjsDoc || !sharedLayoutMap) return;
		if (projectPermission === "READ_ONLY") return;

		const { isSync, lastSyncDate } = syncInfo;

		// 로컬 변경을 YJS에 반영
		// 현재 값과 비교해서 실제로 변경이 있는 경우만 업데이트
		const currentSections = sharedLayoutMap.get("sections") as SectionData[] | undefined;
		const isSame = JSON.stringify(currentSections) === JSON.stringify(layoutDatas);

		// [1] 최초 sync 전 → 수정 차단
		if (!lastSyncDate) return;

		const now = Date.now();
		const lastSyncTime = new Date(lastSyncDate).getTime();
		const elapsed = now - lastSyncTime;

		// [2] sync 중이면 정상 반영
		if (isSync) {
			if (!isSame) {
				sharedLayoutMap.set("sections", layoutDatas);
			}
			return;
		}

		// [3] 오프라인 상태: 60초 이내 수정 가능
		if (elapsed <= 60_000) {
			if (!isSame) {
				sharedLayoutMap.set("sections", layoutDatas);
			}
			return;
		}

		// [4] 60초 넘은 경우 수정 불가
		if (elapsed > 60_000) {
			console.warn("🚨 60초 이상 서버와 sync되지 않았습니다. 수정 내용이 서버에 반영되지 않을 수 있습니다.");
			/*if (!isSame) {
				sharedLayoutMap.set("sections", layoutDatas);
			}*/
		}


	}, [layoutDatas, syncInfo, projectPermission]);


	useEffect(() => {
		if (!uploadStatusMap) return;
		const current = uploadStatusRef.current;
		Object.entries(current).forEach(([itemKey, status]) => {
			const yjsStatus = uploadStatusMap.get(itemKey);
			if (!yjsStatus || JSON.stringify(yjsStatus) !== JSON.stringify(status)) {
				uploadStatusMap.set(itemKey, status);
			}
		});
		// 삭제된 키 동기화
		uploadStatusMap.forEach((_, key) => {
			if (!current[key]) uploadStatusMap.delete(key);
		});
	}, [uploadStatus, uploadStatusMap]);


	useEffect(() => {
		if (!imageStylesMap) return;
		const current = imageStylesRef.current;
		Object.entries(current).forEach(([itemKey, style]) => {
			const yjsStyle = imageStylesMap.get(itemKey);
			if (!yjsStyle || JSON.stringify(yjsStyle) !== JSON.stringify(style)) {
				imageStylesMap.set(itemKey, style);
			}
		});
		// 삭제된 키 동기화
		imageStylesMap.forEach((_, key) => {
			if (!current[key]) imageStylesMap.delete(key);
		});
	}, [imageStyles, imageStylesMap]);


	useEffect(() => {
		if (!imageUrlsMap) return;
		const current = imageUrlsRef.current;
		Object.entries(current).forEach(([itemKey, url]) => {
			const yjsUrl = imageUrlsMap.get(itemKey);
			if (!yjsUrl || yjsUrl !== url) {
				imageUrlsMap.set(itemKey, url);
			}
		});
		// 삭제된 키 동기화
		imageUrlsMap.forEach((_, key) => {
			if (!current[key]) imageUrlsMap.delete(key);
		});
	}, [imageUrls, imageUrlsMap]);

	useEffect(() => {
		const {lastSyncDate} = syncInfo;
		if (!lastSyncDate) return;

		const interval = setInterval(() => {
			const now = Date.now();
			const last = new Date(lastSyncDate).getTime();
			const diff = now - last;

			if (!syncInfo.isSync) {
				if (diff > 60_000) {
					setOfflineMessage("🚨 60초 이상 서버와 sync되지 않았습니다. 수정 내용이 서버에 반영되지 않습니다.");
				} else {
					setOfflineMessage("📡 현재 오프라인입니다. 네트워크를 확인해주세요.");
				}
			} else {
				setOfflineMessage("");
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [syncInfo]);



	useEffect(() => {
		getPermission();

	}, []);

	/**
	 * page func
	 */

	const generateUUID = useCallback(() => {
		if (typeof window !== "undefined") {
			return crypto.randomUUID();
		}
		return "temp-id";
	}, []);


	const addToHistory = (components: ComponentItem[]) => {
		const newHistory = history.slice(0, currentHistoryIndex + 1);
		newHistory.push({droppedComponents: [...components]});
		setHistory(newHistory);
		setCurrentHistoryIndex(newHistory.length - 1);
	};

	const handleUndo = () => {
		if (currentHistoryIndex > 0) {
			const previousState = history[currentHistoryIndex - 1];
			setDroppedComponents(previousState.droppedComponents);
			setCurrentHistoryIndex(currentHistoryIndex - 1);
		}
	};

	const handleRedo = () => {
		if (currentHistoryIndex < history.length - 1) {
			const nextState = history[currentHistoryIndex + 1];
			setDroppedComponents(nextState.droppedComponents);
			setCurrentHistoryIndex(currentHistoryIndex + 1);
		}
	};

	const handleProjectNameChange = (newName: string) => {
		setProjectName(newName);
		setShowProjectNameInput(false);
	};


	const handleFullScreen = () => {
		setIsFullscreen(prev => {
			return !prev
		});
	}


	const getPermission = async () => {
		try {
			const result = await apiHandler.getProject(projectId);
			const members = result.data?.members ?? [];
			const myAccountEmail = getUserIdFromLocal();
			const per = members.find(m => m.email === myAccountEmail)?.permission ?? "READ_ONLY";
			dispatch(setProjectPermission({projectPermission: per}));
			setIsFullscreen(per === "READ_ONLY")

		} finally {

		}
	}

	return (
			<div className="flex flex-col h-screen bg-gray-50">
				{/* 상단 헤더 영역 */}
				<header
						className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
					<div className="flex items-center space-x-4">
						<div className="flex items-center">
							{showProjectNameInput ? (
									<input
											type="text"
											value={projectName}
											onChange={(e) => setProjectName(e.target.value)}
											onBlur={() => handleProjectNameChange(projectName)}
											onKeyPress={(e) =>
													e.key === "Enter" && handleProjectNameChange(projectName)
											}
											className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent"
											autoFocus
									/>
							) : (
									<h1
											className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer flex items-center"
											onClick={() => setShowProjectNameInput(true)}
									>
										{projectName}
										<i className="fas fa-pencil-alt text-sm ml-2 text-gray-400"></i>
									</h1>
							)}
						</div>
					</div>
					<div className="flex items-center space-x-3">
						{/* <button
            onClick={handleSave}
            disabled={isSaving}
            className={`${
              isSaving
                ? "bg-gray-200 text-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-button text-sm font-medium cursor-pointer whitespace-nowrap flex items-center`}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                저장 중...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                저장
              </>
            )}
          </button> */}
						<button
								className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-button text-sm font-medium cursor-pointer whitespace-nowrap">
							<i className="fas fa-eye mr-2"></i>미리보기
						</button>
						<button
								onClick={async () => {
									const sharedLayoutMap = yjsDoc?.getMap("layoutDatas");
									setPublishStatus(null);
									try {
										const response = await apiHandler.publishProject(
												projectId,
												JSON.stringify(sharedLayoutMap?.toJSON()?.sections)
										);
										if (response.data?.url) {
											setPublishStatus({type: "success", url: response.data.url});
										} else {
											setPublishStatus({
												type: "error",
												message: "배포 결과를 알 수 없습니다.",
											});
										}
									} catch (err) {
										let msg = "배포에 실패했습니다. 다시 시도해 주세요.";
										if (
												typeof err === "object" &&
												err !== null &&
												"response" in err
										) {
											// @ts-expect-error: axios error type has response property
											const responseData = err.response?.data;
											const errorDesc =
													responseData &&
													responseData.errors &&
													responseData.errors.errorDescription;
											if (errorDesc) msg = errorDesc;
											// @ts-expect-error: axios error type has message property
											else if (err.message) msg = err.message;
										} else if (err instanceof Error) {
											msg = err.message;
										}
										setPublishStatus({type: "error", message: msg});
									}
								}}
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button text-sm font-medium cursor-pointer whitespace-nowrap"
						>
							<i className="fas fa-rocket mr-2"></i>배포
						</button>
						<button
								onClick={async () => {
									setPublishStatus(null);
									try {
										await apiHandler.unpublishProject(projectId);
										setPublishStatus({type: "success", url: ""});
									} catch (err) {
										let msg = "게시 취소에 실패했습니다. 다시 시도해 주세요.";
										if (
												typeof err === "object" &&
												err !== null &&
												"response" in err
										) {
											// @ts-expect-error: axios error type has response property
											const responseData = err.response?.data;
											const errorDesc =
													responseData &&
													responseData.errors &&
													responseData.errors.errorDescription;
											if (errorDesc) msg = errorDesc;
											// @ts-expect-error: axios error type has message property
											else if (err.message) msg = err.message;
										} else if (err instanceof Error) {
											msg = err.message;
										}
										setPublishStatus({type: "error", message: msg});
									}
								}}
								className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-button text-sm font-medium cursor-pointer whitespace-nowrap ml-2"
						>
							<i className="fas fa-ban mr-2"></i>게시취소
						</button>
						<button
								onClick={() => setShowSettings(true)}
								className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer whitespace-nowrap"
						>
							<i className="fas fa-cog text-lg"></i>
						</button>
						<button
								onClick={async () => {
									setPublishStatus(null);
									try {
										await apiHandler.exitProject(projectId);
										router.push("/list");
									} catch (err) {
										let msg = "프로젝트 탈퇴에 실패했습니다. 다시 시도해 주세요.";
										if (
												typeof err === "object" &&
												err !== null &&
												"response" in err
										) {
											// @ts-expect-error: axios error type has response property
											const responseData = err.response?.data;
											const errorDesc =
													responseData &&
													responseData.errors &&
													responseData.errors.errorDescription;
											if (errorDesc) msg = errorDesc;
											// @ts-expect-error: axios error type has message property
											else if (err.message) msg = err.message;
										} else if (err instanceof Error) {
											msg = err.message;
										}
										setPublishStatus({type: "error", message: msg});
									}
								}}
								className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-button text-sm font-medium cursor-pointer whitespace-nowrap ml-2"
						>
							<i className="fas fa-sign-out-alt mr-2"></i>프로젝트 탈퇴
						</button>
					</div>
				</header>
				<div className="flex flex-1 overflow-hidden">
					{/* 좌측 사이드바 (컴포넌트 패널) */}
					<SectionList
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							setIsDragging={setIsDragging}
							isFullscreen={isFullscreen}
					/>
					{/* 중앙 메인 작업 영역 */}
					<main className={`flex-1 w-screen bg-gray-100 overflow-hidden flex flex-col`}>
						<div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
							{/* <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-button cursor-pointer whitespace-nowrap ${viewMode === "desktop" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => handleViewModeChange("desktop")}
              >
                <i className="fas fa-desktop"></i>
              </button>
              <button
                className={`p-2 rounded-button cursor-pointer whitespace-nowrap ${viewMode === "tablet" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => handleViewModeChange("tablet")}
              >
                <i className="fas fa-tablet-alt"></i>
              </button>
              <button
                className={`p-2 rounded-button cursor-pointer whitespace-nowrap ${viewMode === "mobile" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => handleViewModeChange("mobile")}
              >
                <i className="fas fa-mobile-alt"></i>
              </button>
            </div> */}
							<div className="flex items-center space-x-2">
								<button
										onClick={handleUndo}
										disabled={currentHistoryIndex <= 0}
										className={`p-2 rounded-button whitespace-nowrap ${
												currentHistoryIndex <= 0
														? "text-gray-300 cursor-not-allowed"
														: "text-gray-500 hover:bg-gray-100 cursor-pointer"
										}`}
								>
									<i className="fas fa-undo"></i>
								</button>
								<button
										onClick={handleRedo}
										disabled={currentHistoryIndex >= history.length - 1}
										className={`p-2 rounded-button whitespace-nowrap ${
												currentHistoryIndex >= history.length - 1
														? "text-gray-300 cursor-not-allowed"
														: "text-gray-500 hover:bg-gray-100 cursor-pointer"
										}`}
								>
									<i className="fas fa-redo"></i>
								</button>
								<button
										id="fullscreen-toggle"
										onClick={handleFullScreen}
										disabled={projectPermission === "READ_ONLY"}
										className="p-2 text-gray-500 hover:bg-gray-100 rounded-button cursor-pointer whitespace-nowrap disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-transparent"
								>
									<i
											className={`fas ${isFullscreen ? "fa-compress" : "fa-expand"}`}
									></i>
								</button>
							</div>
						</div>
						<div className="flex-1 overflow-y-auto p-8 flex justify-center">
							<div
									className={`bg-white shadow-lg rounded-lg border border-gray-200 min-h-[calc(100vh-12rem)] w-full max-w-6xl relative`}

									// ${
									//   viewMode === "desktop"
									//     ? "w-full max-w-6xl"
									//     : viewMode === "tablet"
									//       ? "w-[768px]"
									//       : "w-[375px]"
									// }
							>

								{projectPermission === "READ_ONLY" && (
										<div className="absolute inset-0 z-50 bg-transparent cursor-not-allowed" />
								)}

								<div
										ref={canvasRef}
										className={`min-h-screen p-6 relative border-2 ${isDragging ? "border-blue-400 bg-blue-50" : "bg-white border-dashed border-gray-300"} rounded-lg transition-colors duration-200`}
										onDragOver={(e) => {
											e.preventDefault();
										}}
										onDrop={(e) => {
											e.preventDefault();
											const componentType = e.dataTransfer.getData("text/plain");

											const canvasRect = canvasRef.current?.getBoundingClientRect();
											if (canvasRect) {
												const x = e.clientX - canvasRect.left;
												const y = e.clientY - canvasRect.top;
												const newComponent: ComponentItem = {
													id: `${componentType}-${Date.now()}`,
													type: componentType,
													position: {x, y},
												};
												const updatedComponents = [
													...droppedComponents,
													newComponent,
												];
												//   const onAddSection = useCallback(() => {
												//     const newSection: SectionData = {
												//       sectionKey: generateUUID(),
												//       layoutValues: [],
												//     };
												//     dispatch(addSection({ newSection }));
												//     dispatch(changeNowSectionKey(newSection.sectionKey));
												//   }, [dispatch, generateUUID]);

												const newSection: SectionData = {
													sectionKey: generateUUID(),
													layoutValues: [],
												};
												if (componentType === "컨테이너") {
													dispatch(addSection({newSection}));
													return;
												}
												// setDroppedComponents(updatedComponents);
												addToHistory(updatedComponents);
											}
										}}
								>
									{/* Floating ActiveUsers Button & Popover */}
									{awareness && (
											<div className="fixed top-12 right-4 z-20 flex flex-col items-end">
												{/* Round Button */}
												<button
														className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg hover:bg-blue-600 transition mb-2 focus:outline-none"
														onClick={() => setShowUsersPopover((prev) => !prev)}
														aria-label="Show active users"
														type="button"
												>
													{/* User group icon (Heroicons/FontAwesome or SVG) */}
													<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-6 w-6 text-white"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
													>
														<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75"
														/>
													</svg>
												</button>
												{/* Popover */}
												{showUsersPopover && (
														<div
																ref={usersPopoverRef}
																className="mt-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[220px] max-w-xs"
														>
															<ActiveUsers
																	awareness={awareness}
																	layoutDatas={layoutDatas}
																	uploadStatus={uploadStatus}
															/>
														</div>
												)}
											</div>
									)}
									<MainContent
											layoutDatas={layoutDatas}
											selectedItemKey={selectedItemKey}
											nowSectionKey={nowSectionKey}
											imageUrlsMap={imageUrlsMap}
									/>
									{/* {droppedComponents.map((component) => (
                  <div
                    key={component.id}
                    id={`dropped-${component.id}`}
                    className={`absolute bg-white shadow-lg rounded-lg cursor-move p-4 ${selectedComponent === component.type ? "ring-2 ring-blue-500" : ""}`}
                    style={{
                      left: `${component.position.x}px`,
                      top: `${component.position.y}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComponentSelect(component.type);
                    }}
                    // onDragOver={(e) => {
                    //   if (component.type === "컨테이너") {
                    //     e.preventDefault();
                    //     e.currentTarget.classList.add("bg-blue-50");
                    //   }
                    // }}
                    // onDragLeave={(e) => {
                    //   if (component.type === "컨테이너") {
                    //     e.currentTarget.classList.remove("bg-blue-50");
                    //   }
                    // }}
                    // onDrop={(e) => {
                    //   // if (component.type === "컨테이너") {
                    //   e.preventDefault();
                    //   e.currentTarget.classList.remove("bg-blue-50");
                    //   const componentType =
                    //     e.dataTransfer.getData("text/plain");
                    //   const rect = e.currentTarget.getBoundingClientRect();
                    //   const x = e.clientX - rect.left;
                    //   const y = e.clientY - rect.top;
                    //   const newComponent: ComponentItem = {
                    //     id: `${componentType}-${Date.now()}`,
                    //     type: componentType,
                    //     position: { x, y },
                    //   };
                    //   const updatedComponents = [
                    //     ...droppedComponents,
                    //     newComponent,
                    //   ];
                    //   setDroppedComponents(updatedComponents);
                    //   addToHistory(updatedComponents);

                    //   // 컨테이너에 드롭된 경우 addSection 호출
                    //   if (componentType === "컨테이너") {
                    //     const newSection: SectionData = {
                    //       sectionKey: generateUUID(),
                    //       layoutValues: [],
                    //     };
                    //     dispatch(addSection({ newSection }));
                    //   }
                    //   // }
                    // }}
                  >
                    <div className="flex items-center space-x-2 p-2">
                      <i
                        className={`fas fa-${
                          component.type === "텍스트"
                            ? "font"
                            : component.type === "버튼"
                              ? "square"
                              : component.type === "이미지"
                                ? "image"
                                : component.type === "아이콘"
                                  ? "icons"
                                  : "minus"
                        } text-gray-500`}
                      ></i>
                      <span>{component.type}</span>
                    </div>
                  </div>
                ))} */}
									{layoutDatas.length === 0 && (
											<div
													className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
												<div className="text-gray-400 mb-3">
													<i className="fas fa-plus-circle text-5xl"></i>
												</div>
												<p className="text-gray-500 text-lg font-medium">
													여기에 컨테이너를 드래그하여 추가하세요
												</p>
												<p className="text-gray-400 text-sm mt-2">
													왼쪽 패널에서 원하는 요소를 선택하여 드래그하세요
												</p>
											</div>
									)}
								</div>
							</div>
						</div>
					</main>
					{/* 우측 사이드바 (속성 패널) */}
					<SideMenu
							// isOpen={isSideMenuOpen}
							// onClose={() => setIsSideMenuOpen(false)}
							addSection={() => {
							}}
							isFullscreen={isFullscreen}
					/>

					{/* Setting Dialog */}

					{showSettings && (
							<SettingDialog
									setShowSettings={setShowSettings}
									projectId={projectId}
							/>
					)}

					{/* Toast Notification */}
					{/* <div
          className={`fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 flex items-center ${
            showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <i className="fas fa-check-circle mr-2"></i>
          프로젝트가 성공적으로 저장되었습니다
        </div> */}
					{publishStatus && (
							<div
									className={`fixed bottom-20 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 flex items-center z-50
              ${publishStatus.type === "success" ? "bg-blue-600 text-white" : "bg-red-500 text-white"}`}
							>
								{publishStatus.type === "success" ? (
										<>
											{publishStatus.url ? (
													<>
														배포 완료! URL:{" "}
														<a
																href={`https://dev.easytoweb.store/publish/${publishStatus.url}`}
																target="_blank"
																rel="noopener noreferrer"
																className="underline ml-1"
														>
															{publishStatus.url}
														</a>
													</>
											) : (
													"게시가 취소되었습니다."
											)}
										</>
								) : (
										<>
											<i className="fas fa-exclamation-circle mr-2"></i>
											{publishStatus.message}
										</>
								)}
							</div>
					)}

					{offlineMessage && (
							<div className="fixed bottom-20 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 flex items-center z-50 bg-red-500 text-white">
								{offlineMessage}
							</div>
					)}
				</div>
			</div>
	);
};
export default App;