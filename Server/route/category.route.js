import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  uploadImages,
  createCategory,
  getCategory,
  getCategoriesCount,
  getSubCategoriesCount,
  getCategoryById,
  removeImgFromCloudinary,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import upload from "../middleware/multer.js";

const categoryRouter = Router();

categoryRouter.post(
  "/upload-images",
  auth,
  upload.array("images"),
  uploadImages,
);
categoryRouter.post("/create", auth, createCategory);
categoryRouter.get("/", getCategory);
categoryRouter.get("/get/count", getCategoriesCount);
categoryRouter.get("/get/count/subcat", getSubCategoriesCount);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.delete("/deleteImg", auth, removeImgFromCloudinary);
categoryRouter.delete("/delete/:id", auth, deleteCategory);
categoryRouter.put("/update/:id", auth, updateCategory);

export default categoryRouter;
