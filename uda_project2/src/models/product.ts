import Client from '../database';

export type Product = {
  product_id: number;
  name: string;
  price: number;
  category: number;
};

export class ProductStore {
  async getAll(): Promise<Product[]> {
    try {
      const connection = await Client.connect();
      const query = 'SELECT * FROM products';
      const result = await connection.query(query);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve products: ${error}`);
    }
  }

  async getById(productId: number): Promise<Product> {
    try {
      const query = 'SELECT * FROM products WHERE product_id = $1';
      const connection = await Client.connect();
      const result = await connection.query(query, [productId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to find product with ID ${productId}: ${error}`);
    }
  }

  async addProduct(name: string, price: number, category: number): Promise<Product> {
    try {
      const query = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [name, price, category]);
      const newProduct = result.rows[0];
      connection.release();
      return newProduct;
    } catch (error) {
      throw new Error(`Unable to create product ${name}: ${error}`);
    }
  }

  async removeProduct(productId: number): Promise<Product> {
    try {
      const query = 'DELETE FROM products WHERE product_id = $1 RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [productId]);
      const deletedProduct = result.rows[0];
      connection.release();
      return deletedProduct;
    } catch (error) {
      throw new Error(`Unable to delete product with ID ${productId}: ${error}`);
    }
  }

  async updateProduct(id: number, name: string, price: number, category: number): Promise<Product> {
    try {
      const query =
        'UPDATE products SET name = $1, price = $2, category = $3 WHERE product_id = $4 RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [name, price, category, id]);
      const updatedProduct = result.rows[0];
      connection.release();
      return updatedProduct;
    } catch (error) {
      throw new Error(`Unable to update product with ID ${id}: ${error}`);
    }
  }
}
