import { apiSlice } from "../../app/api/apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (payload) => ({
        url: `/posts`,
        method: "POST",
        body: { ...payload },
      }),
    }),
    getPostData: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreatePostMutation, useGetPostDataMutation } = postsApiSlice;
