const pool = require("../config/dbConfing");

class CategoryModel {
  /**
   * Get all system and custom categories
   * @returns {Promise<Array>} - List of categories
   */
  static async getAllCategories() {
    const query = "SELECT * FROM categories ORDER BY id ASC";
    const { rows } = await pool.query(query);
    return rows;
  }

  /**
   * Create a new category
   * @param {String} name - Category name
   * @param {String} type - Type: 'income' or 'expense'
   * @param {String} icon - FontAwesome icon name or class
   * @param {String} color - Hex color code
   * @returns {Promise<Object>} - Newly created category
   */
  static async createCategory(name, type, icon, color) {
    const query = `
      INSERT INTO categories (name, type, icon, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [name, type, icon, color]);
    return rows[0];
  }

  /**
   * Find category by ID
   * @param {Number} id - Category ID
   * @returns {Promise<Object|null>} - Category object or null
   */
  static async findCategoryById(id) {
    const query = "SELECT * FROM categories WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = CategoryModel;
