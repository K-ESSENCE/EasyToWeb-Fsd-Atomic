import {useState} from "react";
import apiHandler from "../shared/api/axios";
import {UseModalReturnType} from "../hooks/useModal";
import toast from "react-hot-toast";
import BaseModal from "./BaseModal";

export interface PasswordChangeModalProps {
	modal: UseModalReturnType;
}

const PasswordChangeModal = ({
	                             modal
                             }: PasswordChangeModalProps) => {

	const [formData, setFormData] = useState({
		email: "",
		verificationCode: "",
		password: "",
		confirmPassword: "",
	});

	const [verificationLoading, setVerificationLoading] = useState(false);
	const [certifyLoading, setCertifyLoading] = useState(false);
	const [changeLoading, setChangeLoading] = useState(false);
	const [showVerification, setShowVerification] = useState(false);
	const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

	const handleChange =
			(field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
				setFormData((prev) => ({...prev, [field]: e.target.value}));
			};

	const handleVerification = async () => {
		if (!formData.email) {
			toast.error("이메일을 입력해주세요.");
			return;
		}

		setVerificationLoading(true);
		try {
			await apiHandler.sendPasswordMail({email: formData.email});
			setShowVerification(true);
			toast.success("인증번호가 발송되었습니다.");
		} catch (err) {
			console.log(err);
			toast.error("인증번호 발송 중 오류가 발생했습니다.");
		} finally {
			setVerificationLoading(false);
		}
	};

	const handleCertifyCode = async () => {
		if (!formData.verificationCode) {
			toast.error("인증번호를 입력해주세요.");
			return;
		}

		setCertifyLoading(true);
		try {
			await apiHandler.certifyMail({
				email: formData.email,
				certificationCode: formData.verificationCode,
				type: "PASSWORD_CHANGE_EMAIL",
			});
			toast.success("이메일 인증이 완료되었습니다.");
		} catch (err) {
			console.log(err);
			toast.error("인증 실패");
		} finally {
			setCertifyLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const {email, password, confirmPassword, verificationCode} = formData;

		if (!email || !password || !confirmPassword || !verificationCode) {
			toast.error("모든 항목을 입력해주세요.");
			return;
		}

		if (password !== confirmPassword) {
			setErrors({confirmPassword: "비밀번호가 일치하지 않습니다."});
			toast.error("비밀번호가 일치하지 않습니다.");
			return;
		}

		setChangeLoading(true);
		try {
			await apiHandler.changePassword({
				email,
				password,
				certificationCode: verificationCode,
				type: "PASSWORD_CHANGE_EMAIL",
			});
			toast.success("비밀번호가 변경되었습니다.");
			modal.close();
		} catch (err) {
			console.log(err);
			toast.error("비밀번호 변경 실패");
		} finally {
			setChangeLoading(false);
		}
	};


	return (
			<BaseModal modal={modal} widthClass={`w-[90vw] max-w-md`}>

				<h2 className="text-lg font-semibold mb-6 text-gray-800 text-center">비밀번호 재설정</h2>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
						<input
								type="email"
								value={formData.email}
								onChange={handleChange("email")}
								className="w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:border-custom focus:ring-custom"
								placeholder="your@email.com"
						/>
					</div>

					<div className="mt-4">
						<button
								type="button"
								onClick={handleVerification}
								disabled={verificationLoading}
								className="mt-2 w-full !rounded-button bg-gray-200 text-gray-700 py-2 px-4 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{verificationLoading ? "인증번호 발송 중..." : "인증번호 받기"}
						</button>
					</div>

					{showVerification && (
							<div className="mt-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
								<div className="flex gap-2">
									<input
											type="text"
											className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
											placeholder="인증번호 6자리 입력"
											maxLength={6}
											value={formData.verificationCode}
											onChange={handleChange("verificationCode")}
									/>
									<button
											type="button"
											className="!rounded-button bg-custom text-white py-2 px-4 font-medium hover:bg-custom/90 disabled:opacity-50 disabled:cursor-not-allowed"
											onClick={handleCertifyCode}
											disabled={certifyLoading}
									>
										{certifyLoading ? "확인 중..." : "확인"}
									</button>
								</div>
								<p className="mt-2 text-sm text-gray-500">인증번호가 발송되었습니다. (유효시간 3:00)</p>
							</div>
					)}

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
						<input
								type="password"
								value={formData.password}
								onChange={handleChange("password")}
								className="w-full rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
								placeholder="••••••••"
						/>
						{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
						<input
								type="password"
								value={formData.confirmPassword}
								onChange={handleChange("confirmPassword")}
								className="w-full rounded-lg border-gray-300 shadow-sm focus:border-custom focus:ring-custom"
								placeholder="••••••••"
						/>
						{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
						)}
					</div>

					<div className="mt-6">
						<button
								type="submit"
								className="w-full !rounded-button bg-custom text-white py-3 px-4 font-medium hover:bg-custom/90 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={changeLoading}
						>
							{changeLoading ? "변경 중..." : "비밀번호 변경"}
						</button>
					</div>
				</form>
			</BaseModal>
	);
};

export default PasswordChangeModal;