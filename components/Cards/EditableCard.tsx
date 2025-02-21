import React, { useState, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { CardStyleI } from './../../utils/constants';
import { TextStyleI } from '../types/common/layoutStyle';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { updateImageUrl, updateTextContent } from '../../store/slices/layouts';
import { changeNowItemKey } from '../../store/slices/keys';

interface DefaultProps {
  shapeStyleValues: CardStyleI;
  itemKey: string;
  titleStyle?: TextStyleI;
  describe?: TextStyleI;
}

const EditableCard = ({ shapeStyleValues, titleStyle, describe, itemKey }: DefaultProps) => {
  const [selectedImageData, setSelectedImageData] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>('여기에 텍스트를 입력하세요.');
  const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
  const sections = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
  
  // Find the item across all sections
  const currentItem = sections.flatMap(section => section.layoutValues)
    .find(item => item.id === itemKey);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentItem?.textValue) {
      setTextContent(currentItem.textValue);
    }
  }, [currentItem?.textValue]);

  const handleTextChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || '';
    setTextContent(newText);
    dispatch(updateTextContent({
      sectionKey: nowSectionKey,
      itemId: itemKey,
      textContent: newText
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files as FileList)[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageData(imageUrl);
      dispatch(changeNowItemKey(itemKey));
      dispatch(updateImageUrl({
        sectionKey: nowSectionKey,
        itemId: itemKey,
        imageUrl: imageUrl
      }));
    }
  };

  const imageUrl = selectedImageData || currentItem?.imgValue;

  return (
    <>
      {currentItem?.layoutName === 'text' ? (
        <div 
          className={`w-full h-full rounded-xl overflow-hidden  p-4`}
        >
          <div className="w-full max-w-xl">
            <div
              contentEditable
              className="text-lg text-gray-800 mb-4 focus:outline-none"
              onBlur={handleTextChange}
              suppressContentEditableWarning={true}
            >
              {textContent}
            </div>
            <p className="text-gray-600">텍스트의 크기, 줄 간격, 자간 등을 오른쪽 사이드바에서 조절할 수 있습니다.</p>
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
};

export default EditableCard;
