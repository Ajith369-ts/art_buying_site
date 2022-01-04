const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.renderProducts);

router.get("/home", shopController.renderHome);

router.get("/products", (req, res, next) => {
    res.send("<h1>Hi</h1>")
});

router.get("/cart", (req, res, next) => {
    res.render("shop/cart");
});

router.get("/product/:productId", shopController.renderProdDetails);


module.exports = router;