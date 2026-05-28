const CategoryModel = require("../model/categoryModel");
const sendResponse = require("../utils/sendResponse");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.getAllCategories();
    sendResponse(res, 200, true, categories);
  } catch (e) {
    next(e);
  }
};

exports.createCategory = async (req, res, next) => {
  const { name, type, icon, color } = req.body;
  try {
    const category = await CategoryModel.createCategory(
      name,
      type,
      icon || "",
      color || "",
    );
    sendResponse(res, 201, true, category);
  } catch (e) {
    next(e);
  }
};
