import React, { ChangeEvent } from "react";
import { CardStyleI } from "./../../utils/constants";
import apiHandler from "../../shared/api/axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/configureStore";
import { setImageUploadStatus } from "../../store/slices/layouts";

interface EditableImageProps {
  imageUrl: string | null | undefined;
  onImageChange: (file: File, imageUrl: string) => void;
  shapeStyleValues: CardStyleI;
  itemKey: string;
  imageUrlsMap: Map<string, string>;
}

const EditableImage: React.FC<EditableImageProps> = ({
  imageUrl,
  onImageChange,
  shapeStyleValues,
  itemKey,
  imageUrlsMap,
}) => {
  const dispatch = useDispatch();
  const uploadStatus = useSelector(
    (state: RootState) =>
      state.layouts.uploadStatus[itemKey] || {
        uploading: false,
        progress: 0,
        error: null,
      }
  );
  const imageStyle = useSelector(
    (state: RootState) => state.layouts.imageStyles[itemKey] || {}
  );

  const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files as FileList)[0];
    if (!file) return;

    dispatch(
      setImageUploadStatus({
        itemKey,
        status: { uploading: true, progress: 0, error: null },
      })
    );

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const tempId = crypto.randomUUID();
    let lastFileUrl: string | undefined = undefined;

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
        const fileUrl = response?.data?.fileUrl;
        if (fileUrl) {
          lastFileUrl = fileUrl;
          onImageChange(file, fileUrl);
        }

        dispatch(
          setImageUploadStatus({
            itemKey,
            status: {
              uploading: true,
              progress: Math.round(((chunkIndex + 1) / totalChunks) * 100),
              error: null,
            },
          })
        );
      }

      dispatch(
        setImageUploadStatus({
          itemKey,
          status: { uploading: false, progress: 100, error: null },
        })
      );
      if (lastFileUrl) {
        if (imageUrlsMap) imageUrlsMap.set(itemKey, lastFileUrl);
        onImageChange(file, lastFileUrl);
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      dispatch(
        setImageUploadStatus({
          itemKey,
          status: { uploading: false, progress: 0, error: "업로드 실패" },
        })
      );
    }
  };

  // 스타일 병합
  const borderRadius =
    imageStyle.borderRadius !== undefined
      ? imageStyle.borderRadius
      : shapeStyleValues.borderRadius;

  return (
    <>
      <input
        className="hidden"
        onChange={handleImageChange}
        id={itemKey}
        type="file"
        accept="image/*"
        disabled={uploadStatus.uploading}
      />
      <label
        className={`relative ${uploadStatus.uploading ? "pointer-events-none opacity-60" : ""} cursor-pointer flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors`}
        htmlFor={itemKey}
        style={{
          width: shapeStyleValues?.width,
          height: shapeStyleValues?.height,
          backgroundColor: imageStyle.backgroundColor,
          borderColor: imageStyle.borderColor,
          borderWidth: imageStyle.borderWidth,
          borderStyle: imageStyle.borderStyle,
          borderRadius: `${borderRadius}%`,
        }}
      >
        {uploadStatus.uploading && (
          <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center z-10">
            <span className="text-blue-500 mb-2">
              업로드 중... {uploadStatus.progress}%
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${uploadStatus.progress}%` }}
              />
            </div>
          </div>
        )}
        {!uploadStatus.uploading && imageUrl ? (
          <img
            alt={`${itemKey} image`}
            width={parseInt(shapeStyleValues.width)}
            height={parseInt(shapeStyleValues.height)}
            src={`https://dev-api.easytoweb.store${imageUrl}`}
            className="object-cover w-full h-full"
            style={{
              borderRadius: `${borderRadius}%`,
            }}
          />
        ) : null}
        {!uploadStatus.uploading && !imageUrl && (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <i className="fas fa-plus text-2xl mb-2"></i>
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
