import MyListModel from "../models/myList.model.js";
import UserModel from "../models/user.model.js";
// Add to My List
export const addToMyList = async (req, res) => {
  try {
    const {
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      discount,
      brand,
    } = req.body;
    const userId = req.userId;
    const item = await MyListModel.findOne({ userId, productId });
    if (item) {
      return res.status(400).json({
        message: "Item already in my list",
        error: true,
        success: false,
      });
    }

    const myListItem = new MyListModel({
      userId,
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      discount,
      brand,
    });
    const save = await myListItem.save();

    const updateCartUser = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $push: { my_list : productId },
      },
    );

    return res.status(200).json({
      message: "Product added successfully to my list",
      data: save,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// delete from myList
export const deleteFromMyList = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: bodyId, productId: bodyProductId } = req.body || {};
    const userId = req.userId;
    const myListItemId = id || bodyId;

    if (!myListItemId) {
      return res.status(400).json({
        message: "My List Item ID is required",
        error: true,
        success: false,
      });
    }

    const existingItem = await MyListModel.findOne({ _id: myListItemId, userId });

    if (!existingItem) {
      return res.status(404).json({
        message: "My List Item not found",
        error: true,
        success: false,
      });
    }

    await MyListModel.deleteOne({ _id: myListItemId, userId });

    const productId = bodyProductId || existingItem?.productId;
    if (productId) {
      await UserModel.updateOne(
        { _id: userId },
        { $pull: { my_list: productId } },
      );
    }

    return res.status(200).json({
      message: "Item deleted successfully from my list",
      data: existingItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get My List Items
export const getMyListItems = async (req, res) => {
  try {
    const userId = req.userId;
    const myListItems = await MyListModel.find({ userId });
    return res.status(200).json({
      data: myListItems,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};


