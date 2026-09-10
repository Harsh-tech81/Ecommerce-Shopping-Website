import { useContext, useEffect } from "react";
import "../ProductItem/style.css";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";
import { MyContext } from "../../App";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useState } from "react";
import { deleteData, editData, postData } from "../../utils/api";
import { MdClose } from "react-icons/md";

function ProductItem(props) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedToMyList, setIsAddedToMyList] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isShowTabs, setIsShowTabs] = useState(false);
  const [selectedTabName, setSelectedTabName] = useState(null);
  const [justAddedHeart, setJustAddedHeart] = useState(false);
  const context = useContext(MyContext);

  const addToCart = (product, userId, quantity) => {
    const productItem = {
      name: product?.name,
      _id: product?._id,
      userId,
      price: product?.price,
      oldPrice: product?.oldPrice,
      countInStock: product?.countInStock,
      subTotal: parseInt(product?.price * quantity),
      quantity: quantity,
      rating: product?.rating,
      image: product?.images[0],
      brand: product?.brand,
      discount: product?.discount,
      size: props?.item?.size?.length !== 0 ? selectedTabName : "",
      ram: props?.item?.productRam?.length !== 0 ? selectedTabName : "",
      weight: props?.item?.productWeight?.length !== 0 ? selectedTabName : "",
      sizeOptions: props?.item?.size || [],
      ramOptions: props?.item?.productRam || [],
      weightOptions: props?.item?.productWeight || [],
    };

    if (
      props?.item?.size?.length !== 0 ||
      props?.item?.productRam?.length !== 0 ||
      props?.item?.productWeight?.length !== 0
    ) {
      setIsShowTabs(true);
    } else {
      context?.addToCart(productItem, userId, quantity);
      setIsAdded(true);
      setIsShowTabs(false);
    }

    if (activeTab !== null) {
      context?.addToCart(productItem, userId, quantity);
      setIsAdded(true);
      setIsShowTabs(false);
    }
  };

  const handleClickActiveTab = (index, name) => {
    setActiveTab(index);
    setSelectedTabName(name);
  };

  useEffect(() => {
    const currentProductId = String(props?.item?._id || "");

    const item = context?.cartData?.filter((cartItem) => {
      const cartProductId = String(cartItem?.productId || "");
      return cartProductId === currentProductId;
    });

    const itemInMyList = context?.myListData?.filter((listItem) => {
      const myListProductId = String(listItem?.productId || "");
      return myListProductId === currentProductId;
    });

    if (item?.length > 0) {
      setCartItem(item);
      setIsAdded(true);
      setQuantity(item[0]?.quantity);
    } else {
      setQuantity(1);
    }
    if (itemInMyList?.length > 0) {
      setIsAddedToMyList(true);
    } else {
      setIsAddedToMyList(false);
    }
  }, [context?.cartData, context?.myListData, props?.item?._id]);

  const addQty = () => {
    setQuantity(quantity + 1);
    const obj = {
      _id: cartItem[0]?._id,
      quantity: quantity + 1,
      subTotal: (quantity + 1) * props?.item?.price,
    };
    editData(`/api/cart/update`, obj).then((res) => {
      context.openAlertbox("success", "Cart Item updated successfully");
      context.getCartData();
    });
  };

  const removeQty = () => {
    if (quantity !== 1 && quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }
    if (quantity === 1) {
      deleteData(`/api/cart/deleteCart/${cartItem[0]?._id}`).then((res) => {
        context.openAlertbox("success", res?.message);
        context.getCartData();
        setIsAdded(false);
        setIsShowTabs(false);
        setActiveTab(null);
      });
    } else {
      const obj = {
        _id: cartItem[0]?._id,
        quantity: quantity - 1,
        subTotal: (quantity - 1) * props?.item?.price,
      };
      editData(`/api/cart/update`, obj).then((res) => {
        context.openAlertbox("success", "Cart Item updated successfully");
        context.getCartData();
      });
    }
  };

  const handleAddToMyList = (product) => {
    if (context?.userDetails === null || context?.userDetails === undefined) {
      context?.openAlertbox("error", "Please login to add item to my list");
      return false;
    }

    const obj = {
      productId: product?._id,
      userId: context?.userDetails?._id,
      productTitle: product?.name,
      price: product?.price,
      oldPrice: product?.oldPrice,
      rating: product?.rating,
      image: product?.images[0],
      brand: product?.brand,
      discount: product?.discount,
    };
    postData("/api/myList/add", obj).then((res) => {
      if (res?.error === false) {
        context?.openAlertbox("success", res?.message);
        setIsAddedToMyList(true);
        setJustAddedHeart(true);
        setTimeout(() => setJustAddedHeart(false), 700);
        context.getMyListData();
      } else {
        context?.openAlertbox("error", res?.message);
      }
    });
  };

  return (
    <div className="productItem rounded-xl overflow-hidden border border-gray-100 flex flex-col justify-between bg-white">
      {/* Image Section */}
      <div className="group imgWrapper overflow-hidden w-full relative aspect-[4/5] bg-gray-50 flex items-center justify-center">
        <Link to={`/product/${props?.item?._id}`} className="w-full h-full block">
          <div className="img h-full w-full overflow-hidden">
            <img
              src={props?.item?.images?.[0] || props?.item?.image}
              className="w-full h-full object-cover"
              alt={props?.item?.name}
            />
          </div>
          {props?.item?.images?.[1] && (
            <div className="img h-full w-full overflow-hidden">
              <img
                src={props?.item?.images[1]}
                className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                alt={props?.item?.name}
              />
            </div>
          )}
        </Link>

        {/* Variant Selection Overlay */}
        {isShowTabs && (
          <div className="variant-overlay flex items-center justify-center absolute top-0 left-0 w-full h-full z-[60] gap-2 p-3 flex-wrap">
            <Button
              className="!absolute top-[10px] right-[10px] !min-w-[30px] !min-h-[30px] !h-[30px] !w-[30px] !rounded-full !bg-white/90 text-black hover:!bg-white"
              onClick={() => setIsShowTabs(false)}
            >
              <MdClose className="text-black z-[90] text-[18px]" />
            </Button>

            {props?.item?.size?.length !== 0 &&
              props?.item?.size?.map((size, index) => (
                <span
                  key={index}
                  className={`variant-pill ${activeTab === index ? "active" : ""}`}
                  onClick={() => handleClickActiveTab(index, size)}
                >
                  {size}
                </span>
              ))}
            {props?.item?.productRam?.length !== 0 &&
              props?.item?.productRam?.map((ram, index) => (
                <span
                  key={index}
                  className={`variant-pill ${activeTab === index ? "active" : ""}`}
                  onClick={() => handleClickActiveTab(index, ram)}
                >
                  {ram}
                </span>
              ))}
            {props?.item?.productWeight?.length !== 0 &&
              props?.item?.productWeight?.map((weight, index) => (
                <span
                  key={index}
                  className={`variant-pill ${activeTab === index ? "active" : ""}`}
                  onClick={() => handleClickActiveTab(index, weight)}
                >
                  {weight}
                </span>
              ))}
          </div>
        )}

        {/* Discount Badge */}
        {props?.item?.discount ? (
          <span className="discount flex items-center absolute top-2.5 left-2.5 z-40 bg-gradient-to-r from-[#ff5252] to-[#e63946] text-white rounded-full text-[10px] font-bold px-2.5 py-1 shadow-sm">
            {props?.item?.discount}% OFF
          </span>
        ) : null}

        {/* Quick Action Buttons */}
        <div className="actions absolute top-[-200px] right-[8px] z-50 flex items-center gap-2 flex-col w-[38px] group-hover:top-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            className="!w-[36px] !h-[36px] !min-w-[36px] !rounded-full !bg-white/95 !text-gray-700 hover:!bg-[#ff5252] hover:!text-white transition-all !shadow-md"
            onClick={() =>
              context.handleOpenProductDetailModel(true, props?.item)
            }
          >
            <MdZoomOutMap className="text-[16px]" />
          </Button>

          <Button
            className={`!w-[36px] !h-[36px] !min-w-[36px] !rounded-full !bg-white/95 hover:!bg-[#ff5252] hover:!text-white transition-all !shadow-md ${isAddedToMyList ? "!bg-[#fff0f0]" : ""}`}
            onClick={() => handleAddToMyList(props?.item)}
          >
            {isAddedToMyList ? (
              <IoMdHeart className={`text-[17px] !text-[#ff5252] ${justAddedHeart ? "heart-active" : ""}`} />
            ) : (
              <FaRegHeart className="text-[14px] !text-gray-600 hover:!text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="info relative flex-1 flex flex-col justify-between p-3 sm:p-4">
        <div>
          {/* Brand */}
          <h6 className="text-[10px] sm:text-[11px] text-gray-400 uppercase font-semibold tracking-wider mb-1">
            <span className="link transition-all truncate block">
              {props?.item?.brand || props?.item?.catName}
            </span>
          </h6>

          {/* Product Name */}
          <h3
            className="text-[13px] sm:text-[14px] font-semibold text-gray-800 line-clamp-2 leading-snug mb-1.5"
            title={props?.item?.name}
          >
            <Link
              to={`/product/${props?.item?._id}`}
              className="link transition-all hover:text-[#ff5252]"
            >
              {props?.item?.name}
            </Link>
          </h3>

          {/* Rating */}
          <Rating
            name="size-small"
            defaultValue={props?.item?.rating || 4}
            size="small"
            readOnly
            className="!text-[14px]"
          />
        </div>

        {/* Price & Cart */}
        <div className="mt-2">
          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="price text-[15px] sm:text-[17px] font-bold text-gray-900">
              &#8377;{props?.item?.price?.toLocaleString("en-IN")}
            </span>
            {props?.item?.oldPrice ? (
              <span className="oldPrice line-through text-gray-400 text-[11px] sm:text-[12px]">
                &#8377;{props?.item?.oldPrice?.toLocaleString("en-IN")}
              </span>
            ) : null}
          </div>

          {/* Add to Cart / Quantity Stepper */}
          <div className="w-full">
            {!isAdded ? (
              <Button
                className="btn-org w-full flex items-center justify-center gap-1.5 !py-2 sm:!py-2.5 !text-[12px] sm:!text-[13px] font-semibold !rounded-lg"
                onClick={() =>
                  addToCart(props?.item, context?.userDetails?._id, quantity)
                }
              >
                <MdOutlineShoppingCart className="text-[17px]" /> Add to Cart
              </Button>
            ) : (
              <div className="qty-stepper flex items-center justify-between overflow-hidden rounded-lg w-full h-[38px] sm:h-[40px]">
                <Button
                  className="!min-w-[40px] !w-[40px] !h-full !rounded-none !bg-gray-50 hover:!bg-gray-100 !transition-colors"
                  onClick={removeQty}
                >
                  <FaMinus className="text-gray-600 text-[10px]" />
                </Button>
                <span className="text-[13px] font-bold text-gray-800 select-none">{quantity}</span>
                <Button
                  className="!min-w-[40px] !w-[40px] !h-full !bg-[#ff5252] hover:!bg-[#e63946] !rounded-none !transition-colors"
                  onClick={addQty}
                >
                  <FaPlus className="text-white text-[10px]" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
