const asyncHandler = require("express-async-handler");
const Category = require("../../model/Category/Category");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const expressAsyncHandler = require("express-async-handler");
//@desc  Create a post
//@route POST /api/v1/posts
//@access Private

exports.createPost = asyncHandler(async (req, res) => {
  const { title, content, categoryId } = req.body;
  //Post kontollu
  const postFound = await Post.findOne({ title });
  if (postFound) {
    throw new Error("Post zaten var");
  }

  //Create post
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
    image: req?.file?.path,
  });

  //Kullanıcının postlarını güncelleme
  await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  //Categorinin postlarını güncelleme
  await Category.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  //Sonuçları bildirme
  res.json({
    status: "Başarılı",
    message: "Post yüklendi",
    post,
  });
});

//@desc  Get all posts
//@route GET /api/v1/posts
//@access Private

exports.getPosts = asyncHandler(async (req, res) => {
  //Hangi kullanıcının baktıgını belirliyoruz
  const loggedInUserId = req.userAuth?._id;
  const currentTime = new Date();
  //Bu kullanıcı bloclananlar arasında varmı kontrolu saglanıyor
  const usersBlockingLoggedInuser = await User.find({
    blockedUsers: loggedInUserId,
  });
  // Engellenleri tek tek getirme Id lerine göre
  const blockingUsersIds = usersBlockingLoggedInuser?.map((user) => user?._id);
  //! sorgu ile category ve özel yazı arama
  const category = req.query.category;
  const searchTerm = req.query.searchTerm;
  //Blok içinde olmayanları getirir
  let query = {
    author: { $nin: blockingUsersIds }, //nin demek not in anlamına gelir ve belli alan haricindekileri getirir.
    $or: [
      //or veya anlamında kullanılır.
      {
        shedduledPublished: { $lte: currentTime }, //lte   "less than or equal" (küçük veya eşit) anlamına gelir.
        shedduledPublished: null,
      },
    ],
  };

  if (category) {
    query.category = category;
  }
  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" }; //Burada ara regex ile arama yapılıyor ve options ile ise büyük küçük harf farkı kaldırılıyor.
  }
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments(query); //kaçtane post var

  const posts = await Post.find(query) //Aranan kiretere göre post getirme
    .populate({
      path: "author",
      model: "User",
      select: "email role username",
    })
    .populate("category") //referans tablo
    .skip(startIndex) //sayfadan kaçıncı postdan itibaren gösterilsin ayarı
    .limit(limit) //her sayfada kaç tane post götersilsin
    .sort({ createdAt: -1 }); //En yeni en başa gelmesi için
  // Sayflama sonuçları
  const pagination = {};
  if (endIndex < total) {
    //toplam post belirlenen sayfalama sayısından büyükse
    pagination.next = {
      page: page + 1, //sayfa artır
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(201).json({
    status: "Başarılı",
    message: "Postlar getirildi",
    posts,
  });
});

//@desc  Get single post
//@route GET /api/v1/posts/:id
//@access PUBLIC
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(201).json({
    status: "Başarılı",
    message: "Post getirildi",
    post,
  });
});

//@desc  Delete Post
//@route DELETE /api/v1/posts/:id
//@access Private

exports.deletePosts = asyncHandler(async (req, res) => {
  const postFound = await Post.findById(req.params.id);
  const isAuthor =
    req.userAuth?._id.toString() === postFound?.author?._id?.toString();
  if (!isAuthor) {
    throw new Error("İşlem gerçekleştirilemiyor, yazar siz değilsiniz !");
  }
  await Post.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "Başarılı",
    message: "Post silindi",
  });
});

//@desc  update Posts
//@route PUT /api/v1/posts/:id
//@access Private

exports.updatePosts = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: "Başarılı",
    message: "Categori güncellendi",
    post,
  });
});

//@desc   liking a Post
//@route  PUT /api/v1/posts/likes/:id
//@access Private

exports.likePost = expressAsyncHandler(async (req, res) => {
  //Post sahibinin id sini alma
  const { id } = req.params;
  //Kullanıcının giriş yaptıgı id yi bulma
  const userId = req.userAuth._id;
  //Postu bulma
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post yok");
  }
  //Begenenlere ekleme

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { likes: userId },
    },
    { new: true }
  );
  // Dislike deki degeri değiştirme kodu
  post.dislikes = post.dislikes.filter(
    (dislike) => dislike.toString() !== userId.toString()
  );
  //Sonuçu kaydet
  await post.save();
  res.status(200).json({ message: "Post begenilenlere eklendi.", post });
});

//@desc   disliking a Post
//@route  PUT /api/v1/posts/dislikes/:id
//@access Private

exports.disLikePost = expressAsyncHandler(async (req, res) => {
  //Post sahibini bulma
  const { id } = req.params;
  //Kullanıcı ıd sini alma
  const userId = req.userAuth._id;
  //Post bulma
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  //Dislike kısımını güncelleme

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { dislikes: userId },
    },
    { new: true }
  );
  // Likelenen alandan çıkarma
  post.likes = post.likes.filter(
    (like) => like.toString() !== userId.toString()
  );
  //Sonuçu kaydet
  await post.save();
  res.status(200).json({ message: "Post disliked successfully.", post });
});

//@desc   clapong a Post
//@route  PUT /api/v1/posts/claps/:id
//@access Private

exports.claps = expressAsyncHandler(async (req, res) => {
  //postu bulma
  const { id } = req.params;
  //Postu db de bulma
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post bulunmuyor");
  }
  //Alkışları değiştirme
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      $inc: { claps: 1 },
    },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Post clapped successfully.", updatedPost });
});

//@desc   Shedule a post
//@route  PUT /api/v1/posts/schedule/:postId
//@access Private

exports.schedule = expressAsyncHandler(async (req, res) => {
  //Bilgileri alma
  const { scheduledPublish } = req.body;
  const { postId } = req.params;
  //ID veya paylaşım yokmu kontrol et
  if (!postId || !scheduledPublish) {
    throw new Error("ID veya paylaşım yok");
  }
  //Post u arama
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post yok ....");
  }
  //kullanıcının gönderinin yazarı olup olmadığını kontrol edin
  if (post.author.toString() !== req.userAuth._id.toString()) {
    throw new Error("Kendi gönderinizi paylaşabilirsiniz");
  }
  // Ne zaman paylaşıldıgını güncelleme
  const scheduleDate = new Date(scheduledPublish);
  const currentDate = new Date();
  if (scheduleDate < currentDate) {
    throw new Error("Tarih eskisinden daha eski olamaz");
  }
  //Post güncellendi
  post.shedduledPublished = scheduledPublish;
  await post.save();
  res.json({
    status: "Başarılı",
    message: "Post programı güncellendi",
    post,
  });
});

//@desc   post  view counta
//@route  PUT /api/v1/posts/:id/post-views-count
//@access Private

exports.postViewCount = expressAsyncHandler(async (req, res) => {
  //Postu ID yi bulma
  const { id } = req.params;
  //Kullanıcı yı bulma
  const userId = req.userAuth._id;
  //Postu bulma
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post yok");
  }
  //Post izlenmeyi degiştirme

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { postViews: userId },
    },
    { new: true }
  ).populate("author");
  await post.save();
  res.status(200).json({ message: "Post bakan sayısı değiştirildi", post });
});
