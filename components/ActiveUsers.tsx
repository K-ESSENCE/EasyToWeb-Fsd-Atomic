import React, { useEffect, useState } from "react";
import { Awareness } from "y-protocols/awareness";
import { SectionData } from "./types/common/layoutStyle";

interface User {
  name: string;
  color: string;
  id: string;
}

interface Selection {
  sectionKey: string | null;
  itemKey: string | null;
}

interface AwarenessState {
  user: User;
  selection: Selection;
}

interface UploadStatus {
  uploading: boolean;
  progress: number;
  error: string | null;
}

interface ActiveUsersProps {
  awareness: Awareness;
  layoutDatas: SectionData[]; // 실제 타입으로 변경 필요
  uploadStatus: { [itemKey: string]: UploadStatus };
}

function ActiveUsers({
  awareness,
  layoutDatas,
  uploadStatus,
}: ActiveUsersProps) {
  const [activeUsers, setActiveUsers] = useState<AwarenessState[]>([]);

  useEffect(() => {
    // awareness 변경사항 감지
    setActiveUsers(
      Array.from(awareness.getStates().values()) as AwarenessState[]
    );

    const handleChange = () => {
      const states = Array.from(
        awareness.getStates().values()
      ) as AwarenessState[];

      setActiveUsers(states);
    };

    awareness.on("change", handleChange);
    return () => awareness.off("change", handleChange);
  }, [awareness]);

  const getSelectionInfo = (selection: Selection) => {
    if (!selection.sectionKey) return null;

    const sectionName = `섹션 ${layoutDatas.findIndex((section) => section.sectionKey === selection.sectionKey) + 1}`;

    return selection.itemKey
      ? `${sectionName} - 아이템 편집 중`
      : `${sectionName} 선택`;
  };

  const getItemInfo = (itemKey: string | null) => {
    if (!itemKey) return null;
    for (const section of layoutDatas) {
      const item = section.layoutValues.find((v) => v.id === itemKey);
      if (item) {
        return item.layoutName;
      }
    }
    return null;
  };

  return (
    <div className="active-users text-black">
      <h3 className="text-lg font-semibold mb-2">현재 활성 사용자</h3>
      <ul className="space-y-2">
        {activeUsers.map(({ user, selection }) => {
          const isUploading =
            selection.itemKey && uploadStatus[selection.itemKey]?.uploading;
          const itemType = getItemInfo(selection.itemKey);
          return (
            <li key={user.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <span>{user.name}</span>
                {selection.itemKey && itemType && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({itemType} 편집 중)
                  </span>
                )}
                {isUploading && (
                  <span className="ml-2 text-xs text-blue-500 animate-pulse">
                    (업로드 중)
                  </span>
                )}
              </div>
              {selection.sectionKey && (
                <div className="text-sm text-gray-600 ml-5">
                  {getSelectionInfo(selection)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActiveUsers;
