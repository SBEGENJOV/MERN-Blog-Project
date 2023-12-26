const express = require("express");
const isLoggin = require("../../middlewares/isLoggin");
const { createComment } = require("../../controllers/comments/comments");

const commentsRouter = express.Router();

commentsRouter.post("/:postsId", isLoggin, createComment);

module.exports = commentsRouter;
