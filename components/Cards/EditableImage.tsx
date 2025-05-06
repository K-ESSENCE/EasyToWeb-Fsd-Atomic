import React, { ChangeEvent } from "react";
import Image from "next/image";
import { CardStyleI } from "./../../utils/constants";

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
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files as FileList)[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(file, url);
    }
  };

  return (
    <>
      <input
        className="hidden"
        onChange={handleImageChange}
        id={itemKey}
        type="file"
        accept="image/*"
      />
      <label
        className={`
          cursor-pointer flex items-center justify-center
          bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors
        `}
        htmlFor={itemKey}
        style={{
          width: shapeStyleValues?.width,
          height: shapeStyleValues?.height,
          borderRadius: `${shapeStyleValues.borderRadius}%`,
        }}
      >
        {imageUrl ? (
          <Image
            width={parseInt(shapeStyleValues.width)}
            height={parseInt(shapeStyleValues.height)}
            src={imageUrl}
            className="object-cover w-full h-full"
            alt={`${itemKey} image`}
            style={{
              borderRadius: `${shapeStyleValues.borderRadius}%`,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <i className="fas fa-plus text-2xl mb-2"></i>
            <span className="text-sm">이미지 추가하기</span>
          </div>
        )}
      </label>
    </>
  );
};

export default EditableImage;
