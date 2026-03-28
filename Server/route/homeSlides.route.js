import { Router } from "express";
import { auth } from "../middleware/auth.js";

import {
  uploadImages,
  AddHomeSlider,
  getHomeSlides,
  getSlide,
  deleteHomeSlide,
  updatedSlide,
  removeImgFromCloudinary
} from "../controllers/homeSlider.controller.js";

import upload from "../middleware/multer.js";

const homeSliderRouter = Router();

homeSliderRouter.post(
  "/upload-images",
  auth,
  upload.array("images"),
  uploadImages,
);
homeSliderRouter.post("/add", auth, AddHomeSlider);
homeSliderRouter.get("/", getHomeSlides);
homeSliderRouter.get("/:id", getSlide);
homeSliderRouter.delete("/deleteImg", auth, removeImgFromCloudinary);
homeSliderRouter.delete("/delete/:id", auth, deleteHomeSlide);
homeSliderRouter.put("/update/:id", auth, updatedSlide);

export default homeSliderRouter;
