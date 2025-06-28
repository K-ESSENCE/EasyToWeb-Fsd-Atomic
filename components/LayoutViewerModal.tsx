import {UseModalReturnType} from "../hooks/useModal";
import {SectionData} from "./types/common/layoutStyle";
import LayoutViewer from "./LayoutViewer";
import {ImageStyleMap} from "../store/slices/layouts";
import BaseModal from "./BaseModal";

export interface LayoutViewerModalProps {
	modal: UseModalReturnType;
	sectionValues: SectionData[];
	imageStyles: ImageStyleMap
	loading?: boolean;
	error?: string;
}

const LayoutViewerModal = ({
	                           modal,
	                           sectionValues,
	                           imageStyles,
	                           loading = false,
	                           error = "",
                           }: LayoutViewerModalProps) => {


	return (
			<BaseModal modal={modal} widthClass={"w-[85vw] h-[85vh]"}>
				<div className="w-full h-full flex flex-col gap-4 text-black">
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
												<LayoutViewer sectionValues={sectionValues}
												              imageStyles={imageStyles}
												/>
										)
								)
					}
				</div>
			</BaseModal>
	);
};

export default LayoutViewerModal;