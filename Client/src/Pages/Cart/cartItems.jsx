import { useState } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import { GoTriangleDown } from "react-icons/go";
import { deleteData } from "../../utils/api";
import { MyContext } from "../../App";
import { useContext } from "react";

function CartItems({
  size,
  qty,
  data,
  productSizeData,
  productRamData,
  productWeightData,
}) {
  const [selectedSize, setSelectedSize] = useState(size);
  const [sizeanchorEl, setSizeAnchorEl] = useState(null);
  const openSize = Boolean(sizeanchorEl);
  const context = useContext(MyContext);
  const [selectedQty, setSelectedQty] = useState(qty);
  const [qtyAnchorEl, setQtyAnchorEl] = useState(null);
  const openQty = Boolean(qtyAnchorEl);

  const handleClickSize = (event) => {
    setSizeAnchorEl(event.currentTarget);
  };

  const handleCloseSize = (value) => {
    setSizeAnchorEl(null);
    if (value) setSelectedSize(value);
  };

  const handleClickQty = (event) => {
    setQtyAnchorEl(event.currentTarget);
  };

  const handleCloseQty = (value) => {
    setQtyAnchorEl(null);
    if (value) setSelectedQty(value);
  };
  const removeItem = (productId) => {
    deleteData(`/api/cart/deleteCart/${productId}`).then((res) => {
      if (res?.error === false) {
        context.openAlertbox("success", res?.message);
        context.getCartData();
      } else {
        context.openAlertbox("error", res?.message);
      }
    });
  };
  return (
    <div
      className="cartItem w-full flex items-center gap-5 border-b border-gray-100 p-4 sm:p-5 hover:bg-gray-50/50 transition-colors animate-fadeInUp rounded-xl mb-2"
    >
      <div className="img relative overflow-hidden rounded-xl border border-gray-100 flex-shrink-0 bg-white" style={{ width: context?.isLarge ? "15%" : "25%" }}>
        <Link to={`/product/${data?.productId}`} className="group block w-full h-full">
          <img
            src={data?.image}
            alt={data?.productTitle}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-0 right-0 bg-[#ff5252] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg z-10 shadow-sm">
          x{data?.quantity || qty}
        </div>
      </div>

      <div className="info relative flex-grow" style={{ width: context?.isLarge ? "85%" : "75%" }}>
        <button 
          className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-all z-10"
          onClick={() => removeItem(data?._id)}
          title="Remove item"
        >
          <IoCloseSharp className="text-[18px]" />
        </button>
        
        <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">{data?.brand}</span>
        
        <h3 className="text-[14px] sm:text-[15px] font-medium text-gray-800 leading-snug pr-10 mb-2">
          <Link
            to={`/product/${data?.productId}`}
            className="hover:text-[#ff5252] transition-colors"
          >
            {data?.productTitle}
          </Link>
        </h3>

        <div className="mb-3">
          <Rating
            name="size-small"
            defaultValue={data?.rating || 0}
            size="small"
            readOnly
          />
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-1">
          {/* Attributes placeholders could go here */}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
          <span className="price text-[16px] sm:text-[18px] font-bold text-gray-900">
            &#8377;{data?.price?.toFixed(2)}
          </span>
          {data?.oldPrice > data?.price && (
            <>
              <span className="oldPrice line-through text-gray-400 text-[13px] font-medium">
                &#8377;{data?.oldPrice?.toFixed(2)}
              </span>
              <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full px-2 py-0.5 text-[10px] font-bold border border-emerald-100">
                {data?.discount?.toFixed(0)}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartItems;
