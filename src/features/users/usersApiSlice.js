import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query.apply({
      query: () => "/users",
      keepUnusedDataFor: 5,
    }),
    getUser: builder.query({
      query: (userId) => `/users/${userId}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery } = userApiSlice;
