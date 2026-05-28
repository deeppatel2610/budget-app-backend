const TransactionModel = require("../model/transactionModel");
const CategoryModel = require("../model/categoryModel");
const sendResponse = require("../utils/sendResponse");

exports.createTransaction = async (req, res, next) => {
  const userId = req.user.id;
  const { categoryId, amount, type, description, transactionDate } = req.body;

  try {
    // 1. If categoryId is provided, verify it exists and matches the transaction type
    if (categoryId) {
      const category = await CategoryModel.findCategoryById(categoryId);
      if (!category) {
        return sendResponse(res, 404, false, null, "Category not found");
      }
      if (category.type !== type) {
        return sendResponse(
          res,
          400,
          false,
          null,
          `Category type mismatch. The selected category is for '${category.type}' but the transaction type is '${type}'.`,
        );
      }
    }

    const transaction = await TransactionModel.createTransaction(
      userId,
      categoryId || null,
      amount,
      type,
      description || "",
      transactionDate,
    );

    sendResponse(res, 201, true, transaction);
  } catch (e) {
    next(e);
  }
};

exports.getTransactions = async (req, res, next) => {
  const userId = req.user.id;
  const { type, categoryId, startDate, endDate } = req.query;

  try {
    const filters = { type, categoryId, startDate, endDate };
    const transactions = await TransactionModel.findTransactionsByUserId(
      userId,
      filters,
    );
    sendResponse(res, 200, true, transactions);
  } catch (e) {
    next(e);
  }
};

exports.getTransactionDetails = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const transaction = await TransactionModel.findTransactionById(id, userId);
    if (!transaction) {
      return sendResponse(res, 404, false, null, "Transaction not found");
    }
    sendResponse(res, 200, true, transaction);
  } catch (e) {
    next(e);
  }
};

exports.updateTransaction = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { categoryId, amount, type, description, transactionDate } = req.body;

  try {
    // 1. Fetch current transaction details
    const existingTransaction = await TransactionModel.findTransactionById(
      id,
      userId,
    );
    if (!existingTransaction) {
      return sendResponse(res, 404, false, null, "Transaction not found");
    }

    const resolvedType = type || existingTransaction.type;
    const resolvedCategoryId =
      categoryId !== undefined ? categoryId : existingTransaction.category_id;

    // 2. If category is updated or type is updated, verify validity
    if (resolvedCategoryId) {
      const category = await CategoryModel.findCategoryById(resolvedCategoryId);
      if (!category) {
        return sendResponse(res, 404, false, null, "Category not found");
      }
      if (category.type !== resolvedType) {
        return sendResponse(
          res,
          400,
          false,
          null,
          `Category type mismatch. The selected category is for '${category.type}' but the transaction type is '${resolvedType}'.`,
        );
      }
    }

    const updatedTransaction = await TransactionModel.updateTransaction(
      id,
      userId,
      {
        categoryId: resolvedCategoryId,
        amount,
        type: resolvedType,
        description,
        transactionDate,
      },
    );

    sendResponse(res, 200, true, updatedTransaction);
  } catch (e) {
    next(e);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const isDeleted = await TransactionModel.deleteTransaction(id, userId);
    if (!isDeleted) {
      return sendResponse(res, 404, false, null, "Transaction not found");
    }
    sendResponse(res, 200, true, null, null);
  } catch (e) {
    next(e);
  }
};
