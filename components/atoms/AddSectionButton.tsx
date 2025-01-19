
interface AddSectionButtonProps {
  onClick: () => void;
  isResponsive: boolean;
}

const AddSectionButton = ({ onClick, isResponsive }: AddSectionButtonProps) => (
    <div
      className={`
        flex items-center justify-center
        min-w-[383px] h-[160px]
        bg-white p-8
        rounded-xl shadow-md
        border border-gray-100 hover:border-blue-200
        transition-colors
        text-gray-600 text-center text-lg
        cursor-pointer
        ${isResponsive ? 'w-full' : ''}
      `}
    onClick={onClick}
    >
      섹션 추가 하기
    </div>
  );

export default AddSectionButton;
