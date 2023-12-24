const http = require("http");
const express = require("express");

//!Server oluşturma kodları
const app = express();
const server = http.createServer(app);

//? Server Başlatma kodları
const PORT = process.env.PORT || 1998;
server.listen(PORT, console.log(`${PORT} portu çalışıyor`));
