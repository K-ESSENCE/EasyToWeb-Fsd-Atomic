import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  isOpen: boolean;
}

const initialState: SettingsState = {
  isOpen: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSettings: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSettings: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { toggleSettings, setSettings } = settingsSlice.actions;
export default settingsSlice;
