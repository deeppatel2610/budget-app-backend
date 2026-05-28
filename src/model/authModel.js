const pool = require("../config/dbConfing");

class AuthModel {
  static async createUser(
    firstName,
    lastName,
    username,
    phoneNumber,
    email,
    password,
  ) {
    const query = `
      INSERT INTO users (first_name, last_name, username, phone_number, email, password_hash )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, username, email;
    `;
    const values = [
      firstName,
      lastName,
      username,
      phoneNumber,
      email,
      password,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findUserByUsername(username) {
    const query = "SELECT * FROM users WHERE username = $1";
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }

  static async findUserByPhoneNumber(phoneNumber) {
    const query = "SELECT * FROM users WHERE phone_number = $1";
    const { rows } = await pool.query(query, [phoneNumber]);
    return rows[0];
  }

  static async findUserById(id) {
    const query = "SELECT * FROM users WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async updateRefreshToken(userId, refreshToken) {
    const query = `
      UPDATE users 
      SET refresh_token = $1 
      WHERE id = $2 
      RETURNING id, username, email;
    `;
    const { rows } = await pool.query(query, [refreshToken, userId]);
    return rows[0];
  }

  static async findUserByRefreshToken(refreshToken) {
    const query = "SELECT * FROM users WHERE refresh_token = $1";
    const { rows } = await pool.query(query, [refreshToken]);
    return rows[0];
  }
}

module.exports = AuthModel;
