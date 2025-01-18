import { MenuHeaderProps } from '../types';

export const MenuHeader = ({ title, onClose }: MenuHeaderProps) => (
  <div className="mt-[64px] px-4 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    <button 
      onClick={() => onClose()}
      className="text-gray-500 hover:text-gray-700 transition-colors relative group"
      title="닫기"
    >
      <i className="fas fa-times"></i>
    </button>
  </div>
);
