const http = require("http");
const express = require("express");
const usersRouter = require("./routes/users/usersRouter");
require("./config/database")(); //Sayfa açıldıgında direkt çalışacagı için bir değişkene atama geregi duymadık

//!Server oluşturma kodları
const app = express();

//Middlewarler

//Gelen verileri JSON formatına dönüştürme işlemi yapılıyor
app.use(express.json());
// Yönlendirme işlemleri
app.use("/", usersRouter);

const server = http.createServer(app);

//? Server Başlatma kodları
const PORT = process.env.PORT || 1998;
server.listen(PORT, console.log(`${PORT} portu çalışıyor`));
