const express = require("express");
const userController = require("../controllers/userController");

const userRoute = express.Router();

userRoute.put("/:id", userController.updateUser);
userRoute.get("/:id", userController.getUser);

module.exports = userRoute;