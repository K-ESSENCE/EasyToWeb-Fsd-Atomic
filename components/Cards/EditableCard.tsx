import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { CardStyleI } from './../../utils/constants';
import { TextStyleI } from '../types/common/layoutStyle';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';

interface DefaultProps {
  shapeStyleValues: CardStyleI;
  itemKey: string;
  titleStyle?: TextStyleI;
  describe?: TextStyleI;
}

const EditableCard = ({ shapeStyleValues, titleStyle, describe, itemKey }: DefaultProps) => {
  const [selectedImageData, setSelectedImageData] = useState<string | null>(null);
  const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
  const sections = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
  const currentSection = sections.find(section => section.sectionKey === nowSectionKey);
  const currentItem = currentSection?.layoutValues.find(item => item.id === itemKey);
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files as FileList)[0];

    if (file) {
      setSelectedImageData(URL.createObjectURL(file));
    } else {
      return;
    }
  };

  const imageUrl = selectedImageData || currentItem?.imgValue;

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
          ${imageUrl ? 'bg-transparent' : 'bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors'}
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

export default EditableCard;
