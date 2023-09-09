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
    const crit = new Crit(data);
    await crit.save();
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
    fetchEngagement,
    createCrit,
    createLike,
    removeLike,
};
