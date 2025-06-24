import {UseModalReturnType} from "../hooks/useModal";
import {SectionData} from "./types/common/layoutStyle";
import LayoutViewer from "./LayoutViewer";
import {ImageStyleMap} from "../store/slices/layouts";

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
			<div
					className="fixed inset-0 z-50 flex items-center justify-center"
					onClick={modal.close}
			>
				<div className="absolute inset-0 bg-black bg-opacity-50" />

				<div
						className="relative z-10 w-[85vw] h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-6"
						onClick={(e) => e.stopPropagation()}
				>
					<button
							onClick={modal.close}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
							aria-label="close"
					>
						<i className="fas fa-times"/>
					</button>

					<div className="w-full h-full flex flex-col gap-4 text-black">
						{
							loading ? (
								<div className="flex flex-col items-center justify-center text-gray-400 text-sm h-60">
									<i className="fas fa-spinner fa-spin text-3xl mb-3" />
									<p>로딩 중입니다...</p>
								</div>
							) :
									(
											error ? (
													<div className="flex flex-col items-center justify-center text-red-500 text-sm h-60">
														<i className="fas fa-exclamation-circle text-3xl mb-3" />
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
				</div>
			</div>
	);
};

export default LayoutViewerModal;