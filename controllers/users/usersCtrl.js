//@desc Register a new user
//@route Post /api/v1/users/register
//@access public

const User = require("../../model/User/User");

exports.register = async (req, res) => {
  try {
    //Kayıt işlemi
    const { username, email, passwords } = req.body;
    //Kullanıcı kontrolu
    const user = await User.findOne({ username });
    if (user) {
      throw new Error("Kullanıcı zaten kayıtlı");
    }
    //Kayıt yapılma aşaması
    const newUser = new User({
      username,
      email,
      passwords,
    });
    await newUser.save();
    res
      .status(200)
      .json({ status: "OK", message: "Kullanıcı kayıt işlemi tamam", newUser });
  } catch (error) {
    res.json({ error: error });
  }
};
