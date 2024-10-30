import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';
const jwt = require('jsonwebtoken');

const orderService = new OrderStore();

export const fetchOrders = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const ordersList = await orderService.getAllOrders();
    res.status(200).json(ordersList);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const fetchOrderById = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const orderId = parseInt(req.params.id);
    const orderData = await orderService.getOrderById(orderId);
    res.status(200).json(orderData);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const addOrder = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }

  try {
    const newOrder = {
      user_id: parseInt(req.body.user_id),
      status: req.body.status,
      create_time: new Date().toISOString(),
    };
    const orderCreated = await orderService.createOrder(newOrder);
    res.status(201).json(orderCreated);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const modifyOrder = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }

  try {
    const orderId = parseInt(req.params.id);
    const updatedOrder = await orderService.updateOrderStatus(orderId, req.body.status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const removeOrder = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const orderId = parseInt(req.params.id);
    const deletedOrder = await orderService.removeOrder(orderId);
    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const orderHandlers = (app: express.Application) => {
  app.get('/orders', fetchOrders);
  app.get('/orders/:id', fetchOrderById);
  app.post('/orders', addOrder);
  app.put('/orders/:id', modifyOrder);
  app.delete('/orders/:id', removeOrder);
};

export default orderHandlers;
