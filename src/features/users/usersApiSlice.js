import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
    }),

    getUsers: builder.mutation({
      query: (pagination) => ({
        url: `/users?${pagination}`,
        method: "GET",
      }),
    }),

    getUserPosts: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/posts`,
        method: "GET",
      }),
    }),

    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/avatar",
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetUserMutation,
  useGetUserPostsMutation,
  useUploadAvatarMutation,
  useGetUsersMutation,
} = usersApiSlice;
