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
      </div>
    </div>
  );
};

export default EditableText;
