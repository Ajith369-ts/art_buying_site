const express = require("express");
const expressValidator = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.get("/register", authController.getRegister);

router.post("/login", authController.postLogin);

router.get("/logout", authController.postLogout);

router.post("/register",
        [expressValidator.check("username")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),

        expressValidator.body("password", "Password must be min 6 character")
        .isLength({min: 6})
        .trim(),

        expressValidator.body("confirmPassword").custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Password have to match!");
            }
            return true;
        })
        ], authController.postRegister);

module.exports = router;