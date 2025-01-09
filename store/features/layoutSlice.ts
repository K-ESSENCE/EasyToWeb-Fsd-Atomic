import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SectionData } from '../../components/types/common/layoutStyle';

interface LayoutState {
  layoutDatas: {
    sectionValues: SectionData[];
  };
}

const initialState: LayoutState = {
  layoutDatas: {
    sectionValues: [],
  },
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<{ newSection: SectionData }>) => {
      state.layoutDatas.sectionValues.push(action.payload.newSection);
    },
    deleteSection: (state, action: PayloadAction<{ id: string }>) => {
      state.layoutDatas.sectionValues = state.layoutDatas.sectionValues.filter(
        section => section.sectionKey !== action.payload.id
      );
    },
    addLayoutItem: (state, action: PayloadAction<{ id: string; newLayoutItemValue: any }>) => {
      const sectionIndex = state.layoutDatas.sectionValues.findIndex(
        section => section.sectionKey === action.payload.id
      );
      if (sectionIndex !== -1) {
        state.layoutDatas.sectionValues[sectionIndex].layoutValues.push(action.payload.newLayoutItemValue);
      }
    },
    deleteLayoutItem: (state, action: PayloadAction<{ sectionId: string; itemId: string }>) => {
      const sectionIndex = state.layoutDatas.sectionValues.findIndex(
        section => section.sectionKey === action.payload.sectionId
      );
      if (sectionIndex !== -1) {
        state.layoutDatas.sectionValues[sectionIndex].layoutValues = 
          state.layoutDatas.sectionValues[sectionIndex].layoutValues.filter(
            item => item.id !== action.payload.itemId
          );
      }
    },
  },
});

export const { addSection, deleteSection, addLayoutItem, deleteLayoutItem } = layoutSlice.actions;
export default layoutSlice.reducer;
