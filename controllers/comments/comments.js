const asyncHandler = require("express-async-handler");
const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");

//@desc  Create a comment
//@route POST /api/v1/comments/:id
//@access Private

exports.createComment = asyncHandler(async (req, res) => {
  //get the payload
  const { message, author } = req.body;
  //get post id from params
  const postsId = req.params.postsId;
  //* Create comment
  const comment = await Comment.create({
    message,
    author: req.userAuth._id,
    postsId,
  });
  //Associate comment to a post
  await Post.findByIdAndUpdate(
    postsId,
    {
      $push: { comments: comment._id },
    },
    { new: true }
  );
  //send the response
  res.json({
    status: "Başarılı",
    message: "Yorum başarı ile oluşturuldu",
    comment,
  });
});
