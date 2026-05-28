const pool = require("./src/config/dbConfing");
const AuthModel = require("./src/model/authModel");
const CategoryModel = require("./src/model/categoryModel");
const TransactionModel = require("./src/model/transactionModel");
const BudgetModel = require("./src/model/budgetModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("./src/utils/jwtHelper");

// Comprehensive logic tests covering database interactions, access/refresh token rotation, CRUD, and analytics
const runModelTests = async () => {
  console.log("🚀 STARTING BACKEND BUSINESS LOGIC INTEGRATION TESTS...");

  // Generate unique test credentials
  const timestamp = Date.now();
  const testUser = {
    firstName: "Test",
    lastName: "User",
    username: `testuser_${timestamp}`,
    phoneNumber: `98765${timestamp.toString().slice(-5)}`,
    email: `test_${timestamp}@example.com`,
    password: "SecurePassword123",
  };

  try {
    // 1. Test User Registration Model logic
    console.log("\n--- 1. Testing User Registration Logic ---");
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const createdUser = await AuthModel.createUser(
      testUser.firstName,
      testUser.lastName,
      testUser.username,
      testUser.phoneNumber,
      testUser.email,
      hashedPassword,
    );

    if (createdUser && createdUser.id) {
      console.log(`✅ User created successfully in DB! ID: ${createdUser.id}`);
    } else {
      throw new Error("Failed to create user");
    }

    // 2. Test User Login / Authentication & Token Logic
    console.log("\n--- 2. Testing Credentials Matching & Token Generation ---");
    const fetchedUser = await AuthModel.findUserByEmail(testUser.email);
    const passwordMatch = await bcrypt.compare(
      testUser.password,
      fetchedUser.password_hash,
    );

    if (passwordMatch) {
      console.log("✅ Credentials matched successfully!");
    } else {
      throw new Error("Password mismatch!");
    }

    const payload = {
      id: fetchedUser.id,
      email: fetchedUser.email,
      username: fetchedUser.username,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    console.log("✅ Access Token generated:", accessToken.slice(0, 30) + "...");
    console.log("✅ Refresh Token generated:", refreshToken.slice(0, 30) + "...");

    // Test Token verification
    const decodedAccess = verifyToken(accessToken);
    if (decodedAccess && decodedAccess.username === testUser.username) {
      console.log("✅ Access Token verified successfully!");
    } else {
      throw new Error("Access Token verification failed!");
    }

    // Save Refresh Token to Database
    await AuthModel.updateRefreshToken(fetchedUser.id, refreshToken);
    const userWithToken = await AuthModel.findUserByRefreshToken(refreshToken);
    if (userWithToken && userWithToken.id === fetchedUser.id) {
      console.log("✅ Refresh Token stored and retrieved from DB successfully!");
    } else {
      throw new Error("Refresh Token database verification failed!");
    }

    // 3. Test Category Listing
    console.log("\n--- 3. Testing Category Retrieval ---");
    const categories = await CategoryModel.getAllCategories();
    console.log(`✅ Retrieved ${categories.length} categories from DB!`);

    // Find first 'expense' category and 'income' category
    const expenseCategory = categories.find((c) => c.type === "expense");
    const incomeCategory = categories.find((c) => c.type === "income");

    if (!expenseCategory || !incomeCategory) {
      throw new Error("Missing default pre-seeded categories in database! Please run schema.sql default categories insert query first.");
    }

    console.log(`📌 Expense Category to use: ${expenseCategory.name} (ID: ${expenseCategory.id})`);
    console.log(`📌 Income Category to use: ${incomeCategory.name} (ID: ${incomeCategory.id})`);

    // 4. Test Transactions Management (CRUD Model)
    console.log("\n--- 4. Testing Transactions (Income & Expense CRUD) ---");
    // Create Income Transaction
    const incomeTx = await TransactionModel.createTransaction(
      fetchedUser.id,
      incomeCategory.id,
      1500.0,
      "income",
      "Test Freelance Income",
      new Date(),
    );
    console.log(`✅ Income transaction created! ID: ${incomeTx.id}, Amount: $${incomeTx.amount}`);

    // Create Expense Transaction
    const expenseTx = await TransactionModel.createTransaction(
      fetchedUser.id,
      expenseCategory.id,
      250.0,
      "expense",
      "Test Lunch Expense",
      new Date(),
    );
    console.log(`✅ Expense transaction created! ID: ${expenseTx.id}, Amount: $${expenseTx.amount}`);

    // Read Transactions with Filter
    const userTxs = await TransactionModel.findTransactionsByUserId(
      fetchedUser.id,
      { type: "expense" },
    );
    if (userTxs.length === 1 && parseFloat(userTxs[0].amount) === 250.0) {
      console.log("✅ Retrieve transactions with filters worked perfectly!");
    } else {
      throw new Error("Transaction filter check failed!");
    }

    // Update Transaction
    const updatedTx = await TransactionModel.updateTransaction(
      expenseTx.id,
      fetchedUser.id,
      { amount: 300.0 },
    );
    if (updatedTx && parseFloat(updatedTx.amount) === 300.0) {
      console.log(`✅ Transaction details updated successfully! New amount: $${updatedTx.amount}`);
    } else {
      throw new Error("Transaction update failed!");
    }

    // Delete Transaction (Income)
    const isDeleted = await TransactionModel.deleteTransaction(
      incomeTx.id,
      fetchedUser.id,
    );
    if (isDeleted) {
      console.log("✅ Transaction deleted successfully!");
    } else {
      throw new Error("Transaction deletion failed!");
    }

    // 5. Test Budgeting and Analytics Summary
    console.log("\n--- 5. Testing Budgeting & Monthly Analytics ---");
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentYear = new Date().getFullYear();

    // Set a budget of 500 for the expense category
    const budget = await BudgetModel.upsertBudget(
      fetchedUser.id,
      expenseCategory.id,
      500.0,
      currentMonth,
      currentYear,
    );
    if (budget && parseFloat(budget.amount) === 500.0) {
      console.log(`✅ Monthly Budget of $500.00 configured for Category ID: ${expenseCategory.id}`);
    } else {
      throw new Error("Budget upsert failed!");
    }

    // Get summary (budget vs actual)
    const summary = await BudgetModel.getMonthlyBudgetSummary(
      fetchedUser.id,
      currentMonth,
      currentYear,
    );

    if (summary.length > 0) {
      const budgetSummary = summary.find(s => s.category_id === expenseCategory.id);
      if (!budgetSummary) {
        throw new Error("Configured budget category not found in summary!");
      }
      console.log("✅ Budget Summary Analytics computed successfully!");
      console.log(`📊 Category: ${budgetSummary.category_name}`);
      console.log(`📊 Budget Limit: $${budgetSummary.budget_limit}`);
      console.log(`📊 Actual Spent: $${budgetSummary.actual_spent}`);
      console.log(`📊 Remaining: $${budgetSummary.remaining_budget}`);

      if (
        parseFloat(budgetSummary.actual_spent) === 300.0 &&
        parseFloat(budgetSummary.remaining_budget) === 200.0
      ) {
        console.log("✅ Summary values computed 100% accurately!");
      } else {
        throw new Error("Calculated spent/remaining values do not match transaction history!");
      }
    } else {
      throw new Error("Summary array returned empty!");
    }

    // Clean up test data
    console.log("\n--- 6. Cleaning Up Test Data ---");
    await pool.query("DELETE FROM transactions WHERE user_id = $1", [
      fetchedUser.id,
    ]);
    await pool.query("DELETE FROM budgets WHERE user_id = $1", [
      fetchedUser.id,
    ]);
    await pool.query("DELETE FROM users WHERE id = $1", [fetchedUser.id]);
    console.log("✅ Test user and all related records deleted cleanly from DB!");

    console.log("\n⭐⭐⭐⭐⭐ ALL MODEL LOGIC & QUERY TESTS PASSED SUCCESSFULLY! ⭐⭐⭐⭐⭐\n");
  } catch (err) {
    console.log("\n❌ TEST FAILURE! Error details:", err.message);
  } finally {
    await pool.end();
  }
};

runModelTests();
