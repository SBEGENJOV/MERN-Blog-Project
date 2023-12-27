const multer = require("multer");
const express = require("express");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockuser,
  profileViewers,
  followingUser,
  unFollowingUser,
  forgotpassword,
  resetPassword,
  accountVerificationEmail,
  verifyAccount,
} = require("../../controllers/users/usersCtrl");
const isLoggin = require("../../middlewares/isLoggin");
const storage = require("../../utils/fileUpload");
//!Dosya yükleme ara yazılımı
const upload = multer({ storage });

//*Kütüphaneyi kullana bilmek için değişkene atadım.
const usersRouter = express.Router();

//! Register sayfasına gönderir.
usersRouter.post("/register", upload.single("profilePicture"), register);
//! Login sayfasına gönderir.
usersRouter.post("/login", login);
//! ID ye göre girme sayfasına gönderir.
usersRouter.get("/profile/", isLoggin, getProfile);
//! kullanıcı engelleme
usersRouter.put("/block/:userIdToBlock", isLoggin, blockUser);
//! kullanıcı engelini kaldırma
usersRouter.put("/unblock/:userIdToUnBlock", isLoggin, unblockuser);
//! Profile bakanları görme
usersRouter.get("/profile-viewer/:userProfileId", isLoggin, profileViewers);
//! Takip etme
usersRouter.put("/following/:userToFollowId", isLoggin, followingUser);
//! Takipden çıkma
usersRouter.put("/unfollowing/:userToUnFollowId", isLoggin, unFollowingUser);
//! Şifremi unuttum
usersRouter.post("/forgot-password/", forgotpassword);
//! Şifreyi resetleme
usersRouter.post("/reset-password/:resetToken", resetPassword);
//! Hesap Onaylama Mail
usersRouter.put(
  "/account-verification-email/",
  isLoggin,
  accountVerificationEmail
);
//! Hesap Onaylama Mail
usersRouter.put("/account-verification/:verifyToken", isLoggin, verifyAccount);

//*Kullana bilmek için eksport ediyorum
module.exports = usersRouter;
