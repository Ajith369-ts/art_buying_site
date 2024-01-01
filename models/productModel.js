const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "A product should have title"],
        trim: true,
        maxLength: [40, "A product name should be less than 40 characters"],
    },
    images: [String],
    imageCover: {
        type: String,
        required: [true, "A product need to have a cover image"],
    },
    price: {
        type: String,
        required: [true, "A product should have a price"],
    },
    description: {
        type: String,
        trim: true,
    },
    medium: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A product should have artist"],
    },
    tags_keywords: {
        type: [String],
        default: ["art"],
    },
    dimensions: {
        type: String,
        required: [true, "A image should have a dimensions"],
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
    isApproved: {
        type: Boolean,
        default: false,
    },
});

productSchema.pre(/^find/, function (next) {
    if (this.options.reviewProd === "adminView")
        this.find({ isApproved: { $eq: false } });
    else this.find({ isApproved: { $ne: false } });
    next();
});

const Product = mongoose.model("Product", productSchema);

/*
const testProduct = new Product({
    title: "The Earth",
    images: ["tour-2-1.jpg", "tour-2-2.jpg", "tour-2-3.jpg"],
    imageCover: "tour-1-cover.jpg",
    price: 0,
    description: "An illustration of a cartoon earth (Earth day special).",
    artist: "Ajith kumar",
    tags_keywords: ["earth", "illustration", "illustrator"],
    dimensions: "1000x1000",
    createdAt: "2021-04-25T09:00:00.000Z",
    modiFiedAt: "2021-04-25T09:00:00.000Z",
});

testProduct
    .save()
    .then((doc) => {
        console.log(doc);
    })
    .catch((err) => {
        console.log(err);
    });
*/

module.exports = Product;
