const User = require("../models/User.model");
const Crit = require("../models/Crit.model");
const asyncHandler = require("../middlewares/asyncHandler");

const { NotFoundError, ForbiddenError } = require("../utils/errors");

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

const createCrit = asyncHandler(async (req, res, next) => {
    const { content, author, replyTo = null, quoteTo = null } = req.body;

    const mentions = content.match(/(@[a-zA-Z0-9_]+)/g);
    const hashtags = content.match(/#\w+/g);

    const crit = new Crit({
        content,
        author,
        mentions,
        hashtags,
        replyTo,
        quoteTo,
    });

    if (replyTo) {
        const originalCrit = await Crit.findById(replyTo);

        if (!originalCrit) {
            return next(new NotFoundError("Crit being replied to is not found!"));
        }

        await originalCrit.updateRepliesCount();
    }

    if (quoteTo) {
        const originalCrit = await Crit.findById(quoteTo);

        if (!originalCrit) {
            return next(new NotFoundError("Crit being recrited is not found!"));
        }
    }

    // attach media if available
    if (req.file)
        crit.media = {
            url: `http://localhost:8080/${req.file.path}`,
            mediaType: req.file.mimetype.split("/")[0],
        };

    const newCrit = await crit.save();

    return res.status(200).json({
        crit: newCrit,
    });
});

const deleteCrit = asyncHandler(async (req, res, next) => {
    const { critId } = req.params;

    const crit = await Crit.findById(critId);

    if (!crit) {
        return next(new NotFoundError("Crit not found!"));
    }

    if (crit.author._id.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError("You are not authorized to delete this crit!"));
    }

    await crit.remove();

    return res.status(200).json({
        message: "Crit deleted successfully!",
    });
});

const createRepost = asyncHandler(async (req, res, next) => {
    const { _id: userId } = req.user;

    const { critId } = req.params;

    const crit = await Crit.findById(critId);

    if (!crit) {
        return next(new NotFoundError("Crit not found!"));
    }

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

    if (!crit) {
        return next(new NotFoundError("Crit not found!"));
    }

    const user = await User.findById(userId);

    await Promise.all([crit.deleteRecrit(userId), user.deleteRecrit(critId)]);

    return res.status(200).json({
        isReposted: false,
    });
});

const likeCrit = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const critId = req.params.critId;

    // addToSet will only add if it doesn't exist yet
    const crit = await Crit.findByIdAndUpdate(
        critId,
        { $addToSet: { likes: userId } },
        { new: true }
    );

    if (!crit) {
        return next(new NotFoundError("Crit not found!"));
    }

    return res.status(200).json({
        isLiked: true,
    });
});

const unlikeCrit = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const critId = req.params.critId;

    const crit = await Crit.findByIdAndUpdate(
        critId,
        { $pull: { likes: userId } },
        { new: true }
    );

    if (!crit) {
        return next(new NotFoundError("Crit not found!"));
    }

    return res.status(200).json({
        isLiked: false,
    });
});

module.exports = {
    getCrit,
    createCrit,
    createRepost,
    likeCrit,
    deleteCrit,
    deleteRepost,
    unlikeCrit,
};
