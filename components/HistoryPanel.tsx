import {useModal, UseModalReturnType} from "../hooks/useModal";
import apiHandler from "../shared/api/axios";
import {ProjectHistory} from "../shared/api/types";
import {useEffect, useState} from "react";
import CenteredStatus from "./CenteredStatus";
import LayoutViewerModal from "./LayoutViewerModal";
import useJsonFromYDocBinary from "../hooks/useJsonFromYdocBinary";
import PageLoader from "./PageLoader";
import moment from "moment";

export interface HistoryPanelProps {
	modal: UseModalReturnType,
	projectId: string
}

const HistoryPanel = ({
	                      modal,
	                      projectId
                      }: HistoryPanelProps) => {
	const [pageable, setPageable] = useState({
		page: 0,
		size: 15,
		sort: "",
		totalCount: 0,
	});

	const [totalCount, setTotalCount] = useState<number>(0);
	const [historyList, setHistoryList] = useState<ProjectHistory[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const totalPages = Math.ceil(totalCount / pageable.size);

	const viewerModal = useModal();
	const [base64Data, setBase64Data] = useState<string | null>(null);
	const [previewLoading, setPreviewLoading] = useState<boolean>(false);
	const { json } = useJsonFromYDocBinary(base64Data);

	useEffect(() => {
		getHistoryList();

	}, [pageable.page]);

	const getHistoryList = async () => {
		setLoading(true);
		try {
			const result = await apiHandler.getProjectHistoryList(
					projectId,
					pageable.page,
					pageable.size,
					pageable.sort
			);
			if (result && result.data) {
				setHistoryList(result.data.projectHistories);
				setTotalCount(result.data?.totalCount ?? 0);
			}
		} finally {
			setLoading(false);
		}
	};

	const getHistoryOne = async (historyId: number) => {
		try {
			setPreviewLoading(true);
			const result = await apiHandler.getProjectHistory(projectId, historyId);
			if (result && result.data) {
				// base64
				setBase64Data(result.data.content);
				viewerModal.open(undefined, ()=>{
					setBase64Data(null);
				});

			}
		} catch (e){
			console.log(e);
		} finally {
			setPreviewLoading(false);
		}
	}

	const getRelativeTime = (editTime: string) => {
		const now = moment();
		const time = moment.utc(editTime).local();

		const diffMin = now.diff(time, "minutes");
		if (diffMin < 1) return "방금 전";
		if (diffMin < 60) return `${diffMin}분 전`;

		const diffHour = now.diff(time, "hours");
		if (diffHour < 24) return `${diffHour}시간 전`;

		const diffDay = now.diff(time, "days");
		return `${diffDay}일 전`;
	};

	return (
			<div className="fixed inset-0 flex justify-end z-50">
				{
					viewerModal.show && (
								<LayoutViewerModal modal={viewerModal}
								                   sectionValues={json?.sections ?? []}
								                   loading={previewLoading}
								                   error={!(json?.sections) ? "오류가 발생했습니다. 관리자에게 문의주세요." : ""}
								                   imageStyles={json?.imageStyles ?? {}}
								/>
					)
				}

				{/* 오버레이 */}
				<div
						className="absolute inset-0 bg-black bg-opacity-40"
						onClick={() => modal.close()}
				/>

				{/* 패널 본체 */}
				<div
						className="relative w-full max-w-md h-full bg-white shadow-xl p-6 overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
				>
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-semibold text-gray-900">프로젝트 기록</h3>
						<button
								className="text-gray-500 hover:text-gray-700"
								onClick={() => modal.close()}
						>
							✕
						</button>
					</div>

					{/* 기록 목록 */}
					<ul className="space-y-3 relative min-h-[200px]">
						{loading ? (
								<div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
									<CenteredStatus
											type="loading"
											message="기록을 불러오는 중입니다..."
									/>
								</div>
						) : historyList.length > 0 ? (
								historyList.map((item, index) => (
										<li key={index}
										    className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
										    onClick={()=>{getHistoryOne(item.id)}}
										>
											<div className="text-sm font-medium text-gray-800 mb-1 truncate"
											     title={item.editor.join(", ")}>
												작성자: {item.editor[0]}
												{item.editor.length > 1 && ` 외 ${item.editor.length - 1}명`}
											</div>
											<div className="text-xs text-gray-500">
												수정 시간: {moment.utc(item.editTime).local().format("YYYY.MM.DD HH:mm")} (
												{getRelativeTime(item.editTime)})
											</div>
										</li>
								))
						) : (
								<div
										className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-sm">
									<i className="fas fa-history text-4xl mb-3"/>
									<p>기록이 없습니다.</p>
								</div>
						)}
					</ul>

					{totalPages > 1 && !loading && (
							<div className="flex justify-between items-center mt-6 text-sm">
								<button
										className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-40"
										onClick={() =>
												setPageable((prev) => ({...prev, page: prev.page - 1}))
										}
										disabled={pageable.page === 0}
								>
									<i className="fas fa-chevron-left text-gray-700"/>
								</button>
								<span className="text-gray-600">
              {pageable.page + 1} / {totalPages}
            </span>
								<button
										className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-40"
										onClick={() =>
												setPageable((prev) => ({...prev, page: prev.page + 1}))
										}
										disabled={pageable.page + 1 >= totalPages}
								>
									<i className="fas fa-chevron-right text-gray-700"/>
								</button>
							</div>
					)}
				</div>
			</div>
	);
};

export default HistoryPanel;