const pool = require("../config/dbConfing");

class BudgetModel {
  /**
   * Insert or update (upsert) a monthly budget limit for a category
   * @returns {Promise<Object>} - Upserted budget details
   */
  static async upsertBudget(userId, categoryId, amount, month, year) {
    const query = `
      INSERT INTO budgets (user_id, category_id, amount, month, year)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, category_id, month, year)
      DO UPDATE SET amount = EXCLUDED.amount
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      userId,
      categoryId,
      amount,
      month,
      year,
    ]);
    return rows[0];
  }

  /**
   * Get all budget configurations of a user
   * @returns {Promise<Array>} - List of user budgets
   */
  static async getBudgetsByUserId(userId) {
    const query = `
      SELECT b.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM budgets b
      JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = $1
      ORDER BY b.year DESC, b.month DESC, c.name ASC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  /**
   * Get category-wise budgets alongside actual spending computed from transactions
   * @returns {Promise<Array>} - Budget versus actual spending list
   */
  static async getMonthlyBudgetSummary(userId, month, year) {
    const query = `
      SELECT 
          b.id,
          b.category_id,
          c.name as category_name,
          c.icon as category_icon,
          c.color as category_color,
          b.amount as budget_limit,
          COALESCE(SUM(t.amount), 0) as actual_spent,
          (b.amount - COALESCE(SUM(t.amount), 0)) as remaining_budget
      FROM budgets b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN transactions t ON b.user_id = t.user_id 
          AND b.category_id = t.category_id 
          AND t.type = 'expense'
          AND EXTRACT(MONTH FROM t.transaction_date) = $2
          AND EXTRACT(YEAR FROM t.transaction_date) = $3
      WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3
      GROUP BY b.id, b.category_id, c.name, c.icon, c.color, b.amount;
    `;
    const { rows } = await pool.query(query, [userId, month, year]);
    return rows;
  }
}

module.exports = BudgetModel;
