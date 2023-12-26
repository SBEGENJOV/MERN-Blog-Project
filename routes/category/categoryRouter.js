const express = require("express");
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categories/category");
const isLoggin = require("../../middlewares/isLoggin");

const categoryRouter = express.Router();

// oluşturma
categoryRouter.post("/", isLoggin, createCategory);
// hepsini getir
categoryRouter.get("/", getCategories);
//Silme
categoryRouter.delete("/:id", isLoggin, deleteCategory);
//Güncelleme
categoryRouter.put("/:id", isLoggin, updateCategory);
module.exports = categoryRouter;
