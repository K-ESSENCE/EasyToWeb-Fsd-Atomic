import { createSlice } from '@reduxjs/toolkit';

interface initialInterface {
  nowSectionKey: string;
  nowItemKey: string;
  isItemSelected: boolean;
  onlySelectedLayout: boolean;
  nonSelected: boolean;
}

const initialState: initialInterface = {
  nowSectionKey: '',
  nowItemKey: '',
  isItemSelected: false,
  onlySelectedLayout: false,
  nonSelected: true,
};

const setNowSelectedState = (state: initialInterface) => {
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
    resetKeys: (state) => {
      state.nowSectionKey = '';
      state.nowItemKey = '';
      setNowSelectedState(state);
    }
  },
  // extraReducers: (builder) => {
  //   builder.addCase(layouts.actions.addSection, (state) => {
  //     state.onlySelectedLayout = true;
  //   });
  // },
});

export default keySlice;
export const { changeNowItemKey, changeNowSectionKey, resetKeys } = keySlice.actions;
