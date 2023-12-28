const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/sendEmail");
const expressAsyncHandler = require("express-async-handler");
const sendAccVerificationEmail = require("../../utils/sendAccVerificationEmail");

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
    profilePicture: req?.file.path,
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
  const user = await User.findById(id)
    .populate({
      path: "posts",
      model: "Post",
    })
    .populate({
      path: "following",
      model: "User",
    })
    .populate({
      path: "blockedUsers",
      model: "User",
    })
    .populate({
      path: "profileViewrs",
      model: "User",
    });
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

exports.unblockuser = asyncHandler(async (req, res) => {
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
});

//@desc   Kimler profilime baktı
//@route  GET /api/v1/users/profile-viewer/:userProfileId
//@access Private

exports.profileViewers = asyncHandler(async (req, res) => {
  //* Find that we want to view his profile
  const userProfileId = req.params.userProfileId;

  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    throw new Error("Böyle bir kullanıcı yok");
  }
  //Kendi bilgilerini bulmak
  const currentUserId = req.userAuth._id;
  //? Check if user already viewed the profile
  if (userProfile?.profileViewrs?.includes(currentUserId)) {
    throw new Error("Zaten bakmışsın");
  }
  //push the user current user id into the user profile
  userProfile.profileViewrs.push(currentUserId);
  await userProfile.save();
  res.json({
    message: "Profile bakılanlar listesine eklendi",
    status: "Başarılı",
  });
});

//@desc   Follwing user
//@route  PUT /api/v1/users/following/:userIdToFollow
//@access Private

exports.followingUser = asyncHandler(async (req, res) => {
  //Giriş yapan kişiyi buluyoruz.
  const currentUserId = req.userAuth._id;
  //! Takip edecegimiz kişiyi arıyoruz
  const userToFollowId = req.params.userToFollowId;
  console.log(currentUserId);
  console.log(userToFollowId);
  //Takip edecegimiz kişinin kendimiz olmadıgını belli ediyoruz
  if (currentUserId.toString() === userToFollowId.toString()) {
    throw new Error("Kendini takip edemezsiz");
  }

  //Giriş yapan kişinin takip ettiklerine ekler
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: { following: userToFollowId }, //addToSet: Mongo DB kodudur ve yeni bir deger eklemek için kullınılır.
    },
    {
      new: true,
    }
  );
  //Aranan kişinin takipçilerine eklemek için kullanılır
  await User.findByIdAndUpdate(
    userToFollowId,
    {
      $addToSet: { followers: currentUserId }, //addToSet: Mongo DB kodudur ve yeni bir deger eklemek için kullınılır.
    },
    {
      new: true,
    }
  );
  //işlem sonucunu gönder
  res.json({
    status: "Başarılı",
    message: "Takip etme kodu başarılı",
  });
});

//@desc   UnFollwing user
//@route  PUT /api/v1/users/unfollowing/:userIdToUnFollow
//@access Private

exports.unFollowingUser = asyncHandler(async (req, res) => {
  //Kendini bulma
  const currentUserId = req.userAuth._id;
  //! Takipden çıkacagın kişiyi bulma
  const userToUnFollowId = req.params.userToUnFollowId;

  //Kendi kendini takipden çıkamazsın
  if (currentUserId.toString() === userToUnFollowId.toString()) {
    throw new Error("Kendi kendini takipden çıkamazsın");
  }
  //Takip edilenlerden çıkarma kodları
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userToUnFollowId }, //Pull kodu Mongo DB ye özeldir ve bir degeri çıkrmak için kullanılır
    },
    {
      new: true,
    }
  );
  //Takip edenlerden çıkarma
  await User.findByIdAndUpdate(
    userToUnFollowId,
    {
      $pull: { followers: currentUserId }, //Pull kodu Mongo DB ye özeldir ve bir degeri çıkrmak için kullanılır
    },
    {
      new: true,
    }
  );
  //send the response
  res.json({
    status: "başarılı",
    message: "Takipden çıkma işlemi gerçekleştirildi",
  });
});

// @route   POST /api/v1/users/forgot-password
// @desc   Forgot password
// @access  Public

exports.forgotpassword = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  //DB de maili arıyoruz
  const userFound = await User.findOne({ email });
  if (!userFound) {
    throw new Error("Email iniz sistemde kayıtlı degil");
  }
  //Yeni token oluşturma
  const resetToken = await userFound.generatePasswordResetToken();
  //Degişimi kaydediyoruz
  await userFound.save();

  //send email
  sendEmail(email, resetToken);
  res
    .status(200)
    .json({ message: "Şifre yenileme mesajı gönderildi", resetToken });
});

// @route   POST /api/v1/users/reset-password/:resetToken
// @desc   Reset password
// @access  Public

exports.resetPassword = expressAsyncHandler(async (req, res) => {
  //email de gelen parametreyi alma
  const { resetToken } = req.params;
  const { password } = req.body;
  //Veritabındaki token ile dışardan gelen token karşılaştırılır.
  const cryptoToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //Bizim verecegimiz özelliklere uyan kişileri buluyoruz
  const userFound = await User.findOne({
    passwordResetToken: cryptoToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!userFound) {
    throw new Error("Şifre yenilemek için verilen süre bitmiş olabilir");
  }
  //Şİfreyi değiştiriyoruz
  const salt = await bcrypt.genSalt(10);
  userFound.password = await bcrypt.hash(password, salt);
  userFound.passwordResetExpires = undefined;
  userFound.passwordResetToken = undefined;
  //İşlem sonucunu döndürüyoruz
  await userFound.save();
  res.status(200).json({ message: "Şifre yenileme işlemi başarılı" });
});

// @route   POST /api/v1/users/account-verification-email/
// @desc    Send Account verification email
// @access  Private

exports.accountVerificationEmail = expressAsyncHandler(async (req, res) => {
  //Kullanıcı mail ini  db de aramak
  const user = await User.findById(req?.userAuth?._id);
  if (!user) {
    throw new Error("Böyle bir kullanıcı yok");
  }
  //Token i maile gönderme
  const token = await user.generateAccVerificationToken();
  //resave
  await user.save();
  //Mail atma
  sendAccVerificationEmail(user?.email, token);
  res.status(200).json({
    message: `Hesabı onaylamak için bilirim bu maile gönderildi: ${user?.email}`,
  });
});

// @route   POST /api/v1/users/verify-account/:verifyToken
// @desc    Verify token
// @access  Private

exports.verifyAccount = expressAsyncHandler(async (req, res) => {
  //Token i kullanıcının taraycısından alacagız
  const { verifyToken } = req.params;
  //Veri tabındaki veri ile kullanıcıdan aldıgımız veriyi karşılaştırıyoruz
  const cryptoToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");
  //DB deki veriler ile karşılaştırma yapılıyor
  const userFound = await User.findOne({
    accountVerificationToken: cryptoToken,
    accountVerificationExpires: { $gt: Date.now() },
  });
  if (!userFound) {
    throw new Error(
      "Hesabı onaylamak için gönderilen token tarihi geçmiş olabilir"
    );
  }
  //Kullanıcı bilgileri güncellendi
  userFound.isVerified = true;
  userFound.accountVerificationExpires = undefined;
  userFound.accountVerificationToken = undefined;
  //Sonuç
  await userFound.save();
  res.status(200).json({ message: "Hesap onaylandı" });
});

//@desc  Upload profile image
//@route  PUT /api/v1/users/upload-profile-image
//@access Private

exports.uploadeProfilePicture = asyncHandler(async (req, res) => {
  // Kullanıcıyı arama
  const userFound = await User.findById(req?.userAuth?._id);
  if (!userFound) {
    throw new Error("Kullanıcı Yok");
  }
  const user = await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $set: { profilePicture: req?.file?.path }, //resim i güncelleme
    },
    {
      new: true, //yeni degeri döndürür.
    }
  );

  //? Sonuçu yazdırma
  res.json({
    status: "Başarılı",
    message: "Kullanıcı resim güncellendi",
    user,
  });
});

//@desc   Upload cover image
//@route  PUT /api/v1/users/upload-cover-image
//@access Private

exports.uploadeCoverImage = asyncHandler(async (req, res) => {
  // Kullanıcıyı arama
  const userFound = await User.findById(req?.userAuth?._id);
  if (!userFound) {
    throw new Error("Böyle bir kullanıcı yok");
  }
  const user = await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $set: { coverImage: req?.file?.path },
    },
    {
      new: true,
    }
  );

  //? send the response
  res.json({
    status: "Başarılı",
    message: "Kullancı küçük resim güncellendi",
    user,
  });
});
