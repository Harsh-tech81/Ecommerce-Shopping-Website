import { BsFillBagCheckFill } from "react-icons/bs";
import Button from "@mui/material/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import { MyContext } from "../../App.jsx";
import { FaPlus } from "react-icons/fa";
import Radio from "@mui/material/Radio";
import { postData, deleteData, fetchDataFromApi } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VITE_APP_RAZORPAY_KEY_ID = import.meta.env.VITE_APP_RAZORPAY_KEY_ID;
const VITE_APP_RAZORPAY_KEY_SECRET = import.meta.env
  .VITE_APP_RAZORPAY_KEY_SECRET;


function Checkout() {
  const context = useContext(MyContext);
  const [isChecked, setIsChecked] = useState(0);
  const [userData, setUserData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const navigate = useNavigate();

  const onApprovePayment = useCallback(async (data) => {
    const user = context?.userDetails;
    const info = {
      userId: user?._id,
      products: context?.cartData,
      payment_status: "COMPLETED",
      delivery_address: selectedAddress,
      totalAmt: totalAmount,
      date: new Date().toLocaleString("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    };



    if (response?.data?.success) {
      await deleteData(`/api/cart/emptyCart/${context?.userDetails?._id}`);
      context?.getCartData();
      context?.openAlertbox("success", response?.data?.message);
      navigate("/order/success");
    } else {
      context?.openAlertbox("error", response?.data?.message || "Payment failed");
         navigate("/order/failed");
    }
  }, [
    context,
    navigate,
    selectedAddress,
    totalAmount,
  ]);



  useEffect(() => {
    window.scrollTo(0, 0);
    setUserData(context?.userDetails);
    setSelectedAddress(context?.userDetails?.address_details[0]?._id);
    fetchDataFromApi(`/api/order/my-order-list`).then(() => {
     
    });
  }, [context?.userDetails]);

  useEffect(() => {
    setTotalAmount(
      context?.cartData?.length !== 0
        ? context?.cartData
            ?.map((item) => parseInt(item?.price) * parseInt(item?.quantity))
            .reduce((acc, curr) => acc + curr, 0)
        : 0,
    )?.toLocalString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

    // localStorage.setItem("totalAmount",context?.cartData?.length !== 0 ? context?.cartData?.map(item=>parseInt(item?.price) * parseInt(item?.quantity)).reduce((acc, curr) => acc + curr, 0) : 0)?.toLocalString("en-IN", {
    //   style: "currency",
    //   currency: "INR",
    //   maximumFractionDigits: 0,
    // }
    // );
    
  }, [context?.cartData]);

  const editAddress = (id) => {
    context?.setAddressMode("edit");
    context?.setOpenAddressPanel(true);
    context?.setAddressId(id);
  };
  const handleChange = (e, index) => {
    if (e.target.checked) {
      setIsChecked(index);
      setSelectedAddress(e.target.value);
    }
  };
  const cashOnDelivery = () => {
    const user = context?.userDetails;
    if(userData?.address_details?.length === 0){
      context?.openAlertbox("error", "Please add a delivery address to proceed with Cash on Delivery.");
      return;
    }
    const payLoad = {
      userId: user?._id,
      products: context?.cartData,
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: selectedAddress,
      totalAmt: totalAmount,
      date: new Date().toLocaleString("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    postData(`/api/order/create`, payLoad).then((res) => {
      if (res?.error === false) {
        context?.openAlertbox("success", res?.message);
        deleteData(`/api/cart/emptyCart/${user?._id}`).then(() => {
          context?.getCartData();
        });
        navigate("/order/success");
      } else {
        context?.openAlertbox("error", res?.message);
           navigate("/order/failed");
      }
    });
  };

  const checkout = (e) => {
    e.preventDefault();
if(userData?.address_details?.length === 0){
  context?.openAlertbox("error", "Please add a delivery address to proceed with payment.");
  return;
}

    var options = {
      key: VITE_APP_RAZORPAY_KEY_ID,
      key_secret: VITE_APP_RAZORPAY_KEY_SECRET,
      amount: totalAmount * 100,
      currency: "INR",
      order_receipt: context?.userDetails?.name,
      name: "E-Commerce App",
      description: "Test Transaction",
      handler: function (response) {
        const paymentId = response.razorpay_payment_id;
        const user = context?.userDetails;

        const payLoad = {
          userId: user?._id,
          products: context?.cartData,
          paymentId,
          payment_status: "COMPLETED",
          delivery_address: selectedAddress,
          totalAmt: totalAmount,
          date: new Date().toLocaleString("en-IN", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        };

        postData(`/api/order/create`, payLoad).then((res) => {
          if (res?.error === false) {
            context?.openAlertbox("success", res?.message);
            deleteData(`/api/cart/emptyCart/${user?._id}`).then(() => {
              context?.getCartData();
            });
            navigate("/order/success");
          } else {
            context?.openAlertbox("error", res?.message);
            navigate("/order/failed");
          }
        });
      },

      theme: {
        color: "#ff5252",
      },
    };

    var pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <section style={{ paddingTop: "40px", paddingBottom: "40px" }}>
      <form onSubmit={checkout}>
        <div className="flex gap-5" style={{ width: context?.isLarge ? "70%" : "95%", margin: "auto", flexDirection: context?.isLarge ? "row" : "column" }}>
          <div className="leftCol" style={{ width: context?.isLarge ? "60%" : "100%" }}>
            <div
              className="card bg-white shadow-md rounded-md w-full"
              style={{ padding: "20px" }}
            >
              <div className="flex items-center justify-between">
                <h2>Select Delivery Address</h2>
                <Button
                  variant="outlined"
                  onClick={() => {
                    context?.setOpenAddressPanel(true);
                    context?.setAddressMode("add");
                  }}
                >
                  <FaPlus />
                  <span className="" style={{ marginLeft: "5px" }}>
                    ADD NEW ADDRESS
                  </span>
                </Button>
              </div>
              <br />
              <div className="flex flex-col gap-4">
                {userData?.address_details?.length !== 0 ? (
                  userData?.address_details?.map((item, index) => {
                    return (
                      <label
                        key={index}
                        className={`flex gap-3 border border-[rgba(0,0,0,0.1)] rounded-md relative ${isChecked === index && "bg-[#fff2f2]"}`}
                        style={{ padding: "14px" }}
                      >
                        <div>
                          <Radio
                            size="small "
                            value={item?._id}
                            onChange={(e) => handleChange(e, index)}
                            checked={isChecked === index}
                          />
                        </div>
                        <div className="info">
                          <span
                            className="bg-red-400 text-white text-xs font-bold  rounded-full "
                            style={{ padding: "2px 6px" }}
                          >
                            {item?.addressType}
                          </span>
                          <h3>{userData?.name}</h3>
                          <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                            {item?.address_line +
                              " " +
                              item?.city +
                              " " +
                              item?.state +
                              " " +
                              item?.country +
                              " " +
                              item?.pincode + 
                              " " +
                              item?.mobile }   
                          </p>
                          <p
                            style={{ marginBottom: "0px" }}
                            className="font-[500]"
                          >
                            +{userData?.mobile}
                          </p>
                        </div>
                        <Button
                          variant="text"
                          className="!absolute top-[15px] right-[15px]"
                          size="small"
                          onClick={() => editAddress(item?._id)}
                        >
                          EDIT
                        </Button>
                      </label>
                    );
                  })
                ) : (
                  <>
                    <div
                      className="flex items-center justify-between flex-col"
                      style={{ padding: "20px", marginTop: "10px" }}
                    >
                      <img src="/relocation.png" width="100" />
                      <h2 className="text-center">
                        No Addresses found in your account!
                      </h2>
                      <p style={{ marginTop: "0px" }}>
                        Add a delivery address.
                      </p>
                      <Button
                        className="btn-org"
                        onClick={() => {
                          context?.setOpenAddressPanel(true);
                          context?.setAddressMode("add");
                        }}
                      >
                        ADD ADDRESS
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="rightCol" style={{ width: context?.isLarge ? "40%" : "100%" }}>
            <div
              className="card shadow-md bg-white rounded-md"
              style={{ padding: "20px" }}
            >
              <h2 style={{ marginBottom: "14px" }}>Your Order</h2>
              <div
                className="flex items-center justify-between border-t  border-b border-[rgba(0,0,0,0.1)]"
                style={{ padding: "12px 12px" }}
              >
                <span className="text-[14px] font-[600]">Product</span>
                <span className="text-[14px] font-[600]">Subtotal</span>
              </div>

              <div
                className="scroll max-h-[250px] overflow-y-scroll overflow-x-hidden"
                style={{ paddingRight: "0px", marginBottom: "30px" }}
              >
                {context?.cartData?.length !== 0 &&
                  context?.cartData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                        style={{ padding: "12px 12px" }}
                      >
                        <div className="part1 flex items-center gap-3">
                          <div className="img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer">
                            {/* <Link to={`/product/${item?.productId}`}> */}
                            <img
                              src={item?.image}
                              className="w-full transition-all group-hover:scale-105"
                            />
                            {/* </Link> */}
                          </div>

                          <div className="info">
                            {/* <Link to={`/product/${item?.productId}`}> */}
                            <h4
                              className="text-[14px]"
                              title={item?.productTitle}
                            >
                              {item?.productTitle.substring(0, 20)}...
                            </h4>
                            {/* </Link> */}
                            <span className="text-[13px]">
                              Qty : {item?.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-[500] text-[14px]">
                          {(item?.quantity * item?.price).toLocaleString(
                            "en-IN",
                            {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            },
                          )}
                        </span>
                      </div>
                    );
                  })}
              </div>

              <div
                className="flex items-center gap-3 flex-col "
                style={{ marginBottom: "10px" }}
              >
                <Button
                  type="submit"
                  className="btn-org btn-lg w-full flex gap-2"
                >
                  <BsFillBagCheckFill className="text-[20px]  " />
                  Checkout
                </Button>

      
                <Button
                  type="button"
                  onClick={cashOnDelivery}
                  className="btn-dark btn-lg w-full flex gap-2 items-center"
                >
                  <BsFillBagCheckFill className="text-[20px]  " />
                  Cash on Delivery
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default Checkout;
