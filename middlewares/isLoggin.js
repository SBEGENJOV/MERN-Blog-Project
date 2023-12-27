const jwt = require("jsonwebtoken");
const User = require("../model/User/User");
const isLoggin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    //Kullanıcı Id sini bulma
    const userId = decoded?.user?.id;
    //Kullanıcı bilgilerinin tümünü getirdik
    const user = await User.findById(userId).select("username email role _id");
    //Kullanıcı bilgilerini req objesine geçirme
    req.userAuth = user;
    if (err) {
      const err = new Error("Geçersiz token");
      next(err);
    } else {
      next();
    }
  });
};

module.exports = isLoggin;
