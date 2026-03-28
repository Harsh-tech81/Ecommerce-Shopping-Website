import ProductModel from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// Image Upload
var imagesArr = [];

export const uploadImages = async (req, res) => {
  try {
    imagesArr = [];
    const image = req.files;

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

    return res.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
// create product controller

export const createProduct = async (req, res) => {
  try {
    let product = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      images: imagesArr,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catName: req.body.catName,
      category: req.body.category,
      catId: req.body.catId,
      subCat: req.body.subCat,
      subCatId: req.body.subCatId,
      thirdsubCat: req.body.thirdsubCat,
      thirdsubCatId: req.body.thirdsubCatId,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
      productRam: req.body.productRam,
      productWeight: req.body.productWeight,
      size: req.body.size,
    });

    product = await product.save();

    if (!product) {
      return res
        .status(500)
        .json({ message: "Product not created", error: true, success: false });
    }
    imagesArr = [];
    return res.status(200).json({
      message: "Product created successfully",
      product,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all products
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "No more products available",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();

    if (!products) {
      res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      success: true,
      error: false,
      page,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all products by Category ID
export const getProductsByCatId = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "No more products available",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      catId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();

    if (!products) {
      res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      success: true,
      error: false,
      page,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all products by Category Name
export const getProductsByCatName = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "No more products available",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      catName: req.query.catName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();

    if (products.length === 0) {
      return res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      success: true,
      error: false,
      page,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all products by SubCategory ID
export const getProductsBySubCatId = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "No more products available",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      subCatId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();

    if (!products) {
      res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      success: true,
      error: false,
      page,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all products by SubCategory Name
export const getProductsBySubCatName = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "No more products available",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      subCat: req.query.subCatName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();

    if (products.length === 0) {
      return res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      success: true,
      error: false,
      page,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all products by ThirdSubCategory ID
export const getProductsByThirdSubCatId = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "No more products available",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      thirdsubCatId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();

    if (!products) {
      res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      success: true,
      error: false,
      page,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all products by ThridSubCategory Name
export const getProductsByThirdSubCatName = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "No more products available",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      thirdsubCat: req.query.thirdSubCatName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();

    if (products.length === 0) {
      return res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      success: true,
      error: false,
      page,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// Get all the products by Price
export const getAllProductsByPrice = async (req, res) => {
  let productList = [];
  if (req.query.catId !== "" && req.query.catId !== undefined) {
    const productListArr = await ProductModel.find({
      catId: req.query.catId,
    }).populate("category");

    productList = productListArr;
  }

  if (req.query.subCatId !== "" && req.query.subCatId !== undefined) {
    const productListArr = await ProductModel.find({
      subCatId: req.query.subCatId,
    }).populate("category");

    productList = productListArr;
  }
  if (req.query.thirdsubCatId !== "" && req.query.thirdsubCatId !== undefined) {
    const productListArr = await ProductModel.find({
      thirdsubCatId: req.query.thirdsubCatId,
    }).populate("category");

    productList = productListArr;
  }

  const filteredProducts = productList.filter((product) => {
    if (req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
      return false;
    }
    if (req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)) {
      return false;
    }
    return true;
  });

  return res.status(200).json({
    products: filteredProducts,
    totalPages: 0,
    error: false,
    success: true,
    page: 0,
  });
};

//Get products by rating
export const getProductsByRating = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(400).json({
        message: "No more products available",
        error: true,
        success: false,
      });
    }

    let products = [];

    if (req.query.catId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        catId: req.query.catId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();
    }

    if (req.query.subCatId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        subCatId: req.query.subCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();
    }

    if (req.query.thirdsubCatId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        thirdsubCatId: req.query.thirdsubCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();
    }

    if (products.length === 0) {
      return res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }

    return res.status(200).json({
      products,
      success: true,
      error: false,
      page,
      totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all products count
export const getProductsCount = async (req, res) => {
  try {
    const totalProducts = await ProductModel.countDocuments();
    if (!totalProducts) {
      return res.status(500).json({
        message: "Unable to fetch products count",
        error: true,
        success: false,
      });
    }
    return res
      .status(200)
      .json({ ProductCount: totalProducts, error: false, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get all featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
    }).populate("category");

    if (products.length === 0) {
      return res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// delete a single Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate(
      "category",
    );
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", error: true, success: false });
    }
    const images = product.images;
    let img = "";
    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];
      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {});
      }
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res
        .status(500)
        .json({ message: "Product not deleted", error: true, success: false });
    }
    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// delete multiple products
export const deleteMultipleProducts = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res
      .status(400)
      .json({ message: "Invalid input", error: true, success: false });
  }
  for (let i = 0; i < ids?.length; i++) {
    const product = await ProductModel.findById(ids[i]);
    const images = product.images;
    let img = "";
    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];
      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {});
      }
    }
  }
  try {
    await ProductModel.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({
      message: "Products deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// get single product by id
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate(
      "category",
    );
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", error: true, success: false });
    }
    return res.status(200).json({
      product,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

// delete image from cloudinary
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

// update product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        brand: req.body.brand,
        images: req.body.images,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        catName: req.body.catName,
        catId: req.body.catId,
        subCat: req.body.subCat,
        subCatId: req.body.subCatId,
        thirdsubCat: req.body.thirdsubCat,
        thirdsubCatId: req.body.thirdsubCatId,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        discount: req.body.discount,
        productRam: req.body.productRam,
        productWeight: req.body.productWeight,
        size: req.body.size,
        category: req.body.category,
      },
      { new: true },
    );
    if (!updatedProduct) {
      return res
        .status(500)
        .json({ message: "Product not updated", error: true, success: false });
    }
    imagesArr = [];
    return res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export async function filters(req, res) {
  const {
    catId,
    subCatId,
    thirdsubCatId,
    minPrice,
    maxPrice,
    rating,
    page,
    limit,
  } = req.body;
  let filter = {};

  if (catId?.length > 0) {
    filter.catId = { $in: catId };
  }
  if (subCatId?.length > 0) {
    filter.subCatId = { $in: subCatId };
  }
  if (thirdsubCatId?.length > 0) {
    filter.thirdsubCatId = { $in: thirdsubCatId };
  }
  if (minPrice || maxPrice) {
    filter.price = { $gte: +minPrice || 0, $lte: +maxPrice || Infinity };
  }
  if (rating?.length > 0) {
    filter.rating = { $in: rating };
  }
  try {
    const products = await ProductModel.find(filter)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .exec();

    const total = await ProductModel.countDocuments(filter);

    if (products.length === 0) {
      return res
        .status(500)
        .json({ message: "No products found", error: true, success: false });
    }
    return res.status(200).json({
      products,
      total,
      success: true,
      error: false,
      page : parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
const sortItems=(products,sortByField,order)=>{
  return products.sort((a, b) => {
if(sortByField==='name'){
    return order==='asc' ? (a.name || '').localeCompare(b.name || '') : (b.name || '').localeCompare(a.name || '')
}
if(sortByField==='price'){
    return order==='asc' ? a.price - b.price : b.price - a.price
  }
return;
  })
}

export async function sortBy(req, res) {
  try {
    const { products, sortBy: sortByField, order } = req.body;
    const sortedItems = sortItems([...products], sortByField, order);
    return res.status(200).json({
      products: sortedItems,
      success: true,
      error: false,
      page: 0,
      totalPages: 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

export async function searchProductController(req,res) {
  try{
  const {
    page,
    limit,
    query
  } = req.body;

    if(!query){
      return res.status(400).json({ message: "Search query is required", error: true, success: false });
    }
    const items=await ProductModel.find({
      $or:[
        { name: { $regex: query, $options: 'i' } },
        { catName: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        {subCat: { $regex: query, $options: 'i' } },
        {thirdsubCat: { $regex: query, $options: 'i' } },
      ]
    }).populate("category");

const total=await items?.length;

return res.status(200).json({
  product: items,
  total,
  success: true,
  error: false,
  page : parseInt(page),
  totalPages: Math.ceil(total / limit),
});
  } catch (error) {
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
} 

