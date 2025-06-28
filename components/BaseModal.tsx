import React from "react";
import {UseModalReturnType} from "../hooks/useModal";
import {createPortal} from "react-dom";

interface BaseModalProps {
	modal: UseModalReturnType;
	children: React.ReactNode;
	widthClass?: string; // optional: 너비 조정
}

const BaseModal = ({ modal, children, widthClass = "max-w-md" }: BaseModalProps) => {
	if (!modal.show || typeof window === "undefined") return null;

	return createPortal(
			<div
					className="fixed inset-0 z-50 flex items-center justify-center"
					onClick={modal.close}
			>
				<div className="absolute inset-0 bg-black bg-opacity-50"/>

				<div
						className={`relative z-10 w-full ${widthClass} bg-white rounded-xl shadow-2xl p-6 pt-10 mx-4`}
						onClick={(e) => e.stopPropagation()}
				>
					<button
							onClick={modal.close}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
							aria-label="close"
					>
						<i className="fas fa-times"/>
					</button>

					<div className="mt-1">
						{children}
					</div>
				</div>
			</div>,
			document.body
	);
};

export default BaseModal;