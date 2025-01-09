import { configureStore } from '@reduxjs/toolkit';
import layoutsSlice from './slices/layouts';
import keysSlice from './slices/keys';

export const store = configureStore({
  reducer: {
    layouts: layoutsSlice.reducer,
    keys: keysSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
