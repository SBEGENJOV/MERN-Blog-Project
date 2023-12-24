const mongoose = require("mongoose");

//Scema

const postScema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    claps: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    shares: {
      type: Number,
      default: 0,
    },
    postViews: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    accountLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    shedduledPublished: {
      type: Date,
      default: null,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    disLikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      }],
  },
  {
    timestamps: true,
  }
);

//Post modellemesi bitti

const Post = mongoose.model("Post", postScema);

module.exports = Post;
