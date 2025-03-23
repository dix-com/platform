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
            providesTags: (result) => providesList(result?.data, "Keyword", "TRENDING_KEYWORDS"),
        }),
        getTrendingCrits: builder.query({
            query: ({ page, limit }) => ({
                url: `/crits/trending/content?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "TRENDING_CRITS"),
        }),
        getSearchCrits: builder.query({
            query: ({ searchQuery, page, limit }) => ({
                url: `/crits/search/recent?query=${searchQuery}&page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "SEARCH_CRITS"),
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
        likeCrit: builder.mutation({
            query: ({ id, userId }) => ({
                url: `/crits/${id}/like`,
                method: "POST",
                body: { userId }
            }),
            invalidatesTags: (result, error, { id, userId }) => [
                { type: "Post", id },
                { type: "User", userId }
            ],
        }),
        unlikeCrit: builder.mutation({
            query: ({ id, userId }) => ({
                url: `/crits/${id}/like`,
                method: "DELETE",
                body: { userId }
            }),
            invalidatesTags: (result, error, { id, userId }) => [
                { type: "Post", id },
                { type: "User", userId }
            ],
        }),
    }),
});


export const {
    useGetCritQuery,
    useGetHomeTimelineQuery,
    useCreateCritMutation,
    useDeleteCritMutation,
    useGetTrendingKeywordsQuery,
    useLazyGetTrendingCritsQuery,
    useGetQuotesQuery,
    useGetRepostUsersQuery,
    useGetLikeUsersQuery,
    useGetTrendingCritsQuery,
    useGetRepliesQuery,
    useGetSearchCritsQuery,
    useLikeCritMutation,
    useUnlikeCritMutation,
} = critApi;