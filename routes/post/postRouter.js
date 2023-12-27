const express = require("express");
const isLoggin = require("../../middlewares/isLoggin");
const {
  createPost,
  getPost,
  getPosts,
  deletePosts,
  updatePosts,
  likePost,
  disLikePost,
  claps,
  schedule,
} = require("../../controllers/posts/posts");
const checkAccountVerification = require("../../middlewares/isAccountVerified");

const postRouter = express.Router();

// oluşturma
postRouter.post("/", isLoggin, checkAccountVerification, createPost);
postRouter.get("/", getPosts);
postRouter.get("/:id", getPost);
postRouter.delete("/:id", isLoggin, deletePosts);
postRouter.put("/:id", isLoggin, updatePosts);
postRouter.put("/likes/:id", isLoggin, likePost);
postRouter.put("/dislikes/:id", isLoggin, disLikePost);
postRouter.put("/claps/:id", isLoggin, claps);
postRouter.put("/schedule/:postId", isLoggin, schedule);

module.exports = postRouter;
