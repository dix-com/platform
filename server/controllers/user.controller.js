const { ObjectId } = require("mongoose").Types;

const User = require("../models/User.model");
const Crit = require("../models/Crit.model");
const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/user.service");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");


const getUser = asyncHandler(async (req, res, next) => {
    const { username } = req.params;

    if (!(await User.exists({ username: username })))
        return next(new NotFoundError(`The username ${username} couldn't be found.`));

    const user = await userService.findByUsername(username);

    return res.status(200).json(user);
});

const getQueryUsers = asyncHandler(async (req, res, next) => {
    const { query: searchQuery } = req.query;

    if (!searchQuery)
        return next(new NotFoundError("No query provided!"));

    const searchRegex = new RegExp(searchQuery, 'i');
    const response = await userService.findFromQuery(searchRegex, req.pagination);

    return res.status(200).json(response);
});

const getRecommendedUsers = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    if (!(await User.exists({ _id: userId })))
        return next(new NotFoundError("User not found!"));

    const response = await userService.fetchRecommendedUsers(
        new ObjectId(userId),
        req.pagination
    );

    return res.status(200).json(response);
});

const getFollowers = asyncHandler(async (req, res, next) => {
    const relevantUser = await userService.findByUsername(req.params.username);

    if (!relevantUser)
        return next(new NotFoundError("The specified user could not found!"));

    const response = await userService.fetchFollowers(
        relevantUser._id,
        req.pagination
    );

    return res.status(200).json(response);
});

const getFollowing = asyncHandler(async (req, res, next) => {
    const relevantUser = await userService.findByUsername(req.params.username);

    if (!relevantUser)
        return next(new NotFoundError("The specified user could not found!"));

    const response = await userService.fetchFollowing(
        relevantUser._id,
        req.pagination
    );

    return res.status(200).json(response);
});

const getHomeFeed = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    if (!(await User.exists({ _id: userId })))
        return next(new NotFoundError("User not found!"));

    const response = await userService.fetchHomeFeed(
        new ObjectId(userId),
        req.pagination
    );

    return res.status(200).json(response);
});

const getProfileTimeline = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user)
        return next(
            new NotFoundError("Can't retrieve crits since the user does not exist!")
        );

    const response = await userService.fetchTimeline(user._id, req.pagination);

    return res.status(200).json(response);
});

const getRepliesTimeline = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return next(
            new NotFoundError("Can't retrieve crits since the user does not exist!")
        );
    }

    const response = await userService.fetchRepliesTimeline(
        user._id,
        req.pagination
    );

    return res.status(200).json(response);
});

const getMediaTimeline = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user)
        return next(
            new NotFoundError("Can't retrieve crits since the user does not exist!")
        );

    const response = await userService.fetchMediaTimeline(user._id, req.pagination);

    return res.status(200).json(response);
});

const getLikesTimeline = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    if (!(await User.exists({ _id: userId })))
        return next(new NotFoundError("Can't retrieve crits since the user does not exist!"));

    const response = await userService.fetchLikeTimeline(new ObjectId(userId), req.pagination);

    return res.status(200).json(response);
});

const followUser = asyncHandler(async (req, res, next) => {
    const { userId: sourceUserId } = req.params;
    const { targetUserId } = req.body;

    if (!(await User.exists({ _id: sourceUserId })))
        return next(new NotFoundError("Source user not found!"));

    if (!(await User.exists({ _id: targetUserId })))
        return next(new NotFoundError("Target user not found!"));

    await userService.createFollow(sourceUserId, targetUserId);

    return res.status(200).json({
        isFollowing: true,
    });
});

const unfollowUser = asyncHandler(async (req, res, next) => {
    const { targetUserId } = req.body;
    const { userId: sourceUserId } = req.params;

    if (!(await User.exists({ _id: sourceUserId })))
        return next(new NotFoundError("Source user not found!"));

    if (!(await User.exists({ _id: targetUserId })))
        return next(new NotFoundError("Target user not found!"));

    await userService.removeFollow(sourceUserId, targetUserId);

    return res.status(200).json({
        isFollowing: false,
    });
});

const updateUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { _id: currentUserId } = req.user;

    if (currentUserId.toString() !== userId)
        return next(new UnauthorizedError("You're not allowed to alter this user."));

    const { username, displayName, bio, location, website } = req.body;

    const updateData = {
        username,
        displayName,
        bio,
        location,
        website,
    };

    if (req.files["profileImage"]) {
        updateData.profileImageURL = `${process.env.API_URL}/${req.files.profileImage[0].path}`;
    }

    if (req.files["bannerImage"]) {
        updateData.bannerURL = `${process.env.API_URL}/${req.files.bannerImage[0].path}`;
    }
    // console.log(username)

    await User.findByIdAndUpdate(userId, updateData);

    return res.status(200).json({
        isUpdated: true,
    });
});

const pinCrit = asyncHandler(async (req, res, next) => {
    const { userId, critId } = req.params;
    const { _id: currentUserId } = req.user;

    if (!(await User.exists({ _id: userId })))
        return next(new NotFoundError("User with that id wasn't found!"));

    if (!(await Crit.exists({ _id: critId })))
        return next(new NotFoundError("Crit with that id wasn't found!"));

    if (currentUserId.toString() !== userId)
        return next(new UnauthorizedError("You're not allowed to alter this user."));


    await User.findByIdAndUpdate(userId, { pin: critId });

    return res.status(200).json({
        success: true,
    });
});

const unpinCrit = asyncHandler(async (req, res, next) => {
    const { userId, critId } = req.params;
    const { _id: currentUserId } = req.user;

    if (!(await User.exists({ _id: userId })))
        return next(new NotFoundError("User with that id wasn't found!"));

    if (!(await Crit.exists({ _id: critId })))
        return next(new NotFoundError("Crit with that id wasn't found!"));

    if (currentUserId.toString() !== userId)
        return next(new UnauthorizedError("You're not allowed to alter this user."));


    await User.findByIdAndUpdate(userId, { pin: null });

    return res.status(200).json({
        success: true,
    });
});


module.exports = {
    getUser,
    getRecommendedUsers,
    getQueryUsers,
    getFollowing,
    getFollowers,
    getHomeFeed,
    getProfileTimeline,
    getRepliesTimeline,
    getMediaTimeline,
    getLikesTimeline,
    followUser,
    unfollowUser,
    updateUser,
    pinCrit,
    unpinCrit
};
