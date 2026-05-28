const BudgetModel = require("../model/budgetModel");
const CategoryModel = require("../model/categoryModel");
const sendResponse = require("../utils/sendResponse");

exports.setBudget = async (req, res, next) => {
  const userId = req.user.id;
  const { categoryId, amount, month, year } = req.body;

  try {
    // 1. Verify category exists
    const category = await CategoryModel.findCategoryById(categoryId);
    if (!category) {
      return sendResponse(res, 404, false, null, "Category not found");
    }

    // 2. Verify category is of type 'expense' (cannot budget income!)
    if (category.type !== "expense") {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Budgets can only be configured for 'expense' categories.",
      );
    }

    const budget = await BudgetModel.upsertBudget(
      userId,
      categoryId,
      amount,
      month,
      year,
    );

    sendResponse(res, 200, true, budget);
  } catch (e) {
    next(e);
  }
};

exports.getBudgets = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const budgets = await BudgetModel.getBudgetsByUserId(userId);
    sendResponse(res, 200, true, budgets);
  } catch (e) {
    next(e);
  }
};

exports.getBudgetSummary = async (req, res, next) => {
  const userId = req.user.id;
  const { month, year } = req.query;

  try {
    const summary = await BudgetModel.getMonthlyBudgetSummary(
      userId,
      parseInt(month),
      parseInt(year),
    );
    sendResponse(res, 200, true, summary);
  } catch (e) {
    next(e);
  }
};
