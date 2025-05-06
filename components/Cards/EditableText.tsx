import React from "react";

interface EditableTextProps {
  textContent: string;
  onTextChange: (newText: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
  textContent,
  onTextChange,
}) => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden p-4">
      <div className="w-full max-w-xl">
        <div
          contentEditable
          className="text-lg text-gray-800 mb-4 focus:outline-none"
          onBlur={(e) => onTextChange(e.currentTarget.textContent || "")}
          suppressContentEditableWarning={true}
        >
          {textContent}
        </div>
        <p className="text-gray-600">
          텍스트의 크기, 줄 간격, 자간 등을 오른쪽 사이드바에서 조절할 수
          있습니다.
        </p>
      </div>
    </div>
  );
};

export default EditableText;
