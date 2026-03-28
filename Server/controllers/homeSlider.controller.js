import HomeSliderModel from "../models/homeSlider.model.js";
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

export const AddHomeSlider = async (req, res) => {
  try {
    let homeSlider = new HomeSliderModel({
      images: imagesArr,
    });
    if (!homeSlider) {
      return res.status(400).json({
        message: "Failed to create home slider",
        error: true,
        success: false,
      });
    }
    homeSlider = await homeSlider.save();
    imagesArr = [];
    return res.status(200).json({
      message: "Home slider created successfully",
      homeSlider,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const getHomeSlides = async (req, res) => {
  try {
    const HomeSlides = await HomeSliderModel.find();
    if (!HomeSlides) {
      return res.status(404).json({
        message: "No home slides found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Home slides fetched successfully",
      data: HomeSlides,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const getSlide = async (req, res) => {
  try {
    const slide = await HomeSliderModel.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({
        message: "Slide with this ID is not found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Slide fetched successfully",
      data: slide,
      success: true,
      error: false,
    });
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

export const deleteHomeSlide = async (req, res) => {
  try {
    const slide = await HomeSliderModel.findById(req.params.id);
    const images = slide.images;
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
    const deletedSlide = await HomeSliderModel.findByIdAndDelete(req.params.id);

    if (!deletedSlide) {
      res.status(404).json({
        message: "Slide not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "The slide is deleted successfully",
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
export const updatedSlide = async (req, res) => {
  try {
    const slide = await HomeSliderModel.findByIdAndUpdate(
      req.params.id,
      {
     
        images: imagesArr.length === 0 ? req.body.images : imagesArr[0],
       
      },
      { new: true }
    );

    if (!slide) {
      return res.status(500).json({
        message: "Slide cannot be updated!",
        error: true,
        success: false,
      });
    }
    imagesArr = [];
    res.status(200).json({
      message: "Slide updated successfully",
      slide,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

