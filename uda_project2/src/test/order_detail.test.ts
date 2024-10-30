import { Request, Response } from 'express';
import { OrderDetailStore } from '../models/order_detail';
import { createOrderDetail, deleteOrderDetail, getAllOrderDetails, getOrderDetailById, updateOrderDetail } from '../handlers/order_detail';
const jwt = require('jsonwebtoken');

jest.mock('../models/order_detail');
jest.mock('jsonwebtoken');

describe('Order Detail API Routes', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  it('getAllOrderDetails - should return a list of order details', async () => {
    const sampleOrderDetails = [{ order_id: 1, product_id: 1, quantity: 2 }];
    mockRequest = {
      headers: {
        token: 'valid-token',
      }
    };
    (OrderDetailStore.prototype.getAllOrderDetails as jest.Mock).mockResolvedValue(sampleOrderDetails);

    await getAllOrderDetails(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(sampleOrderDetails);
    expect(OrderDetailStore.prototype.getAllOrderDetails).toHaveBeenCalled();
  });

  it('getOrderDetailById - should return a specific order detail by order_id', async () => {
    const sampleOrderDetail = { order_id: 1, product_id: 1, quantity: 2 };
    mockRequest = {
      headers: {
        token: 'valid-token',
      }, params: { order_id: '1' }
    };
    (OrderDetailStore.prototype.getOrderDetailsById as jest.Mock).mockResolvedValue(sampleOrderDetail);

    await getOrderDetailById(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(sampleOrderDetail);
    expect(OrderDetailStore.prototype.getOrderDetailsById).toHaveBeenCalledWith(1);
  });

  it('createOrderDetail - should add a new order detail and return it', async () => {
    const newOrderDetail = { order_id: 1, product_id: 1, quantity: 2 };
    mockRequest = {
      headers: {
        token: 'valid-token',
      },
      body: {
        order_id: '1',
        product_id: '1',
        quantity: '2',
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (OrderDetailStore.prototype.addOrderDetail as jest.Mock).mockResolvedValue(newOrderDetail);

    await createOrderDetail(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(newOrderDetail);
    expect(OrderDetailStore.prototype.addOrderDetail).toHaveBeenCalledWith({
      order_id: 1,
      product_id: 1,
      quantity: 2,
    });
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('deleteOrderDetail - should remove an order detail', async () => {
    const deletionResponse = { message: 'Order detail deleted' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      }, params: { order_id: '1', product_id: '1' }
    };
    (OrderDetailStore.prototype.removeOrderDetail as jest.Mock).mockResolvedValue(deletionResponse);

    await deleteOrderDetail(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(deletionResponse);
    expect(OrderDetailStore.prototype.removeOrderDetail).toHaveBeenCalledWith(1, 1);
  });

  it('updateOrderDetail - should modify an existing order detail and return it', async () => {
    const updatedOrderDetail = { order_id: 1, product_id: 1, quantity: 3 };
    mockRequest = {
      headers: {
        token: 'valid-token',
      },
      body: {
        quantity: '3',
      },
      params: { order_id: '1', product_id: '1' },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (OrderDetailStore.prototype.updateOrderDetail as jest.Mock).mockResolvedValue(updatedOrderDetail);

    await updateOrderDetail(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(updatedOrderDetail);
    expect(OrderDetailStore.prototype.updateOrderDetail).toHaveBeenCalledWith({
      order_id: 1,
      product_id: 1,
      quantity: 3,
    });
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('should return 401 if token is invalid in create route', async () => {
    mockRequest = {
      headers: {
        token: 'invalid-token',
      },
      body: {
        order_id: '1',
        product_id: '1',
        quantity: '2',
      },
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await createOrderDetail(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(`Invalid token Error: Invalid token`);
  });
});
