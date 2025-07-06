import { LayoutState } from "../store/slices/editor";

const EDITOR_STATE_KEY = "easytoweb_editor_state";

export const saveEditorState = (layoutData: LayoutState) => {
  try {
    localStorage.setItem(EDITOR_STATE_KEY, JSON.stringify(layoutData));
  } catch (error) {
    console.error("에디터 상태 저장 실패:", error);
  }
};

export const loadEditorState = (): LayoutState | null => {
  try {
    const savedState = localStorage.getItem(EDITOR_STATE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error("에디터 상태 불러오기 실패:", error);
    return null;
  }
};
