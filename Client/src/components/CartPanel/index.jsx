import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import Button from "@mui/material/Button";
import { BsFillBagCheckFill } from "react-icons/bs";
import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import { deleteData } from "../../utils/api";
function CartPanel({ data }) {
  const context = useContext(MyContext);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const removeFromCart = (productId) => {
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
    <>
      <div
        className="scroll w-full max-h-[450px] overflow-y-scroll overflow-x-hidden"
        style={{
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        {data?.length > 0 &&
          data?.map((item, index) => (
            <div
              className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)]"
              key={index}
            >
              <div
                className="img w-[25%] overflow-hidden h-[90px] rounded-md"
                style={{ paddingBottom: "5px" }}
              >
                <Link
                  to={`/product/${item?.productId}`}
                  className="block group"
                >
                  <img
                    src={item?.image}
                    className="w-full group-hover:scale-105 "
                  />
                </Link>
              </div>
              <div
                className="info w-[75%] relative"
                style={{ paddingRight: "8px", paddingTop: "10px" }}
              >
                <h4
                  className="text-[14px] font-[500]"
                  style={{ marginTop: "10px" }}
                >
                  <Link
                    to={`/product/${item?.productId}`}
                    className="link transition-all"
                  >
                    {item?.productTitle?.substr(0, 40) + "..."}
                  </Link>
                </h4>

                <p
                  className="flex items-center gap-5"
                  style={{ marginTop: "8px", marginBottom: "10px" }}
                >
                  <span>
                    Qty : <span>{item?.quantity}</span>
                  </span>
                  <span className="text-[#ff5252] font-bold">
                    Price :{" "}
                    {item?.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </p>
                <MdDeleteOutline
                  className="absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all"
                  onClick={() => removeFromCart(item?._id)}
                />
              </div>
            </div>
          ))}
      </div>

      <br />

      <div
        className="bottomSec absolute bottom-[10px] left-[10px] w-full overflow-hidden"
        style={{ paddingRight: "10px" }}
      >
        <div
          className="bottominfo w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col"
          style={{
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "18px",
            paddingRight: "18px",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">
              {context?.cartData?.length || 0} item
            </span>
            <span className="text-[#ff5252] font-bold">
              {context?.cartData
                ?.reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
            </span>
          </div>
        </div>

        <div
          className="bottominfo w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col"
          style={{
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "18px",
            paddingRight: "18px",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">Total (tax excl.)</span>
            <span className="text-[#ff5252] font-bold">
              {context?.cartData
                ?.reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
            </span>
          </div>
          <br />
          <div className="flex items-center justify-between w-full gap-5">
            <Link to="/cart" className="w-[50%] d-block">
              <Button className="btn-org btn-lg w-full">View Cart</Button>
            </Link>
            <Link to="/checkout" className="w-[50%] d-block">
              <Button className="btn-org btn-border  btn-lg w-full flex gap-2">
                <BsFillBagCheckFill className="text-[20px]  " />
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPanel;
