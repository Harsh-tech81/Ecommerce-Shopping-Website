import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import mylistRouter from "./route/mylist.route.js";
import addressRouter from "./route/address.route.js";
import homeSliderRouter from "./route/homeSlides.route.js";
import blogRouter from "./route/blog.route.js";
import orderRouter from "./route/order.route.js";
const app = express();
const PORT = process.env.PORT;

// Build allowed origins from environment variables
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "Server is running on port " + PORT });
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/myList", mylistRouter);
app.use("/api/address", addressRouter);
app.use("/api/homeSlides", homeSliderRouter);
app.use("/api/blog", blogRouter);
app.use("/api/order", orderRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
