import { useState, useContext, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { postData, fetchDataFromApi, editData } from "../../utils/api";
import { CircularProgress } from "@mui/material";
import { MyContext } from "../../App";

function AddAddress() {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [addressType, setAddressType] = useState("");
  const [formFields, setFormFields] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: true,
    userId: "",
    addressType: "",
    landmark: "",
  });

  useEffect(() => {
    if (context?.addressMode === "edit") {
        fetchAddress(context?.addressId);
    }
  }, [context?.addressMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setFormFields((prev) => ({
      ...prev,
      userId: context?.userDetails?._id,
    }));
  }, [context?.userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleChangeAddressType = (e) => {
    setAddressType(e.target.value);
    setFormFields((prev) => ({
      ...prev,
      addressType: e.target.value,
    }));
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
    if (formFields.landmark === "") {
      context.openAlertbox("error", "Please enter landmark");
      setIsLoading(false);
      return false;
    }
    if (formFields.addressType === "") {
      context.openAlertbox("error", "Please select address type");
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
    if (context?.addressMode === "add") {
      postData(`/api/address/add`, formFields, { withCredentials: true }).then(
        (res) => {

          if (res?.error !== true) {
            setIsLoading(false);
            context.openAlertbox("success", res?.message);
            context?.setOpenAddressPanel(false);
            setPhone("");
            setFormFields({
              address_line: "",
              city: "",
              state: "",
              pincode: "",
              country: "",
              mobile: "",
              status: true,
              userId: context?.userDetails?._id || "",
              addressType: "",
              landmark: "",
            });
            fetchDataFromApi(
              `/api/address/get?userId=${context?.userDetails?._id}`,
            ).then((res) => {
              context?.setAddress(res?.data);
            });
          } else {
            context.openAlertbox("error", res?.message);
            setIsLoading(false);
            context?.setOpenAddressPanel(false);
            setPhone("");
            setFormFields({
              address_line: "",
              city: "",
              state: "",
              pincode: "",
              country: "",
              mobile: "",
              status: true,
              userId: context?.userDetails?._id || "",
              addressType: "",
              landmark: "",
            });
          }
        },
      );
    }
    if (context?.addressMode === "edit") {
      setIsLoading(true);
      editData(`/api/address/${context?.addressId}`, formFields, {
        withCredentials: true,
      }).then((res) => {
        setIsLoading(false);
        context?.openAlertbox("success", res?.data?.message);
        context?.getUserDetails();
        context?.setOpenAddressPanel(false);
        setFormFields({
          address_line: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          mobile: "",
          status: true,
          userId: context?.userDetails?._id || "",
          addressType: "",
          landmark: "",
        });
        setAddressType("");
        setPhone("");
      });
    }
  };
  const fetchAddress = (id) => {
    context?.setAddressMode("edit");
   context?.setOpenAddressPanel(true);
    context?.editAddress(id);
    fetchDataFromApi(`/api/address/${id}`).then((res) => {
      if (res?.error === false) {
        const address = res?.address;
        const safeMobile = String(address?.mobile ?? "");
        setFormFields({
          address_line: address?.address_line || "",
          city: address?.city || "",
          state: address?.state || "",
          pincode: address?.pincode || "",
          country: address?.country || "",
          mobile: safeMobile,
          userId: context?.userDetails?._id || "",
          addressType: address?.addressType || "",
          landmark: address?.landmark || "",
        });
        setPhone(safeMobile);
        setAddressType(address?.addressType || "");
      } else {
        context.openAlertbox("error", "Address not found");
      }
    });
  };

  return (
    <form style={{ padding: "10px 25px 25px 25px" }} onSubmit={handleSubmit}>
      <div className="col w-[100%]" style={{ marginBottom: "10px" }}>
        <TextField
          label="Address"
          variant="outlined"
          className="w-full"
          size="small"
          name="address_line"
          value={formFields.address_line}
          onChange={handleChange}
          disabled={isLoading ? true : false}
        />
      </div>

      <div className="col w-[100%]" style={{ marginBottom: "10px" }}>
        <TextField
          label="City"
          variant="outlined"
          className="w-full"
          size="small"
          name="city"
          value={formFields.city}
          onChange={handleChange}
          disabled={isLoading ? true : false}
        />
      </div>
      <div className="col w-[100%]" style={{ marginBottom: "10px" }}>
        <TextField
          label="State"
          variant="outlined"
          className="w-full"
          size="small"
          name="state"
          value={formFields.state}
          onChange={handleChange}
          disabled={isLoading ? true : false}
        />
      </div>

      <div className="col w-[100%]" style={{ marginBottom: "10px" }}>
        <TextField
          label="Country"
          variant="outlined"
          className="w-full"
          size="small"
          name="country"
          value={formFields.country}
          onChange={handleChange}
          disabled={isLoading ? true : false}
        />
      </div>
      <div className="col w-[100%]" style={{ marginBottom: "10px" }}>
        <TextField
          label="Pincode"
          variant="outlined"
          className="w-full"
          size="small"
          name="pincode"
          value={formFields.pincode}
          onChange={handleChange}
          disabled={isLoading ? true : false}
        />
      </div>

      <div className="col w-[100%]" style={{ marginBottom: "10px" }}>
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
      <div className="col w-[100%]" style={{ marginBottom: "10px" }}>
        <TextField
          label="Landmark"
          variant="outlined"
          className="w-full"
          size="small"
          name="landmark"
          value={formFields.landmark}
          onChange={handleChange}
          disabled={isLoading ? true : false}
        />
      </div>

      <div className="flex gap-5 flex-col" style={{ paddingBottom: "20px" }}>
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Address Type
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={addressType}
            onChange={handleChangeAddressType}
          >
            <FormControlLabel value="Home" control={<Radio />} label="Home" />
            <FormControlLabel
              value="Office"
              control={<Radio />}
              label="Office"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="flex items-center gap-5">
        <Button
          className="btn-org btn-lg w-full flex gap-2 items-center justify-center"
          onClick={handleSubmit}
          type="submit"
        >
          {isLoading ? <CircularProgress color="inherit" /> : "Save"}
        </Button>
      </div>
    </form>
  );
}

export default AddAddress;
