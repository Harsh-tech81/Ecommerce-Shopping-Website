import { Fragment, useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { IoIosArrowUp } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { editData, fetchDataFromApi } from "../../utils/api";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { MyContext } from "../../App.jsx";

function Orders() {
  const [isOpenOrderIndex, setIsOpenOrderIndex] = useState(null);
  const [orders, setOrders] = useState([]);
  const context = useContext(MyContext);
  const handleChange = (e, id) => {
    const nextStatus = e.target.value;
    const obj = {
      order_status: nextStatus,
    };
    editData(`/api/order/order-status/${id}`, obj)
      .then((res) => {
        if (res?.data?.error === false) {
          setOrders((prev) =>
            prev.map((order) =>
              order?._id === id
                ? { ...order, order_status: nextStatus }
                : order,
            ),
          );
          context?.openAlertbox("success", res?.data?.message);
        } else {
          context?.openAlertbox(
            "error",
            res?.data?.message || "Failed to update order status",
          );
        }
      })
      .catch(() => {
        context?.openAlertbox("error", "Failed to update order status");
      });
  };

  useEffect(() => {
    fetchDataFromApi("/api/order/order-list").then((res) => {
      if (res?.error === false) {
        setOrders(res?.data || []);
      }
    });
  }, []);

  const isShowOrderedProduct = (index) => {
    if (isOpenOrderIndex === index) {
      setIsOpenOrderIndex(null);
    } else {
      setIsOpenOrderIndex(index);
    }
  };

  return (
    <div className="card my-4 shadow-md sm:rounded-lg bg-white">
      <div className="flex items-center justify-between px-5 py-5">
        <h2 className="text-[18px] font-[600]">Recent Orders</h2>
    
      </div>
      <div className="relative overflow-x-auto" style={{ marginTop: "15px" }}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  dark:bg-gray-100 dark:text-gray-400">
            <tr>
              <th scope="col" style={{ padding: "12px 24px" }}>
                &nbsp;
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Order Id
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Paymant Id
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Name
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Phone Number
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Address
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                pincode
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Total Amount
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Email
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                User Id
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Order Status
              </th>
              <th
                scope="col"
                style={{ padding: "12px 24px" }}
                className="whitespace-nowrap"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.length !== 0 &&
              orders?.map((order, index) => {
                return (
                  <Fragment key={order?._id || index}>
                    <tr className="bg-white border-b dark:bg-white dark:border-gray-700">
                      <td
                        className="font-[500]"
                        style={{ padding: "12px 15px" }}
                      >
                        <Button
                          className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1] "
                          onClick={() => isShowOrderedProduct(index)}
                        >
                          {isOpenOrderIndex === index ? (
                            <IoIosArrowUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                          ) : (
                            <MdKeyboardArrowDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                          )}
                        </Button>
                      </td>
                      <td
                        className="font-[500]"
                        style={{ padding: "12px 15px" }}
                      >
                        <span className="text-[#ff5252] font-[500]">
                          {order?._id}
                        </span>
                      </td>

                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]"
                      >
                        <span className="text-[#ff5252] font-[500]">
                          {order?.paymentId
                            ? order?.paymentId
                            : "CASH ON DELIVERY"}
                        </span>
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500] whitespace-nowrap"
                      >
                        {order?.userId?.name}
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]"
                      >
                        {order?.userId?.mobile}
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]"
                      >
                        <span className="block w-[400px] font-[500]">
                          {order?.delivery_address?.address_line},{" "}
                          {order?.delivery_address?.city},{" "}
                          {order?.delivery_address?.landmark},{" "}
                          {order?.delivery_address?.country}
                        </span>
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]"
                      >
                        {order?.delivery_address?.pincode}
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]"
                      >
                        {order?.totalAmt}
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]"
                      >
                        {order?.userId?.email}
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]"
                      >
                        <span className="text-[#ff5252] font-[500]">
                          {order?.userId?._id}
                        </span>
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]"
                      >
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={order?.order_status || "pending"}
                          label="Status"
                          onChange={(e) => handleChange(e, order?._id)}
                          size="small"
                          style={{zoom:'80%'}}
                          className="w-full"
                        >
                          <MenuItem value={"pending"}>Pending</MenuItem>
                          <MenuItem value={"confirmed"}>Confirmed</MenuItem>
                          <MenuItem value={"delivered"}>Delivered</MenuItem>
                        </Select>
                      </td>
                      <td
                        style={{ padding: "15px 10px" }}
                        className="font-[500]  whitespace-nowrap"
                      >
                        {order?.createdAt?.split("T")[0]}
                      </td>
                    </tr>
                    {isOpenOrderIndex === index && (
                      <tr>
                        <td style={{ paddingLeft: "140px" }} colSpan="4">
                          <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50  dark:bg-gray-100 dark:text-gray-400">
                                <tr>
                                  <th
                                    scope="col"
                                    style={{ padding: "12px 24px" }}
                                    className="whitespace-nowrap"
                                  >
                                    Product Id
                                  </th>
                                  <th
                                    scope="col"
                                    style={{ padding: "12px 24px" }}
                                    className="whitespace-nowrap"
                                  >
                                    Product Title
                                  </th>
                                  <th
                                    scope="col"
                                    style={{ padding: "12px 24px" }}
                                  >
                                    Image
                                  </th>
                                  <th
                                    scope="col"
                                    style={{ padding: "12px 24px" }}
                                  >
                                    Quantity
                                  </th>
                                  <th
                                    scope="col"
                                    style={{ padding: "12px 24px" }}
                                  >
                                    Price
                                  </th>
                                  <th
                                    scope="col"
                                    style={{ padding: "12px 24px" }}
                                  >
                                    Sub Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.products?.length > 0 &&
                                  order?.products?.map((product, index) => {
                                    return (
                                      <>
                                        <tr
                                          className="bg-white border-b dark:bg-white dark:border-gray-700"
                                          key={index}
                                        >
                                          <td
                                            className="font-[500]"
                                            style={{
                                              padding: "12px 15px",
                                            }}
                                          >
                                            <span className="text-[#ff5252] font-[500]">
                                              {product?._id}
                                            </span>
                                          </td>

                                          <td
                                            style={{
                                              padding: "15px 10px",
                                            }}
                                            className="font-[500]"
                                          >
                                            <span className=" font-[500]">
                                              <div className="w-[200px]">
                                                {product?.productTitle}
                                              </div>
                                            </span>
                                          </td>
                                          <td
                                            style={{
                                              padding: "15px 10px",
                                            }}
                                            className="font-[500]"
                                          >
                                            <img
                                              src={product?.image}
                                              className="w-[40px] h-[40px] object-cover rounded-md"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              padding: "15px 10px",
                                            }}
                                            className="font-[500]"
                                          >
                                            {product?.quantity}
                                          </td>
                                          <td
                                            style={{
                                              padding: "15px 10px",
                                            }}
                                            className="font-[500]"
                                          >
                                            <span className="block w-[400px] font-[500]">
                                              {product?.price?.toLocaleString(
                                                "en-IN",
                                                {
                                                  style: "currency",
                                                  currency: "INR",
                                                  maximumFractionDigits: 0,
                                                },
                                              )}
                                            </span>
                                          </td>
                                          <td
                                            style={{
                                              padding: "15px 10px",
                                            }}
                                            className="font-[500]"
                                          >
                                            {product?.subTotal?.toLocaleString(
                                              "en-IN",
                                              {
                                                style: "currency",
                                                currency: "INR",
                                                maximumFractionDigits: 0,
                                              },
                                            )}
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
