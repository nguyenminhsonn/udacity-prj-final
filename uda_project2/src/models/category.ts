import Client from '../database';

export type Category = {
  category_id: number;
  name: string;
};

export class CategoryStore {
  async getAllCategories(): Promise<Category[]> {
    try {
      const connection = await Client.connect();
      const query = 'SELECT * FROM categories';

      const result = await connection.query(query);

      connection.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve categories. Error: ${error}`);
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      const query = 'SELECT * FROM categories WHERE category_id = $1';
      const connection = await Client.connect();

      const result = await connection.query(query, [id]);

      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to find category with ID ${id}. Error: ${error}`);
    }
  }

  async addCategory(name: string): Promise<Category> {
    try {
      const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
      const connection = await Client.connect();

      const result = await connection.query(query, [name]);

      const newCategory = result.rows[0];

      connection.release();

      return newCategory;
    } catch (error) {
      throw new Error(`Unable to add category ${name}. Error: ${error}`);
    }
  }

  async deleteCategory(id: number): Promise<Category> {
    try {
      const query = 'DELETE FROM categories WHERE category_id = $1 RETURNING *';
      const connection = await Client.connect();

      const result = await connection.query(query, [id]);

      const deletedCategory = result.rows[0];

      connection.release();

      return deletedCategory;
    } catch (error) {
      throw new Error(`Unable to delete category with ID ${id}. Error: ${error}`);
    }
  }
}
