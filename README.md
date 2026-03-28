# MERN Full Stack Ecommerce Project

A complete ecommerce platform built with the MERN stack, split into three apps:
- `Client` (customer-facing storefront)
- `Admin` (management dashboard)
- `Server` (REST API + authentication + business logic)

This project includes product browsing, category filters, cart, wishlist, checkout flow, address management, orders, blog, admin content control, and OTP-based account verification/password reset.

## Project Architecture

```text
MERN Full Stack Project/
  Admin/   -> React + Vite admin dashboard
  Client/  -> React + Vite ecommerce frontend
  Server/  -> Express + MongoDB API
```

## Tech Stack

### Frontend (Client + Admin)
- React 19 + Vite
- React Router
- Tailwind CSS + custom responsive styles
- MUI (Material UI)
- Axios + Fetch API
- Firebase Auth (Google sign-in)
- React Hot Toast
- Swiper, React Icons
### Backend (Server)
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (access + refresh token flow)
- Cookie parser, CORS, Helmet, Morgan
- Multer + Cloudinary (image upload/storage)
- Nodemailer (OTP emails)
- Bcrypt (password hashing)

## Core Features

### Customer Panel (Client)
- User registration/login/logout
- OTP email verification
- Forgot password with OTP email verification
- Product listing with filter/sort/search
- Product details and related interactions
- Cart management (add/update/remove/clear)
- Wishlist (My List)
- Address CRUD
- Checkout + order placement
- Order history
- Blog listing
- Responsive UI for mobile/tablet/desktop

### Admin Panel
- Admin authentication flow
- Dashboard layout with responsive sidebar
- Product management
- Category and subcategory management
- Home slider/banner management
- Blog management
- User listing
- Order listing and status updates
- Profile management

### Backend/API Highlights
- Modular route architecture:
  - `/api/user`
  - `/api/product`
  - `/api/category`
  - `/api/cart`
  - `/api/myList`
  - `/api/address`
  - `/api/homeSlides`
  - `/api/blog`
  - `/api/order`
- Token refresh handling for protected APIs
- Secure headers with Helmet
- CORS for local dev origins
- Cloud image lifecycle support

## Authentication and OTP Flow

- Email OTP verification for registration
- Forgot password OTP flow
- Access token + refresh token mechanism
- Google sign-in support (Firebase)

### Registration behavior
The registration flow is designed so user records are finalized after OTP verification.

## API Modules Covered

- **Users/Auth**: register, verify email, login, logout, forgot password, verify forgot-password OTP, change password, refresh token, profile details
- **Products**: CRUD, image upload, featured products, category/subcategory filters, rating/price filters, search
- **Categories**: CRUD, image upload, counts
- **Cart**: add/get/update/delete/empty
- **Wishlist**: add/get/delete
- **Address**: add/get/get-by-id/update/delete
- **Orders**: create, admin list, user list, status update
- **Home Slides**: CRUD + image upload
- **Blogs**: CRUD + image upload

## Environment Variables

Create environment files with your own values.

### Server (`Server/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JSON_WEB_TOKEN_SECRET_KEY=your_access_token_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret

EMAIL=your_email@example.com
EMAIL_PASS=your_app_password

cloudinary_Config_Cloud_Name=your_cloudinary_cloud_name
cloudinary_Config_api_key=your_cloudinary_api_key
cloudinary_Config_api_secret=your_cloudinary_api_secret
```

### Client (`Client/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Admin (`Admin/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Local Setup

### 1. Install dependencies
```bash
# from project root (run separately)
cd Server && npm install
cd ../Client && npm install
cd ../Admin && npm install
```

### 2. Start development servers
Open 3 terminals:

```bash
# Terminal 1
cd Server
npm run dev
```

```bash
# Terminal 2
cd Client
npm run dev
```

```bash
# Terminal 3
cd Admin
npm run dev
```

## Build Commands

```bash
# Client
cd Client && npm run build

# Admin
cd Admin && npm run build

# Server (production run)
cd Server && npm run start
```

## Admin vs Client Routing (High Level)

- **Client routes**: home, products, product details, cart, checkout, orders, login/register, verify OTP, forgot-password, account pages
- **Admin routes**: dashboard, products, categories/subcategories, home slider, blog list, users, orders, profile, login/sign-up/verify account

## Security and Best Practices Used

- Password hashing with `bcryptjs`
- Protected routes with auth middleware
- JWT-based auth with token refresh
- HTTP hardening via `helmet`
- CORS configuration for allowed origins
- OTP expiration checks for verification/reset flows

## Future Improvements

- Add role-based route guards on frontend pages
- Add automated tests (unit/integration)
- Add Docker and CI/CD pipeline
- Add centralized validation layer (e.g., Zod/Joi)
- Add API documentation (OpenAPI/Swagger)

## Author

Harsh Kumar

