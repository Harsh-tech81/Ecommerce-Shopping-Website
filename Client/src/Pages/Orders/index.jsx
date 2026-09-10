import Button from "@mui/material/Button";
import AccountSidebar from "../../components/AccountSidebar";
import { MdKeyboardArrowDown } from "react-icons/md";
import Badge from "../../components/Badge";
import { useEffect, useState, useContext } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { LiaShippingFastSolid } from "react-icons/lia";

function getStatusBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "delivered") return "badge-delivered";
  if (s === "shipped" || s === "out for delivery") return "badge-shipped";
  if (s === "confirmed" || s === "processing") return "badge-processing";
  return "badge-pending";
}

function Orders() {
  const [isOpenOrderIndex, setIsOpenOrderIndex] = useState(null);
  const [orders, setOrders] = useState([]);
  const context = useContext(MyContext);

  const isShowOrderedProduct = (index) => {
    if (isOpenOrderIndex === index) {
      setIsOpenOrderIndex(null);
    } else {
      setIsOpenOrderIndex(index);
    }
  };

  useEffect(() => {
    fetchDataFromApi("/api/order/my-order-list").then((res) => {
      if (res?.error === false) {
        setOrders(res?.data || []);
      }
    });
  }, []);

  const isDesktop = context?.windowWidth > 992;

  return (
    <section
      className="w-full"
      style={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      <div className="container flex gap-5" style={{ flexDirection: context?.isLarge ? "row" : "column" }}>
        {context?.windowWidth > 992 && (
          <div className="col1" style={{ width: context?.isLarge ? "20%" : "100%" }}>
            <AccountSidebar />
          </div>
        )}
        <div className="col2" style={{ width: context?.isLarge ? "80%" : "100%" }}>
          <div className="shadow-md rounded-xl bg-white overflow-hidden">
            {/* Header */}
            <div
              className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white"
              style={{ padding: "15px 20px" }}
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Orders</h2>
              <p className="text-sm text-gray-500" style={{ marginTop: "2px", marginBottom: "0px" }}>
                You have{" "}
                <span className="font-bold text-[#ff5252]">
                  {orders.length}
                </span>{" "}
                {orders.length === 1 ? "order" : "orders"}
              </p>
            </div>

            {orders?.length === 0 ? (
              <div className="flex items-center justify-center flex-col gap-4 py-16">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <LiaShippingFastSolid className="text-3xl text-gray-400" />
                </div>
                <h4 className="text-base font-semibold text-gray-600">No orders yet</h4>
                <p className="text-sm text-gray-400 m-0">Start shopping to see your orders here.</p>
                <Link to="/">
                  <Button className="btn-org btn-sm">Shop Now</Button>
                </Link>
              </div>
            ) : isDesktop ? (
              /* ====== DESKTOP TABLE VIEW ====== */
              <div className="relative overflow-x-auto" style={{ marginTop: "0px" }}>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-[11px] text-gray-500 uppercase bg-gray-50 tracking-wider">
                    <tr>
                      <th scope="col" className="px-4 py-3 w-[50px]">&nbsp;</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Order #</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Date</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Items</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Total</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Payment</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Status</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order, index) => (
                      <>
                        <tr
                          className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                          key={`order-${index}`}
                        >
                          <td className="px-4 py-3">
                            <Button
                              className="!w-[32px] !h-[32px] !min-w-[32px] !rounded-lg !bg-gray-100 hover:!bg-gray-200 !transition-colors"
                              onClick={() => isShowOrderedProduct(index)}
                            >
                              {isOpenOrderIndex === index ? (
                                <IoIosArrowUp className="text-[14px] text-gray-600" />
                              ) : (
                                <MdKeyboardArrowDown className="text-[16px] text-gray-600" />
                              )}
                            </Button>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[#ff5252] font-semibold font-mono text-xs">
                              #{order?._id?.slice(-8)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium text-xs">
                            {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                          </td>
                          <td className="px-4 py-3 font-medium text-xs">
                            {order?.products?.length || 0} item{order?.products?.length > 1 ? "s" : ""}
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900 text-sm">
                            &#8377;{Number(order?.totalAmt || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-gray-600">
                            {order?.paymentId ? "Online" : "COD"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(order?.order_status)}`}>
                              {order?.order_status || "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link to={`/order-tracking?orderId=${order?._id}`}>
                              <Button className="!text-[11px] !font-semibold !text-[#ff5252] !capitalize !px-3 !py-1 !rounded-lg hover:!bg-red-50 !transition-colors !min-w-0">
                                Track
                              </Button>
                            </Link>
                          </td>
                        </tr>

                        {/* Expanded product details */}
                        {isOpenOrderIndex === index && (
                          <tr key={`expanded-${index}`}>
                            <td className="px-4 py-4 bg-gray-50/80" colSpan="8">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {order?.products?.map((product, pIdx) => (
                                  <div key={pIdx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                    <img
                                      src={product?.image}
                                      className="w-12 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                                      alt={product?.productTitle}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-xs font-semibold text-gray-800 truncate m-0">
                                        {product?.productTitle}
                                      </h5>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[11px] text-gray-500">Qty: {product?.quantity}</span>
                                        <span className="text-[11px] font-bold text-gray-800">
                                          {product?.price?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {/* Order meta */}
                              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 text-[11px] text-gray-500">
                                <span><strong>Address:</strong> {order?.delivery_address?.address_line}, {order?.delivery_address?.city} - {order?.delivery_address?.pincode}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* ====== MOBILE CARD VIEW ====== */
              <div className="p-3 sm:p-4 space-y-3">
                {orders?.map((order, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div
                      className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => isShowOrderedProduct(index)}
                    >
                      <div className="flex items-center gap-3">
                        {/* First product thumbnail */}
                        {order?.products?.[0]?.image && (
                          <img
                            src={order.products[0].image}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                            alt=""
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-800 font-mono">
                              #{order?._id?.slice(-8)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(order?.order_status)}`}>
                              {order?.order_status || "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500">
                            <span>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : ""}</span>
                            <span>&bull;</span>
                            <span>{order?.products?.length} item{order?.products?.length > 1 ? "s" : ""}</span>
                            <span>&bull;</span>
                            <span className="font-bold text-gray-800">&#8377;{Number(order?.totalAmt || 0).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isOpenOrderIndex === index ? (
                          <IoIosArrowUp className="text-[16px] text-gray-400" />
                        ) : (
                          <MdKeyboardArrowDown className="text-[18px] text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isOpenOrderIndex === index && (
                      <div className="border-t border-gray-100 bg-gray-50/50">
                        {/* Products */}
                        <div className="p-3 space-y-2">
                          {order?.products?.map((product, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-100">
                              <img
                                src={product?.image}
                                className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                                alt={product?.productTitle}
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[11px] font-semibold text-gray-800 truncate m-0">
                                  {product?.productTitle}
                                </h5>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500">
                                  <span>Qty: {product?.quantity}</span>
                                  <span className="font-bold text-gray-700">
                                    {product?.price?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Meta + Track Button */}
                        <div className="px-3 pb-3 flex items-center justify-between">
                          <div className="text-[10px] text-gray-400">
                            {order?.paymentId ? "Paid Online" : "Cash on Delivery"}
                          </div>
                          <Link to={`/order-tracking?orderId=${order?._id}`}>
                            <Button className="btn-org !text-[11px] !py-1.5 !px-4 !rounded-lg !min-w-0">
                              <LiaShippingFastSolid className="text-[14px] mr-1" /> Track
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Orders;
