import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SectionsState {
  isOpen: boolean;
}

const initialState: SectionsState = {
  isOpen: false,
};

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    toggleSections: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSections: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { toggleSections, setSections } = sectionsSlice.actions;
export default sectionsSlice;
