const { ObjectId } = require("mongoose").Types;
const User = require("../models/User.model");
const Bookmark = require("../models/Bookmark.model");
const Crit = require("../models/Crit.model");

const asyncHandler = require("../middlewares/asyncHandler");
const bookmarkService = require("../services/bookmark.service");

const {
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
} = require("../utils/errors");


const getBookmarks = asyncHandler(async (req, res, next) => {
    const { _id: authUserId } = req.user;
    const { userId } = req.params;

    if (!(await User.exists({ _id: userId })))
        return next(
            new NotFoundError("The user in the request could not be found!")
        );

    if (userId !== authUserId.toString())
        return next(
            new UnauthorizedError("You are not authorized to bookmark this crit!")
        );

    const response = await bookmarkService.fetchUserBookmarks(
        new ObjectId(userId),
        req.pagination
    );

    return res.status(200).json(response);
});

const createBookmark = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { critId } = req.body;
    const authUserId = req.user._id.toString();

    if (!(await User.exists({ _id: userId })))
        return next(new NotFoundError("The user could not be found!"));

    if (!(await Crit.exists({ _id: critId })))
        return next(new NotFoundError("The crit could not be found!"));

    if (
        await Bookmark.exists({
            user: userId,
            crit: critId,
        })
    )
        return next(new BadRequestError("You already bookmarked this crit!"));

    await bookmarkService.createBookmark(userId, critId);

    return res.status(200).json({
        isBookmarked: true,
    });
});

const deleteBookmark = asyncHandler(async (req, res, next) => {
    const { userId, critId } = req.params;
    const authUserId = req.user._id.toString();

    if (!(await User.exists({ _id: userId })))
        return next(new NotFoundError("The user could not be found!"));

    if (!(await Crit.exists({ _id: critId })))
        return next(new NotFoundError("The crit could not be found!"));

    if (userId !== authUserId)
        return next(new UnauthorizedError("You are not authorized to do this!"));

    await bookmarkService.deleteBookmark(authUserId, critId);

    return res.status(200).json({
        isBookmarked: false,
    });
});

const deleteAllBookmarks = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const authUserId = req.user._id.toString();

    if (!(await User.exists({ _id: userId })))
        return next(new NotFoundError("The user could not be found!"));

    if (authUserId !== userId)
        return next(new UnauthorizedError("You are not authorized to do this!"));

    await bookmarkService.deleteAllBookmarks(new ObjectId(userId));

    return res.status(200).json({
        bookmarksCleared: true,
    });
});


module.exports = {
    getBookmarks,
    createBookmark,
    deleteBookmark,
    deleteAllBookmarks,
};
