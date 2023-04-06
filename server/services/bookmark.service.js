const User = require("../models/User.model");
const Bookmark = require("../models/Bookmark.model");
const paginate = require("../helpers/paginatePlugin");

const { userCritSelector } = require("../helpers/selectors");

const fetchUserBookmarks = async (userId, options) => {
    return await paginate(
        "Bookmark",
        [
            { $match: { user: userId } },

            {
                $lookup: {
                    from: "crits",
                    localField: "crit",
                    foreignField: "_id",
                    as: "critDetails",
                },
            },
            {
                $unwind: "$critDetails",
            },

            {
                $replaceRoot: { newRoot: "$critDetails" },
            },

            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: {
                    path: "$author",
                },
            },

            {
                $lookup: {
                    from: "crits",
                    localField: "quoteTo",
                    foreignField: "_id",
                    as: "quoteTo",
                },
            },
            {
                $unwind: {
                    path: "$quoteTo",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $lookup: {
                    from: "users",
                    localField: "quoteTo.author",
                    foreignField: "_id",
                    as: "quoteTo.author",
                },
            },
            {
                $unwind: {
                    path: "$quoteTo.author",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $lookup: {
                    from: "crits",
                    localField: "replyTo",
                    foreignField: "_id",
                    as: "replyTo",
                },
            },
            {
                $unwind: {
                    path: "$replyTo",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $lookup: {
                    from: "users",
                    localField: "replyTo.author",
                    foreignField: "_id",
                    as: "replyTo.author",
                },
            },
            {
                $unwind: {
                    path: "$replyTo.author",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $project: {
                    ...userCritSelector,
                },
            },
        ],
        options
    );
};

const createBookmark = async (userId, critId) => {
    await Bookmark.create({ user: userId, crit: critId });
};

const deleteBookmark = async (userId, critId) => {
    await Bookmark.deleteOne({ user: userId, crit: critId });
};

const deleteAllBookmarks = async (userId) => {
    await Bookmark.deleteMany({ user: userId });
};

module.exports = {
    fetchUserBookmarks,
    createBookmark,
    deleteBookmark,
    deleteAllBookmarks,
};
