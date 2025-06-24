import {UseModalReturnType} from "../hooks/useModal";
import apiHandler from "../shared/api/axios";
import {ProjectHistory} from "../shared/api/types";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

export interface HistoryPanelProps {
	modal: UseModalReturnType,
	projectId: string
}

const HistoryPanel = (
		{
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

	const getHistoryList = async () => {
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
			// 생략
		}
	};

	useEffect(() => {
		getHistoryList();

	}, [pageable.page]);

	const totalPages = Math.ceil(totalCount / pageable.size);

	const getRelativeTime = (editTime: string) => {
		const now = dayjs();
		const time = dayjs(editTime);
		const diffMin = now.diff(time, 'minute');
		if (diffMin < 1) return '방금 전';
		if (diffMin < 60) return `${diffMin}분 전`;
		const diffHour = now.diff(time, 'hour');
		if (diffHour < 24) return `${diffHour}시간 전`;
		const diffDay = now.diff(time, 'day');
		return `${diffDay}일 전`;
	};

	return (
			<div className="fixed inset-0 flex justify-end z-50">
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
					<ul className="space-y-3">
						{historyList.length > 0 ? (
								historyList.map((item, index) => (
										<li
												key={index}
												className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
										>
											<div
													className="text-sm font-medium text-gray-800 mb-1 truncate"
													title={item.editor.join(", ")}
											>
												작성자: {item.editor[0]}
												{item.editor.length > 1 && ` 외 ${item.editor.length - 1}명`}
											</div>
											<div className="text-xs text-gray-500">
												수정 시간: {dayjs(item.editTime).format('YYYY.MM.DD HH:mm')} ({getRelativeTime(item.editTime)})
											</div>
										</li>
								))
						) : (
								<div className="text-sm text-gray-500">기록이 없습니다.</div>
						)}
					</ul>

					{totalPages > 1 && (
							<div className="flex justify-between items-center mt-6 text-sm">
								<button
										className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-40"
										onClick={() =>
												setPageable((prev) => ({ ...prev, page: prev.page - 1 }))
										}
										disabled={pageable.page === 0}
								>
									<i className="fas fa-chevron-left text-gray-700" />
								</button>
								<span className="text-gray-600">
      {pageable.page + 1} / {totalPages}
    </span>
								<button
										className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-40"
										onClick={() =>
												setPageable((prev) => ({ ...prev, page: prev.page + 1 }))
										}
										disabled={pageable.page + 1 >= totalPages}
								>
									<i className="fas fa-chevron-right text-gray-700" />
								</button>
							</div>
					)}
				</div>
			</div>
	);
};


export default HistoryPanel;