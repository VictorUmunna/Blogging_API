const express = require("express");
const publicRouter = express.Router();

const articleController = require("../controllers/articleController");

publicRouter
  .route("/blog/publish/:id")
  .get(articleController.getPublishedArticle);

publicRouter.get("/blog/list", articleController.getBlogList);

module.exports = publicRouter;