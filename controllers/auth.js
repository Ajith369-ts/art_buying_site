
const passport = require("passport");
const User = require("../models/user");

const expressValidator = require("express-validator");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "login"
    });
};

exports.getRegister = (req, res, next) => {
    res.render("auth/register", {
        pageTitle: "Create Account",
        errorMsg: "",
        oldInput: {
            email: "",
            password: ""
        }
    });
};

exports.postLogin = (req, res, next) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password 
     });

     req.login(user, function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local", { failureRedirect: "/login" })(req, res, function(){
                res.redirect("/home");
            });
        }
    });
};

exports.postRegister = (req, res, next) => {

    const errors = expressValidator.validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render("auth/register", {
            pageTitle: "Create Account",
            errorMsg: errors.array()[0].msg,
            oldInput: {
                email: req.body.username,
                password: req.body.password
            }
        });
    } else {

    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/home");
            });
        }
    });
}
};

exports.postLogout = (req, res, next) => {
    req.logout();
    res.redirect("/login");
}