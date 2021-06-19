const { ObjectId } = require("mongodb");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// TODO: INDEXING

const critSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            maxLength: [280, "The crit can't be longer than 280 characters."],
            validate: {
                validator: (c) => {
                    return c.trim().length > 0;
                },
                message: "The crit can't be empty.",
            },
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // add array structure for more than 1 media per crit
        media: [
            {
                url: {
                    type: String,
                    required: true,
                },
                mediaType: {
                    type: String,
                    required: true,
                    // enum: ["image", "gif"],
                    // message: "Invalid media type.",
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crit",
        },
        inReplyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crit",
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        recrits: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Crit",
            },
        ],
    },
    { timestamps: true }
);

// critSchema.index({author: 1, hashtags: 1});

const Crit = mongoose.model("Crit", critSchema);

module.exports = Crit;
