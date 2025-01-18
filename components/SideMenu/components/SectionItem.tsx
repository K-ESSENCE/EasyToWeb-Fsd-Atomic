import { SectionItemProps } from '../types';

export const SectionItem = ({ sectionId, isSelected, index, onSelect }: SectionItemProps) => (
  <div 
    key={sectionId}
    className={`p-4 rounded-xl border cursor-pointer transition-colors
      ${isSelected 
        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
        : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    onClick={() => onSelect(sectionId)}
  >
    <div className="flex items-center justify-between">
      <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
        섹션 {index + 1}
      </span>
      {isSelected && (
        <span className="text-blue-600 text-sm">선택됨</span>
      )}
    </div>
  </div>
);
