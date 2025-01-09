import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { CardStyleI } from './../../utils/constants';
import { TextStyleI } from '../types/common/layoutStyle';

interface DefaultProps {
  shapeStyleValues: CardStyleI;
  itemKey: string;
  titleStyle?: TextStyleI;
  describe?: TextStyleI;
}

const EditableCard = ({ shapeStyleValues, titleStyle, describe, itemKey }: DefaultProps) => {
  const [selectedImageData, setSelectedImageData] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files as FileList)[0];

    if (file) {
      setSelectedImageData(URL.createObjectURL(file));
    } else {
      return;
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
          cursor-pointer
          ${selectedImageData ? 'bg-transparent' : 'bg-[#f0f0f0]'}
        `}
        htmlFor={itemKey}
        style={{
          width: shapeStyleValues?.width,
          height: shapeStyleValues?.height,
          borderRadius: `${shapeStyleValues.borderRadius}%`,
        }}
      >
        {selectedImageData && (
          <Image
            width={parseInt(shapeStyleValues.width)}
            height={parseInt(shapeStyleValues.height)}
            src={selectedImageData}
            alt="selectedImg"
            className={`
              object-cover w-full h-full
            `}
            style={{
              borderRadius: `${shapeStyleValues.borderRadius}%`,
            }}
          />
        )}
      </label>
    </>
  );
};

export default EditableCard;
