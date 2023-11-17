import { baseApi } from "./baseApi";
import providesList from "../../helpers/providesList";

export const critApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCrit: builder.query({
            query: (id) => ({
                url: `/crits/${id}`,
            }),
            providesTags: (result, err, id) => [{ type: "Post", id }],
            transformResponse: (response) => response.crit,
        }),
        getReplies: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/crits/${id}/replies?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "CRIT_REPLIES"),
        }),
        getHomeTimeline: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/users/${id}/home_timeline?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "HOME_FEED"),
        }),
        getTrendingKeywords: builder.query({
            query: ({ page, limit }) => ({
                url: `/crits/trending/keywords?page=${page}&limit=${limit}`,
            }),
            transformResponse: (response) => response.data,
        }),
        getQuotes: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/crits/${id}/engagement?quotes=1&page=${page}&limit=${limit}`,
            }),
        }),
        getRepostUsers: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/crits/${id}/engagement?recrits=1&page=${page}&limit=${limit}`,
            }),
        }),
        getLikeUsers: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/crits/${id}/engagement?likes=1&page=${page}&limit=${limit}`,
            }),
        }),
        createCrit: builder.mutation({
            query: (data) => ({
                url: "/crits",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Post" }],
        }),
        deleteCrit: builder.mutation({
            query: (critId) => ({
                url: `/crits/${critId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, critId) => [{ type: "Post", id: critId }],
        }),
    }),
});

export const {
    useGetCritQuery,
    useGetHomeTimelineQuery,
    useCreateCritMutation,
    useDeleteCritMutation,
    useGetTrendingKeywordsQuery,
    useGetQuotesQuery,
    useGetRepostUsersQuery,
    useGetLikeUsersQuery,
} = critApi;