import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './features/layoutSlice';

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
