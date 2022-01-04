const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    cart: {
        items: [{
            productId: {type: mongoose.Schema.Types.ObjectId},
            quantity: {type: Number}
        }]
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);