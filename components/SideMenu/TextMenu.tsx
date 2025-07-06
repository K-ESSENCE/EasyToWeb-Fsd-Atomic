import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTextStyle } from "../../store/slices/editor";
import { Item, TextProps } from "../types/common/layout";
import { RootState } from "../../store/configureStore";

interface TextMenuProps {
  item: Item;
}

const TextMenu = ({ item }: TextMenuProps) => {
  const dispatch = useDispatch();
  const nowSectionKey = useSelector(
    (state: RootState) => state.keys.nowSectionKey
  );
  const textStyle =
    item.type === "text"
      ? (item.componentProps as TextProps).textStyle || {}
      : {};

  const handleChange = (style: Partial<typeof textStyle>) => {
    dispatch(
      updateTextStyle({
        sectionKey: nowSectionKey,
        itemId: item.id,
        style,
      })
    );
  };

  return (
    <div className="space-y-6">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        텍스트 스타일
      </h4>

      {/* 글자 크기 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">글자 크기</label>
        <input
          type="text"
          value={textStyle.size || ""}
          onChange={(e) => handleChange({ size: e.target.value })}
          placeholder="예: 16px"
          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
        />
      </div>

      {/* 색상 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">색상</label>
        <input
          type="color"
          value={textStyle.color || "#000000"}
          onChange={(e) => handleChange({ color: e.target.value })}
          className="w-10 h-8 p-0 border border-gray-300 rounded"
        />
      </div>

      {/* 정렬 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">정렬</label>
        <select
          value={textStyle.align || "left"}
          onChange={(e) =>
            handleChange({
              align: e.target.value as "left" | "center" | "right",
            })
          }
          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="left">왼쪽</option>
          <option value="center">중앙</option>
          <option value="right">오른쪽</option>
        </select>
      </div>

      {/* 줄 간격 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">줄 간격</label>
        <input
          type="text"
          value={textStyle.lineHeight || ""}
          onChange={(e) => handleChange({ lineHeight: e.target.value })}
          placeholder="예: 1.5"
          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
        />
      </div>

      {/* 글자 간격 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">자간</label>
        <input
          type="text"
          value={textStyle.letterSpacing || ""}
          onChange={(e) => handleChange({ letterSpacing: e.target.value })}
          placeholder="예: 0.5px"
          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
        />
      </div>

      {/* 글꼴 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">글꼴</label>
        <input
          type="text"
          value={textStyle.fontFamily || ""}
          onChange={(e) => handleChange({ fontFamily: e.target.value })}
          placeholder="예: Arial, Pretendard"
          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
        />
      </div>

      {/* 강조 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">굵게</label>
        <input
          type="checkbox"
          checked={textStyle.bold || false}
          onChange={(e) => handleChange({ bold: e.target.checked })}
        />
      </div>

      {/* 기울임 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">기울임</label>
        <input
          type="checkbox"
          checked={textStyle.italic || false}
          onChange={(e) => handleChange({ italic: e.target.checked })}
        />
      </div>

      {/* 밑줄 */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-gray-700 w-24">밑줄</label>
        <input
          type="checkbox"
          checked={textStyle.underline || false}
          onChange={(e) => handleChange({ underline: e.target.checked })}
        />
      </div>
    </div>
  );
};

export default TextMenu;
