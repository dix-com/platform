const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const providerSchema = new Schema({
    providerId: String,
    providerName: {
        type: String,
        required: true,
    },
});

const userSchema = new Schema(
    {
        provider: {
            type: providerSchema,
            required: false,
        },
        username: {
            type: String,
            required: false,
            unique: [true, "Username already exists!"],
            trim: true,
            lowercase: true,
            validate: {
                validator: (username) => {
                    // return !username.match(/^[0-9a-zA-Z_.-]+$/);
                    return /^[0-9a-zA-Z_.-]+$/.test(username);
                },
                message: (props) =>
                    `${props.value} is not a valid username. Username must only contain numbers, letters, ".", "-", "_"`,
            },
        },
        email: {
            type: String,
            required: [true, "Email required"],
            unique: [true, "Email already exists!"],
            trim: true,
            lowercase: true,
            validate: {
                validator: (email) => {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
                },
                message: (props) => `${props.value} is not a valid email address!`,
            },
        },
        password: {
            type: String,
            required: false,
            minLength: [8, "Password must be at least 8 characters long!"],
        },
        profileImageURL: String,
        bannerURL: String,
        displayName: String,
        dob: {
            type: Date,
            required: true,
        },
        bio: {
            type: String,
            maxLength: 160,
        },
        website: {
            type: String,
            default: null,
            maxLength: 100,
            validate: {
                validator: (url) => {
                    // return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
                    return /^((http|https):\/\/)?[^ "]+$/.test(url);
                },
                message: (props) => `${props.value} is not a valid URL!`,
            },
        },
        location: {
            type: String,
            default: null,
            maxLength: 30,
        },
        followers: {
            type: [ObjectId],
            ref: "User",
            default: [],
        },
        following: {
            type: [ObjectId],
            ref: "User",
            default: [],
        },
        recrits: {
            type: [ObjectId],
            ref: "Crit",
            default: [],
        },
        bookmarks: {
            type: [ObjectId],
            ref: "Crit",
            default: [],
        },
    },
    { timestamps: true }
);

// Static methods
userSchema.statics.addUser = (data) => {
    const user = new this(data);
    return user.save();
};

// Instance methods
userSchema.methods.addRecrit = function (critId) {
    const isRecrited = this.recrits.some((id) => id === critId);

    if (!isRecrited) {
        this.recrits.push(critId);
        return this.save();
    }

    return Promise.resolve(this);
};

userSchema.methods.deleteRecrit = function (critId) {
    const isRecrited = this.recrits.some((id) => id.equals(critId));

    if (isRecrited) {
        this.recrits.remove(critId);
        return this.save();
    }

    return Promise.resolve(this);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
