const express = require("express");
const path = require("path");

const multer = require("multer");

const mongoose = require("mongoose");

const User = require("./models/user");

// Authentication
const session = require("express-session");
const passport = require("passport");

// Template Engine
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorPage = require("./routes/404error");

app.use(express.urlencoded({ extended: false }));
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorPage);

mongoose
    .connect(`mongodb://localhost:27017/${process.env.MONGO_DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then((result) => {
        app.listen(3000, () => {
            console.log("server running on port 3000");
        });
    })
    .catch((err) => {
        console.log(err);
    });
