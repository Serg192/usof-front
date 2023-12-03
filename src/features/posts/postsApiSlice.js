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

    getPosts: builder.mutation({
      query: (filterAndSearchOptions) => ({
        url: `/posts?${filterAndSearchOptions}`,
        method: "GET",
      }),
    }),

    createPostComment: builder.mutation({
      query: ({ postId, commentText }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { commentText },
      }),
    }),

    getPostComments: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/comments`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostDataMutation,
  useGetPostsMutation,
  useCreatePostCommentMutation,
  useGetPostCommentsMutation,
} = postsApiSlice;
