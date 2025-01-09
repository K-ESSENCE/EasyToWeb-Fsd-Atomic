import { createSlice } from '@reduxjs/toolkit';
import layouts from '@/store/slices/layouts';

interface initialInerface {
  nowSectionKey: string;
  nowItemKey: string;
  isItemSelected: boolean;
  onlySelectedLayout: boolean;
  nonSelected: boolean;
}

const initialState: initialInerface = {
  nowSectionKey: '',
  nowItemKey: '',
  isItemSelected: false,
  onlySelectedLayout: false,
  nonSelected: true,
};

const setNowSelectedState = (state: initialInerface) => {
  state.isItemSelected = !!state.nowItemKey && !!state.nowSectionKey;
  state.onlySelectedLayout = !state.nowItemKey && !!state.nowSectionKey;
  state.nonSelected = !state.nowItemKey && !state.nowSectionKey;
};

const keySlice = createSlice({
  name: 'keys',
  initialState,
  reducers: {
    changeNowSectionKey: (state, { payload }) => {
      state.nowSectionKey = payload;
      setNowSelectedState(state);
    },
    changeNowItemKey: (state, { payload }) => {
      state.nowItemKey = payload;
      setNowSelectedState(state);
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(layouts.actions.addSection, (state) => {
  //     state.onlySelectedLayout = true;
  //   });
  // },
});

export default keySlice;
export const { changeNowItemKey, changeNowSectionKey } = keySlice.actions;
