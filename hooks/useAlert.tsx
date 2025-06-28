import {confirmAlert} from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {useState} from "react";


export interface AlertOptions {
	title?: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	disableCancel?: boolean;
	position?: "center" | "right";
	onConfirm?: (input?: string) => void;
	onCancel?: () => void;
	prompt?: boolean; // 입력창 활성화 여부
	defaultValue?: string;
	placeholder?: string;
}

const useAlert = () => {
	return (options: AlertOptions) => {
		confirmAlert({
			overlayClassName: "bg-black/40",
			customUI: ({onClose}) => <AlertUI options={options} onClose={onClose}/>,
		});
	};
};

export default useAlert;

interface AlertUIProps {
	options: AlertOptions,
	onClose: () => void
}

const AlertUI = ({
	                 options,
	                 onClose
                 }: AlertUIProps) => {
	const {
		title = "알림",
		message,
		confirmLabel = "확인",
		cancelLabel = "취소",
		disableCancel = false,
		position = "center",
		onConfirm,
		onCancel,
		prompt = false,
		defaultValue = "",
		placeholder = "",
	} = options;

	const [input, setInput] = useState(defaultValue);

	const handleConfirm = () => {
		onConfirm?.(prompt ? input : undefined);
		onClose();
	};

	return (
			<div
					className={`bg-white p-6 rounded-xl shadow-2xl w-[90vw] sm:w-[400px] min-w-[240px] sm:min-w-[300px] max-w-full text-sm text-gray-800 ${
							position === "right" ? "ml-auto mr-0" : "mx-auto"
					}`}
			>
				<h2 className="text-base font-semibold mb-4">{title}</h2>

				<p className="text-sm text-gray-600 mb-6 whitespace-pre-line">{message}</p>

				{prompt && (
						<input
								type="text"
								placeholder={placeholder}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								className="w-full px-3 py-2 mb-6 border rounded text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
				)}

				<div className="flex justify-end space-x-3">
					{!disableCancel && (
							<button
									onClick={() => {
										onCancel?.();
										onClose();
									}}
									className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
							>
								{cancelLabel}
							</button>
					)}
					<button
							onClick={handleConfirm}
							className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
					>
						{confirmLabel}
					</button>
				</div>
			</div>
	);
};