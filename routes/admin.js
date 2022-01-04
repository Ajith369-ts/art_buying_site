const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/add-product", adminController.renderAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/products", adminController.renderAdminProducts);

router.get("/edit-product/:prodId", adminController.adminEditProduct);

router.post("/edit-product", adminController.adminUpdateProduct);

router.post("/delete-product", adminController.adminDeleteProduct)

module.exports = router;