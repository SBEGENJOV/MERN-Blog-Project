const mongoose = require("mongoose");
//connect to db

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://seydi19981995:GUoYAStDSLiz8KlF@mern-blog-v1.wwfafhe.mongodb.net/"
    );
    console.log("Veri tabanı baglantısı başarılı");
  } catch (error) {
    console.log("Veri tabanı baglantısı başarısız", error.message);
  }
};

module.exports = connectDB;
