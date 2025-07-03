import React from "react";
import {UseModalReturnType} from "../hooks/useModal";
import {createPortal} from "react-dom";

interface BaseModalProps {
	modal: UseModalReturnType;
	children: React.ReactNode;
	widthClass?: string; // optional: 너비 조정
}

const BaseModal = ({modal, children, widthClass = "max-w-md"}: BaseModalProps) => {
	if (!modal.show || typeof window === "undefined") return null;

	return createPortal(
			<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					onClick={modal.close}
			>
				<div
						className={`relative z-10 w-full ${widthClass} bg-white rounded-xl shadow-2xl flex flex-col max-h-full overflow-hidden`}
						onClick={e => e.stopPropagation()}
				>
					<button
							onClick={modal.close}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
							aria-label="close"
					>
						<i className="fas fa-times"/>
					</button>

					<div className="overflow-y-auto flex-1 p-6">
						{children}
					</div>
				</div>
			</div>,
			document.body
	);
};

export default BaseModal;