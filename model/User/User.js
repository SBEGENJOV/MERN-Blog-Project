const mongoose = require("mongoose");
const crypto = require("crypto");

//Scema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    notificationPreferences: {
      email: { type: String, default: true },
      // diger bildirim türleri (sms)
    },
    genderUser: {
      type: String,
      enum: ["male", "female", "prefer not to say", "nun-binary"],
    },
    profileViewrs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
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

//! Generate Password Reset Token metotu oluşturma
userSchema.methods.generatePasswordResetToken = function () {
  //token oluşturma
  const resetToken = crypto.randomBytes(20).toString("hex");
  //Kullanıcın şifresini sıfırlaması için token üretiyoruz belirlenen yere kaydediyoruz
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //Token geçerlilik süresini belirliyoruz
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//! Maile onay için token gönderme
userSchema.methods.generateAccVerificationToken = function () {
  //Token oluşturma
  const resetToken = crypto.randomBytes(20).toString("hex");
  //Oluşturulan tokeni hashleme
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Token geçerlilik süresini ayarlama
  this.accountVerificationExpires = Date.now() + 10 * 60 * 1000; //! 10 minutes
  return resetToken;
};

//User modellemesi bitti
const User = mongoose.model("User", userSchema);

module.exports = User;
