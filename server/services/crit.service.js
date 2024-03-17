const Crit = require("../models/Crit.model");
const paginate = require("../helpers/paginatePlugin");

const {
    userInfoSelector,
    userCritSelector,
    postDetailSelector
} = require("../helpers/selectors");

const fetchById = async (critId) => {
    const crit = await Crit.findById(critId).populate({
        path: "author",
        select: userInfoSelector,
    }).populate({
        path: "replyTo",
        select: postDetailSelector,
        populate: {
            path: "author",
            select: userInfoSelector,
        }
    }).populate({
        path: "quoteTo",
        select: postDetailSelector,
        populate: {
            path: "author",
            select: userInfoSelector,
        }
    });

    return crit;
};

const fetchByQuery = async (query, options) => {
    return await paginate(
        "Crit",
        [
            { $unwind: '$hashtags' },
            {
                $match: {
                    $or: [
                        { hashtags: { $regex: query } },
                        { content: { $regex: query } }
                    ]
                }
            },

            {
                $group: {
                    _id: '$_id',
                    uniqueData: { $first: '$$ROOT' }
                },

            },

            {
                $replaceRoot: { newRoot: '$uniqueData' }
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
                    preserveNullAndEmptyArrays: true,
                }
            },



            {
                $project: {
                    ...userCritSelector
                }
            }
        ],
        options
    )
}

const fetchReplies = async (critId, options) => {
    return await paginate(
        "Crit",
        [
            { $match: { replyTo: critId } },

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

            { $project: { document: "$$ROOT", ...userCritSelector } },
            { $replaceRoot: { newRoot: "$document" } },
        ],
        options
    );
};

const fetchEngagement = async (req, res, next) => {
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
};

const createCrit = async (data) => {
    return (await new Crit(data).save());
}


const createLike = async (critId, userId) => {
    return await Crit.findByIdAndUpdate(critId, {
        $addToSet: { likes: userId },
    });
};

const removeLike = async (critId, userId) => {
    return await Crit.findByIdAndUpdate(critId, {
        $pull: { likes: userId },
    });
};

module.exports = {
    fetchById,
    fetchByQuery,
    fetchReplies,
    fetchEngagement,
    createCrit,
    createLike,
    removeLike,
};