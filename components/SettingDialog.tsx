import apiHandler from "../shared/api/axios";
import {PromiseError} from "../shared/api/types";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {RootState} from "../store/configureStore";
import toast from "react-hot-toast";
import useAlert from "../hooks/useAlert";
import {useModal} from "../hooks/useModal";
import InvitationModal from "./InvitationModal";
import ProjectRoleModal from "./ProjectRoleModal";
import ProjectPublishModal from "./ProjectPublishModal";

interface SettingDialogProps {
	setShowSettings: (arg: boolean) => void;
	projectId: string;
}

const SettingDialog = ({
	                       setShowSettings,
	                       projectId,
                       }: SettingDialogProps) => {

	const router = useRouter();
	const alert = useAlert();

	const invitationModal = useModal();
	const roleModal = useModal();
	const publishModal = useModal();


	const projectPermission = useSelector((state: RootState) => state.layouts.projectPermission);

	const handleExit = async () => {
		alert({
			title: "정말 탈퇴하시겠습니까?",
			message: "이 작업은 되돌릴 수 없습니다.",
			confirmLabel: "탈퇴",
			cancelLabel: "취소",
			onConfirm: async () => {
				try {
					await apiHandler.exitProject(projectId);
					toast.success("프로젝트를 탈퇴했습니다.");
					router.push("/list");
				} catch (err) {
					const msg = (err as PromiseError)?.error ?? "프로젝트 탈퇴에 실패했습니다.";
					toast.error(msg);
				}
			},
		});
	};


	return (
			<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
				<div className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[90vh] overflow-y-scroll">
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold text-gray-800">설정</h2>
							<button
									onClick={() => setShowSettings(false)}
									className="text-gray-400 hover:text-gray-600 !rounded-button"
							>
								<i className="fas fa-times"></i>
							</button>
						</div>
					</div>

					<div className="p-6">
						<div className="space-y-6">
							{/* <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                프로젝트 설정
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button">
                  <i className="fas fa-palette text-blue-500 text-lg w-8"></i>
                  <div>
                    <div className="text-gray-800 font-medium">테마 색상</div>
                    <div className="text-sm text-gray-500">
                      프로젝트의 주요 색상을 설정합니다
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button">
                  <i className="fas fa-font text-purple-500 text-lg w-8"></i>
                  <div>
                    <div className="text-gray-800 font-medium">폰트 설정</div>
                    <div className="text-sm text-gray-500">
                      프로젝트에서 사용할 폰트를 선택합니다
                    </div>
                  </div>
                </button>
              </div>
            </div> */}

							{/* <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                계정 설정
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button">
                  <i className="fas fa-user-circle text-green-500 text-lg w-8"></i>
                  <div>
                    <div className="text-gray-800 font-medium">프로필</div>
                    <div className="text-sm text-gray-500">
                      계정 정보를 관리합니다
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button">
                  <i className="fas fa-bell text-yellow-500 text-lg w-8"></i>
                  <div>
                    <div className="text-gray-800 font-medium">알림 설정</div>
                    <div className="text-sm text-gray-500">
                      알림 기본 설정을 변경합니다
                    </div>
                  </div>
                </button>
              </div>
            </div> */}

							<div>
								<h3 className="text-sm font-medium text-gray-500 mb-4">협업</h3>
								<div className="space-y-3">
									{
											!(projectPermission === "READ_ONLY" || projectPermission === "EDIT") && (
													<button
															className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button"
															onClick={() => invitationModal.open()}
													>
														<i className="fas fa-users text-indigo-500 text-lg w-8"></i>
														<div>
															<div className="text-gray-800 font-medium">팀원 초대</div>
															<div className="text-sm text-gray-500">
																팀원을 초대합니다
															</div>
														</div>
													</button>
											)
									}

									<button
											className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button"
											onClick={() => roleModal.open()}
									>
										<i className="fas fa-user-cog text-yellow-600 text-lg w-8"></i>
										<div>
											<div className="text-gray-800 font-medium">팀 관리</div>
											<div className="text-sm text-gray-500">
												팀원 권한을 설정합니다
											</div>
										</div>
									</button>

									<button
											className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button"
											onClick={()=> publishModal.open()}
									>
										<i className="fas fa-share-alt text-pink-500 text-lg w-8"></i>
										<div>
											<div className="text-gray-800 font-medium">공유 설정</div>
											<div className="text-sm text-gray-500">
												프로젝트 공유 옵션을 설정합니다
											</div>
										</div>
									</button>

									<button
											className="w-full flex items-center p-3 text-left hover:bg-red-50 rounded-lg transition-colors !rounded-button"
											onClick={() => handleExit()}
									>
										<i className="fas fa-sign-out-alt text-red-500 text-lg w-8"></i>
										<div>
											<div className="text-red-600 font-medium">프로젝트 탈퇴</div>
											<div className="text-sm text-gray-500">
												이 프로젝트에서 나가게 됩니다
											</div>
										</div>
									</button>
								</div>
							</div>

							{/* <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                내보내기
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button">
                  <i className="fas fa-file-export text-orange-500 text-lg w-8"></i>
                  <div>
                    <div className="text-gray-800 font-medium">
                      프로젝트 내보내기
                    </div>
                    <div className="text-sm text-gray-500">
                      프로젝트를 다양한 형식으로 내보냅니다
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button">
                  <i className="fas fa-code text-teal-500 text-lg w-8"></i>
                  <div>
                    <div className="text-gray-800 font-medium">
                      코드 내보내기
                    </div>
                    <div className="text-sm text-gray-500">
                      프로젝트 코드를 내보냅니다
                    </div>
                  </div>
                </button>
              </div>
            </div> */}
						</div>
					</div>
				</div>

				<InvitationModal modal={invitationModal} projectId={projectId}/>

				<ProjectRoleModal modal={roleModal} projectId={projectId}/>

				<ProjectPublishModal modal={publishModal} projectId={projectId}/>

			</div>
	);
};

export default SettingDialog;
