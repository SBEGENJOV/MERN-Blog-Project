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
//! Profile bakanları görme
usersRouter.put("/following/:userToFollowId", isLoggin, followingUser);
//! Profile bakanları görme
usersRouter.put("/unfollowing/:userToUnFollowId", isLoggin, unFollowingUser);

//*Kullana bilmek için eksport ediyorum
module.exports = usersRouter;
