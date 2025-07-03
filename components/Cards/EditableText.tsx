import React, {useEffect, useRef} from "react";
import {Item} from "../types/common/layout";

interface EditableTextProps {
  item: Item;
  onTextChange: (newText: string) => void;
}

const EditableText = ({ item, onTextChange }: EditableTextProps) => {
  const textProps = item.type === "text" ? item.componentProps : null;
  const textStyle = textProps?.textStyle || {};
  const commonStyle = item.commonStyle || {};
  const divRef = useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = {
    fontSize: textStyle.size,
    color: textStyle.color,
    fontWeight: textStyle.bold ? "bold" : "normal",
    fontStyle: textStyle.italic ? "italic" : "normal",
    textDecoration: textStyle.underline ? "underline" : "none",
    textAlign: textStyle.align,
    lineHeight: textStyle.lineHeight,
    letterSpacing: textStyle.letterSpacing,
    fontFamily: textStyle.fontFamily,
    width: commonStyle.width,
    height: commonStyle.height,
    margin: commonStyle.margin,
    padding: commonStyle.padding,
    borderRadius: commonStyle.borderRadius,
    backgroundColor: commonStyle.backgroundColor,
    minHeight: "1.5em",
    minWidth: "1.5em",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    outline: 'none'
  };

  useEffect(() => {
    if (divRef.current) {
      if (!textProps?.text || textProps.text.trim() === "") {
        divRef.current.innerHTML = "<br />";
      } else {
        divRef.current.innerText = textProps.text;
      }
    }
  }, [textProps?.text]);

  const handleBlur = () => {
    const text = divRef.current?.innerText || "";
    onTextChange(text);
  };

  return (
      <div className="w-full h-full overflow-hidden">
        <div className="w-full">
          <div
              ref={divRef}
              contentEditable
              onBlur={handleBlur}
              style={style}
              className="text-gray-800"
              suppressContentEditableWarning
          />
        </div>
      </div>
  );
};

export default EditableText;
