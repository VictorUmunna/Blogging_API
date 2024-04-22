const Joi = require("joi");
const postValidator = Joi.object({
  body: Joi.string().trim().required(),
  createAt: Joi.date().min("now").iso().timestamp(),
  updatedAt: Joi.date().greater("now").iso().timestamp(),
  title: Joi.string().max(100).trim().required(),
  description: Joi.string().max(300).trim().required(),
  tags: Joi.array().items(Joi.string().required()),
  state: Joi.string(),
});

const validatePostMiddelWare = async (req, res, next) => {
  const postPayload = req.body;
  try {
    await postValidator.validateAsync(postPayload);
    next();
  } catch (error) {
    return res.status(406).send(error.details[0].message);
  }
};

module.exports = validatePostMiddelWare;