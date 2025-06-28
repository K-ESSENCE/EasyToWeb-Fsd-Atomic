'use client';

import { Provider } from 'react-redux';
import { store } from '../store/configureStore';
import {Toaster} from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <Provider store={store}>
        <Toaster position="bottom-right"
                 toastOptions={{
                   style: {
                     fontSize: "16px",
                     padding: "16px 20px",
                     minWidth: "300px",
                   },
                   success: {
                     style: {
                       background: "#22c55e",
                       color: "white",
                     },
                   },
                   error: {
                     style: {
                       background: "#ef4444",
                       color: "white",
                     },
                   },
                   duration:4000
                 }}
        />
        {children}
      </Provider>
  );
}
