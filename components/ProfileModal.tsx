import React, {useEffect, useState} from "react";
import {useModal, UseModalReturnType} from "../hooks/useModal";
import apiHandler, {FULL_API_URL} from "../shared/api/axios";
import {clearSessionInLocal, getAccountInfoFromLocal, updateAccountToLocal} from "../utils/session";
import {useChunkedImageUpload} from "../hooks/useChunkedImageUpload";
import PasswordChangeModal from "./PasswordChangeModal";
import BaseModal from "./BaseModal";

interface ProfileModalProps {
	modal: UseModalReturnType,
}


const ProfileModal = ({
	                       modal
                       }: ProfileModalProps) => {

	const passwordChangeModal = useModal();
	const {uploadImage, status} = useChunkedImageUpload();
	const initialProfileUrl = getAccountInfoFromLocal()?.profileUrl ?? "/profile.png"
	const [profileUrl, setProfileUrl] = useState(initialProfileUrl);
	const [nickname, setNickname] = useState(getAccountInfoFromLocal()?.nickname ?? "");

	useEffect(() => {
		refreshProfile()

	}, []);


	const handleLogout = async () => {
		try {
			await apiHandler.logout();

		} finally {
			clearSessionInLocal();
			window.location.href = "/"
		}
	}

	const refreshProfile = async () =>{
		try {
			const result = await apiHandler.me();
			if (result.data){
				updateAccountToLocal(result.data);
				setProfileUrl(result.data.profileUrl);
				setNickname(result.data.nickname);
			}

		}catch (error){
			console.log(error);
		}
	}

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const result = await uploadImage(file);

		if (result.fileUrl) {
			setProfileUrl(result.fileUrl);
		} else {
			setProfileUrl(initialProfileUrl);
		}
	};

	const updateProfile = async () => {
		const params = {
			nickname: nickname,
			profileUrl: profileUrl,
		}

		try {
			const result = await apiHandler.updateProfile(params);
			if (result.data){
				updateAccountToLocal(result.data);
				modal.close()
			}

		}catch (error){
			console.log(error);
		}
	}


	return (
			<>
				<PasswordChangeModal modal={passwordChangeModal}/>

				<BaseModal modal={modal}>
					<div className="flex flex-col items-center">
						<label
								htmlFor="profileImageInput"
								className="relative group cursor-pointer w-[36vw] max-w-[360px] min-w-[144px] aspect-square"
						>
							<img
									src={`${FULL_API_URL}${profileUrl}?format=WEBP`}
									onError={(e) => {
										e.currentTarget.src = `/profile.png`;
									}}
									alt="프로필"
									className="w-full h-full object-cover rounded-xl border-2 border-gray-300 shadow"
							/>

							<div
									className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
								<i className="fas fa-camera text-white text-2xl mb-2"></i>
								<span className="text-white text-sm">이미지 변경</span>
							</div>

							{status.uploading && (
									<div
											className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex flex-col items-center justify-center z-10">
										<i className="fas fa-spinner fa-spin text-white text-2xl mb-2"/>
										<span className="text-white text-sm">업로드 중... {status.progress}%</span>
									</div>
							)}
						</label>

						<input
								type="file"
								id="profileImageInput"
								accept="image/*"
								className="hidden"
								onChange={handleImageChange}
						/>

						{/* 상태 메시지 */}
						<div className="mt-2 text-sm text-center h-5">
							{status.error && (
									<span className="text-red-600">{status.error}</span>
							)}
						</div>
					</div>

					{/* 아이디 (읽기 전용) */}
					<div className="mb-6 relative">
						<label className="absolute left-3 top-2 text-xs text-gray-500">
							아이디
						</label>
						<input
								type="text"
								value={getAccountInfoFromLocal()?.email ?? ""}
								readOnly
								className="w-full pt-6 pb-2 px-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* 닉네임 */}
					<div className="mb-6 relative">
						<label className="absolute left-3 top-2 text-xs text-gray-500">
							닉네임
						</label>
						<input
								type="text"
								value={nickname}
								onChange={(e) => setNickname(e.target.value)}
								className="w-full pt-6 pb-2 px-3 border border-gray-300 text-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* 하단 액션 영역 */}
					<div
							className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
						{/* 왼쪽 버튼들 */}
						<div
								className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
							<button
									className="text-sm text-blue-600 hover:underline"
									onClick={() => passwordChangeModal.open()}
							>
								비밀번호 변경
							</button>
							<button
									className="text-sm text-red-500 hover:underline"
									onClick={() => handleLogout()}
							>
								로그아웃
							</button>
						</div>

						{/* 오른쪽 저장 버튼 */}
						<button
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-button"
								onClick={() => updateProfile()}
						>
							저장
						</button>
					</div>
				</BaseModal>
			</>
	)
}

export default ProfileModal