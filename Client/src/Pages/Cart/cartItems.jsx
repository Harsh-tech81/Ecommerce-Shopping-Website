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
      className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)]"
      style={{ padding: "10px", paddingBottom: "10px" }}
    >
      <div className="img overflow-hidden rounded-lg" style={{ width: context?.isLarge ? "15%" : "25%" }}>
        <Link to={`/product/${data?.productId}`} className="group">
          <img
            src={data?.image}
            className="w-full group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      <div className="info relative" style={{ width: context?.isLarge ? "85%" : "75%" }}>
        <IoCloseSharp
          className="cursor-pointer absolute top-[0px] right-[0px] text-[22px] link transition-all"
          onClick={() => removeItem(data?._id)}
        />
        <span className="text-[11px]">{data?.brand}</span>
        <h3 className="text-[16px]">
          <Link
            to={`/product/${data?.productId}`}
            className="link cursor-pointer"
          >
            {data?.productTitle?.substr(0, 60) + "..."}
          </Link>
        </h3>

        <Rating
          name="size-small"
          defaultValue={data?.rating || 0}
          size="small"
          readOnly
        />

        <div className="flex items-center gap-4" style={{ marginTop: "8px" }}>
          {/* {data?.size !== "" && (
            <>
              {productSizeData?.length !== 0 && (
                <div className="relative ">
                  <span
                    className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] rounded-md cursor-pointer"
                    style={{ padding: "4px 8px" }}
                    onClick={handleClickSize}
                  >
                    Size: {selectedSize} <GoTriangleDown />
                  </span>
                  <Menu
                    id="size-menu"
                    anchorEl={sizeanchorEl}
                    open={openSize}
                    onClose={() => handleCloseSize(null)}
                    slotProps={{
                      list: {
                        "aria-labelledby": "basic-button",
                      },
                    }}
                  >
                    {productSizeData?.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          className={`${item?.name === selectedSize && "selected"}`}
                          onClick={() => {
                            handleCloseSize(item?.name);
                          }}
                        >
                          {item?.name}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </div>
              )}
            </>
          )}

          {data?.ram !== "" && (
            <>
              {productRamData?.length !== 0 && (
                <div className="relative ">
                  <span
                    className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] rounded-md cursor-pointer"
                    style={{ padding: "4px 8px" }}
                    onClick={handleClickRam}
                  >
                    RAM: {selectedRam} <GoTriangleDown />
                  </span>
                  <Menu
                    id="ram-menu"
                    anchorEl={ramanchorEl}
                    open={openRam}
                    onClose={() => handleCloseRam(null)}
                    slotProps={{
                      list: {
                        "aria-labelledby": "basic-button",
                      },
                    }}
                  >
                    {productRamData?.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          className={`${item?.name === selectedRam && "selected"}`}
                          onClick={() => {
                            handleCloseRam(item?.name);
                          }}
                        >
                          {item?.name}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </div>
              )}
            </>
          )}

          {data?.weight !== "" && (
            <>
              {productWeightData?.length !== 0 && (
                <div className="relative ">
                  <span
                    className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] rounded-md cursor-pointer"
                    style={{ padding: "4px 8px" }}
                    onClick={handleClickWeight}
                  >
                    Weight: {selectedWeight} <GoTriangleDown />
                  </span>
                  <Menu
                    id="weight-menu"
                    anchorEl={weightanchorEl}
                    open={openWeight}
                    onClose={() => handleCloseWeight(null)}
                    slotProps={{
                      list: {
                        "aria-labelledby": "basic-button",
                      },
                    }}
                  >
                    {productWeightData?.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          className={`${item?.name === selectedWeight && "selected"}`}
                          onClick={() => {
                            handleCloseWeight(item?.name);
                          }}
                        >
                          {item?.name}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </div>
              )}
            </>
          )} */}

          {/* <div className="relative ">
            <span
              className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] rounded-md cursor-pointer"
              style={{ padding: "4px 8px" }}
              onClick={handleClickQty}
            >
              Qty: {selectedQty}
              <GoTriangleDown />
            </span>
            <Menu
              id="size-menu"
              anchorEl={qtyAnchorEl}
              open={openQty}
              onClose={() => handleCloseQty(null)}
              slotProps={{
                list: {
                  "aria-labelledby": "basic-button",
                },
              }}
            >
              <MenuItem onClick={() => handleCloseQty(1)}>1</MenuItem>
              <MenuItem onClick={() => handleCloseQty(2)}>2</MenuItem>
              <MenuItem onClick={() => handleCloseQty(3)}>3</MenuItem>
              <MenuItem onClick={() => handleCloseQty(4)}>4</MenuItem>
              <MenuItem onClick={() => handleCloseQty(5)}>5</MenuItem>
              <MenuItem onClick={() => handleCloseQty(6)}>6</MenuItem>
              <MenuItem onClick={() => handleCloseQty(7)}>7</MenuItem>
              <MenuItem onClick={() => handleCloseQty(8)}>8</MenuItem>
              <MenuItem onClick={() => handleCloseQty(9)}>9</MenuItem>
              <MenuItem onClick={() => handleCloseQty(10)}>10</MenuItem>
            </Menu>
          </div> */}
        </div>

        <div className="flex items-center gap-3" style={{ marginTop: "10px" }}>
          <span className="price text-[14px] font-[600] text-[#000]">
            &#8377;{data?.price.toFixed(2)}
          </span>
          <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
            &#8377;{data?.oldPrice.toFixed(2)}
          </span>
          <span className="price text-[14px] font-[600] text-[#ff5252]">
            {data?.discount.toFixed(0)}% OFF
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
