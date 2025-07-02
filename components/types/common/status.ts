// 기타 상태
export interface UploadStatus {
	uploading: boolean;
	progress: number;
	error: string | null;
}

export interface TextEditStatus {
	editing: boolean;
	text: string;
}

export interface AwarenessState {
	user: User;
	selection: Selection;
}

export interface Selection {
	sectionKey: string | null;
	itemKey: string | null;
}

export interface User {
	name: string;
	color: string;
	id: string;
}

export const PERMISSION_ORDER = {
	OWNER: 3,
	ADMIN: 2,
	EDIT: 1,
	READ_ONLY: 0,
} as const;

export type Permission = keyof typeof PERMISSION_ORDER;