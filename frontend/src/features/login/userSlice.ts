import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:3000/app";

interface UserState {
  user: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthorized: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  isAuthorized: !!Cookies.get("token"),
  error: null,
};

export const getUserAsync = createAsyncThunk("app/getUser", async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getUser`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error";
      });
  },
});

export const getUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
