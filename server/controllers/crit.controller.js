const { ObjectId } = require("mongoose").Types;
const User = require("../models/User.model");
const Crit = require("../models/Crit.model");
const asyncHandler = require("../middlewares/asyncHandler");
const critService = require("../services/crit.service");

const paginate = require("../helpers/paginatePlugin");
const { engagementSelector } = require("../helpers/selectors");

const { NotFoundError, ForbiddenError } = require("../utils/errors");
const { isObjEmpty } = require("../utils/object");
const pick = require("../utils/pick");

const getCrit = asyncHandler(async (req, res, next) => {
    const { critId } = req.params;

    if (!(await Crit.exists({ _id: critId })))
        return next(new NotFoundError("The requested crit couldn't be found!"));

    const crit = await critService.fetchById(critId);

    return res.status(200).json({
        crit,
    });
});

const getCritReplies = asyncHandler(async (req, res, next) => {
    const { critId } = req.params;

    if (!(await Crit.exists({ _id: critId })))
        return next(new NotFoundError("Crit with such ID doesn't exist!"));

    const response = await critService.fetchReplies(
        new ObjectId(critId),
        req.pagination
    );

    return res.status(200).json(response);
});

const getTrendingKeywords = asyncHandler(async (req, res, next) => {
    const response = await paginate(
        "Crit",
        [
            {
                $unwind: {
                    path: "$hashtags",
                    preserveNullAndEmptyArrays: true,
                },
            },

            { $match: { hashtags: { $ne: null } } },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },

            { $project: { hashtag: "$_id", count: 1, _id: 0 } },
        ],
        req.pagination
    );

    return res.status(200).json(response);
});

const getTrendingCrits = asyncHandler(async (req, res, next) => {
    const response = await paginate(
        "Crit",
        [
            {
                $unwind: {
                    path: "$hashtags",
                    preserveNullAndEmptyArrays: true
                }
            },

            { $match: { hashtags: { $ne: null } } },


            {
                $group: {
                    _id: "$hashtags",
                    count: { $sum: 1 },
                    crits: { $push: "$$ROOT" }
                }
            },

            { $sort: { count: -1 } },

            {
                $unwind: {
                    path: "$crits",
                    preserveNullAndEmptyArrays: true
                }
            },

            { $replaceRoot: { newRoot: "$crits" } },

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
                    preserveNullAndEmptyArrays: true,
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

            { $sort: { "createdAt": -1 } }
        ],
        req.pagination
    )

    return res.status(200).json(response);
});

const getSearchCrits = asyncHandler(async (req, res, next) => {
    const { query: searchQuery } = req.query;

    if (!searchQuery)
        return next(new NotFoundError("No query provided!"));

    const searchRegex = new RegExp(searchQuery, 'i');
    const response = await critService.fetchByQuery(searchRegex, req.pagination);

    return res.status(200).json(response);

});

const getCritEngagement = asyncHandler(async (req, res, next) => {
    const { critId } = req.params;

    const query = pick(req.query, ["quotes", "recrits", "likes"]);

    const isQueryEmpty = isObjEmpty(query);

    if (isQueryEmpty)
        return next(new BadRequestError("Invalid query parameters!"));

    if (!(await Crit.exists({ _id: critId })))
        return next(new NotFoundError("Crit with such ID doesn't exist!"));

    const parsedId = new ObjectId(critId);

    const field = query.likes ? "likes" : query.recrits ? "recrits" : "quotes";
    const filter = field === "quotes" ? { quoteTo: parsedId } : { _id: parsedId };

    const response = await paginate(
        "Crit",
        [
            { $match: filter },

            {
                $lookup: {
                    from: "users",
                    localField: `${field}`,
                    foreignField: "_id",
                    as: `${field}`,
                },
            },
            {
                $unwind: {
                    path: `$${field}`,
                },
            },

            { $replaceRoot: { newRoot: `$${field}` } },
            { $project: { ...engagementSelector } },
        ],
        req.pagination
    );

    return res.status(200).json(response);
});

const createCrit = asyncHandler(async (req, res, next) => {
    const { content = "", author, replyTo = null, quoteTo = null } = req.body;

    const mentions = content.match(/(@[a-zA-Z0-9_]+)/g) || [];
    const hashtags = content.match(/#\w+/g) || [];

    const data = {
        content,
        author,
        mentions,
        hashtags,
        replyTo,
        quoteTo,
    };

    // Check the crit type
    if (replyTo && quoteTo)
        return next(new ForbiddenError("Crit can't be both a reply and a quote!"));

    if (quoteTo && !(await Crit.exists({ _id: quoteTo })))
        return next(new NotFoundError("Crit being quoted is not found!"));

    if (replyTo && !(await Crit.exists({ _id: replyTo })))
        return next(new NotFoundError("Crit being quoted is not found!"));

    if (replyTo) {
        const originalCrit = await Crit.findById(replyTo);

        if (!originalCrit)
            return next(new NotFoundError("Crit being replied to is not found!"));

        await originalCrit.updateRepliesCount();
    }

    // Attach incoming files
    if (req.file) {
        data.media = {
            url: `${process.env.API_URL}/${req.file.path}`,
            mediaType: req.file.mimetype.split("/")[0],
        };
    }

    let crit;

    try {
        crit = await critService.createCrit(data);
    } catch (err) {
        let errors = Object.values(err.errors).map(el => el.message);
        let fields = Object.values(err.errors).map(el => el.path);
    }

    return res.status(200).json({
        success: true,
        critId: crit._id
    });
});

const deleteCrit = asyncHandler(async (req, res, next) => {
    const { critId } = req.params;

    const crit = await Crit.findById(critId);
    const critAuthorId = crit.author._id.toString();
    const authUserId = req.user._id.toString();

    if (!crit)
        return next(new NotFoundError("The crit couldn't be found in the database!"));

    if (critAuthorId !== authUserId)
        return next(new ForbiddenError("You are not authorized to delete this crit!"));

    await crit.deleteOne();

    return res.status(200).json({
        isCritDeleted: true,
    });
});

const createRepost = asyncHandler(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { critId } = req.params;

    const crit = await Crit.findById(critId);

    if (!crit)
        return next(new NotFoundError("Crit not found!"));

    const user = await User.findById(userId);

    await Promise.all([crit.addRecrit(userId), user.addRecrit(critId)]);

    return res.status(200).json({
        isReposted: true,
    });
});

const deleteRepost = asyncHandler(async (req, res, next) => {
    const { _id: userId } = req.user;
    const { critId } = req.params;

    const crit = await Crit.findById(critId);

    if (!crit) next(new NotFoundError("Crit not found!"));

    const user = await User.findById(userId);

    await Promise.all([
        crit.deleteRecrit(userId),
        user.deleteRecrit(critId)
    ]);

    return res.status(200).json({
        isReposted: false,
    });
});

const likeCrit = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const critId = req.params.critId;

    const crit = await critService.createLike(critId, userId);

    if (!crit)
        return next(new NotFoundError("The crit to be liked was not found!"));

    return res.status(200).json({
        isLiked: true,
    });
});

const unlikeCrit = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const critId = req.params.critId;

    const crit = await critService.removeLike(critId, userId);

    if (!crit)
        return next(new NotFoundError("The crit to be unliked was not found!"));

    return res.status(200).json({
        isLiked: false,
    });
});

module.exports = {
    getCrit,
    getCritReplies,
    getTrendingKeywords,
    getTrendingCrits,
    getSearchCrits,
    getCritEngagement,
    createCrit,
    createRepost,
    likeCrit,
    deleteCrit,
    deleteRepost,
    unlikeCrit,
};
