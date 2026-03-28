import CartModel from "../models/cartProduct.model.js";


export const addToCart = async (req, res) => {
  try {
    const {
      productTitle,
      image,
      rating,
      price,
      quantity,
      subTotal,
      productId,
      countInStock,
      oldPrice,
      discount,
      size,
      weight,
      ram,
      brand,
      sizeOptions,
      ramOptions,
      weightOptions,
    } = req.body;
    const userId = req.userId;
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }
    const checkItemCart = await CartModel.findOne({ userId, productId });
    if (checkItemCart) {
      return res.status(400).json({
        message: "Product already in Cart",
        error: true,
        success: false,
      });
    }
    const cartItem = new CartModel({
      productTitle,
      image,
      rating,
      price,
      quantity,
      subTotal,
      productId,
      countInStock,
      userId,
      oldPrice,
      discount,
      size,
      weight,
      ram,
      brand,
      sizeOptions,
      ramOptions,
      weightOptions,
    });
    const data = await cartItem.save();

    return res.status(200).json({
      message: "Product added successfully to cart",
      data,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get Cart Items
export const getCartItems = async (req, res) => {
  try {
    const userId = req.userId;
    const cartItems = await CartModel.find({ userId });
    return res.status(200).json({
      data: cartItems,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// update Cart Item Quantity
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { _id, quantity, subTotal } = req.body;
    const userId = req.userId;

    if (!_id || !quantity) {
      return res.status(400).json({
        message: "Cart Item ID and Quantity are required",
        error: true,
        success: false,
      });
    }

    const updatedCartItem = await CartModel.updateOne(
      { _id, userId },
      { quantity, subTotal },
      {
        new: true,
      }
    );

    if (!updatedCartItem) {
      return res.status(404).json({
        message: "Cart Item not found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Cart Item quantity updated successfully",
      data: updatedCartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// delete Cart Item
export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId; // middleware auth will set this
    if (!id) {
      return res.status(400).json({
        message: "Cart Item ID is required",
        error: true,
        success: false,
      });
    }
    const deletedCartItem = await CartModel.deleteOne({ _id : id, userId });

    if (!deletedCartItem) {
      return res.status(500).json({
        message: "Failed to delete Cart Item",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Cart Item deleted successfully",
      data: deletedCartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const emptyCartController = async (req, res) => {
  try {
    const userId = req.params.id;
    await CartModel.deleteMany({ userId });
    
    return res.status(200).json({
      error: false,
      success: true,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};