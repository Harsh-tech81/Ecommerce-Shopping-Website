import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  registerUserController,
  verifyEmailController,
  loginUserController,
  logoutUserController,
  userAvatarController,
  removeImgFromCloudinary,
  updateUserProfileController,
  forgotPasswordController,
  verifyForgotPasswordOtp,
  changePasswordController,
  refreshTokenController,
  getLoginUserDetails,
  authWithGoogle,
  addProductReviewController,
  getSingleReviewController,
  getAllUsersController,
  getAllReviewsController,
} from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";
import { get } from "http";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verifyEmail", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.post("/authWithGoogle", authWithGoogle);
userRouter.get("/logout", auth, logoutUserController);
userRouter.put(
  "/user-avatar",
  auth,
  upload.array("avatar"),
  userAvatarController,
);
userRouter.delete("/deleteImg", auth, removeImgFromCloudinary);
userRouter.put("/:id", auth, updateUserProfileController);
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
userRouter.post("/change-password", changePasswordController);
userRouter.get("/refresh-token", refreshTokenController);
userRouter.get("/user-details", auth, getLoginUserDetails);
userRouter.post("/addReview", auth, addProductReviewController);
userRouter.get("/getReview", getSingleReviewController);
userRouter.get("/getAllReviews",getAllReviewsController);
userRouter.get("/getAllUsers",getAllUsersController);
export default userRouter;
