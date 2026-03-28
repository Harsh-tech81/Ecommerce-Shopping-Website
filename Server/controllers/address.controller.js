import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";
export const addToCartItemController = async (req, res) => {
  try {
    const {
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      landmark,
      addressType,
    } = req.body;

    const userId = req.userId;
    if (!address_line || !city || !state || !pincode || !country || !mobile) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const address = new AddressModel({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId,
      landmark,
      addressType,
    });
    const saveAddress = await address.save();
    if (!saveAddress) {
      return res.status(500).json({
        message: "Unable to add address",
        error: true,
        success: false,
      });
    }
    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: { address_details: saveAddress?._id },
      },
    );

    return res.status(200).json({
      message: "Address added successfully",
      error: false,
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const getAddressController = async (req, res) => {
  try {
    const address = await AddressModel.find({ userId: req?.query?.userId });
    if (!address) {
      return res.status(404).json({
        message: "No addresses found",
        error: true,
        success: false,
      });
    } else {
      const updatedUser = await UserModel.updateOne(
        { _id: req?.query?.userId },
        {
          $push: {
            address: address?._id,
          },
        },
      );

      return res.status(200).json({
        message: "Addresses fetched successfully",
        error: false,
        success: true,
        data: address,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const _id = req.params.id;
    const userId = req.userId;
    if (!_id) {
      return res.status(400).json({
        message: "Address ID is required",
        error: true,
        success: false,
      });
    }
    const deletedItem = await AddressModel.deleteOne({ _id, userId });

    if (!deletedItem) {
      return res.status(500).json({
        message: "Failed to delete Address",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Address removed successfully",
      data: deletedItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const address = await AddressModel.findOne({ _id: id, userId });

    if (!address) {
      return res.status(500).json({
        message: "Failed to fetch Address",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      address,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
export const editAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId,
      landmark,
      addressType,
    } = req.body;
    const address = await AddressModel.findByIdAndUpdate(
      id,
      {
        address_line,
        city,
        state,
        pincode,
        country,
        mobile,
        landmark,
        addressType,
      },
      { new: true },
    );

if(!address){
  return res.status(500).json({
    message: "Failed to update Address",
    error: true,
    success: false,
  });
}

    return res.status(200).json({
      message: "Address updated successfully",
      address,
      error: false,
      success: true,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
