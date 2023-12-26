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