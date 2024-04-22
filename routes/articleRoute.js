const express = require("express");
const articleRouter = express.Router();

const articleController = require("../controllers/articleController");

const articleValidator = require("../validators/article.validator");

// articleRouter.post(
//   "/blog/create",
//   articleValidator,
//   articleController.createArticle
// );

articleRouter
  .route("/blog")
  .post(articleValidator, articleController.createArticle)
  .get(articleController.getBlogByOwner);

articleRouter
  .route("/blog/:id")
  .patch(articleController.updateById)
  .delete(articleController.deleteById);
articleRouter.patch("/blog/state/:id", articleController.updateStateById);

module.exports = articleRouter;