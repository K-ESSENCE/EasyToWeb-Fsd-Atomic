import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FULL_API_URL } from "../../shared/api/axios";
import { RootState } from "../../store/configureStore";
import { setImageUploadStatus } from "../../store/slices/editor";
import { useChunkedImageUpload } from "../../hooks/useChunkedImageUpload";
import { Item } from "../types/common/layout";

interface EditableImageProps {
	item: Item;
	onImageChange: (file: File, imageUrl: string) => void;
}

const EditableImage = ({ item, onImageChange }: EditableImageProps) => {
	const dispatch = useDispatch();
	const { uploadImage } = useChunkedImageUpload();

	const uploadStatus = useSelector(
			(state: RootState) =>
					state.layouts.uploadStatus[item.id] || {
						uploading: false,
						progress: 0,
						error: null,
					}
	);

	const imageProps = item.type === "img" ? item.componentProps : null;
	const imageStyle = imageProps?.imageStyle || {};
	const commonStyle = item.commonStyle || {};

	const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		dispatch(
				setImageUploadStatus({
					itemKey: item.id,
					status: { uploading: true, progress: 0, error: null },
				})
		);

		const result = await uploadImage(file, (progress) => {
			dispatch(
					setImageUploadStatus({
						itemKey: item.id,
						status: { uploading: true, progress: progress.progress, error: null },
					})
			);
		});

		dispatch(
				setImageUploadStatus({
					itemKey: item.id,
					status: { uploading: false, progress: 100, error: null },
				})
		);

		if (result.fileUrl) {
			onImageChange(file, result.fileUrl);
		} else {
			dispatch(
					setImageUploadStatus({
						itemKey: item.id,
						status: { uploading: false, progress: 0, error: "업로드 실패" },
					})
			);
		}
	};

	const labelStyle: React.CSSProperties = {
		width: commonStyle.width || "200px",
		height: commonStyle.height || "160px",
		margin: commonStyle.margin,
		padding: commonStyle.padding,
		backgroundColor: commonStyle.backgroundColor || "#f9f9f9",
		borderRadius: commonStyle.borderRadius || `${imageStyle.borderRadius ?? 0}px`,
		borderColor: imageStyle.borderColor || "#e5e7eb",
		borderWidth: imageStyle.borderWidth ?? 0,
		borderStyle: imageStyle.borderStyle || "dashed",
		boxShadow: imageStyle.boxShadow || "none",
		aspectRatio: imageStyle.aspectRatio || undefined,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		overflow: "hidden",
		transition: "transform 0.2s ease, opacity 0.2s ease",
		minWidth: '150px',
		minHeight: '150px'
	};

	const imageStyleOnly: React.CSSProperties = {
		width: "100%",
		height: "100%",
		objectFit: imageStyle.objectFit || "cover",
		borderRadius: `${imageStyle.borderRadius ?? 0}px`,
		opacity: imageStyle.opacity ?? 1,
	};

	return (
			<>
				<input
						id={item.id}
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="hidden"
						disabled={uploadStatus.uploading}
				/>
				<label
						htmlFor={item.id}
						className={`relative ${uploadStatus.uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
						style={labelStyle}
				>
					{uploadStatus.uploading && (
							<div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10">
								<span className="text-blue-500 mb-2">업로드 중... {uploadStatus.progress}%</span>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
											className="bg-blue-500 h-2 rounded-full"
											style={{ width: `${uploadStatus.progress}%` }}
									/>
								</div>
							</div>
					)}

					{!uploadStatus.uploading && imageProps?.url && (
							<img
									src={`${FULL_API_URL}${imageProps.url}`}
									alt="업로드 이미지"
									style={imageStyleOnly}
							/>
					)}

					{!uploadStatus.uploading && !imageProps?.url && (
							<div className="flex flex-col items-center justify-center text-gray-500">
								<i className="fas fa-plus text-2xl mb-2" />
								<span className="text-sm">이미지 추가하기</span>
							</div>
					)}

					{uploadStatus.error && (
							<div className="absolute inset-0 flex items-center justify-center z-20">
								<div className="bg-white/90 text-red-500 font-bold text-xs px-4 py-2 rounded shadow">
									{uploadStatus.error}
								</div>
							</div>
					)}
				</label>
			</>
	);
};

export default EditableImage;