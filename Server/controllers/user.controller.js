import UserModel from "../models/user.model.js";
import PendingRegistrationModel from "../models/pendingRegistration.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import VerificationEmail from "../utils/verifyEmailTemplate.js";
import ForgotPasswordEmail from "../utils/forgotPasswordEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ReviewsModel from "../models/reviews.model.js";
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser?.verify_email) {
      return res.status(400).json({
        message: "User already Registered with this email",
        error: true,
        success: false,
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    await PendingRegistrationModel.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name,
        email: normalizedEmail,
        role: role || "USER",
        password: hashedPassword,
        otp: verifyCode,
        otpExpires: Date.now() + 10 * 60 * 1000,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    //  Send verification email
    const isEmailSent = await sendEmailFun({
      to: normalizedEmail,
      subject: "Verify email from Ecommerce App",
      text: "",
      html: VerificationEmail(name, verifyCode),
    });

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Verification email could not be sent. Please try again.",
        error: true,
        success: false,
      });
    }

    // Create a JWT token for verification purpose
    const token = jwt.sign(
      { email: normalizedEmail },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
    );

    return res.status(200).json({
      message: "User registered successfully! Please verify your email.",
      error: false,
      success: true,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const authWithGoogle = async (req, res) => {
  const { name, email, role, avatar, password, mobile } = req.body;
  try {
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      const user = new UserModel({
        name,
        email,
        avatar,
        password: "null",
        mobile,
        role,
        signUpWithGoogle: true,
        verify_email: true,
      });

      await user.save();
      const accessToken = await generatedAccessToken(user._id);
      const refreshToken = await generatedRefreshToken(user._id);

      const updateUser = await UserModel.findOneAndUpdate(user?._id, {
        last_login_date: new Date(),
      });
      const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };
      res.cookie("refreshToken", refreshToken, cookiesOption);
      res.cookie("accessToken", accessToken, cookiesOption);

      return res.status(200).json({
        message: "Login successfully",
        error: false,
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      const accessToken = await generatedAccessToken(existingUser._id);
      const refreshToken = await generatedRefreshToken(existingUser._id);

      const updateFields = { last_login_date: new Date() };
      if (avatar) updateFields.avatar = avatar;

      const updateUser = await UserModel.findOneAndUpdate(
        existingUser?._id,
        updateFields,
      );
      const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };
      res.cookie("refreshToken", refreshToken, cookiesOption);
      res.cookie("accessToken", accessToken, cookiesOption);
      return res.status(200).json({
        message: "Login successfully",
        error: false,
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({
        message: "Provide required fields email and OTP",
        error: true,
        success: false,
      });
    }

    const pendingUser = await PendingRegistrationModel.findOne({
      email: normalizedEmail,
    });

    if (pendingUser) {
      const isCodeValid = otp === pendingUser.otp;
      const isNotExpired = pendingUser.otpExpires > Date.now();

      if (!isCodeValid) {
        return res.status(400).json({
          message: "Invalid OTP",
          error: true,
          success: false,
        });
      }

      if (!isNotExpired) {
        return res.status(400).json({
          message: "OTP expired",
          error: true,
          success: false,
        });
      }

      let user = await UserModel.findOne({ email: normalizedEmail });

      if (!user) {
        user = new UserModel({
          name: pendingUser.name,
          email: pendingUser.email,
          role: pendingUser.role,
          password: pendingUser.password,
          verify_email: true,
          otp: null,
          otpExpires: null,
        });
      } else if (!user.verify_email) {
        user.name = pendingUser.name;
        user.password = pendingUser.password;
        user.role = pendingUser.role;
        user.verify_email = true;
        user.otp = null;
        user.otpExpires = null;
      } else {
        await PendingRegistrationModel.deleteOne({ _id: pendingUser._id });
        return res.status(400).json({
          message: "Email is already verified",
          error: true,
          success: false,
        });
      }

      await user.save();
      await PendingRegistrationModel.deleteOne({ _id: pendingUser._id });

      return res.status(200).json({
        message: "Email verified successfully",
        error: false,
        success: true,
      });
    }

    // Legacy fallback for already-created unverified users
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    const isCodeValid = otp === user.otp;
    const isNotExpired = user.otpExpires > Date.now();
    if (isCodeValid && isNotExpired) {
      user.verify_email = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(200).json({
        message: "Email verified successfully",
        error: false,
        success: true,
      });
    } else if (!isCodeValid) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    } else {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to admin for activation",
        error: true,
        success: false,
      });
    }

    if (user.verify_email !== true) {
      return res.status(400).json({
        message:
          "Your email is not verified. Please verify your email to login.",
        error: true,
        success: false,
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser = await UserModel.findOneAndUpdate(user?._id, {
      last_login_date: new Date(),
    });
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("refreshToken", refreshToken, cookiesOption);
    res.cookie("accessToken", accessToken, cookiesOption);

    return res.status(200).json({
      message: "Login successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
//logout controller
export const logoutUserController = async (req, res) => {
  try {
    const userid = req.userId;
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("refreshToken", cookiesOption);
    res.clearCookie("accessToken", cookiesOption);
    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.status(200).json({
      message: "Logout successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// Image Upload
var imagesArr = [];
export const userAvatarController = async (req, res) => {
  try {
    imagesArr = [];
    const userId = req.userId;
    const image = req.files;
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(500).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // first remove image from the cloudinary
    const imgUrl = user.avatar;
    const urlArr = imgUrl.split("/");
    const image_Avatar = urlArr[urlArr.length - 1];

    const imageName = image_Avatar.split(".")[0];
    if (imageName) {
      const resp = await cloudinary.uploader.destroy(
        imageName,
        (error, result) => {},
      );
    }

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

    user.avatar = imagesArr[0];
    await user.save();

    return res.status(200).json({
      _id: userId,
      avatar: imagesArr[0],
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

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
      return res.status(200).send(resp);
    }
  }
};

// update user details
export const updateUserProfileController = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const { name, mobile, password, email } = req.body;
    const userExist = await UserModel.findById(userId);
    if (!userExist) {
      return res.status(400).send("The User can't be Updated!");
    }

    const normalizedEmail = (email || userExist.email || "").trim();
    const isEmailChanged = normalizedEmail !== userExist.email;

    let verifyCode = "";
    if (isEmailChanged) {
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    let hashPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    } else {
      hashPassword = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name,
        email: normalizedEmail,
        password: hashPassword,
        mobile,
        verify_email: isEmailChanged ? false : userExist.verify_email,
        otp: verifyCode !== "" ? verifyCode : null,
        otpExpires: verifyCode !== "" ? Date.now() + 10 * 60 * 1000 : null,
      },
      { new: true },
    );

    // Send verification email if email is changed
    if (isEmailChanged) {
      await sendEmailFun({
        to: normalizedEmail,
        subject: "Verify Email from Ecommerce App",
        text: "",
        html: VerificationEmail(userExist.name, verifyCode),
      });
    }

    return res.json({
      message: "User updated successfully",
      error: false,
      success: true,
      user: {
        _id: updateUser?._id,
        name: updateUser?.name,
        email: updateUser?.email,
        mobile: updateUser?.mobile,
        avatar: updateUser?.avatar,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// forgot password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    } else {
      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = verifyCode;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      //  Send verification email
      const isEmailSent = await sendEmailFun({
        to: email,
        subject: "Verify OTP from Ecommerce App",
        text: "",
        html: ForgotPasswordEmail(user.name, verifyCode),
      });

      if (!isEmailSent) {
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return res.status(500).json({
          message: "OTP email could not be sent. Please try again.",
          error: true,
          success: false,
        });
      }

      return res.json({
        message: "Please check your email",
        error: false,
        success: true,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// Verify forgot password otp
export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide required fields email and OTP",
        error: true,
        success: false,
      });
    }

    if (otp !== user.otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    if (!user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    user.otp = null;
    user.otpExpires = null;
    user.verify_email = true;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// Change Password
export const changePasswordController = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide required fields",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(confirmPassword, salt);

    user.password = hashedPassword;
    user.verify_email = true;
    await user.save();

    return res.json({
      message: "Password changed successfully",
      error: false,
      success: true,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// refresh token controller
export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];
    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }
    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN,
    );
    if (!verifyToken) {
      return res.status(401).json({
        message: "token is expired",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken?.id;
    const newAccessToken = await generatedAccessToken(userId);
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", newAccessToken, cookiesOption);

    return res.json({
      message: "New Access token generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get login user details
export const getLoginUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId)
      .select("-password -refresh_token")
      .populate("address_details");
    return res.status(200).json({
      message: "User details",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// Review Controller
export const addProductReviewController = async (req, res) => {
  try {
    const { image, rating, review, userName, userId, productId } = req.body;
    const Newreview = new ReviewsModel({
      image,
      rating,
      review,
      userName,
      userId,
      productId,
    });
    await Newreview.save();
    return res.status(201).json({
      message: "Review added successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get reviews
export const getSingleReviewController = async (req, res) => {
  try {
    const productId = req.query.productId;
    const reviews = await ReviewsModel.find({ productId });
    if (!reviews.length) {
      return res.status(400).json({
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      error: false,
      success: true,
      reviews,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await UserModel.find();
    if(!users){
      return res.status(400).json({
        message: "No users found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "All users",
      error: false,
      success: true,
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export const getAllReviewsController = async (req, res) => {
  try {
    const reviews = await ReviewsModel.find();
    if (!reviews.length) {
      return res.status(400).json({
        message: "No reviews found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "All reviews",
      error: false,
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};



