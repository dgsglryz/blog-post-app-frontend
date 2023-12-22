// src/api/authApi.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import Cookies from "js-cookie";

// Replace with your actual API endpoints
const API_BASE_URL = "http://localhost:3000/auth";

interface User {
  userId?: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
}

export interface LogInUser {
  userId?: string;
  username: string;
  password: string;
}
interface UserState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthorized: boolean;
  error: any;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  isAuthorized: !!Cookies.get("token"),
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data.user;
    } catch (error: any) {
      // Handle the error here and return a custom error message
      if (error.response && error.response.data && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue("Error occurred during login");
      }
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: LogInUser, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      // Handle the error here and return a custom error message
      if (error.response && error.response.data && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue("Error occurred during login");
      }
    }
  }
);

export const logoutUserAsync = createAsyncThunk("auth/logoutUser", async () => {
  try {
    // Make a request to the backend logout endpoint
    const response = await axios.post(`${API_BASE_URL}/logout`, null, {
      withCredentials: true,
    });

    // Clear the token from Cookies
    Cookies.remove("token");

    return response; // Return null or any appropriate value after successfully logging out
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthorized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthorized = true;
        Cookies.set("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error";
        state.isAuthorized = false;
      })
      .addCase(logoutUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = null;
        state.isAuthorized = false;
        state.error = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error";
      });
  },
});

export const { logoutUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const isAuthorized = (state: RootState) => state.auth.isAuthorized;
export const authError = (state: RootState) => state.auth.error;
export const isAuthPending = (state: RootState) =>
  state.auth.status === "loading";

export default authSlice.reducer;
