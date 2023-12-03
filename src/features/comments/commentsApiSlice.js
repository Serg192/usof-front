import { apiSlice } from "../../app/api/apiSlice";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "GET",
      }),
    }),

    updateComment: builder.mutation({
      query: ({ commentId, commentText }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: { commentText },
      }),
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApiSlice;
