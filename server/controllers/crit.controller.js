const Crit = require("../models/Crit.model");

const asyncHandler = require("../middlewares/asyncHandler");
const { NotFoundError } = require("../config/ApplicationError");

const getCrit = asyncHandler(async (req, res, next) => {
    const { critId } = req.params;

    const crit = await Crit.findById(critId).populate("author");

    if (!crit) {
        return next(new NotFoundError("Crit not found!"));
    }

    return res.status(200).json({
        data: {
            crit: crit || [],
        },
    });
});

const getLikingUsers = asyncHandler(async (req, res, next) => {
    const { critId } = req.params;

    const crit = await Crit.findById(critId).select("likes -_id").populate("likes");

    console.log(crit);

    // TODO: Get specific data to display on liking users page
});

const createCrit = asyncHandler(async (req, res, next) => {
    const { content, author } = req.body;

    const mentions = content.match(/(@[a-zA-Z0-9_]+)/g);
    const hashtags = content.match(/#\w+/g);

    const crit = new Crit({
        content,
        author,
        mentions,
        hashtags,
    });

    req.file &&
        (crit.media = {
            url: `http://localhost:8080/${req.file.path}`,
            mediaType: req.file.mimetype.split("/")[0],
        });

    const newCrit = await crit.save();

    return res.status(200).json({
        crit: newCrit,
    });
});

const createReply = asyncHandler(async (req, res, next) => {
    const { content, author, media, hashtags, inReplyTo } = req.body;

    const crit = new Crit({
        content,
        author,
        media,
        hashtags,
        inReplyTo,
    });

    const newCrit = await crit.save();

    return res.status(200).json({
        crit: newCrit,
    });
});

const createRecrit = asyncHandler(async () => {
    const { content, author, media, hashtags, recritId } = req.body;

    const crit = new Crit({
        content,
        author,
        media,
        hashtags,
        recritId,
    });

    const newCrit = await crit.save();

    return res.status(200).json({
        crit: newCrit,
    });
});

const likeCrit = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const critId = req.params.critId;

    const crit = await Crit.findByIdAndUpdate(
        critId,
        {
            // addToSet will only add if it doesn't exist yet
            $addToSet: { likes: userId },
        },
        { new: true }
    );

    if (!crit) {
        return next(new NotFoundError("Crit not found!"));
    }

    console.log("got here");
    return res.status(200).json({
        data: {
            isLiked: true,
        },
    });
});

const unlikeCrit = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const critId = req.params.critId;

    const crit = await Crit.findByIdAndUpdate(
        critId,
        {
            $pull: { likes: userId },
        },
        { new: true }
    );

    if (!crit) {
        return next(new NotFoundError("Crit not found!"));
    }

    return {
        data: {
            isLiked: false,
            likes: crit.likes,
        },
    };
});

const deleteCrit = asyncHandler(async (req, res, next) => {
    const crit = res.crit;
    // todo: delete this crit using await res.crit.remove();?
});

module.exports = {
    getCrit,
    getLikingUsers,
    createCrit,
    createReply,
    createRecrit,
    likeCrit,
    unlikeCrit,
    deleteCrit,
};
