import express, { Request, Response } from 'express';
import { OrderDetailStore } from '../models/order_detail';
const jwt = require('jsonwebtoken');

const orderStore = new OrderDetailStore();

export const getAllOrderDetails = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const orderDetails = await orderStore.getAllOrderDetails();
    res.json(orderDetails);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getOrderDetailById = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const orderDetails = await orderStore.getOrderDetailsById(parseInt(req.params.order_id));
    res.json(orderDetails);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const createOrderDetail = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }

  try {
    const newOrderDetail = await orderStore.addOrderDetail({
      order_id: parseInt(req.body.order_id),
      product_id: parseInt(req.body.product_id),
      quantity: parseInt(req.body.quantity),
    });
    res.json(newOrderDetail);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const deleteOrderDetail = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }
  try {
    const deletedDetail = await orderStore.removeOrderDetail(
      parseInt(req.params.order_id),
      parseInt(req.params.product_id)
    );
    res.json(deletedDetail);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const updateOrderDetail = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET);
  } catch (error) {
    res.status(401);
    res.json(`Invalid token ${error}`);
  }

  try {
    const updatedOrderDetail = await orderStore.updateOrderDetail({
      order_id: parseInt(req.params.order_id),
      product_id: parseInt(req.params.product_id),
      quantity: parseInt(req.body.quantity),
    });
    res.json(updatedOrderDetail);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/order-details', getAllOrderDetails);
  app.get('/order-details/:order_id', getOrderDetailById);
  app.post('/order-details', createOrderDetail);
  app.put('/order-details/:order_id/:product_id', updateOrderDetail);
  app.delete('/order-details/:order_id/:product_id', deleteOrderDetail);
};

export default orderRoutes;
