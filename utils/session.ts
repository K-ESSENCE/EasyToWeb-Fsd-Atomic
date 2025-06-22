export const saveSessionToLocal = (
		accessToken: string,
		account: {
			id: string;
			name: string;
			email: string;
		}
) => {
	localStorage.setItem("accessToken", accessToken);
	localStorage.setItem("userName", account.name);
	localStorage.setItem("userId", account.email);
}

export const updateTokenToLocal = (
		accessToken: string,
) => {
	localStorage.setItem("accessToken", accessToken);
}

export const getAccessTokenFromLocal = () => {
	return localStorage.getItem("accessToken");
}

export const getUserIdFromLocal = () => {
	return localStorage.getItem("userId");
}

export const getUserNameFromLocal = () => {
	return localStorage.getItem("userName");
}

export const clearSessionInLocal = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("userName");
	localStorage.removeItem("userId");
}

export const isLogin = () => {
	return !!getAccessTokenFromLocal()
}
