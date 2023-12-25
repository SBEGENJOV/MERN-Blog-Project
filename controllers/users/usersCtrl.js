const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");

//@desc Register a new user
//@route Post /api/v1/users/register
//@access public

exports.register = async (req, res) => {
  try {
    //Kayıt işlemi
    const { username, email, password } = req.body;
    //Kullanıcı kontrolu
    const user = await User.findOne({ username });
    if (user) {
      throw new Error("Kullanıcı zaten kayıtlı");
    }
    //Kayıt yapılma aşaması
    const newUser = new User({
      username,
      email,
      password,
    });
    //Şifreyi güvenliye dönüştürme
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    //Kayıt
    await newUser.save();
    res
      .status(200)
      .json({ status: "OK", message: "Kullanıcı kayıt işlemi tamam", newUser });
  } catch (error) {
    res.json({ error: error });
  }
};

//@desc User Login
//@route Post /api/v1/users/login
//@access public

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Kullanıcı kontrolu
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }
    const isMatched = await bcrypt.compare(password, user?.password);
    if (!isMatched) {
      throw new Error("Giriş bilgileri doğru değil");
    }
    // Son giriş zamanını güncelleme için veritabanında bir güncelleme işlemi gerçekleştirilmeli
    user.lastLogin = new Date();
    res.json({
      status: "success",
      email: user?.email,
      _id: user?._id,
      username: user?.username,
      role: user?.role,
      token: generateToken(user),
      profilePicture: user?.profilePicture,
      isVerified: user?.isVerified,
    });
  } catch (error) {
    res.json({ status: "olumsuz", message: error?.message });
  }
};

//@desc Get profile
//@route Post /api/v1/users/profile/:id
//@access public

exports.getProfile = async (req, res) => {
  try {
    const id = req.userAuth._id;
    const user = await User.findById(id);
    res.json({
      status: "succes",
      message: "Profile girildi",
      user,
    });
  } catch (error) {
    res.json({
      status: "Başarısız",
      message: error?.message,
    });
  }
};
