const mongoose = require("mongoose");

//Scema

const categoryScema = new mongoose.Schema(
  {
    name: {
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
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
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

//Category modellemesi bitti

const Category = mongoose.model("Category", categoryScema);

module.exports = Category;
