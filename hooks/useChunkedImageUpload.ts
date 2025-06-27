import { useState } from "react";
import apiHandler from "../shared/api/axios";

interface UploadStatus {
	uploading: boolean;
	progress: number;
	error: string | null;
}

interface UploadResult {
	fileId?: string;
	fileUrl?: string;
	error?: string;
}

const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB

export const upload = async (
		file: File,
		onUploadStart?: (status: UploadStatus) => void,
		onChunkUploaded?: (status: UploadStatus) => void,
		onUploadComplete?: (status: UploadStatus) => void,
		onUploadFailed?: (status: UploadStatus) => void,
): Promise<UploadResult> => {
	if (!file) return { error: "No file provided" };

	const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
	const tempId = crypto.randomUUID();
	let lastFileUrl: string | undefined;
	let lastFileId: string | undefined;

	onUploadStart?.({uploading: true, progress: 0, error: null});

	try {
		for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
			const start = chunkIndex * CHUNK_SIZE;
			const end = Math.min(start + CHUNK_SIZE, file.size);
			const blob = file.slice(start, end);

			const info = {
				id: tempId,
				chunkNumber: chunkIndex,
				totalChunks: totalChunks,
				fileName: file.name,
				contentType: file.type,
				fileSize: file.size,
			};

			const formData = new FormData();
			formData.append(
					"info",
					new Blob([JSON.stringify(info)], { type: "application/json" })
			);
			formData.append("file", blob, file.name);

			const response = await apiHandler.uploadFileFormData(formData);
			if (response?.data?.fileUrl) {
				lastFileUrl = response?.data?.fileUrl;
			}

			if (response?.data?.fileId) {
				lastFileId = response?.data?.fileId
			}

			const currentStatus = {
				uploading: true,
				progress: Math.round(((chunkIndex + 1) / totalChunks) * 100),
				error: null,
			};
			onChunkUploaded?.(currentStatus);
		}

		onUploadComplete?.({ uploading: false, progress: 100, error: null })
		return { fileId: lastFileId, fileUrl: lastFileUrl };

	} catch (err) {
		console.error("업로드 실패:", err);
		const error = "업로드 실패";
		onUploadFailed?.({ uploading: false, progress: 0, error })
		return { error };
	}
};


export const useChunkedImageUpload = () => {
	const [status, setStatus] = useState<UploadStatus>({
		uploading: false,
		progress: 0,
		error: null,
	});


	const uploadImage = async (
			file: File,
			onChunkUploaded?: (status: UploadStatus) => void
	): Promise<UploadResult> => {
		return upload(
				file,
				(status) => {
					setStatus(status)
				},
				(status) => {
					setStatus(status);
					onChunkUploaded?.(status);
				},
				(status) => {
					setStatus(status)
				},
				(status) => {
					setStatus(status)
				},
		);
	}

	return { uploadImage, status };
}

