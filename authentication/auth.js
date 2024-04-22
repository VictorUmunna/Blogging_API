const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const localStrategy = require("passport-local").Strategy;
require("dotenv").config();
const userModel = require("../models/userModel");

// Auth endpoints with JWTStrategy
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// AUth email and password with passport-local

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const user = await userModel.create({
          email,
          first_name,
          last_name,
          password,
        });
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  //   create strategy and configure state
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const validPassword = user.isValidPassword(password);
        if (!validPassword) {
          return done(null, false, { message: "Password is incorrect" });
        }
        return done(null, user, { message: "Login successfull" });
      } catch (err) {
        return done(err);
      }
    }
  )
);