import { Router } from "express";
import { auth } from "../middleware/auth.js";

import {
    createOrderController,
    getOrdersController,
    getMyOrdersController,
    updateOrderStatusController,
    trackOrderController
} from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post("/create", auth, createOrderController);
orderRouter.get("/order-list", auth, getOrdersController);
orderRouter.get("/my-order-list", auth, getMyOrdersController);
orderRouter.put("/order-status/:id", auth, updateOrderStatusController);
orderRouter.get("/track/:id", trackOrderController);
export default orderRouter;

