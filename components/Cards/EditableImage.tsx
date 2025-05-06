import React, { ChangeEvent } from "react";
import Image from "next/image";
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
}

const EditableImage: React.FC<EditableImageProps> = ({
  imageUrl,
  onImageChange,
  shapeStyleValues,
  itemKey,
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

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files as FileList)[0];
    if (file) {
      dispatch(
        setImageUploadStatus({
          itemKey,
          status: { uploading: true, progress: 0, error: null },
        })
      );
      // info 객체 예시 (실제 값으로 대체)
      const info = {
        id: itemKey,
        chunkNumber: 1,
        totalChunks: 1,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      };
      try {
        const res = await apiHandler.uploadFile({
          file,
          info,
          onUploadProgress: (event) => {
            if (event.total) {
              dispatch(
                setImageUploadStatus({
                  itemKey,
                  status: {
                    progress: Math.round((event.loaded / event.total) * 100),
                  },
                })
              );
            }
          },
        });
        dispatch(
          setImageUploadStatus({
            itemKey,
            status: { uploading: false, progress: 100 },
          })
        );
        onImageChange(
          file,
          (res as { url?: string }).url || URL.createObjectURL(file)
        );
      } catch {
        dispatch(
          setImageUploadStatus({
            itemKey,
            status: { uploading: false, error: "업로드 실패" },
          })
        );
      }
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
          <Image
            width={parseInt(shapeStyleValues.width)}
            height={parseInt(shapeStyleValues.height)}
            src={imageUrl}
            className="object-cover w-full h-full"
            alt={`${itemKey} image`}
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
