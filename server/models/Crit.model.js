const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const critSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            maxLength: [280, "The crit can't be longer than 280 characters."],
            validate: {
                validator: (c) => {
                    return c.trim().length > 0;
                },
                message: "The crit can't be empty.",
            },
        },
        author: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        media: [
            {
                url: {
                    type: String,
                    required: true,
                },
                mediaType: {
                    type: String,
                    required: true,
                    enum: ["image", "gif"],
                    message: "Invalid media type.",
                },
            },
        ],
        mentions: {
            type: [String],
            default: [],
            set: (mentions) => mentions.map((m) => m.toLowerCase().replace("@", "")),
        },
        hashtags: {
            type: [String],
            default: [],
            set: (hashtags) => hashtags.map((h) => h.toLowerCase().replace("#", "")),
        },
        visibility: {
            type: String,
            enum: ["EVERYONE", "FOLLOWED", "MENTIONED"],
            default: "EVERYONE",
        },
        replyTo: {
            type: ObjectId,
            ref: "Crit",
            default: null,
        },
        quoteTo: {
            type: ObjectId,
            ref: "Crit",
            default: null,
        },
        repliesCount: {
            type: Number,
            default: 0,
        },
        likes: {
            type: [ObjectId],
            ref: "User",
            default: [],
        },
        recrits: {
            type: [ObjectId],
            ref: "User",
            default: [],
        },
    },
    { timestamps: true }
);

// critSchema.index({author: 1, hashtags: 1});

critSchema.methods.updateRepliesCount = async function () {
    this.repliesCount = await mongoose.model("Crit").countDocuments({
        replyTo: this._id,
    });

    return this.save();
};

critSchema.methods.addRecrit = function (userId) {
    const isRecrited = this.recrits.some((id) => id === userId);

    if (!isRecrited) {
        this.recrits.push(userId);
        return this.save();
    }

    return Promise.resolve(this);
};

critSchema.methods.deleteRecrit = function (userId) {
    const isRecrited = this.recrits.some((id) => id.equals(userId));

    if (isRecrited) {
        this.recrits.remove(userId);
        return this.save();
    }

    return Promise.resolve(this);
};

const Crit = mongoose.model("Crit", critSchema);

module.exports = Crit;
