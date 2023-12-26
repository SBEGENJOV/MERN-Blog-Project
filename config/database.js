const mongoose = require("mongoose");
//connect to db

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MOGO_URL
    );
    console.log("Veri tabanı baglantısı başarılı");
  } catch (error) {
    console.log("Veri tabanı baglantısı başarısız", error.message);
  }
};

module.exports = connectDB;
