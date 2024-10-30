import Client from '../database';

export type OrderDetail = {
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderDetailStore {
  async getAllOrderDetails(): Promise<OrderDetail[]> {
    try {
      const connection = await Client.connect();
      const query = 'SELECT * FROM order_detail';
      const result = await connection.query(query);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to retrieve order details. Error: ${error}`);
    }
  }

  async getOrderDetailsById(order_id: number): Promise<OrderDetail[]> {
    try {
      const query = 'SELECT * FROM order_detail WHERE order_id = $1';
      const connection = await Client.connect();
      const result = await connection.query(query, [order_id]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to find order details for order ID ${order_id}. Error: ${error}`);
    }
  }

  async addOrderDetail(orderDetail: OrderDetail): Promise<OrderDetail> {
    try {
      const query =
        'INSERT INTO order_detail (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [
        orderDetail.order_id,
        orderDetail.product_id,
        orderDetail.quantity,
      ]);
      const newOrderDetail = result.rows[0];
      connection.release();
      return newOrderDetail;
    } catch (error) {
      throw new Error(`Unable to add order detail. Error: ${error}`);
    }
  }

  async removeOrderDetail(order_id: number, product_id: number): Promise<OrderDetail> {
    try {
      const query = 'DELETE FROM order_detail WHERE order_id = $1 AND product_id = $2 RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [order_id, product_id]);
      const deletedDetail = result.rows[0];
      connection.release();
      return deletedDetail;
    } catch (error) {
      throw new Error(`Unable to delete order detail for order ID ${order_id} and product ID ${product_id}. Error: ${error}`);
    }
  }

  async updateOrderDetail(orderDetail: OrderDetail): Promise<OrderDetail> {
    try {
      const query =
        'UPDATE order_detail SET quantity = $1 WHERE order_id = $2 AND product_id = $3 RETURNING *';
      const connection = await Client.connect();
      const result = await connection.query(query, [
        orderDetail.quantity,
        orderDetail.order_id,
        orderDetail.product_id,
      ]);
      const updatedDetail = result.rows[0];
      connection.release();
      return updatedDetail;
    } catch (error) {
      throw new Error(`Unable to update order detail for order ID ${orderDetail.order_id} and product ID ${orderDetail.product_id}. Error: ${error}`);
    }
  }
}
