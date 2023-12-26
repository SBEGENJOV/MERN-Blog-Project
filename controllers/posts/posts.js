const asyncHandler = require("express-async-handler");
const Category = require("../../model/Category/Category");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const expressAsyncHandler = require("express-async-handler");
//@desc  Create a post
//@route POST /api/v1/posts
//@access Private

exports.createPost = asyncHandler(async (req, res) => {
  const { title, content, categoryId } = req.body;
  //Post kontollu
  const postFound = await Post.findOne({ title });
  if (postFound) {
    throw new Error("Post zaten var");
  }

  //Create post
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
  });

  //Kullanıcının postlarını güncelleme
  await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  //Categorinin postlarını güncelleme
  await Category.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  //Sonuçları bildirme
  res.json({
    status: "Başarılı",
    message: "Post yüklendi",
    post,
  });
});

//@desc  Get all posts
//@route GET /api/v1/posts
//@access Private

exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  res.status(201).json({
    status: "Başarılı",
    message: "Postlar getirildi",
    posts,
  });
});

//@desc  Get single post
//@route GET /api/v1/posts/:id
//@access PUBLIC
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(201).json({
    status: "Başarılı",
    message: "Post getirildi",
    post,
  });
});

//@desc  Delete Post
//@route DELETE /api/v1/posts/:id
//@access Private

exports.deletePosts = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "Başarılı",
    message: "Post silindi",
  });
});

//@desc  update Posts
//@route PUT /api/v1/posts/:id
//@access Private

exports.updatePosts = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: "Başarılı",
    message: "Categori güncellendi",
    post,
  });
});
