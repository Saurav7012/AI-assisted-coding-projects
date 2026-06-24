import { configureStore } from "@reduxjs/toolkit";
import userReducers from "./authSlice";

export const store = configureStore({
  reducer: {
    user: userReducers
  }
});
