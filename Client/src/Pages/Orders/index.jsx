import Button from "@mui/material/Button";
import AccountSidebar from "../../components/AccountSidebar";
import { MdKeyboardArrowDown } from "react-icons/md";
import Badge from "../../components/Badge";
import { useEffect, useState, useContext } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

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
          <div className="shadow-md rounded-md bg-white">
            <div
              className="border-b border-[rgba(0,0,0,0.1)]"
              style={{ padding: "15px 30px" }}
            >
              <h2>My Orders</h2>
              <p style={{ marginTop: "0px" }}>
                There are{" "}
                <span className="font-bold text-[#ff5252]">
                  {orders.length}
                </span>{" "}
                products in my orders
              </p>

              <div
                className="relative overflow-x-auto"
                style={{ marginTop: "15px" }}
              >
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
                          <>
                            <tr
                              className="bg-white border-b dark:bg-white dark:border-gray-700"
                              key={index}
                            >
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
                                  {order?.delivery_address?.country},{" "}
                                  {order?.delivery_address?.mobile}

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
                                <Badge status={order?.order_status} />
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
                                <td
                                  style={{ paddingLeft: "140px" }}
                                  colSpan="4"
                                >
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
                                          order?.products?.map(
                                            (product, index) => {
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
                                                      <span className="text-[#ff5252] font-[500] text-gray-600">
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
                                                          {
                                                            product?.productTitle
                                                          }
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
                                            },
                                          )}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Orders;
