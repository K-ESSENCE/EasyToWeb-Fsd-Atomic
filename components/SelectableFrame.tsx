import { CardStyleI } from '../utils/constants';
import React from 'react';

interface DefalutProps {
  shapeStyleValues: CardStyleI;
  thisKey: string;
  selectedKey: string | null;
  children: React.ReactNode;
  changeKey: (key: string) => void;
  onHandleRemove: () => void;
}

const SelectableFrame = ({
  shapeStyleValues,
  thisKey,
  selectedKey,
  children,
  changeKey,
  onHandleRemove,
}: DefalutProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const isBackground = (e.target as HTMLElement).classList.contains('bg');
    if (isBackground) {
      changeKey(thisKey);
      return;
    }
  };

  const isSelected = selectedKey === thisKey;

  return (
    <div
      className={`
        relative flex flex-col justify-center gap-5 text-center transition-border duration-400 w-full
        ${isSelected ? 'border-4 border-[#39ff14]' : 'border-4 border-transparent'}
        hover:${isSelected ? 'border-[#39ff14]' : 'border-[#007bff]'}
        group
      `}
      onClick={handleClick}
    >
      {isSelected && (
        <div className="absolute top-[2%] right-[2%] text-base text-black cursor-pointer w-10 ml-auto" onClick={onHandleRemove}>
          삭제
        </div>
      )}
      <div className="invisible group-hover:visible">
        {children}
      </div>
    </div>
  );
};

export default SelectableFrame;
