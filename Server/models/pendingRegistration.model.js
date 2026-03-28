import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

pendingRegistrationSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

const PendingRegistrationModel = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema,
);

export default PendingRegistrationModel;