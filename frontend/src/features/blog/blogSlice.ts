import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

export interface Blog {
  _id: string;
  title: string;
  description: string;
  username?: string;
  createdAt?: string;
  updatedAt?: Date;
}

interface BlogsState {
  items: Blog[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BlogsState = {
  items: [],
  status: "idle",
  error: null,
};

const apiUrl = "http://localhost:3000/app";

export const getBlogs = createAsyncThunk("blogs/get", async () => {
  const response = await axios.get(`${apiUrl}/article`, {
    withCredentials: true,
  });

  return response.data;
});

export const addBlogAsync = createAsyncThunk(
  "blogs/add",
  async (newBlog: any) => {
    try {
      const response = await axios.post(`${apiUrl}/save`, newBlog, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error adding blog:", error);
      throw error;
    }
  }
);

export const updateBlogAsync = createAsyncThunk(
  "blogs/update",
  async (updatedBlog: Blog) => {
    try {
      const response = await axios.post(`${apiUrl}/update`, updatedBlog, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  }
);

export const deleteBlogAsync = createAsyncThunk(
  "blogs/delete",
  async (blogId: any) => {
    try {
      const response = await axios.post(`${apiUrl}/delete`, blogId, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error";
      })
      .addCase(addBlogAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBlogAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload.article);
      })
      .addCase(addBlogAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error";
      })
      .addCase(updateBlogAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBlogAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(updateBlogAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error";
      })
      .addCase(deleteBlogAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBlogAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((blog) => blog._id !== action.payload);
      })
      .addCase(deleteBlogAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error";
      });
  },
});

export const selectBlogs = (state: RootState) => state.blogs;
export const isBlogsPending = (state: RootState) =>
  state.blogs.status === "loading";
export default todosSlice.reducer;
