import { baseApi } from "./baseApi";
import providesList from "../../helpers/providesList";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserInfo: builder.query({
            query: (identifier) => ({
                url: `/users/${identifier}`,
            }),
            providesTags: (result, err, arg) =>
                result
                    ? [
                        {
                            type: "User",
                            id: result._id,
                        },
                    ]
                    : ["User"],
        }),
        getSearchUsers: builder.query({
            query: ({ searchQuery, page, limit }) => ({
                url: `/users/search/recent?query=${searchQuery}&page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "User", "SEARCH_USERS"),
        }),
        getRecommendedUsers: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/users/${id}/recommended?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "User", "RECOMMENDED"),
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [
                {
                    type: "User",
                    id: arg.id,
                },
            ],
        }),
        getBookmarks: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/users/${id}/bookmarks?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "BOOKMARKS"),
        }),
        createBookmark: builder.mutation({
            query: ({ userId, critId }) => ({
                url: `/users/${userId}/bookmarks`,
                method: "POST",
                body: {
                    critId,
                },
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: "Post", id: "BOOKMARKS" },
                { type: "User", id: userId },
            ],
        }),
        deleteBookmark: builder.mutation({
            query: ({ userId, critId }) => ({
                url: `/users/${userId}/bookmarks/${critId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: "Post", id: "BOOKMARKS" },
                { type: "User", id: userId },
            ],
        }),
        deleteAllBookmarks: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}/bookmarks`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, userId) => [
                { type: "User", id: userId },
            ],
        }),
        getUserFollowers: builder.query({
            query: ({ username, page, limit }) => ({
                url: `/users/${username}/followers?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: (result) => providesList(result?.data, "User", "FOLLOWERS"),
        }),
        getUserFollowing: builder.query({
            query: ({ username, page, limit }) => ({
                url: `/users/${username}/following?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: (result) => providesList(result?.data, "User", "FOLLOWING"),
        }),
        getUserCrits: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/users/${id}/timeline?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "TIMELINE"),
        }),
        getUserReplies: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/users/${id}/replies?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "REPLIES"),
        }),
        getUserLikes: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/users/${id}/likes?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "LIKES"),
        }),
        getUserMedia: builder.query({
            query: ({ id, page, limit }) => ({
                url: `/users/${id}/media?page=${page}&limit=${limit}`,
            }),
            providesTags: (result) => providesList(result?.data, "Post", "MEDIA"),
        }),
        followUser: builder.mutation({
            query: ({ id, targetUserId }) => ({
                url: `/users/${id}/following`,
                method: "PUT",
                body: {
                    targetUserId,
                },
            }),
            invalidatesTags: (result, error, { id, targetUserId }) => [
                { type: "User", id },
                { type: "User", id: targetUserId },
                { type: "User", id: "FOLLOWING" },
                { type: "User", id: "FOLLOWERS" },
                { type: "Post", id: "HOME_FEED" },
                { type: "User", id: "RECOMMENDED" },
                { type: "User", id: "SEARCH_USERS" }
            ],
        }),
        unfollowUser: builder.mutation({
            query: ({ id, targetUserId }) => ({
                url: `/users/${id}/following`,
                method: "DELETE",
                body: {
                    targetUserId,
                },
            }),
            invalidatesTags: (result, error, { id, targetUserId }) => [
                { type: "User", id },
                { type: "User", id: targetUserId },
                { type: "User", id: "FOLLOWING" },
                { type: "User", id: "FOLLOWERS" },
                { type: "Post", id: "HOME_FEED" },
                { type: "User", id: "RECOMMENDED" },
                { type: "User", id: "SEARCH_USERS" }
            ],
        }),
        createRepost: builder.mutation({
            query: ({ critId }) => ({
                url: `/crits/${critId}/repost`,
                method: "POST",
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
        }),
        deleteRepost: builder.mutation({
            query: ({ critId }) => ({
                url: `/crits/${critId}/repost`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
        }),

        likeCrit: builder.mutation({
            query: ({ id }) => ({
                url: `/crits/${id}/like`,
                method: "POST",
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Post", id }, { type: "Post", id: "TRENDING_CRITS" }],
        }),
        unlikeCrit: builder.mutation({
            query: ({ id }) => ({
                url: `/crits/${id}/like`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
        }),
    }),
});

export const {
    useGetUserInfoQuery,
    useGetUserCritsQuery,
    useGetUserFollowersQuery,
    useGetUserFollowingQuery,
    useUpdateUserMutation,
    useFollowUserMutation,
    useUnfollowUserMutation,
    useLikeCritMutation,
    useUnlikeCritMutation,
    useGetUserLikesQuery,
    useGetUserRepliesQuery,
    useGetUserMediaQuery,
    useCreateRepostMutation,
    useDeleteRepostMutation,
    useDeleteAllBookmarksMutation,
    useGetBookmarksQuery,
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
    useGetRecommendedUsersQuery,
    useLazyGetSearchUsersQuery,
    useGetSearchUsersQuery
} = userApi;