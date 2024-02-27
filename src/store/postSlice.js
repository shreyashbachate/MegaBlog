//Assignment for post Slice
// state.allPosts
// state.userPosts

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  postData: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
});

export const {} = postSlice.actions;

export default postSlice.reducer;
