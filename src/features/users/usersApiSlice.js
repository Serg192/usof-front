import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserMutation } = usersApiSlice;
