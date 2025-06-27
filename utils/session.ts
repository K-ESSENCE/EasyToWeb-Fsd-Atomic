interface AccountInfo {
	id: string;
	nickname: string;
	email: string;
	profileUrl:string;
}

export const saveSessionToLocal = (
		accessToken: string,
		account: AccountInfo
) => {
	localStorage.setItem("accessToken", accessToken);
	localStorage.setItem("account", JSON.stringify(account));
}

export const updateAccountToLocal = (account: AccountInfo) => {
	localStorage.setItem("account", JSON.stringify(account));
}

export const updateTokenToLocal = (
		accessToken: string,
) => {
	localStorage.setItem("accessToken", accessToken);
}

export const getAccessTokenFromLocal = () => {
	return localStorage.getItem("accessToken");
}

export const getAccountInfoFromLocal = () => {
	const accountStr = localStorage.getItem("account");
	if (!accountStr) return;

	return JSON.parse(accountStr) as AccountInfo;
}


export const clearSessionInLocal = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("account");
}

export const isLogin = () => {
	return !!getAccessTokenFromLocal()
}
