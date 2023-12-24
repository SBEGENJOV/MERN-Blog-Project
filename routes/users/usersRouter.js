const express = require("express");
const { register } = require("../../controllers/users/usersCtrl");

//*Kütüphaneyi kullana bilmek için değişkene atadım.
const usersRouter = express.Router();

//! Register sayfasına gönderir.
usersRouter.post('/api/v1/users/register', register);

//*Kullana bilmek için eksport ediyorum
module.exports = usersRouter;