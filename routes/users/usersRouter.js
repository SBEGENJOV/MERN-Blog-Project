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
} = require("../../controllers/users/usersCtrl");
const isLoggin = require("../../middlewares/isLoggin");

//*Kütüphaneyi kullana bilmek için değişkene atadım.
const usersRouter = express.Router();

//! Register sayfasına gönderir.
usersRouter.post("/register", register);
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

//*Kullana bilmek için eksport ediyorum
module.exports = usersRouter;
