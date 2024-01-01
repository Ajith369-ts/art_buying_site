const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

router
    .route("/")
    .get(productController.getAllProduct)
    .post(
        authController.protect,
        authController.restrictTo("admin", "creator"),
        productController.createProduct
    );

router
    .route("/reviewProduct")
    .get(
        authController.protect,
        authController.restrictTo("admin"),
        productController.reviewProduct
    );

router.route("/:userId/artworks").get(productController.getAllProduct);

router
    .route("/:id")
    .get(authController.protect, productController.getProduct)
    .patch(productController.updateProduct)
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        productController.deleteProduct
    );

module.exports = router;
