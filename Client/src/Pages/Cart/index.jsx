import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { BsFillBagCheckFill } from "react-icons/bs";
import CartItems from "./cartItems";
import { MyContext } from "../../App";
import { useContext } from "react";
function CartPage() {
  const context = useContext(MyContext);
  return (
    <section
      className="section"
      style={{ paddingTop: "10px", paddingBottom: "50px" }}
    >
      <div className="container flex gap-5" style={{ width: context?.isLarge ? "80%" : "95%", maxWidth: context?.isLarge ? "80%" : "95%", flexDirection: context?.isLarge ? "row" : "column" }}>
        <div className="leftPart" style={{ width: context?.isLarge ? "70%" : "100%" }}>
          <div className="shadow-md rounded-md bg-white">
            <div
              className="border-b border-[rgba(0,0,0,0.1)]"
              style={{ padding: "10px 30px" }}
            >
              <h2>Your Cart</h2>
              <p style={{ marginTop: "0px" }}>
                There are{" "}
                <span className="font-bold text-[#ff5252]">
                  {context?.cartData?.length}
                </span>{" "}
                products in your cart
              </p>
            </div>

            {context?.cartData?.length !== 0 ? (
              context?.cartData?.map((item, index) => {
                return (
                  <CartItems
                    key={index}
                    size="S"
                    qty={item?.quantity}
                    data={item}
                    productSizeData={item?.size}
                    productRamData={item?.ram}
                    productWeightData={item?.weight}
                  />
                );
              })
            ) : (
              <div
                className="flex items-center justify-center flex-col gap-5"
                style={{ padding: "40px 0px" }}
              >
                <img
                  src="/empty-cart.png"
                  alt="Empty Cart"
                  className="w-[150px]"
                />
                <h4 className="text-lg font-semibold">
                  Your Cart is currently empty.
                </h4>
                <Link to="/">
                  {" "}
                  <Button className="btn-org btn-sm">Continue Shopping</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="rightPart" style={{ width: context?.isLarge ? "30%" : "100%" }}>
          <div
            className="shadow-md rounded-md bg-white sticky top-[155px] z-[90]"
            style={{ padding: "33px" }}
          >
            <h3 style={{ paddingBottom: "20px" }} className="text-[17px]">
              Cart Totals
            </h3>
            <hr />
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Subtotal</span>
              <span className="text-[#ff5252] font-bold">
                {" "}
                &#8377;
                {context?.cartData
                  ?.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  )
                  .toFixed(2)}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Shipping</span>
              <span className=" font-bold"> Free</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Estimated for</span>
              <span className="font-bold">United Kingdom</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Total</span>
              <span className="text-[#ff5252] font-bold">
                {" "}
                &#8377;
                {context?.cartData
                  ?.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  )
                  .toFixed(2)}
              </span>
            </p>
            <br />

            <Link to="/checkout" className="w-[100%] d-block">
              <Button className="btn-org btn-lg w-full flex gap-2">
                <BsFillBagCheckFill className="text-[20px] " /> Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartPage;
