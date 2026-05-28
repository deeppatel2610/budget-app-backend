const pool = require("../config/dbConfing");

class TransactionModel {
  /**
   * Create a new income or expense transaction
   * @returns {Promise<Object>} - The newly created transaction
   */
  static async createTransaction(
    userId,
    categoryId,
    amount,
    type,
    description,
    transactionDate,
  ) {
    const query = `
      INSERT INTO transactions (user_id, category_id, amount, type, description, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      userId,
      categoryId,
      amount,
      type,
      description,
      transactionDate || new Date(),
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  /**
   * Find transactions for a specific user with dynamic filters
   * @returns {Promise<Array>} - List of transactions matching filters
   */
  static async findTransactionsByUserId(userId, filters = {}) {
    const { type, categoryId, startDate, endDate } = filters;
    let query = `
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;
    const values = [userId];
    let paramIndex = 2;

    if (type) {
      query += ` AND t.type = $${paramIndex++}`;
      values.push(type);
    }

    if (categoryId) {
      query += ` AND t.category_id = $${paramIndex++}`;
      values.push(categoryId);
    }

    if (startDate) {
      query += ` AND t.transaction_date >= $${paramIndex++}`;
      values.push(startDate);
    }

    if (endDate) {
      query += ` AND t.transaction_date <= $${paramIndex++}`;
      values.push(endDate);
    }

    query += " ORDER BY t.transaction_date DESC, t.id DESC";

    const { rows } = await pool.query(query, values);
    return rows;
  }

  /**
   * Find a specific transaction by ID and user ID
   * @returns {Promise<Object|null>} - Transaction details or null
   */
  static async findTransactionById(id, userId) {
    const query = `
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1 AND t.user_id = $2;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0];
  }

  /**
   * Update transaction details
   * @returns {Promise<Object|null>} - Updated transaction details
   */
  static async updateTransaction(id, userId, updates = {}) {
    const { categoryId, amount, type, description, transactionDate } = updates;
    const query = `
      UPDATE transactions
      SET category_id = COALESCE($1, category_id),
          amount = COALESCE($2, amount),
          type = COALESCE($3, type),
          description = COALESCE($4, description),
          transaction_date = COALESCE($5, transaction_date)
      WHERE id = $6 AND user_id = $7
      RETURNING *;
    `;
    const values = [
      categoryId,
      amount,
      type,
      description,
      transactionDate,
      id,
      userId,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  /**
   * Delete a transaction
   * @returns {Promise<Boolean>} - True if deleted, false if not found
   */
  static async deleteTransaction(id, userId) {
    const query =
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id;";
    const { rows } = await pool.query(query, [id, userId]);
    return rows.length > 0;
  }
}

module.exports = TransactionModel;
