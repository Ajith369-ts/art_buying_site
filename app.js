const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./util/AppError");
const globalErrorHandler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// Set security header
app.use(helmet());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Limit IP from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, Please try again in an hour",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

// Data sanitization against Nosql injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: ["artist", "price"],
    })
);

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
    next(new AppError("Page not there....404 not found!", 404));
});

app.use(globalErrorHandler);

module.exports = app;
