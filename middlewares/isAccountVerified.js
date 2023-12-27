const User = require("../model/User/User");

const checkAccountVerification = async (req, res, next) => {
  try {
    //Kullanıcı ara
    const user = await User.findById(req.userAuth._id);
    //Hesap onaylanmış mı kontol et
    if (user?.isVerified) {
      next();
    } else {
      res.status(401).json({ message: "Hesap onaylanmamış" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Hatası", error });
  }
};

module.exports = checkAccountVerification;