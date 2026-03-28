import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import QtyBox from "../QtyBox";
import Rating from "@mui/material/Rating";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MyContext } from "../../App";
import { CircularProgress } from "@mui/material";
import { postData } from "../../utils/api";

function ProductDetailsComponent(props) {
  const [productActionIndex, setProductActionIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTabName, setSelectedTabName] = useState(null);
  const [tabError, setTabError] = useState(false);

  const handleSelectQty = (value) => {
    setQuantity(value);
  };

  const handleClickActiveTab = (index, name) => {
    setProductActionIndex(index);
    setSelectedTabName(name);
    setTabError(false);
  };

  const addToCart = (product, userId, quantity) => {
    if (userId === undefined) {
      context?.openAlertbox("error", "Please login to add item in cart");
      return false;
    }
    const productItem = {
      productTitle: product?.name,
      _id: product?._id,
      userId,
      price: product?.price,
      oldPrice: product?.oldPrice,
      countInStock: product?.countInStock,
      subTotal: parseInt(product?.price * quantity),
      quantity: quantity,
      rating: product?.rating,
      image: product?.images[0],
      productId: product?._id,
      brand: product?.brand,
      discount: product?.discount,
      size: props?.item?.size?.length !== 0 ? selectedTabName : "",
      ram: props?.item?.productRam?.length !== 0 ? selectedTabName : "",
      weight: props?.item?.productWeight?.length !== 0 ? selectedTabName : "",
    };

    const hasVariants =
      (props?.item?.size?.length || 0) > 0 ||
      (props?.item?.productRam?.length || 0) > 0 ||
      (props?.item?.productWeight?.length || 0) > 0;

    if (!hasVariants || selectedTabName !== null) {
      setIsLoading(true);
      postData("/api/cart/add", productItem).then((res) => {
        if (res?.error === false) {
          context.openAlertbox("success", res?.message);
          context.getCartData();
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        } else {
          context.openAlertbox("error", res?.message);
          setIsLoading(false);
        }
      });
    } else {
      setTabError(true);
    }
  };
  return (
    <>
      <h1 className="text-[24px] font-[600]" style={{ marginBottom: "10px" }}>
        {props?.item?.name}
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-gray text-[13px]">
          Brands :{" "}
          <span className="font-[500] text-black opacity-75">
            {props?.item?.brand}
          </span>
        </span>

        <Rating
          name="size-small"
          readOnly
          size="small"
          defaultValue={props?.item?.rating || 0}
        />
        <span
          className="text-[13px] cursor-pointer "
          onClick={props?.goToReviews}
        >
          Review ({props?.reviewCount || 0})
        </span>
      </div>

      <div className="flex items-center gap-3" style={{ marginTop: "15px" }}>
        <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
          {props?.item?.oldPrice?.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          })}
        </span>
        <span className="price text-[20px] font-[600] text-[#ff5252]">
         {props?.item?.price?.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          })}
        </span>
        <span className="text-[14px]">
          Available In Stock :{" "}
          <span className="text-green-600 text-[14px] font-bold">
            {props?.item?.countInStock || 0} Items
          </span>
        </span>
      </div>

      <p
        style={{
          marginTop: "18px",
          paddingRight: "20px",
          marginBottom: "20px",
        }}
      >
        {props?.item?.description}
      </p>
      {props?.item?.productRam?.length !== 0 && (
        <div
          className="flex items-center gap-3"
          style={{ marginBottom: "10px" }}
        >
          <span className="text-[16px]">RAM : </span>
          <div className="flex items-center gap-1 actions">
            {props?.item?.productRam?.map((ram, index) => {
              return (
                <Button
                  key={index}
                  className={`${
                    productActionIndex === index
                      ? "!bg-[#ff5252] !text-white"
                      : ""
                  }${tabError && "error"}`}
                  onClick={() => handleClickActiveTab(index, ram)}
                >
                  {ram}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      {props?.item?.size?.length !== 0 && (
        <div
          className="flex items-center gap-3"
          style={{ marginBottom: "10px" }}
        >
          <span className="text-[16px]">SIZE : </span>
          <div className="flex items-center gap-1 actions">
            {props?.item?.size?.map((size, index) => {
              return (
                <Button
                  key={index}
                  className={`${
                    productActionIndex === index
                      ? "!bg-[#ff5252] !text-white"
                      : ""
                  } ${tabError && "error"}`}
                  onClick={() => handleClickActiveTab(index, size)}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      {props?.item?.productWeight?.length !== 0 && (
        <div
          className="flex items-center gap-3"
          style={{ marginBottom: "10px" }}
        >
          <span className="text-[16px]">WEIGHT : </span>
          <div className="flex items-center gap-1 actions">
            {props?.item?.productWeight?.map((weight, index) => {
              return (
                <Button
                  key={index}
                  className={`${
                    productActionIndex === index
                      ? "!bg-[#ff5252] !text-white"
                      : ""
                  }${tabError && "error"}`}
                  onClick={() => handleClickActiveTab(index, weight)}
                >
                  {weight}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      <p
        className="text-[14px] text-[#000]"
        style={{ marginTop: "18px", marginBottom: "0px" }}
      >
        Free Shipping (Est. Delivery Time 2-3 Days)
      </p>
      <div className="flex items-center gap-4" style={{ marginTop: "20px" }}>
        <div className="qtyBoxWrapper w-[70px]">
          <QtyBox handleSelectQty={handleSelectQty} />
        </div>
        <Button
          className="btn-org flex gap-2 !min-w-[150px]"
          onClick={() =>
            addToCart(props?.item, context?.userDetails?._id, quantity)
          }
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <MdOutlineShoppingCart className="text-[22px]" /> Add to Cart
            </>
          )}
        </Button>
      </div>


    </>
  );
}

export default ProductDetailsComponent;
