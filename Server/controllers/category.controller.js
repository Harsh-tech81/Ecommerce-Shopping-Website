import CategoryModel from "../models/category.model.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// Image Upload

var imagesArr = [];

export const uploadImages = async (req, res) => {
  try {
    imagesArr = [];
    const image = req.files;

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < image?.length; i++) {
      const img = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${image[i].filename}`);
        },
      );
    }

    return res.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// create category controller
export const createCategory = async (req, res) => {
  try {
    let category = new CategoryModel({
      name: req.body.name,
      images: imagesArr,
      parentCatName: req.body.parentCatName,
      parentId: req.body.parentId,
    });

    if (!category) {
      return res
        .status(500)
        .json({ message: "Category not created", error: true, success: false });
    }
    category = await category.save();
    imagesArr = [];
    return res.status(200).json({
      message: "Category created successfully",
      category,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get category
export const getCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat._doc, children: [] };
    });

    const rootCategories = [];

    categories.forEach((cat) => {
      if (cat.parentId) {
        categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: rootCategories,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get categories count
export const getCategoriesCount = async (req, res) => {
  try {
    const categoriesCount = await CategoryModel.countDocuments({
      parentId: undefined,
    });
    if (!categoriesCount) {
      return res.status(500).json({
        message: "Cannot fetch categories count",
        error: true,
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "Categories count fetched successfully",
        categoryCount: categoriesCount,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get sub-category count
export const getSubCategoriesCount = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    if (!categories) {
      res.status(500).json({
        message: "Cannot fetch sub-categories count",
        error: true,
        success: false,
      });
    } else {
      const subCatArr = [];
      for (let cat of categories) {
        if (cat.parentId !== undefined) {
          subCatArr.push(cat);
        }
      }
      res.status(200).json({
        message: "Sub-Categories count fetched successfully",
        subCategoryCount: subCatArr.length,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get single category by id
export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(500).json({
        message: "The Category with the given ID was not found.",
        error: true,
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "Category fetched successfully",
        category,
        success: true,
        error: false,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// delete image from cloudinary
export const removeImgFromCloudinary = async (req, res) => {
  const imgUrl = req.query.img;
  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];
  if (imageName) {
    const resp = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {},
    );
    if (resp) {
      return res.status(200).json({
        message: "Image deleted successfully",
        success: true,
        error: false,
      });
    }
  }
};

// delete category by ID
export const deleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    const images = category.images;
    let img = "";
    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];
      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {});
      }
    }

    const subCategory = await CategoryModel.find({ parentId: req.params.id });

    for (let i = 0; i < subCategory.length; i++) {
      const thirdsubCategory = await CategoryModel.find({
        parentId: subCategory[i]._id,
      });
      for (let j = 0; j < thirdsubCategory.length; j++) {
        const deletedthirdsub = await CategoryModel.findByIdAndDelete(
          thirdsubCategory[j]._id,
        );
      }

      const deletedsubCat = await CategoryModel.findByIdAndDelete(
        subCategory[i]._id,
      );
    }

    const deletedCat = await CategoryModel.findByIdAndDelete(req.params.id);

    if (!deletedCat) {
      res.status(404).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "The category is deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// update category by ID
export const updateCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        images: imagesArr.length === 0 ? req.body.images : imagesArr[0],
        parentCatName: req.body.parentCatName,
        parentId: req.body.parentId,
      },
      { new: true },
    );

    if (!category) {
      return res.status(500).json({
        message: "Category can't be updated!",
        error: true,
        success: false,
      });
    }
    imagesArr = [];
    res.status(200).json({
      message: "Category updated successfully",
      category,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};



