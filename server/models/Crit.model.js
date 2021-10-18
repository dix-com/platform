const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const critSchema = new Schema(
    {
        content: {
            type: String,
            required: false,
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
        mentions: [
            {
                type: ObjectId,
                ref: "User",
                set: (m) => m.toLowerCase().replaceAll("@", ""),
            },
        ],
        hashtags: [
            {
                type: String,
                set: (h) => h.toLowerCase().replaceAll("#", ""),
            },
        ],
        visibility: {
            type: String,
            enum: ["EVERYONE", "FOLLOWED", "MENTIONED"],
            default: "EVERYONE",
        },
        recritId: {
            type: ObjectId,
            ref: "Crit",
        },
        inReplyTo: {
            type: ObjectId,
            ref: "Crit",
        },
        likes: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        recrits: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        replies: [
            {
                type: ObjectId,
                ref: "Crit",
            },
        ],
    },
    { timestamps: true }
);

// critSchema.index({author: 1, hashtags: 1});

const Crit = mongoose.model("Crit", critSchema);

module.exports = Crit;
