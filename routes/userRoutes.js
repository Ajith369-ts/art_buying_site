const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all the middleware below here
router.use(authController.protect);

router.patch("/upgrade-to-creator", authController.updateUserToCreator);

router.patch("/updateMyPassword", authController.updatePassword);

router.get("/me", userController.getMe, userController.getUser);

router.patch("/updateMe", userController.updateMe);

router.delete("/deleteMe", userController.deleteMe);

router.route("/").get(userController.getAllUsers);

router.route("/:id").get(userController.getUser);

module.exports = router;
