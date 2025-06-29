import { useState, useRef, useEffect } from "react";

export const HelpPopover = () => {
	const [show, setShow] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setShow(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	return (
			<div className="absolute -top-5 -right-4 z-10" ref={ref}>
				<button
						onClick={() => setShow((prev) => !prev)}
						className="text-gray-400 hover:text-blue-500 p-0 m-0"
						title="도움말"
				>
					<i className="fas fa-question-circle text-md"/>
				</button>

				{show && (
						<div
								className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-3 text-sm text-gray-700 z-50">
							<p>
								이 영역은 텍스트 또는 이미지를 편집할 수 있어요. 선택 후 우측
								사이드바에서 세부 설정이 가능합니다.
							</p>
							<div
									className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 z-[-1]"/>
						</div>
				)}
			</div>
	);
};