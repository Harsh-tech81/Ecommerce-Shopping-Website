import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { BsFillBagCheckFill } from "react-icons/bs";
import CartItems from "./cartItems";
import { MyContext } from "../../App";
import { useContext } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { LiaShippingFastSolid } from "react-icons/lia";
import { IoSparkles } from "react-icons/io5";

function CartPage() {
  const context = useContext(MyContext);
  
  const cartTotal = context?.cartData?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ) || 0;
  
  const totalSavings = context?.cartData?.reduce(
    (total, item) => {
      if (item.oldPrice && item.oldPrice > item.price) {
        return total + (item.oldPrice - item.price) * item.quantity;
      }
      return total;
    },
    0
  ) || 0;

  const freeShippingThreshold = 500;
  const shippingProgress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);

  return (
    <section className="section py-8">
      <div className="container mx-auto px-4" style={{ width: context?.isLarge ? "80%" : "95%", maxWidth: context?.isLarge ? "80%" : "95%" }}>
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs aria-label="breadcrumb" className="text-sm">
            <Link color="inherit" to="/" className="hover:text-[#ff5252] transition-colors">
              Home
            </Link>
            <span className="text-gray-900 font-medium">Cart</span>
          </Breadcrumbs>
        </div>

        <div className={`flex gap-6 animate-fadeInUp ${context?.isLarge ? "flex-row" : "flex-col"}`}>
          <div className="leftPart" style={{ width: context?.isLarge ? "70%" : "100%" }}>
            <div className="shadow-sm rounded-2xl bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white border-b border-[rgba(0,0,0,0.05)] px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#ff5252]">
                    <BsFillBagCheckFill className="text-lg" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 m-0">Your Cart</h2>
                </div>
                <p className="m-0 text-gray-500 text-sm">
                  <span className="font-bold text-[#ff5252] text-lg">
                    {context?.cartData?.length || 0}
                  </span>{" "}
                  items
                </p>
              </div>

              <div className="p-2 sm:p-4">
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
                  <div className="flex items-center justify-center flex-col gap-6 py-16">
                    <img
                      src="/empty-cart.png"
                      alt="Empty Cart"
                      className="w-[180px] animate-float opacity-80"
                    />
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        Your Cart is currently empty
                      </h4>
                      <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                      <div className="animate-pulseGlow inline-block rounded-full">
                        <Link to="/">
                          <Button className="btn-org btn-lg rounded-full px-8 flex items-center gap-2">
                            <IoSparkles /> Continue Shopping
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rightPart" style={{ width: context?.isLarge ? "30%" : "100%" }}>
            <div className="shadow-sm rounded-2xl bg-white sticky top-[155px] z-[90] overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-[#ff5252] to-[#e63946]"></div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h3>
                
                {/* Free Shipping Progress */}
                <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                    <LiaShippingFastSolid className="text-[#ff5252] text-lg" />
                    {cartTotal < freeShippingThreshold ? (
                      <span className="text-gray-700">Add <strong className="text-[#ff5252]">₹{(freeShippingThreshold - cartTotal).toFixed(2)}</strong> more for free shipping</span>
                    ) : (
                      <span className="text-green-600">You qualify for free shipping! 🎉</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#ff5252] h-2 rounded-full transition-all duration-1000 ease-in-out relative"
                      style={{ width: `${shippingProgress}%` }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="font-bold text-gray-800">
                      &#8377;{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span className="text-sm font-medium">Discount</span>
                      <span className="font-bold">
                        -&#8377;{totalSavings.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-600 pb-4 border-b border-gray-100">
                    <span className="text-sm font-medium">Shipping</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-bold text-gray-800">Total</span>
                    <span className="text-xl text-[#ff5252] font-bold">
                      &#8377;{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex justify-end">
                      <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md font-medium border border-green-100">
                        Total savings: ₹{totalSavings.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <Link to="/checkout" className="w-full block">
                  <Button className="btn-org btn-lg w-full flex justify-center gap-2 rounded-xl py-3 btn-shimmer">
                    <BsFillBagCheckFill className="text-[20px]" /> Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartPage;
