const express = require("express");
const isLoggin = require("../../middlewares/isLoggin");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../../controllers/comments/comments");

const commentsRouter = express.Router();

commentsRouter.post("/:postsId", isLoggin, createComment);
commentsRouter.put("/:id", isLoggin, updateComment);
commentsRouter.delete("/:id", isLoggin, deleteComment);

module.exports = commentsRouter;
