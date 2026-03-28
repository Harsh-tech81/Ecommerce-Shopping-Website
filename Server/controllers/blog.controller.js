import BlogModel from "../models/blog.model.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

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

// delete image from cloudinary
export const removeImgFromCloudinary = async (req, res) => {
  try {
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

    return res.status(400).json({
      message: "Invalid image path",
      success: false,
      error: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// create Blog controller
export const addBlog = async (req, res) => {
  try {
    let blog = new BlogModel({
      title: req.body.title,
      description: req.body.description,
      images: imagesArr,
    });

    if (!blog) {
      return res
        .status(500)
        .json({ message: "Blog not created", error: true, success: false });
    }
    blog = await blog.save();
    imagesArr = [];
    return res.status(200).json({
      message: "Blog created successfully",
      blog,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get Blog controller
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await BlogModel.countDocuments();

    let blogs;
    let totalPages = 1;

    if (!Number.isNaN(perPage) && perPage > 0) {
      totalPages = Math.ceil(totalPosts / perPage) || 1;

      if (page > totalPages) {
        return res.status(400).json({
          message: "No more blogs available",
          error: true,
          success: false,
        });
      }

      blogs = await BlogModel.find()
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();
    } else {
      blogs = await BlogModel.find().sort({ createdAt: -1 }).exec();
      totalPages = totalPosts > 0 ? 1 : 0;
    }

    if (!blogs) {
      return res
        .status(404)
        .json({ message: "Blogs not found", error: true, success: false });
    }
    return res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
      success: true,
      error: false,
      page,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get single blog by id
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        message: "The Blog with the given ID was not found.",
        error: true,
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "Blog fetched successfully",
        blog,
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

// delete blog by ID
export const deleteBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    const images = blog.images;
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

    const deletedBlog = await BlogModel.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      res.status(404).json({
        message: "Blog not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "The blog is deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// update blog by ID
export const updateBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        images: imagesArr.length === 0 ? req.body.images : imagesArr,
      },
      { new: true },
    );

    if (!blog) {
      return res.status(500).json({
        message: "Blog can't be updated!",
        error: true,
        success: false,
      });
    }
    imagesArr = [];
    res.status(200).json({
      message: "Blog updated successfully",
      blog,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
