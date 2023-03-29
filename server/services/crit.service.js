const Crit = require("../models/Crit.model");
const paginate = require("../helpers/paginatePlugin");

const { userInfoSelector } = require("../helpers/selectors");

const fetchById = async (critId) => {
    return await Crit.findById(critId).populate("author").select(userInfoSelector);
};

const createLike = async (critId, userId) => {
    // Update the array only if the value doesn't exist yet
    return await Crit.findByIdAndUpdate(critId, {
        $addToSet: { likes: userId },
    });
};

const removeLike = async (critId, userId) => {
    return await Crit.findByIdAndUpdate(critId, {
        $pull: { likes: userId },
    });
};

const createRecrit = async (critId, userId) => {};

const removeRecrit = async (critId, userId) => {};

module.exports = {
    fetchById,
    createLike,
    removeLike,
    createRecrit,
    removeRecrit,
};
