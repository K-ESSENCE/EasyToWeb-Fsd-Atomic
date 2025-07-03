import apiHandler from "../shared/api/axios";
import toast from "react-hot-toast";
import {useState} from "react";
import {UseModalReturnType} from "../hooks/useModal";
import BaseModal from "./BaseModal";

interface InvitationModalProps {
	modal: UseModalReturnType,
	projectId: string
}


const InvitationModal = ({
	                         modal,
	                         projectId
                         }: InvitationModalProps) => {

	const [inviteEmail, setInviteEmail] = useState("");
	const [inviting, setInviting] = useState(false);
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const [inviteError, setInviteError] = useState("");

	const handleInvite = async () => {
		setInviting(true);
		setInviteError("");
		try {
			await apiHandler.inviteProject({projectId, email: inviteEmail});
			setInviteSuccess(true);
			setInviteEmail("");
			toast.success("초대가 완료되었습니다.");
			setTimeout(() => {
				modal.close();
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
			<BaseModal modal={modal} widthClass={"max-w-lg"}>
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					팀원 초대
				</h3>
				<input
						className="w-full mb-3 px-3 py-2 border rounded text-gray-800"
						placeholder="이메일 입력"
						value={inviteEmail}
						onChange={(e) => setInviteEmail(e.target.value)}
						type="email"
				/>
				<div className="flex justify-end space-x-3">
					<button
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
							onClick={modal.close}
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
			</BaseModal>
	)
}

export default InvitationModal;