const express = require('express')

const userRouter = express.Router();

userRouter.post('/signup', () => {
  // Function for signing a new user in goes here
  res.send('New user signed up successfully')
});

userRouter.post('/login', () => {
  // Function for logging a user in goes here
  res.send('User logged in successfully')
});

userRouter.post('/logout', () => {
  // Function for logging out a user goes here
  res.send('User logged out successfully')
});

module.exports = userRouter;
