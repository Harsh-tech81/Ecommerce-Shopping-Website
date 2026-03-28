import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    userName : {
      type: String,
      default: "",
    },
    image : {
      type: String,
      default: "",
    },
    rating : {
      type: Number,
      default: '',
    },
    review : {
      type: String,
      default: "",
    },
    userId : {
      type: String,
      default: '',
    },
    productId : {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true
  },
);

const ReviewsModel = mongoose.model("reviews", reviewsSchema);
export default ReviewsModel;
