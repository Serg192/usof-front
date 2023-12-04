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

    getPostLikes: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "GET",
      }),
    }),
    createLikeUnderPost: builder.mutation({
      query: ({ postId, payload }) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
        body: { ...payload },
      }),
    }),

    deletePostLike: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "DELETE",
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
  useGetPostLikesMutation,
  useCreateLikeUnderPostMutation,
  useDeletePostLikeMutation,
} = postsApiSlice;
