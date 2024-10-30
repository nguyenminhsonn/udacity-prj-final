import { Request, Response } from 'express';
import { CategoryStore } from '../models/category';
const jwt = require('jsonwebtoken');
import { listCategories, getCategoryById, addCategory, deleteCategory } from '../handlers/category';

jest.mock('../models/category');
jest.mock('jsonwebtoken');

describe('Category API Routes', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();

    jest.clearAllMocks();
  });

  it('should retrieve all categories', async () => {
    const categoryList = [{ id: 1, name: 'Category 1' }];
    mockRequest = {
      headers: {
        token: 'valid-token',
      },
    };
    (CategoryStore.prototype.getAllCategories as jest.Mock).mockResolvedValue(categoryList);

    await listCategories(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(categoryList);
    expect(CategoryStore.prototype.getAllCategories).toHaveBeenCalled();
  });

  it('should fetch a category by its ID', async () => {
    const singleCategory = { id: 1, name: 'Category 1' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      }, params: { id: '1' }
    };
    (CategoryStore.prototype.getCategoryById as jest.Mock).mockResolvedValue(singleCategory);

    await getCategoryById(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(singleCategory);
    expect(CategoryStore.prototype.getCategoryById).toHaveBeenCalledWith(1);
  });

  it('should create a new category and return it', async () => {
    const newCategory = { id: 1, name: 'New Category' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      },
      body: {
        name: 'New Category',
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(true);
    (CategoryStore.prototype.addCategory as jest.Mock).mockResolvedValue(newCategory);

    await addCategory(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(newCategory);
    expect(CategoryStore.prototype.addCategory).toHaveBeenCalledWith('New Category');
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.TOKEN_SECRET);
  });

  it('should remove a category', async () => {
    const deleteResponse = { message: 'Category deleted' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      }, params: { id: '1' }
    };
    (CategoryStore.prototype.deleteCategory as jest.Mock).mockResolvedValue(deleteResponse);

    await deleteCategory(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(deleteResponse);
    expect(CategoryStore.prototype.deleteCategory).toHaveBeenCalledWith(1);
  });

  it('should respond with 401 if the token is invalid during creation', async () => {
    mockRequest = {
      headers: {
        token: 'invalid-token',
      },
      body: {
        name: 'New Category',
      },
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await addCategory(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith('Invalid token Error: Invalid token');
  });
});
