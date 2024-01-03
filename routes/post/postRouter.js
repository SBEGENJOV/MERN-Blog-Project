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
const storage = require("../../utils/fileUpload");
const multer = require("multer");
const postRouter = express.Router();

//!Dosya yükleme ara yazılımı
const upload = multer({ storage });

// oluşturma
postRouter.post(
  "/",
  isLoggin,
  checkAccountVerification,
  upload.single("file"),
  createPost
);

postRouter.get("/", getPosts);
postRouter.get("/:id", getPost);
postRouter.delete("/:id", isLoggin, deletePosts);
postRouter.put("/:id", isLoggin, upload.single("file"), updatePosts);
postRouter.put("/likes/:id", isLoggin, likePost);
postRouter.put("/dislikes/:id", isLoggin, disLikePost);
postRouter.put("/claps/:id", isLoggin, claps);
postRouter.put("/schedule/:postId", isLoggin, schedule);

module.exports = postRouter;
