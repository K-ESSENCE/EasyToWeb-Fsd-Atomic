import { createPortal } from "react-dom";
import CenteredStatus from "./CenteredStatus";

type BackgroundType = "white" | "black" | "light" | "dark";

type PageLoaderProps = {
	message?: string;
	background?: BackgroundType;
};

const backgroundClassMap: Record<BackgroundType, string> = {
	white: "bg-white opacity-100",
	black: "bg-black opacity-100",
	light: "bg-black opacity-20",
	dark: "bg-black opacity-60",
};

const textColorMap: Record<BackgroundType, string> = {
	white: "text-gray-900",
	black: "text-white",
	light: "text-white",
	dark: "text-white",
};

const PageLoader = ({ message = "", background = "dark" }: PageLoaderProps) => {
	if (typeof window === "undefined") return null;

	const bgClass = backgroundClassMap[background];
	const textClass = textColorMap[background];

	return createPortal(
			<div className="fixed inset-0 z-50 flex items-center justify-center">
				<div className={`absolute inset-0 ${bgClass}`} />

				<div className={`relative z-10 ${textClass} text-sm`}>
					<CenteredStatus type="loading" message={message} />
				</div>
			</div>,
			document.body
	);
};

export default PageLoader;