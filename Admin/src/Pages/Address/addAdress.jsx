import Button from "@mui/material/Button";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { postData, fetchDataFromApi } from "../../utils/api";
import { useContext } from "react";
import { MyContext } from "../../App";
import { CircularProgress } from "@mui/material";

function AddAddress() {
  const context = useContext(MyContext);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [formFields, setFormFields] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: true,
    userId: "",
    selected: false,
  });

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setFormFields((prev) => ({
      ...prev,
      status: event.target.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.address_line === "") {
      context.openAlertbox("error", "Please enter address");
      setIsLoading(false);
      return false;
    }

    if (formFields.city === "") {
      context.openAlertbox("error", "Please enter city");
      setIsLoading(false);
      return false;
    }

    if (formFields.state === "") {
      context.openAlertbox("error", "Please enter state");
      setIsLoading(false);
      return false;
    }

    if (formFields.pincode === "") {
      context.openAlertbox("error", "Please enter pincode");
      setIsLoading(false);
      return false;
    }

    if (formFields.country === "") {
      context.openAlertbox("error", "Please enter country");
      setIsLoading(false);
      return false;
    }

    if (formFields.mobile === "") {
      context.openAlertbox("error", "Please enter your 10-digit mobile number");
      setIsLoading(false);
      return false;
    }

    // VALIDATION FOR USER ID
    if (!context?.userDetails?._id) {
      context.openAlertbox(
        "error",
        "User not authenticated or userId missing. Please reload or login again.",
      );
      setIsLoading(false);
      return false;
    }

    const payload = {
      ...formFields,
      userId: context?.userDetails?._id,
    };

    postData(`/api/address/add`, payload, { withCredentials: true }).then(
      (res) => {
  
        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertbox("success", res?.message);

          context?.setIsOpenFullScreen({
            open: false,
            content: "",
          });

          fetchDataFromApi(
            `/api/address/get?userId=${context?.userDetails?._id}`,
          ).then((res) => {
            context?.setAddress(res?.data);
          });
        } else {
          context.openAlertbox("error", res?.message);
          setIsLoading(false);

          context?.setIsOpenFullScreen({
            open: false,
            content: "",
          });
        }
      },
    );
  };

  return (
    <section className="p-3 sm:p-5 bg-gray-50">
      <form className="form py-3 px-3 sm:px-6 lg:px-8" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-auto pr-1 sm:pr-3 lg:pr-4 pt-3 sm:pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 mb-3 gap-3 sm:gap-4">
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Address
              </h3>
              <input
                type="text"
                name="address_line"
                value={formFields.address_line}
                onChange={handleChange}
                disabled={isLoading ? true : false}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">City</h3>
              <input
                type="text"
                name="city"
                value={formFields.city}
                onChange={handleChange}
                disabled={isLoading ? true : false}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-3 gap-3 sm:gap-4">
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">State</h3>
              <input
                type="text"
                name="state"
                value={formFields.state}
                onChange={handleChange}
                disabled={isLoading ? true : false}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Pincode
              </h3>
              <input
                type="text"
                name="pincode"
                value={formFields.pincode}
                onChange={handleChange}
                disabled={isLoading ? true : false}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Country
              </h3>
              <input
                type="text"
                name="country"
                value={formFields.country}
                onChange={handleChange}
                disabled={isLoading ? true : false}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-3 gap-3 sm:gap-4">
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Mobile No.
              </h3>
              <PhoneInput
                defaultCountry="in"
                value={phone}
                disabled={isLoading ? true : false}
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields((prev) => ({
                    ...prev,
                    mobile: phone,
                  }));
                }}
              />
            </div>

            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">Status</h3>
              <Select
                displayEmpty
                value={status}
                onChange={handleChangeStatus}
                inputProps={{ "aria-label": "Without label" }}
                size="small"
                className="w-full"
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>
          </div>

          <br />
        </div>

        <div className="w-full sm:w-[250px]">
          <Button className="btn-blue btn-lg w-full" type="submit">
            {isLoading ? <CircularProgress color="inherit" /> : "Add Address"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default AddAddress;
