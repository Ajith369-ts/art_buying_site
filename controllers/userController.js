const User = require("../models/userModel");

const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                "Password cannot be updated here. Please use /updateMyPassword",
                400
            )
        );
    }

    const filterBody = filterObj(req.body, "username", "name", "email");

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false,
    });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getUser = catchAsync(async (req, res, next) => {
    let query = User.findById(req.params.id);
    if (req.user.role === "creator" || req.user.role === "admin")
        query = query.populate("artworks");

    const user = await query;

    if (!user) {
        return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: user,
    });
});

const filterObj = (obj, ...allowedField) => {
    const newObj = {};

    Object.keys(obj).forEach((el) => {
        if (allowedField.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};
