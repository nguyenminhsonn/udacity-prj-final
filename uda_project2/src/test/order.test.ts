import { Request, Response } from 'express';
import { OrderStore } from '../models/order';
const jwt = require('jsonwebtoken');
import { fetchOrders, fetchOrderById, addOrder, removeOrder, modifyOrder } from '../handlers/order';

jest.mock('../models/order');
jest.mock('jsonwebtoken');

describe('Order API Routes', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  it('getAllOrders - should retrieve all orders', async () => {
    const sampleOrders = [{ id: 1, user_id: 1, status: 'active', create_time: '2024-10-07T00:00:00.000Z' }];
    mockReq = {
      headers: {
        token: 'valid-token',
      }
    };
    (OrderStore.prototype.getAllOrders as jest.Mock).mockResolvedValue(sampleOrders);

    await fetchOrders(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(sampleOrders);
    expect(OrderStore.prototype.getAllOrders).toHaveBeenCalled();
  });

  it('getOrderById - should retrieve an order by its ID', async () => {
    const sampleOrder = { id: 1, user_id: 1, status: 'active', create_time: '2024-10-07T00:00:00.000Z' };
    mockReq = {
      headers: {
        token: 'valid-token',
      }, params: { id: '1' }
    };
    (OrderStore.prototype.getOrderById as jest.Mock).mockResolvedValue(sampleOrder);

    await fetchOrderById(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(sampleOrder);
    expect(OrderStore.prototype.getOrderById).toHaveBeenCalledWith(1);
  });

  it('createOrder - should add a new order and return it', async () => {
    const newOrder = { id: 1, user_id: 1, status: 'active', create_time: '2024-10-07T00:00:00.000Z' };
    mockReq = {
      headers: {
        token: 'valid-token',
      },
      body: {
        user_id: '1',
        status: 'active',
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (OrderStore.prototype.createOrder as jest.Mock).mockResolvedValue(newOrder);

    await addOrder(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(newOrder);
    expect(OrderStore.prototype.createOrder).toHaveBeenCalledWith({
      user_id: 1,
      status: 'active',
      create_time: expect.any(String),
    });
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('deleteOrder - should remove an order', async () => {
    const deletionResponse = { message: 'Order deleted' };
    mockReq = {
      headers: {
        token: 'valid-token',
      }, params: { id: '1' }
    };
    (OrderStore.prototype.removeOrder as jest.Mock).mockResolvedValue(deletionResponse);

    await removeOrder(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(deletionResponse);
    expect(OrderStore.prototype.removeOrder).toHaveBeenCalledWith(1);
  });

  it('updateOrder - should modify an existing order and return it', async () => {
    const updatedOrder = { id: 1, user_id: 1, status: 'complete', create_time: '2024-10-07T00:00:00.000Z' };
    mockReq = {
      headers: {
        token: 'valid-token',
      },
      body: {
        status: 'complete',
      },
      params: { id: '1' },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (OrderStore.prototype.updateOrderStatus as jest.Mock).mockResolvedValue(updatedOrder);

    await modifyOrder(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(updatedOrder);
    expect(OrderStore.prototype.updateOrderStatus).toHaveBeenCalledWith(1, 'complete');
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('should return 401 if the token is invalid in create route', async () => {
    mockReq = {
      headers: {
        token: 'invalid-token',
      },
      body: {
        user_id: '1',
        status: 'active',
      },
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await addOrder(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(`Invalid token Error: Invalid token`);
  });
});
