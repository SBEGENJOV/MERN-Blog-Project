const http = require("http");
const express = require("express");
const usersRouter = require("./routes/users/usersRouter");
require("./config/database")(); //Sayfa açıldıgında direkt çalışacagı için bir değişkene atama geregi duymadık

//!Server oluşturma kodları
const app = express();

//Middlewarler

//Gelen verileri JSON formatına dönüştürme işlemi yapılıyor
app.use(express.json());
// Yönlendirme işlemleri..
app.use("/api/v1/users", usersRouter);
//! Hata alınca gitmesi gereken alan
app.use((err, req, res, next) => {
  //status
  const status = err?.status ? err?.status : "Hatalı";
  //mesaj
  const message = err?.message;
  //stack
  const stack = err?.stack;
  res.status(500).json({
    status,
    message,
    stack,
  });
});

const server = http.createServer(app);

//? Server Başlatma kodları
const PORT = process.env.PORT || 1998;
server.listen(PORT, console.log(`${PORT} portu çalışıyor..`));
