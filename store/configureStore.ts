import { configureStore } from '@reduxjs/toolkit';
import layoutsSlice from './slices/editor';
import keysSlice from './slices/keys';
import settingsSlice from './slices/settings';
import sectionsSlice from './slices/sections';

export const store = configureStore({
  reducer: {
    layouts: layoutsSlice.reducer,
    keys: keysSlice.reducer,
    settings: settingsSlice.reducer,
    sections: sectionsSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
