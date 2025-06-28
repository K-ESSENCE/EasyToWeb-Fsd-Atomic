import BaseModal from "./BaseModal";
import {UseModalReturnType} from "../hooks/useModal";
import {Permission, PERMISSION_ORDER, ProjectMember, PromiseError} from "../shared/api/types";
import apiHandler from "../shared/api/axios";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {setProjectPermission, setProjectPublishUrl} from "../store/slices/layouts";
import {getAccountInfoFromLocal} from "../utils/session";
import {useDispatch} from "react-redux";
import useAlert from "../hooks/useAlert";

interface ProjectRoleModalProps {
	modal: UseModalReturnType,
	projectId: string,
}

const ProjectRoleModal = ({
	                          modal,
	                          projectId,
                          }: ProjectRoleModalProps) => {

	const dispatch = useDispatch();
	const alert = useAlert();
	const [members, setMembers] = useState<ProjectMember[]>([]);

	const myAccountEmail = getAccountInfoFromLocal()?.email;
	const myPermission = members.find(m => m.email === myAccountEmail)?.permission ?? "READ_ONLY";


	useEffect(() => {
		getMemberList();

	}, []);

	const getMemberList = async () => {
		try {
			const result = await apiHandler.getProject(projectId);
			const fetched = result.data?.members ?? [];

			const sorted = fetched.sort(
					(a, b) => PERMISSION_ORDER[b.permission] - PERMISSION_ORDER[a.permission]
			);
			setMembers(sorted);

			const myPerm = fetched.find(m => m.email === myAccountEmail)?.permission ?? "READ_ONLY";
			dispatch(setProjectPermission({projectPermission: myPerm}));

		} catch (err) {
			toast.error("멤버 목록을 불러오지 못했습니다.");
			console.log(err)
		}
	};


	const handleRoleSave = async (accountId: string, permission: Permission) => {
		try {
			await apiHandler.updateProjectMemberPermission({accountId, permission, projectId});
			setMembers(prev =>
					prev.map(member =>
							member.accountId === accountId ? {...member, permission} : member
					)
			);

			toast.success("권한이 변경되었습니다.");
		} catch (err) {
			const msg = (err as PromiseError)?.error ?? "권한 변경에 실패했습니다.";
			toast.error(msg);
		}
	};

	const handleKickMember = async (accountId: string) => {
		alert({
			title: "정말 방출하시겠습니까?",
			message: "이 작업은 되돌릴 수 없습니다.",
			confirmLabel: "방출",
			cancelLabel: "취소",
			onConfirm: async () => {
				try {
					await apiHandler.kickProjectMember({projectId, accountId});
					await getMemberList();
					toast.success("멤버가 방출되었습니다.");
				} catch (err) {
					const msg = (err as PromiseError)?.error ?? "방출에 실패했습니다.";
					toast.error(msg);
				}
			},
		});
	};


	return (
			<BaseModal modal={modal} widthClass={"max-w-lg"}>
				<h3 className="text-lg font-medium text-gray-900 mb-4">권한 설정</h3>

				<ul className="mb-4 max-h-64 overflow-y-auto divide-y">
					{members.map((member) => {
						const isSelf = member.email === myAccountEmail;
						const myLevel = PERMISSION_ORDER[myPermission as Permission];
						const targetLevel = PERMISSION_ORDER[member.permission as Permission];
						const canEdit = !isSelf && myLevel > targetLevel;
						const canKick =
								!isSelf &&
								myLevel > targetLevel &&
								(myPermission === "OWNER" || myPermission === "ADMIN");

						return (
								<li key={member.accountId} className="py-2 mx-1">
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium text-gray-800">
												{member.nickname}{" "}
												{isSelf && <span className="text-blue-500">(본인)</span>}
											</div>
											<div className="text-sm text-gray-500">{member.email}</div>
										</div>

										<div className="flex items-center space-x-2">
											{canKick && (
													<button
															onClick={() => handleKickMember(member.accountId)}
															className="text-sm text-red-500 border border-red-500 rounded px-2 py-1 hover:bg-red-50"
													>
														방출
													</button>
											)}

											<select
													value={member.permission}
													disabled={!canEdit}
													onChange={(e) =>
															handleRoleSave(member.accountId, e.target.value as Permission)
													}
													className="border rounded px-2 py-1 text-sm w-40 disabled:bg-gray-100 disabled:text-gray-400"
											>
												<option value="OWNER">OWNER</option>
												<option value="ADMIN">ADMIN</option>
												<option value="EDIT">EDIT</option>
												<option value="READ_ONLY">READ-ONLY</option>
											</select>
										</div>
									</div>
								</li>
						);
					})}
				</ul>

				<div className="flex justify-end space-x-3">
					<button
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-button"
							onClick={modal.close}
					>
						닫기
					</button>
				</div>
			</BaseModal>
	)
}

export default ProjectRoleModal