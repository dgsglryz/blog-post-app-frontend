import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "../features/login/authSlice";
import blogReducer from "../features/blog/blogSlice";
import userSlice from "../features/login/userSlice";
export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    auth: authReducer,
    user: userSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
