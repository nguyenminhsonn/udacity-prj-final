import express, { Request, Response } from 'express';
import { CategoryStore } from '../models/category';
const jwt = require('jsonwebtoken');

const storeInstance = new CategoryStore();

export const listCategories = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const categories = await storeInstance.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching categories', details: error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const category = await storeInstance.getCategoryById(parseInt(req.params.id));
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching category by ID', details: error });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const newCategory = await storeInstance.addCategory(req.body.name);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ error: 'Error creating category', details: err });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const deletedCategory = await storeInstance.deleteCategory(parseInt(req.params.id));
    res.status(200).json(deletedCategory);
  } catch (error) {
    res.status(400).json({ error: 'Error deleting category', details: error });
  }
};

const categoryEndpoints = (app: express.Application) => {
  app.get('/categories', listCategories);
  app.get('/categories/:id', getCategoryById);
  app.post('/categories', addCategory);
  app.delete('/categories/:id', deleteCategory);
};

export default categoryEndpoints;
