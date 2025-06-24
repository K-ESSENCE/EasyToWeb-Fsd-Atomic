import React from "react";

interface CenteredStatusProps {
	type: "loading" | "error" | "empty";
	message?: string;
}

const icons = {
	loading: <i className="fas fa-spinner fa-spin text-3xl mb-3"/>,
	error: <i className="fas fa-exclamation-circle text-3xl text-red-500 mb-3"/>,
	empty: <i className="fas fa-folder-open text-4xl mb-3 text-gray-400"/>,
};

const CenteredStatus = (
		{
			type,
			message = ""
		}: CenteredStatusProps
) => {
	return (
			<div className="flex flex-col items-center justify-center h-full text-sm text-gray-500 py-16">
				{icons[type]}
				<p>{message}</p>
			</div>
	);
};

export default CenteredStatus;