import express, { Request, Response } from 'express';
import { ProductStore } from '../models/product';
const jwt = require('jsonwebtoken');

const store = new ProductStore();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const products = await store.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const productId = parseInt(req.params.id);
    const product = await store.getById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }

  try {
    const { name, price, category } = req.body;
    const newProduct = await store.addProduct(name, parseFloat(price), parseInt(category));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const productId = parseInt(req.params.id);
    const deletedProduct = await store.removeProduct(productId);
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const productId = parseInt(req.params.id);
    const { name, price, category } = req.body;
    const updatedProduct = await store.updateProduct(productId, name, parseFloat(price), parseInt(category));
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', getAllProducts);
  app.get('/products/:id', getProductById);
  app.post('/products', addProduct);
  app.put('/products/:id', updateProduct);
  app.delete('/products/:id', deleteProduct);
};

export default productRoutes;
