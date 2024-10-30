import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
const jwt = require('jsonwebtoken');

const store = new UserStore();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const usersList = await store.getAllUsers();
    res.json(usersList);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const userId = parseInt(req.params.id);
    const user = await store.getUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user: User = {
      user_id: 0,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };
    
    const newUser = await store.addUser(user);
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET);
    res.json(token);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const deletedUser = await store.removeUser(parseInt(req.params.id));
    res.json(deletedUser);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await store.authenticateUser(username, password);
  if (user) {
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
    res.json(token);
  } else {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', getAllUsers);
  app.get('/users/:id', getUserById);
  app.post('/user/register', registerUser);
  app.delete('/users/:id', deleteUser);
  app.post('/user/login', loginUser);
};

export default userRoutes;
