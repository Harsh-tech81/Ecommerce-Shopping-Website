import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createProduct,
  uploadImages,
  getProducts,
  getProductsByCatId,
  getProductsByCatName,
  getProductsBySubCatId,
  getProductsBySubCatName,
  getProductsByThirdSubCatId,
  getProductsByThirdSubCatName,
  getAllProductsByPrice,
  getProductsByRating,
  getProductsCount,
  getFeaturedProducts,
  deleteProduct,
  getProductById,
  removeImgFromCloudinary,
  updateProduct,
  deleteMultipleProducts,
  filters,
  sortBy,
  searchProductController
} from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";

const productRouter = Router();

productRouter.post(
  "/upload-images",
  auth,
  upload.array("images"),
  uploadImages,
);


productRouter.post("/create", auth, createProduct);
productRouter.get("/", getProducts);
productRouter.get("/getProdByCatId/:id", getProductsByCatId);
productRouter.get("/getProdByCatName", getProductsByCatName);
productRouter.get("/getProdBySubCatId/:id", getProductsBySubCatId);
productRouter.get("/getProductsBySubCatName", getProductsBySubCatName);
productRouter.get("/getProdByThirdCatId/:id", getProductsByThirdSubCatId);
productRouter.get("/getProdByThirdCatName", getProductsByThirdSubCatName);
productRouter.get("/getProdByPrice", getAllProductsByPrice);
productRouter.get("/getProdByRating", getProductsByRating);
productRouter.get("/getAllProductsCount", getProductsCount);
productRouter.get("/getFeaturedProducts", getFeaturedProducts);
productRouter.delete('/deleteMultiple',deleteMultipleProducts)
productRouter.delete("/:id", deleteProduct);
productRouter.get("/:id", getProductById);
productRouter.delete("/deleteImg", auth, removeImgFromCloudinary);
productRouter.put("/updateProduct/:id",auth, updateProduct );
productRouter.post("/filters", filters);
productRouter.post("/sortBy",sortBy );
productRouter.post("/search/get", searchProductController);

export default productRouter;
