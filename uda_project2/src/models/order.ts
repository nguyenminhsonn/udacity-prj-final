import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
  create_time: string;
};

export class OrderStore {
  async getAllOrders(): Promise<Order[]> {
    try {
      const connection = await Client.connect();
      const query = 'SELECT * FROM orders';
      const result = await connection.query(query);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve orders. Error: ${error}`);
    }
  }

  async getOrderById(orderId: number): Promise<Order> {
    try {
      const query = 'SELECT * FROM orders WHERE id = $1';
      const connection = await Client.connect();
      const result = await connection.query(query, [orderId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to find order with ID ${orderId}. Error: ${error}`);
    }
  }

  async createOrder(order: Order): Promise<Order> {
    try {
      const query = 'INSERT INTO orders (user_id, status, create_time) VALUES ($1, $2, $3) RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [order.user_id, order.status, order.create_time]);
      const newOrder = result.rows[0];
      connection.release();
      return newOrder;
    } catch (error) {
      throw new Error(`Unable to create a new order. Error: ${error}`);
    }
  }

  async removeOrder(orderId: number): Promise<Order> {
    try {
      const query = 'DELETE FROM orders WHERE id = $1 RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [orderId]);
      const removedOrder = result.rows[0];
      connection.release();
      return removedOrder;
    } catch (error) {
      throw new Error(`Unable to delete order with ID ${orderId}. Error: ${error}`);
    }
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    try {
      const query = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [status, orderId]);
      const updatedOrder = result.rows[0];
      connection.release();
      return updatedOrder;
    } catch (error) {
      throw new Error(`Unable to update status for order with ID ${orderId}. Error: ${error}`);
    }
  }
}
