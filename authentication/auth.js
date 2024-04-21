const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/users');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
            // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // Use this if you are using Bearer token
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);


//signup

passport.use(
    'signup',
    new localStrategy(
        {
            firstnameField: 'first_name',
            lastnameField: 'last_name',
            usernameField: 'email',
            passwordField: 'password'
        },
        async (first_name, last_name, email, password, done) => {
            try {
                const user = await UserModel.create({ first_name, last_name, email, password });
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    
    )
);



// login middleware

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try{
                const user = await UserModel.findOne({email})

                // Check if user exists
                if(!user){
                    return done(null, false, {message: 'User not found!'})
                }
                
                // Validate password
                if(!await user.isValidPassword(password)){
                    return done(null, false, {message: 'Incorrect password!'})
                }

                // If user and password are correct, return user data
                return done(null, user, {message: 'Logged in successfully!'})
            }
            catch(error){
                return done(error);
            }
        }

    )
);
    