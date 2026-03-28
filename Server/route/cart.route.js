import { Router } from "express";
import { auth } from "../middleware/auth.js";

import {  addToCart,getCartItems,updateCartItemQuantity,deleteCartItem,emptyCartController } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", auth, addToCart);
cartRouter.get("/get", auth, getCartItems);
cartRouter.put("/update", auth, updateCartItemQuantity);
cartRouter.delete("/deleteCart/:id", auth, deleteCartItem);
cartRouter.delete("/emptyCart/:id", auth, emptyCartController);

export default cartRouter;
