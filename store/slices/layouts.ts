import { createSlice } from "@reduxjs/toolkit";
import { LayoutData, LayoutItemValues, SectionData } from "../../components/types/common/layoutStyle";
import { MAX_LAYOUT_VALUE } from "../../utils/constants";

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
    },
    deleteSection: (state, { payload }: { payload: IdPayloadI }) => {
      const updatedState = state.layoutDatas.sectionValues.filter(
        (section) => section.sectionKey !== payload.id,
      );
      state.layoutDatas.sectionValues = updatedState;
    },
    updateSectionTitle: (state, { payload }: { payload: UpdateSectionTitlePayloadI }) => {
      const section = state.layoutDatas.sectionValues.find(
        section => section.sectionKey === payload.sectionKey
      );
      if (section) {
        section.title = payload.title;
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
    },
  },
});

export default layoutSlice;
export const { addSection, deleteSection, addLayoutItem, deleteLayoutItem, updateSectionTitle } = layoutSlice.actions;
