const express = require("express");
const { createCategory } = require("../../controllers/categories/category");
const isLoggin = require("../../middlewares/isLoggin");

const categoryRouter = express.Router();

// oluşturma
categoryRouter.post("/", isLoggin, createCategory);
module.exports = categoryRouter;
