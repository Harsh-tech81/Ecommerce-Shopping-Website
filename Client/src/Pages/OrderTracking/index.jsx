import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import {
  IoSearchOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsBoxSeam, BsCheck2Circle } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

const STEPS = [
  { key: "placed", title: "Order Placed", icon: BsBoxSeam, desc: "We have received your order." },
  { key: "confirmed", title: "Confirmed", icon: IoCheckmarkCircle, desc: "Seller is preparing your items." },
  { key: "shipped", title: "Shipped", icon: LiaShippingFastSolid, desc: "Package handed to courier partner." },
  { key: "delivered", title: "Delivered", icon: BsCheck2Circle, desc: "Package safely delivered to you." },
];

function getActiveStepIndex(status) {
  const s = (status || "").toLowerCase();
  if (s === "delivered") return 3;
  if (s === "shipped" || s === "out for delivery") return 2;
  if (s === "confirmed" || s === "processing") return 1;
  return 0;
}

function getEstimatedDelivery(createdAt) {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderTracking() {
  const [searchParams] = useSearchParams();
  const queryOrderId = searchParams.get("orderId") || "";

  const [orderIdInput, setOrderIdInput] = useState(queryOrderId);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);

  const context = useContext(MyContext);
  const isMobile = context?.windowWidth < 640;

  useEffect(() => {
    if (context?.isLogin) {
      fetchDataFromApi("/api/order/my-order-list").then((res) => {
        if (res?.error === false && Array.isArray(res?.data)) {
          setRecentOrders(res.data.slice(0, 4));
        }
      });
    }
  }, [context?.isLogin]);

  const handleTrackOrder = (idToTrack) => {
    const targetId = (idToTrack || orderIdInput).trim();
    if (!targetId) {
      setErrorMessage("Please enter a valid Order ID.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    fetchDataFromApi(`/api/order/track/${targetId}`)
      .then((res) => {
        setIsLoading(false);
        if (res?.error === false && res?.data) {
          setOrderDetails(res.data);
          setErrorMessage("");
        } else {
          const localMatch = recentOrders.find(
            (o) => o._id === targetId || o.paymentId === targetId
          );
          if (localMatch) {
            setOrderDetails(localMatch);
          } else {
            setOrderDetails(null);
            setErrorMessage(res?.message || "No order found with ID '" + targetId + "'.");
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setOrderDetails(null);
        setErrorMessage(err?.message || "Failed to fetch tracking information.");
      });
  };

  useEffect(() => {
    if (queryOrderId) {
      setOrderIdInput(queryOrderId);
      handleTrackOrder(queryOrderId);
    }
  }, [queryOrderId]);

  const activeStep = getActiveStepIndex(orderDetails?.order_status);
  const progressPercent = ((activeStep) / (STEPS.length - 1)) * 100;

  return (
    <section className="orderTrackingPage bg-gradient-to-b from-[#fafbfc] to-[#f3f4f6] py-6 sm:py-10 min-h-[75vh]">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" className="mb-4">
          <Link to="/" className="text-gray-500 hover:text-[#ff5252] text-[13px] transition">
            Home
          </Link>
          <span className="text-gray-800 text-[13px] font-medium">Order Tracking</span>
        </Breadcrumbs>

        {/* Header Search Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl mx-auto mb-8 text-center animate-fadeInUp">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff5252] to-[#e63946] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200/50 animate-wiggle">
            <LiaShippingFastSolid size={32} />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Track Your Shipment
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
            Enter your Order ID or Payment ID to see real-time delivery milestones.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrackOrder();
            }}
            className="flex flex-col sm:flex-row gap-2.5 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. 64f1a2b3c4...)"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="tracking-search w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#ff5252] focus:bg-white transition-all"
              />
              <IoSearchOutline
                size={18}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-org !py-3.5 !px-8 !text-sm !font-semibold !rounded-xl !capitalize"
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Track"
              )}
            </Button>
          </form>

          {/* Quick Select from Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100 text-left">
              <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
                Recent Orders:
              </span>
              <div className="flex flex-wrap gap-2">
                {recentOrders.map((ord, idx) => (
                  <button
                    key={ord._id}
                    type="button"
                    onClick={() => {
                      setOrderIdInput(ord._id);
                      handleTrackOrder(ord._id);
                    }}
                    className={`text-xs bg-gray-50 hover:bg-red-50 hover:text-[#ff5252] text-gray-600 font-medium px-3 py-2 rounded-lg border border-gray-200 transition-all cursor-pointer hover:border-red-200 hover:shadow-sm stagger-${idx + 1}`}
                  >
                    #{ord._id.slice(-8)} &bull; &#8377;{ord?.totalAmt || 0}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-8 animate-fadeInUp">
            <IoWarningOutline size={22} className="flex-shrink-0 text-red-500" />
            <p className="text-xs sm:text-sm m-0 leading-tight">{errorMessage}</p>
          </div>
        )}

        {/* Tracking Details */}
        {orderDetails && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 animate-fadeInUp">
            {/* Status Bar */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between flex-wrap gap-3 hover:scale-[1.01] transition-transform duration-300">
              <div>
                <span className="text-[10px] sm:text-xs text-gray-400 block uppercase tracking-wider">Order ID</span>
                <span className="text-sm sm:text-base font-bold text-gray-900 break-all font-mono">
                  #{orderDetails._id?.slice(-12) || orderDetails._id}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {orderDetails.createdAt && (
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Est. Delivery</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {getEstimatedDelivery(orderDetails.createdAt)}
                    </span>
                  </div>
                )}
                <span className={`px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                  activeStep === 3 ? "badge-delivered" :
                  activeStep === 2 ? "badge-shipped" :
                  activeStep === 1 ? "badge-processing" :
                  "badge-pending"
                }`}>
                  {orderDetails.order_status || "Pending"}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="p-6 sm:p-10 border-b border-gray-100">
              {isMobile ? (
                /* MOBILE: Vertical Stepper */
                <div className="flex flex-col gap-0 relative pl-6">
                  {/* Vertical progress line */}
                  <div className="absolute left-[18px] top-[24px] bottom-[24px] w-[3px] bg-gray-200 rounded-full">
                    <div
                      className="w-full bg-gradient-to-b from-[#ff5252] to-[#e63946] rounded-full transition-all duration-700 ease-out shimmer-bar"
                      style={{ height: `${progressPercent}%` }}
                    />
                  </div>

                  {STEPS.map((step, idx) => {
                    const isCompleted = idx <= activeStep;
                    const isCurrent = idx === activeStep;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="flex items-start gap-4 relative py-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500 animate-scaleIn stagger-${idx + 1} ${
                            isCompleted
                              ? "bg-gradient-to-br from-[#ff5252] to-[#e63946] text-white shadow-[0_0_15px_rgba(255,82,82,0.6)]"
                              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                          } ${isCurrent ? "animate-pulseGlow" : ""}`}
                        >
                          <StepIcon size={18} />
                        </div>
                        <div className="pt-1.5">
                          <h4 className={`text-sm font-bold mb-0.5 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 m-0 leading-tight">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* DESKTOP: Horizontal Stepper */
                <div className="relative">
                  {/* Horizontal progress bar */}
                  <div className="absolute top-[24px] left-[48px] right-[48px] h-[3px] bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff5252] to-[#e63946] rounded-full transition-all duration-700 ease-out shimmer-bar"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4 relative z-10">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx <= activeStep;
                      const isCurrent = idx === activeStep;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 animate-scaleIn stagger-${idx + 1} ${
                              isCompleted
                                ? "bg-gradient-to-br from-[#ff5252] to-[#e63946] text-white shadow-[0_0_15px_rgba(255,82,82,0.6)]"
                                : "bg-white text-gray-400 border-2 border-gray-200"
                            } ${isCurrent ? "animate-pulseGlow ring-4 ring-red-100" : ""}`}
                          >
                            <StepIcon size={22} />
                          </div>
                          <h4
                            className={`text-xs sm:text-sm font-bold mt-3 mb-1 ${
                              isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 max-w-[130px] m-0">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Details */}
            <div className="p-5 sm:p-8">
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                Delivery Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold text-xs sm:text-sm mb-2">
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 animate-float">
                      <FaRegUser className="text-[#ff5252] text-[11px]" />
                    </div>
                    Customer Info
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 m-0 leading-relaxed">
                    <strong>Name:</strong> {orderDetails?.userId?.name || "Customer"}<br />
                    <strong>Email:</strong> {orderDetails?.userId?.email || "N/A"}<br />
                    <strong>Phone:</strong> {orderDetails?.userId?.mobile || "N/A"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold text-xs sm:text-sm mb-2">
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 animate-float">
                      <CiLocationOn className="text-[#ff5252] text-[13px]" />
                    </div>
                    Shipping Address
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 m-0 leading-relaxed">
                    {typeof orderDetails?.delivery_address === "object" ? (
                      <>
                        {orderDetails.delivery_address?.address_line},{" "}
                        {orderDetails.delivery_address?.city},{" "}
                        {orderDetails.delivery_address?.state} -{" "}
                        {orderDetails.delivery_address?.pincode}
                      </>
                    ) : (
                      orderDetails?.delivery_address || "Standard Address"
                    )}
                  </p>
                </div>
              </div>

              {/* Items */}
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                Items ({orderDetails?.products?.length || 0})
              </h3>

              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden mb-6">
                {orderDetails?.products?.map((item, i) => (
                  <div key={i} className={`p-3 sm:p-4 flex items-center gap-3 hover:bg-gray-50/50 transition-colors animate-slideIn stagger-${Math.min(i + 1, 4)}`}>
                    <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src={item?.image || "/product-placeholder.png"}
                        alt={item?.productTitle || item?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate mb-0.5">
                        {item?.productTitle || item?.name}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500">
                        <span>Qty: {item?.quantity}</span>
                        {item?.size && <span>Size: {item?.size}</span>}
                        {item?.ram && <span>RAM: {item?.ram}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        &#8377;{((item?.price || 0) * (item?.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl flex items-center justify-between border border-gray-100">
                <div>
                  <span className="text-[10px] sm:text-xs text-gray-400 block uppercase tracking-wider">Payment</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    {orderDetails?.payment_status === "CASH ON DELIVERY"
                      ? "Cash On Delivery"
                      : "Online Payment"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] sm:text-xs text-gray-400 block uppercase tracking-wider">Total</span>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#ff5252] to-[#e63946] bg-clip-text text-transparent animate-scaleIn inline-block">
                    &#8377;{Number(orderDetails?.totalAmt || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrderTracking;
