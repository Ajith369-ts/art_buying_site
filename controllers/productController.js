/*
const fs = require("fs");

exports.checkId = (req, res, next, id) => {
    if (id < 0) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid Id",
        });
    }
    console.log("Iam here");
    next();
};

const products = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/product.json`)
);

exports.getAllProduct = (req, res) => {
    console.log("Hello");
    res.status(200).json({
        status: "success",
        result: products.length,
        data: products,
    });
};
*/

const Product = require("../models/productModel");
const User = require("../models/userModel");

const APIFeatures = require("../util/apiFeatures");
const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");

exports.createProduct = catchAsync(async (req, res, next) => {
    req.body.artist = req.user.id;
    if (req.user.role === "admin") {
        const artist = await User.findOne({ email: req.body.email });
        req.body.artist = artist.id;
    }

    const newProduct = await Product.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            product: newProduct,
        },
    });
});

exports.getAllProduct = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitField()
        .pagination();

    if (req.params.userId) features.artworks(req.params.userId);

    const products = await features.filterQuery;

    res.status(200).json({
        status: "success",
        result: products.length,
        data: { products },
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError("No product found with that id", 404));
    }

    res.status(200).json({
        status: "success",
        data: product,
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        message: "Updated successfully",
        data: {
            product,
        },
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: "success",
        message: "Product deleted successfully",
        data: null,
    });
});

exports.reviewProduct = catchAsync(async (req, res, next) => {
    const pending = await Product.find({ isApproved: false }, null, {
        reviewProd: "adminView",
    });

    res.status(200).json({
        status: "success",
        result: pending.length,
        data: pending,
    });
});
