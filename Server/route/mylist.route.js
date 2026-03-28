import { Router } from "express";
import { auth } from "../middleware/auth.js";

const mylistRouter = Router();

import {
  addToMyList,
  deleteFromMyList,
  getMyListItems,
} from "../controllers/mylist.controller.js";

mylistRouter.post("/add", auth, addToMyList);
mylistRouter.delete("/:id", auth, deleteFromMyList);
mylistRouter.get("/", auth, getMyListItems);

export default mylistRouter;
