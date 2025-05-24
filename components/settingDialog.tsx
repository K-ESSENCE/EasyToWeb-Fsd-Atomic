import { useState } from "react";
import apiHandler from "../shared/api/axios";

const SettingDialog = ({
  setShowSettings,
  projectId,
}: {
  setShowSettings: (arg: boolean) => void;
  projectId: string;
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const handleInvite = async () => {
    setInviting(true);
    setInviteError("");
    try {
      await apiHandler.inviteProject({ projectId, email: inviteEmail });
      setInviteSuccess(true);
      setInviteEmail("");
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
      }, 1500);
    } catch (err) {
      if (typeof err === "object" && err !== null && "response" in err) {
        setInviteError(
          // @ts-expect-error: axios error type has response property
          err.response?.data?.message ||
            // @ts-expect-error: axios error type has message property
            err.message ||
            "초대에 실패했습니다. 다시 시도해 주세요."
        );
      } else if (err instanceof Error) {
        setInviteError(err.message);
      } else {
        setInviteError("초대에 실패했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setInviting(false);
    }
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
                <button
                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button"
                  onClick={() => setShowInviteModal(true)}
                >
                  <i className="fas fa-users text-indigo-500 text-lg w-8"></i>
                  <div>
                    <div className="text-gray-800 font-medium">팀 관리</div>
                    <div className="text-sm text-gray-500">
                      팀원을 초대하고 권한을 설정합니다
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button">
                  <i className="fas fa-share-alt text-pink-500 text-lg w-8"></i>
                  <div>
                    <div className="text-gray-800 font-medium">공유 설정</div>
                    <div className="text-sm text-gray-500">
                      프로젝트 공유 옵션을 설정합니다
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

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              팀원 초대
            </h3>
            <input
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="이메일 입력"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              type="email"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
                onClick={() => setShowInviteModal(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-button"
                onClick={handleInvite}
                disabled={inviting || !inviteEmail}
              >
                {inviting ? "초대 중..." : "초대"}
              </button>
            </div>
            {inviteSuccess && (
              <div className="text-green-600 text-sm mt-3">
                초대가 완료되었습니다!
              </div>
            )}
            {inviteError && (
              <div className="text-red-600 text-sm mt-3">{inviteError}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingDialog;
