import {UseModalReturnType} from "../hooks/useModal";
import LayoutViewer from "./LayoutViewer";
import BaseModal from "./BaseModal";
import {LayoutState} from "../store/slices/editor";

export interface LayoutViewerModalProps {
	modal: UseModalReturnType;
	layouts: LayoutState[];
	loading?: boolean;
	error?: string;
}

const LayoutViewerModal = ({
	                           modal,
	                           layouts,
	                           loading = false,
	                           error = "",
                           }: LayoutViewerModalProps) => {


	return (
			<BaseModal modal={modal} widthClass={"w-[85vw] h-[85vh]"}>
				<div
						className="flex flex-col justify-center items-center h-full overflow-auto p-4 text-black">
					{
						loading ? (
										<div
												className="flex flex-col items-center justify-center text-gray-400 text-sm h-60">
											<i className="fas fa-spinner fa-spin text-3xl mb-3"/>
											<p>로딩 중입니다...</p>
										</div>
								) :
								(
										error ? (
												<div
														className="flex flex-col items-center justify-center text-red-500 text-sm h-60">
													<i className="fas fa-exclamation-circle text-3xl mb-3"/>
													<p>{error}</p>
												</div>
										) : (
												<LayoutViewer layouts={layouts}/>
										)
								)
					}
				</div>
			</BaseModal>
	);
};

export default LayoutViewerModal;