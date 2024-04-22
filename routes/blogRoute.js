const express = require("express");
const blogController = require("../controllers/blogController");
const { verifyToken } = require("../middlewares/validations/validateUser");

const blogRoute = express.Router();

blogRoute.post("/create", verifyToken, blogController.create);
blogRoute.delete("/:id", verifyToken, blogController.delete);
blogRoute.get("/:blogId", blogController.get);
blogRoute.get("/", blogController.getBlogs);
blogRoute.patch("/:id", verifyToken, blogController.update);

module.exports = blogRoute;