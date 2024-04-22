require("./authentication/auth");
const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

const userRouter = require("./routes/authRoute");
const articleRouter = require("./routes/articleRoute");
const publicRouter = require("./routes/publicRoute");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");

app.use("/api", publicRouter);
app.use("/api", userRouter);
app.use(
  "/api",
  passport.authenticate("jwt", { session: false }),
  articleRouter
);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't access ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;