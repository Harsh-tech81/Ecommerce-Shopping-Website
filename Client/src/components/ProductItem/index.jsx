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
        context.getMyListData();
      } else {
        context?.openAlertbox("error", res?.message);
      }
    });
  };

  return (
    <div className="productItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)] h-[430px]">
      <div className="group imgWrapper overflow-hidden w-[100%] rounded-md relative h-[250px]">
        <Link to={`/product/${props?.item?._id}`}>
          <div className="img h-[350px] overflow-hidden">
            <img
              src={props?.item?.images[0]}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="img h-[350px] overflow-hidden">
            <img
              src={props?.item?.images[1]}
              className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-105"
            />
          </div>
        </Link>

        {isShowTabs && (
          <div
            className="flex items-center justify-center absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-[60] gap-2"
            style={{ padding: "12px" }}
          >
            <Button
              className="!absolute top-[10px] right-[10px] !min-w-[30px] !min-h-[30px] !h-[30px] !w-[30px] !rounded-full !bg-[rgba(255,255,255,1)] text-black"
              onClick={() => setIsShowTabs(false)}
            >
              <MdClose className="text-black z-[90] text-[25px]" />
            </Button>

            {props?.item?.size?.length !== 0 &&
              props?.item?.size?.map((size, index) => {
                return (
                  <span
                    key={index}
                    className={`flex items-center justify-center bg-[rgba(255,255,255,0.8)] max-w-[35px] h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeTab === index && "!bg-[#ff5252] !text-white"}`}
                    style={{ padding: "0px 8px" }}
                    onClick={() => handleClickActiveTab(index, size)}
                  >
                    {size}
                  </span>
                );
              })}
            {props?.item?.productRam?.length !== 0 &&
              props?.item?.productRam?.map((ram, index) => {
                return (
                  <span
                    key={index}
                    className={`flex items-center justify-center bg-[rgba(255,255,255,0.8)] max-w-[45px] h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeTab === index && "!bg-[#ff5252] !text-white"}`}
                    style={{ padding: "0px 8px" }}
                    onClick={() => handleClickActiveTab(index, ram)}
                  >
                    {ram}
                  </span>
                );
              })}
            {props?.item?.productWeight?.length !== 0 &&
              props?.item?.productWeight?.map((weight, index) => {
                return (
                  <span
                    key={index}
                    className={`flex items-center justify-center bg-[rgba(255,255,255,0.8)] max-w-[35px] h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeTab === index && "!bg-[#ff5252] !text-white"}`}
                    style={{ padding: "0px 8px" }}
                    onClick={() => handleClickActiveTab(index, weight)}
                  >
                    {weight}
                  </span>
                );
              })}
          </div>
        )}

        <span
          className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-[#ff5252] text-white rounded-lg text-[12px] font-[500]"
          style={{ padding: "1px 5px" }}
        >
          {props?.item?.discount}%
        </span>

        <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] group-hover:top-[15px] opacity-0 group-hover:opacity-100 transition-all">
          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-[#ff5252] hover:!text-white transition-all group"
            onClick={() =>
              context.handleOpenProductDetailModel(true, props?.item)
            }
          >
            <MdZoomOutMap className="text-[20px]" />
          </Button>

          <Button
            className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-[#ff5252] hover:!text-white transition-all group `}
            onClick={() => handleAddToMyList(props?.item)}
          >
            {isAddedToMyList ? (
              <IoMdHeart className="text-[18px] !text-[#ff5252] group-hover:text-white !hover:text-white" />
            ) : (
              <FaRegHeart className="text-[18px] !text-black group-hover:text-white !hover:text-white" />
            )}
          </Button>
        </div>
      </div>

      <div
        className="info relative !h-[290px]"
        style={{ padding: "14px", paddingTop: "20px", paddingBottom: "30px" }}
      >
        <h6 className="text-[13px] !font-[400]">
          <span className="link transition-all">{props?.item?.brand}</span>
        </h6>
        <h3
          className="text-[13px] title font-[500] text-[#000] line-clamp-2"
          style={{ marginTop: "6px", marginBottom: "5px" }}
        >
          <Link
            to={`/product/${props?.item?._id}`}
            className="link transition-all"
          >
            {props?.item?.name?.substr(0, 30) + "..."}
          </Link>
        </h3>
        <Rating
          name="size-small"
          defaultValue={props?.item?.rating}
          size="small"
          readOnly
        />

        <div className="flex items-center gap-3">
          <span className="oldPrice line-through text-gray-500 text-[15px] font-[500]">
           {props?.item?.oldPrice?.toLocaleString("en-IN", {
             style: "currency",
             currency: "INR",
             maximumFractionDigits: 0,
           })}
          </span>
          <span className="price text-[15px] font-[600] text-[#ff5252]">
       
           {props?.item?.price?.toLocaleString("en-IN", {
             style: "currency",
             currency: "INR",
             maximumFractionDigits: 0,
           })}
          </span>
        </div>

        <div className="flex justify-start">
          {!isAdded ? (
            <Button
              className="btn-org flex gap-2 mt-12 "
              onClick={() =>
                addToCart(props?.item, context?.userDetails?._id, quantity)
              }
            >
              <MdOutlineShoppingCart className="text-[22px] " /> Add to
              Cart{" "}
            </Button>
          ) : (
            <div className="flex items-center justify-between overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] w-full">
              <Button
                className="!min-w-[35px] !w-[35px] !h-[30px]  !rounded-none !bg-[#f1f1f1]"
                onClick={removeQty}
              >
                <FaMinus className="text-black" />
              </Button>
              <span>{quantity}</span>
              <Button
                className="!min-w-[35px] !w-[35px] !h-[30px] !bg-[#ff5252] !rounded-none "
                onClick={addQty}
              >
                <FaPlus className="text-white" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
