// import Crit from "../../critter/Crit";
// import UserPreview from "../../shared/UserPreview";

// import {
//     useGetUserCritsQuery,
//     useGetUserRepliesQuery,
//     useGetUserLikesQuery,
//     useGetUserMediaQuery,
//     useGetUserFollowersQuery,
//     useGetUserFollowingQuery,
// } from "../../../store/api/userApi";

// import PreviewList from ".";
// import withPaginatedQuery from "./withPaginatedQuery";

// const selectId = (params) => ({ id: params._id });
// const selectUsername = (params) => ({ username: params.username });

// const ProfileTimelineList = withPaginatedQuery(useGetUserCritsQuery, Crit)(PreviewList);

// const RepliesList = withPaginatedQuery(useGetUserRepliesQuery, Crit)(PreviewList);

// const MediaList = withPaginatedQuery(useGetUserMediaQuery, Crit, {
//     header: "The user hasn't posted media",
//     subheader: "Once they do, those posts will show up here.",
// })(PreviewList);

// const LikesList = withPaginatedQuery(useGetUserLikesQuery, Crit, {
//     header: "The user hasn't liked any posts",
//     subheader: "When they do, those posts will show up here.",
// })(PreviewList);

// const QuotesList = withPaginatedQuery(useGetUserCritsQuery, Crit, {
//     header: "No Quotes yet",
//     subheader: "You will find a list of everyone who quoted this post here.",
// })(PreviewList);

// const RepostUsersList = withPaginatedQuery(useGetUserCritsQuery, UserPreview, {
//     header: "No Reposts yet",
//     subheader:
//         "Share someone else's post on your timeline by reposting it. When you do, it'll show up here.",
// })(PreviewList);

// const LikeUsersList = withPaginatedQuery(useGetUserCritsQuery, UserPreview, {
//     header: "No likes yet",
//     subheader: "When someone taps the heart to Like this post, it'll show up here.",
// })(PreviewList);

// const FollowersList = (useGetUserFollowersQuery,
// UserPreview,
// {
//     header: "Looking for followers?",
//     subheader:
//         "When someone follows this account, they'll show up here. Criting and interacting with others helps boost followers.",
// },
// selectUsername)(PreviewList);

// const FollowingList = withPaginatedQuery(
//     useGetUserFollowingQuery,
//     UserPreview,
//     {
//         header: "@{username} isn't following anyone",
//         subheader: "Once they follow accounts, they'll show up here.",
//     },
//     selectUsername
// )(PreviewList);

// export {
//     ProfileTimelineList,
//     RepliesList,
//     MediaList,
//     LikeUsersList,
//     QuotesList,
//     RepostUsersList,
//     FollowingList,
//     LikesList,
//     FollowersList,
// };

// export default PreviewList;
