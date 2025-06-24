import React from "react";
import CenteredStatus from "./CenteredStatus";

interface PageLoaderProps {
	message?: string
}

const PageLoader = ({
	                    message = ""
                    }: PageLoaderProps) => {
	return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
				<div className="flex flex-col items-center text-gray-100 text-sm">
					<CenteredStatus type={'loading'} message={message}/>
				</div>
			</div>
	);
};

export default PageLoader;