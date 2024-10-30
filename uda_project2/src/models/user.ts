import Client from '../database';
const bcrypt = require('bcryptjs');

export type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
};

export class UserStore {
  async getAllUsers(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve users. Error: ${error}`);
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE user_id = $1';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to find user ${id}. Error: ${error}`);
    }
  }

  async addUser(user: User): Promise<User> {
    try {
      const sql = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const saltRounds = parseInt(process.env.SALT_ROUNDS as string, 10);
      const hashedPassword = bcrypt.hashSync(user.password + process.env.PEPPER, saltRounds);
      const result = await conn.query(sql, [user.username, hashedPassword, user.email]);
      const newUser = result.rows[0];
      conn.release();
      return newUser;
    } catch (error) {
      throw new Error(`Unable to add user ${user.username}. Error: ${error}`);
    }
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT password FROM users WHERE username = $1';
      const result = await conn.query(sql, [username]);

      if (result.rows.length) {
        const user = result.rows[0];

        if (bcrypt.compareSync(password + process.env.PEPPER, user.password)) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw new Error(`Authentication failed for user ${username}. Error: ${error}`);
    }
  }

  async removeUser(id: number): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE user_id = $1';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const deletedUser = result.rows[0];
      conn.release();
      return deletedUser;
    } catch (error) {
      throw new Error(`Unable to delete user ${id}. Error: ${error}`);
    }
  }
}
