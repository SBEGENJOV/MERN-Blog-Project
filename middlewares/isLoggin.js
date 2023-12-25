const jwt = require("jsonwebtoken");
const User = require("../model/User/User");
const isLoggin = (req, res, next) => {
const token = req.headers.authorization?.split(" ")[1];

  jwt.verify(token, "anykey", async (err, decoded) => {
    //Kullanıcı Id sini bulma
    const userId = decoded?.user?.id;
    //Kullanıcı bilgilerinin tümünü getirdik
    const user = await User.findById(userId).select('username email role _id');
    //Kullanıcı bilgilerini req objesine geçirme
    req.userAuth = user;
    if (err) {
      return "Geçersiz token";
    } else {
      next();
    }
  });
};

module.exports = isLoggin;
