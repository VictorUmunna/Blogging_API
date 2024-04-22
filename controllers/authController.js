const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();

exports.signUp = async (req, res, next) => {
  try {
    res.status(201).send({
      user: {
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error("Username or password is incorrect");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: "1hr",
        });
        return res.status(200).json({ token });
      });

      next();
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};