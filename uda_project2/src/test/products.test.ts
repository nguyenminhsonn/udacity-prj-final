import { Request, Response } from 'express';
import { ProductStore } from '../models/product';
const jwt = require('jsonwebtoken');
import { getAllProducts, getProductById, addProduct, deleteProduct, updateProduct } from '../handlers/product';

jest.mock('../models/product');
jest.mock('jsonwebtoken');

describe('Product API Routes', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it('getAllProducts - should retrieve all products', async () => {
    const sampleProducts = [{ id: 1, name: 'Product 1', price: 100, category: 'Category 1' }];
    mockRequest = {
      headers: {
        token: 'valid-token',
      }
    };
    (ProductStore.prototype.getAll as jest.Mock).mockResolvedValue(sampleProducts);

    await getAllProducts(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(sampleProducts);
    expect(ProductStore.prototype.getAll).toHaveBeenCalled();
  });

  it('getProductById - should retrieve a product by its ID', async () => {
    const sampleProduct = { id: 1, name: 'Product 1', price: 100, category: 'Category 1' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      }, params: { id: '1' }
    };
    (ProductStore.prototype.getById as jest.Mock).mockResolvedValue(sampleProduct);

    await getProductById(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(sampleProduct);
    expect(ProductStore.prototype.getById).toHaveBeenCalledWith(1);
  });

  it('addProduct - should create a new product and return it', async () => {
    const newProduct = { id: 1, name: 'Product 1', price: 100, category: 'Category 1' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      },
      body: {
        name: 'Product 1',
        price: '100',
        category: '1',
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (ProductStore.prototype.addProduct as jest.Mock).mockResolvedValue(newProduct);

    await addProduct(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(newProduct);
    expect(ProductStore.prototype.addProduct).toHaveBeenCalledWith('Product 1', 100, 1);
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('removeProduct - should delete a product', async () => {
    const deletionResponse = { message: 'Product deleted' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      }, params: { id: '1' }
    };
    (ProductStore.prototype.removeProduct as jest.Mock).mockResolvedValue(deletionResponse);

    await deleteProduct(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(deletionResponse);
    expect(ProductStore.prototype.removeProduct).toHaveBeenCalledWith(1);
  });

  it('modifyProduct - should update an existing product and return it', async () => {
    const updatedProduct = { id: 1, name: 'Updated Product', price: 150, categoryId: 1 };
    mockRequest = {
      headers: {
        token: 'valid-token',
      },
      body: {
        name: 'Updated Product',
        price: 150,
        category: 1,
      },
      params: { id: '1' },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (ProductStore.prototype.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

    await updateProduct(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(updatedProduct);
    expect(ProductStore.prototype.updateProduct).toHaveBeenCalledWith(1, 'Updated Product', 150, 1);
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('should return 401 if the token is invalid in addProduct route', async () => {
    mockRequest = {
      headers: {
        token: 'invalid-token',
      },
      params: {
        name: 'Product 1',
        price: '100',
        category: '1',
      },
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await addProduct(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(`Invalid token Error: Invalid token`);
  });
});
