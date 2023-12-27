const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");

//@desc Register a new user
//@route Post /api/v1/users/register
//@access public

exports.register = asyncHandler(async (req, res) => {
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
});

//@desc User Login
//@route Post /api/v1/users/login
//@access public

exports.login = asyncHandler(async (req, res) => {
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
});

//@desc Get profile
//@route Post /api/v1/users/profile/:id
//@access public

exports.getProfile = asyncHandler(async (req, res, next) => {
  const id = req.userAuth._id;
  const user = await User.findById(id);
  res.json({
    status: "succes",
    message: "Profile girildi",
    user,
  });
});

//@desc Block user
//@route Post /api/v1/users/block/:userIdToBlock
//@access privte

exports.blockUser = asyncHandler(async (req, res) => {
  //* Bloklacanak kişiyi arıyoruz
  const userIdToBlock = req.params.userIdToBlock;
  const userToBlock = await User.findById(userIdToBlock);
  if (!userToBlock) {
    throw new Error("Kullanıcı yok");
  }
  // ! Kendi kendini bloklamasın diye karşılaştırma yapıyoruz.
  const userBlocking = req.userAuth._id;
  // check if user is blocking him/herself
  if (userIdToBlock.toString() === userBlocking.toString()) {
    throw new Error("Kendi kendini bloklayamazsın");
  }
  //find the current user
  const currentUser = await User.findById(userBlocking);
  //? Check if user already blocked
  if (currentUser?.blockedUsers?.includes(userIdToBlock)) {
    throw new Error("Kullanıcı zaten bloklu");
  }
  //push the user to be blocked in the array of the current user
  currentUser.blockedUsers.push(userIdToBlock);
  await currentUser.save();
  res.json({
    message: "Kullanıcı başarı ile bloklandı",
    status: "Başarılı",
  });
});


//@desc unBlock user
//@route Post /api/v1/users/unblock/:userIdToBlock
//@access privte

exports.unblockuser = asyncHandler(async(req,res)=>{
  //Blokdan çıkaralıcak kişiyi bul
  const userIdToUnBlock = req.params.userIdToUnBlock;
  const userToUnBlock = await User.findById(userIdToUnBlock);
  if (!userToUnBlock) {
    throw new Error("Böyle bir kullanıcı yok");
  }
  //Kendimizi buluyoruz
  const userUnBlocking = req.userAuth._id;
  const currentUser = await User.findById(userUnBlocking);

  //check if user is blocked before unblocking
  if (!currentUser.blockedUsers.includes(userIdToUnBlock)) {
    throw new Error("Bu kullanıcı bloklu değil");
  }
  //Kullanıcı bloklular listesinden çıkarma
  currentUser.blockedUsers = currentUser.blockedUsers.filter(
    (id) => id.toString() !== userIdToUnBlock.toString()
  );
  //resave the current user
  await currentUser.save();
  res.json({
    status: "Başarılı",
    message: "Kullanıcı blokdan çıkarıldı",
  });
})