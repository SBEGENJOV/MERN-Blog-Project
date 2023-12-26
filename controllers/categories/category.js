const Category = require("../../model/Category/Category");
const asyncHandler = require("express-async-handler");

//@desc  Create a category
//@route POST /api/v1/categories
//@access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, author } = req.body;
  //! if exist
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category zaten var");
  }
  const category = await Category.create({
    name: name,
    author: req.userAuth?._id,
  });
  res.status(201).json({
    status: "Başarılı",
    message: "Category başary ile oluşturuldu",
    category,
  });
});

//@desc  Get all Categories
//@route GET /api/v1/categories
//@access PUBLIC

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).populate({
    path: "posts",
    model: "Post",
  });
  res.status(201).json({
    status: "Başarılı",
    message: "Categoriler listelendi",
    categories,
  });
});

//@desc  Delete Category
//@route DELETE /api/v1/categories/:id
//@access Private

exports.deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "Başarılı",
    message: "Category silindi",
  });
});

//@desc  update Category
//@route PUT /api/v1/categories/:id
//@access Private

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "Başarılı",
    message: "Categori güncellendi",
    category,
  });
});
