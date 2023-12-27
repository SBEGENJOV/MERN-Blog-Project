const mongoose = require("mongoose");

//Scema

const commentScema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

//Comment modellemesi bitti

const Comment = mongoose.model("Comment", commentScema);

module.exports = Comment;
