import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  uploadImages,
  removeImgFromCloudinary,
  addBlog,
  getBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import upload from "../middleware/multer.js";

const blogRouter = Router();

blogRouter.post("/upload-images", auth, upload.array("images"), uploadImages);
blogRouter.delete("/deleteImg", auth, removeImgFromCloudinary);

blogRouter.post("/add", auth, addBlog);
blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getSingleBlog);
blogRouter.delete("/:id", auth, deleteBlog);
blogRouter.put("/:id", auth, updateBlog);

export default blogRouter;
