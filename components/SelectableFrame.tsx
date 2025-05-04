interface DefalutProps {
  isItem?: boolean;
  thisKey: string;
  selectedKey: string | null;
  children: React.ReactNode;
  changeKey: (key: string) => void;
}

const SelectableFrame = ({
  isItem = false,
  thisKey,
  selectedKey,
  children,
  changeKey,
}: DefalutProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 삭제 버튼 클릭 시 이벤트 전파 방지
    if (isItem) {
      changeKey(thisKey);
      e.stopPropagation();
      return;
    }

    changeKey(thisKey);
  };

  // const handleDelete = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onHandleRemove();
  // };

  const isSelected = selectedKey === thisKey;

  return (
    <div
      className={`mt-5 p-4
        ${isSelected ? "border-4 border-[#39ff14]" : "border-4 border-transparent"}
        hover:${isSelected ? "border-[#39ff14]" : "border-[#007bff]"}
      `}
      onClick={handleClick}
    >
      <div>{children}</div>
    </div>
  );
};

export default SelectableFrame;
