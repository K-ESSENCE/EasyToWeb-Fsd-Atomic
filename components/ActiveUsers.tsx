import React, {useEffect, useState} from "react";
import {Awareness} from "y-protocols/awareness";
import {Section} from "./types/common/layout";
import {AwarenessState, UploadStatus, Selection} from "./types/common/status";


interface ActiveUsersProps {
	awareness: Awareness;
	sections: Section[];
	uploadStatus: { [itemKey: string]: UploadStatus };
}

function ActiveUsers({
	                     awareness,
	                     sections,
	                     uploadStatus,
                     }: ActiveUsersProps) {
	const [activeUsers, setActiveUsers] = useState<AwarenessState[]>([]);

	useEffect(() => {
		// awareness 변경사항 감지
		setActiveUsers(
				Array.from(awareness.getStates().values()) as AwarenessState[]
		);

		const handleChange = () => {
			const states = Array.from(
					awareness.getStates().values()
			) as AwarenessState[];

			setActiveUsers(states);
		};

		awareness.on("change", handleChange);
		return () => awareness.off("change", handleChange);
	}, [awareness]);

	const getSelectionInfo = (selection: Selection) => {
		if (!selection.sectionKey) return null;

		const sectionName = `섹션 ${sections.findIndex((section) => section.sectionKey === selection.sectionKey) + 1}`;

		return selection.itemKey
				? `${sectionName} - 아이템 편집 중`
				: `${sectionName} 선택`;
	};

	const getItemInfo = (itemKey: string | null) => {
		if (!itemKey) return null;
		for (const section of sections) {
			const item = section.items.find((v) => v.id === itemKey);
			if (item) {
				return item.type;
			}
		}
		return null;
	};

	return (
			<div className="active-users text-black">
				<h3 className="text-lg font-semibold mb-2">현재 활성 사용자</h3>
				<ul className="space-y-2">
					{activeUsers.map(({user, selection}) => {
						const isUploading =
								selection.itemKey && uploadStatus[selection.itemKey]?.uploading;
						const itemType = getItemInfo(selection.itemKey);
						return (
								<li key={user.id} className="flex flex-col gap-1">
									<div className="flex items-center gap-2">
                <span
		                className="w-3 h-3 rounded-full"
		                style={{backgroundColor: user.color}}
                />
										<span>{user.name}</span>
										{selection.itemKey && itemType && (
												<span className="ml-2 text-xs text-gray-500">
                    ({itemType} 편집 중)
                  </span>
										)}
										{isUploading && (
												<span className="ml-2 text-xs text-blue-500 animate-pulse">
                    (업로드 중)
                  </span>
										)}
									</div>
									{selection.sectionKey && (
											<div className="text-sm text-gray-600 ml-5">
												{getSelectionInfo(selection)}
											</div>
									)}
								</li>
						);
					})}
				</ul>
			</div>
	);
}

export default ActiveUsers;
