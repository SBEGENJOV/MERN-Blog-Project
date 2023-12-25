const express = require("express");
const { register, login } = require("../../controllers/users/usersCtrl");

//*Kütüphaneyi kullana bilmek için değişkene atadım.
const usersRouter = express.Router();

//! Register sayfasına gönderir.
usersRouter.post("/api/v1/users/register", register);
//! Login sayfasına gönderir.
usersRouter.post("/api/v1/users/login", login);

//*Kullana bilmek için eksport ediyorum
module.exports = usersRouter;
