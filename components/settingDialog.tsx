const SettingDialog = ({
  setShowSettings,
}: {
  setShowSettings: (arg: boolean) => void;
}) => {
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
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors !rounded-button">
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
    </div>
  );
};

export default SettingDialog;
