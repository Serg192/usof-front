import { apiSlice } from "../../app/api/apiSlice";

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchCategory: builder.mutation({
      query: (pattern) => ({
        url: `/categories/search?pattern=${pattern}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSearchCategoryMutation } = categoriesApiSlice;
