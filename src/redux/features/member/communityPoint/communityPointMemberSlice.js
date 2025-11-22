import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // No pagination needed for member's own community point view
};

const communityPointMemberSlice = createSlice({
  name: "communityPointMember",
  initialState,
  reducers: {
    resetCommunityPointMember: () => initialState,
  },
});

export const { resetCommunityPointMember } = communityPointMemberSlice.actions;

export default communityPointMemberSlice.reducer;
