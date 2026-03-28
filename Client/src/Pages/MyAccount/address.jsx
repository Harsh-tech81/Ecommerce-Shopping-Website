import AccountSidebar from "../../components/AccountSidebar";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import "react-international-phone/style.css";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import AddressBox from "./addressBox";

const label = {
  inputProps: { "aria-label": "Radio button demo" },
};

const Address = () => {
  const context = useContext(MyContext);

  const handleDeleteAddress = (id) => {
    deleteData(`/api/address/${id}`).then((res) => {
      if (res?.error !== true) {
        fetchDataFromApi(
          `/api/address/get?userId=${context?.userDetails?._id}`,
        ).then((res) => {
          context?.setAddress(res?.data);
          context?.getUserDetails();
          context.openAlertbox("success", "Address deleted successfully");
        });
      } else {
        context.openAlertbox("error", "Failed to delete address");
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (
      context?.userDetails?._id !== "" &&
      context?.userDetails?._id !== undefined &&
      context?.userDetails?._id !== null
    ) {
      context?.setAddress(context?.userDetails?.address_details || []);
    }
  }, [context?.userDetails]);

  return (
    <>
      <section
        className="w-full"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div className="container flex gap-5" style={{ padding: "20px", flexDirection: context?.isLarge ? "row" : "column" }}>
          {context?.windowWidth > 992 && (
            <div className="col1" style={{ width: context?.isLarge ? "20%" : "100%" }}>
              <AccountSidebar />
            </div>
          )}

          <div className="col2" style={{ width: context?.isLarge ? "50%" : "100%" }}>
            <div
              className="card bg-white shadow-md rounded-md "
              style={{ padding: "30px", marginBottom: "20px" }}
            >
              <div
                className="flex items-center"
                style={{ paddingBottom: "10px" }}
              >
                <h2 style={{ paddingBottom: "0px" }}>Address</h2>
              </div>

              <div
                className="flex items-center justify-center border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f1faff] rounded-md cursor-pointer hover:bg-[#e7f3f9]"
                style={{ padding: "10px" }}
                onClick={context?.toggleAddressPanel(true)}
              >
                <span
                  className="text-[14px] font-[500]"
                  style={{ padding: "8px" }}
                >
                  Add Address
                </span>
              </div>

              <div
                className="flex flex-col gap-2"
                style={{ marginTop: "20px" }}
              >
                {context?.address?.length > 0 ? (
                  context?.address?.map((address, index) => {
                    return (
                      <AddressBox
                        address={address}
                        key={index}
                        handleDeleteAddress={handleDeleteAddress}
                    
                      />
                    );
                  })
                ) : (
                  <p className="text-center text-[14px] font-[500] text-[rgba(0,0,0,0.5)]">
                    No address found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Address;
