const express = require("express");
const { register, login, getProfile } = require("../../controllers/users/usersCtrl");

//*Kütüphaneyi kullana bilmek için değişkene atadım.
const usersRouter = express.Router();

//! Register sayfasına gönderir.
usersRouter.post("/register", register);
//! Login sayfasına gönderir.
usersRouter.post("/login", login);
//! ID ye göre girme sayfasına gönderir.
usersRouter.get("/profile/:id", getProfile);
    
//*Kullana bilmek için eksport ediyorum
module.exports = usersRouter;
