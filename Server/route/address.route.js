import { Router } from "express";
import { auth } from "../middleware/auth.js";

import {
  addToCartItemController,
  getAddressController,
  deleteAddress,
  getAddressById,
  editAddress,
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/add", auth, addToCartItemController);
addressRouter.get("/get", auth, getAddressController);
addressRouter.get("/:id", auth, getAddressById);
addressRouter.delete("/:id", auth, deleteAddress);
addressRouter.put("/:id", auth, editAddress); 

export default addressRouter;
