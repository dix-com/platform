import { baseApi } from "./baseApi";

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
            transformResponse: (response) => response.user,
        }),
        getCrit: builder.query({
            query: (id) => {
                return {
                    url: `/crits/${id}`,
                };
            },
            providesTags: (result, err, id) => [{ type: "Post", id }],
        }),
        getUserCrits: builder.query({
            query: (identifier) => {
                return {
                    url: `/users/${identifier}/crits`,
                };
            },
            transformResponse: (response) => response.crits,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id: id }) => ({
                              type: "Post",
                              id,
                          })),
                          { type: "Post", id: "LIST" },
                      ]
                    : [{ type: "Post", id: "LIST" }],
        }),
        getUserLikes: builder.query({
            query: (id) => ({
                url: `/users/${id}/liked_crits`,
            }),
            transformResponse: (response) => response.data.likedCrits,
        }),
        createCrit: builder.mutation({
            query: (data) => {
                return {
                    url: "/crits",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: [{ type: "Post", id: "LIST" }],
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
        followUser: builder.mutation({
            query: ({ id, targetUserId }) => {
                return {
                    url: `/users/${id}/following`,
                    method: "PUT",
                    body: {
                        targetUserId,
                    },
                };
            },
            invalidatesTags: (result, error, { id, targetUserId }) => [
                { type: "User", id },
                { type: "User", id: targetUserId },
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
            ],
        }),
        likeCrit: builder.mutation({
            query: ({ id }) => {
                return {
                    url: `/crits/${id}/like`,
                    method: "POST",
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
        }),
    }),
});

export const {
    useGetUserInfoQuery,
    useGetUserCritsQuery,
    useUpdateUserMutation,
    useFollowUserMutation,
    useUnfollowUserMutation,
    useLikeCritMutation,
    useCreateCritMutation,
    useGetUserLikesQuery,
} = userApi;
