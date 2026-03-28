import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

export const createOrderController = async (req, res) => {
  try {
    const userId = req.userId;

    let order = new OrderModel({
      userId,
      products: req.body.products,
      paymentId: req.body.paymentId,
      payment_status: req.body.payment_status,
      delivery_address: req.body.delivery_address,
      totalAmt: req.body.totalAmt,
      date: req.body.date,
    });
    if (!order) {
      return res.status(500).json({
        error: true,
        success: false,
      });
    }

    for (let i = 0; i < req.body.products.length; i++) {
      await ProductModel.findByIdAndUpdate(
        req.body.products[i].productId,
        {
          countInStock: parseInt(
            req.body.products[i].countInStock - req.body.products[i].quantity,
          ),
        },
        { new: true },
      );
    }
    order = await order.save();

    await UserModel.findByIdAndUpdate(userId, {
      $push: { orderHistory: order._id },
    });

    return res.status(200).json({
      message: "Order created successfully",
      order,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("delivery_address userId");
    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const getMyOrdersController = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address userId");

    return res.status(200).json({
      message: "User orders fetched successfully",
      data: orders,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const orderId = req.params.id || req.body.id;
    const { order_status } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order id is required",
        error: true,
        success: false,
      });
    }

    const validStatuses = ["pending", "confirmed", "delivered"];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({
        message: "Invalid order status",
        error: true,
        success: false,
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { order_status },
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      data: updatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};
