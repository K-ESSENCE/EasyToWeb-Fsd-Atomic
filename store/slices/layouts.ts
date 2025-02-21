import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LayoutData, LayoutItemValues, SectionData } from "../../components/types/common/layoutStyle";
import { MAX_LAYOUT_VALUE } from "../../utils/constants";
import { saveEditorState } from "../../utils/localStorage";

interface InitialInterface {
  layoutDatas: LayoutData;
}

interface AddSectionPayloadI {
  payload: {
    newSection: SectionData;
  };
}

interface PayLoadI {
  payload: IdPayloadI & LayoutItemPayLoadI;
}

interface IdPayloadI {
  id: string;
}

interface LayoutItemPayLoadI {
  newLayoutItemValue: LayoutItemValues;
}

interface UpdateSectionTitlePayloadI {
  sectionKey: string;
  title: string;
}

interface AddImagePayloadI {
  sectionKey: string;
}

interface UpdateImageUrlPayloadI {
  sectionKey: string;
  itemId: string;
  imageUrl: string;
  
}

interface UpdateTextContentPayloadI {
  sectionKey: string;
  itemId: string;
  textContent: string;
}

const initialState: InitialInterface = {
  layoutDatas: {
    layoutId: 'initial-layout',
    sectionValues: [],
  },
};

const layoutSlice = createSlice({
  name: 'layouts',
  initialState: initialState,
  reducers: {
    addSection: function (state, { payload: { newSection } }: AddSectionPayloadI) {
      state.layoutDatas.sectionValues.push({
        ...newSection,
        title: `섹션 ${state.layoutDatas.sectionValues.length + 1}` // 기본 제목 추가
      });
      saveEditorState(state.layoutDatas);
    },
    deleteSection: (state, { payload }: { payload: IdPayloadI }) => {
      const updatedState = state.layoutDatas.sectionValues.filter(
        (section) => section.sectionKey !== payload.id,
      );
      state.layoutDatas.sectionValues = updatedState;
      saveEditorState(state.layoutDatas);
    },
    updateSectionTitle: (state, { payload }: { payload: UpdateSectionTitlePayloadI }) => {
      const section = state.layoutDatas.sectionValues.find(
        section => section.sectionKey === payload.sectionKey
      );
      if (section) {
        section.title = payload.title;
        saveEditorState(state.layoutDatas);
      }
    },
    addLayoutItem: (state, { payload }: PayLoadI) => {
      const sectionIndex = state.layoutDatas.sectionValues.findIndex(
        (section) => section.sectionKey === payload.id,
      );

      if (sectionIndex === -1) return;

      if (
        state.layoutDatas.sectionValues[sectionIndex].layoutValues.length >=
        MAX_LAYOUT_VALUE
      )
        return;

      state.layoutDatas.sectionValues[sectionIndex].layoutValues.push(
        payload.newLayoutItemValue,
      );
      saveEditorState(state.layoutDatas);
    },
    addImageToSection: (state, { payload }: { payload: AddImagePayloadI }) => {
      const section = state.layoutDatas.sectionValues.find(
        section => section.sectionKey === payload.sectionKey
      );
      if (!section) return;
      
      if (!section.layoutValues) {
        section.layoutValues = [];
      }
      
      if (section.layoutValues.length >= 4) {
        alert('4개까지');
        return;
      }
      
      section.layoutValues.push({
        id: crypto.randomUUID(),
        layoutName: 'rectNormal',
        imgValue: '',
      });
      saveEditorState(state.layoutDatas);
    },
    deleteLayoutItem: (state, { payload }: { payload: { sectionId: string; itemId: string } }) => {
      const sectionIndex = state.layoutDatas.sectionValues.findIndex(
        (section) => section.sectionKey === payload.sectionId,
      );

      if (sectionIndex === -1) return;

      state.layoutDatas.sectionValues[sectionIndex].layoutValues =
        state.layoutDatas.sectionValues[sectionIndex].layoutValues.filter(
          (item) => item.id !== payload.itemId,
        );
      saveEditorState(state.layoutDatas);
    },
    updateImageUrl(state, { payload }: { payload: UpdateImageUrlPayloadI }) {
      const section = state.layoutDatas.sectionValues.find(
        section => section.sectionKey === payload.sectionKey
      );
      if (section) {
        const item = section.layoutValues.find(item => item.id === payload.itemId);
        if (item) {
          item.imgValue = payload.imageUrl;
          saveEditorState(state.layoutDatas);
        }
      }
    },
    updateTextContent(state, { payload }: { payload: UpdateTextContentPayloadI }) {
      const section = state.layoutDatas.sectionValues.find(
        section => section.sectionKey === payload.sectionKey
      );
      if (section) {
        const item = section.layoutValues.find(item => item.id === payload.itemId);
        if (item) {
          item.textValue = payload.textContent;
          saveEditorState(state.layoutDatas);
        }
      }
    },
    setLayoutData(state, action: PayloadAction<LayoutData>) {
      state.layoutDatas = action.payload;
      saveEditorState(state.layoutDatas);
    },
  },
});

export default layoutSlice;
export const { 
  addSection, 
  deleteSection, 
  updateSectionTitle,
  addLayoutItem, 
  addImageToSection,
  deleteLayoutItem,
  updateImageUrl,
  updateTextContent,
  setLayoutData,
} = layoutSlice.actions;
