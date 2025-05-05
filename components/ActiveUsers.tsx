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

interface ActiveUsersProps {
  awareness: Awareness;
  layoutDatas: SectionData[]; // 실제 타입으로 변경 필요
}

function ActiveUsers({ awareness, layoutDatas }: ActiveUsersProps) {
  const [activeUsers, setActiveUsers] = useState<AwarenessState[]>([]);

  useEffect(() => {
    // awareness 변경사항 감지
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

  return (
    <div className="active-users text-black">
      <h3 className="text-lg font-semibold mb-2">현재 활성 사용자</h3>
      <ul className="space-y-2">
        {activeUsers.map(({ user, selection }) => (
          <li key={user.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <span>{user.name}</span>
            </div>
            {selection.sectionKey && (
              <div className="text-sm text-gray-600 ml-5">
                {getSelectionInfo(selection)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActiveUsers;
