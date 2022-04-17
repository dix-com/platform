import { baseApi } from "./baseApi";

export const critApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCrit: builder.query({
            query: (id) => ({
                url: `/crits/${id}`,
            }),
            providesTags: (result, err, id) => [{ type: "Post", id }],
        }),
        createCrit: builder.mutation({
            query: (data) => ({
                url: "/crits",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Post", id: "LIST" }],
        }),
        deleteCrit: builder.mutation({
            query: (critId) => ({
                url: `/crits/${critId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const { useGetCritQuery, useCreateCritMutation, useDeleteCritMutation } = critApi;
