const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please enter your name."],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Please enter your name."],
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "please provide a valid email"],
        },
        photo: {
            type: String,
            default: "default.jpg",
        },
        role: {
            type: String,
            enum: ["user", "creator", "admin"],
            default: "user",
        },
        // Creator-specific fields
        creatorInfo: {
            bio: {
                type: String,
            },
            website: {
                type: String,
                trim: true,
            },
            socialMedia: {
                facebook: { type: String, trim: true },
                twitter: { type: String, trim: true },
                instagram: { type: String, trim: true },
            },
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 6,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your password"],
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
            },
            message: "Password are not same.",
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTokenExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        modiFiedAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// virtual populate
userSchema.virtual("artworks", {
    ref: "Product",
    foreignField: "artist",
    localField: "_id",
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = function (
    candidatePassword,
    userPassword
) {
    return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000
        );

        return JWTTimestamp < changedTimeStamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
