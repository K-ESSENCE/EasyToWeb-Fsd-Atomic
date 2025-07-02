import React from "react";

interface SelectableFrameProps {
	isItem?: boolean;
	thisKey: string;
	selectedKey: string | null;
	children: React.ReactNode;
	changeKey: (key: string) => void;
}

const SelectableFrame = ({
	                         isItem = false,
	                         thisKey,
	                         selectedKey,
	                         children,
	                         changeKey,
                         }: SelectableFrameProps) => {
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		// 삭제 버튼 클릭 시 이벤트 전파 방지
		if (isItem) {
			changeKey(thisKey);
			e.stopPropagation();
			return;
		}

		changeKey(thisKey);
	};

	// const handleDelete = (e: React.MouseEvent) => {
	//   e.stopPropagation();
	//   onHandleRemove();
	// };

	const isSelected = selectedKey === thisKey;

	return (
			<div
					className={`p-4 rounded-md transition-all duration-150 ease-in-out
    ${isSelected ? "ring-2 ring-offset-2 ring-green-400 bg-green-50" : "ring-1 ring-transparent"}
    hover:ring-2 hover:ring-blue-400 hover:bg-blue-50`}
					onClick={handleClick}
			>
				<div>{children}</div>
			</div>
	);
};

export default SelectableFrame;
