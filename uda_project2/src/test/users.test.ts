import { Request, Response } from 'express';
import { UserStore } from '../models/user';
const jwt = require('jsonwebtoken');
import { getAllUsers, getUserById, registerUser, deleteUser, loginUser } from '../handlers/user';

jest.mock('../models/user');
jest.mock('jsonwebtoken');

describe('User API Routes', () => {
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

  it('getAllUsers - should return a list of users', async () => {
    const sampleUsers = [{ user_id: 1, username: 'john', email: 'john@example.com' }];
    mockRequest = {
      headers: {
        token: 'valid-token',
      }
    };
    (UserStore.prototype.getAllUsers as jest.Mock).mockResolvedValue(sampleUsers);

    await getAllUsers(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(sampleUsers);
    expect(UserStore.prototype.getAllUsers).toHaveBeenCalled();
  });

  it('getUserById - should return user details by ID', async () => {
    const sampleUser = { user_id: 1, username: 'john', email: 'john@example.com' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      }, params: { id: '1' }
    };
    (UserStore.prototype.getUserById as jest.Mock).mockResolvedValue(sampleUser);

    await getUserById(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(sampleUser);
    expect(UserStore.prototype.getUserById).toHaveBeenCalledWith(1);
  });

  it('registerUser - should create a new user and return a token', async () => {
    const newUser = { user_id: 1, username: 'john', email: 'john@example.com' };
    const generatedToken = 'mockToken';
    mockRequest = {
      body: {
        username: 'john',
        password: 'password',
        email: 'john@example.com',
      },
    };
    (UserStore.prototype.addUser as jest.Mock).mockResolvedValue(newUser);
    (jwt.sign as jest.Mock).mockReturnValue(generatedToken);

    await registerUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(generatedToken);
    expect(UserStore.prototype.addUser).toHaveBeenCalledWith({
      user_id: 0,
      username: 'john',
      password: 'password',
      email: 'john@example.com',
    });
    expect(jwt.sign).toHaveBeenCalledWith({ user: newUser }, process.env.TOKEN_SECRET);
  });

  it('deleteUser - should remove a user', async () => {
    const deleteResponse = { message: 'User deleted' };
    mockRequest = {
      headers: {
        token: 'valid-token',
      }, params: { id: '1' }
    };
    (UserStore.prototype.removeUser as jest.Mock).mockResolvedValue(deleteResponse);

    await deleteUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(deleteResponse);
    expect(UserStore.prototype.removeUser).toHaveBeenCalledWith(1);
  });

  it('loginUser - should authenticate user and return a token', async () => {
    const authenticatedUser = { user_id: 1, username: 'john', email: 'john@example.com' };
    const generatedToken = 'mockToken';
    mockRequest = {
      body: { username: 'john', password: 'password' },
    };
    (UserStore.prototype.authenticateUser as jest.Mock).mockResolvedValue(authenticatedUser);
    (jwt.sign as jest.Mock).mockReturnValue(generatedToken);

    await loginUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(generatedToken);
    expect(UserStore.prototype.authenticateUser).toHaveBeenCalledWith('john', 'password');
    expect(jwt.sign).toHaveBeenCalledWith({ user: authenticatedUser }, process.env.TOKEN_SECRET);
  });

  it('loginUser - should return 401 if login fails', async () => {
    mockRequest = {
      body: { username: 'john', password: 'wrongpassword' },
    };
    (UserStore.prototype.authenticateUser as jest.Mock).mockResolvedValue(null);

    await loginUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authentication failed' });
  });
});
