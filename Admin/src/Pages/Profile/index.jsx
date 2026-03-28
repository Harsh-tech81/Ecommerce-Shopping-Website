import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { uploadImage } from "../../utils/api";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Collapse } from "react-collapse";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { editData, fetchDataFromApi, postData } from "../../utils/api";
import Radio from "@mui/material/Radio";

const label = {
  inputProps: { "aria-label": "Radio button demo" },
};

const Profile = () => {
  const context = useContext(MyContext);
  const formdata = new FormData();
  const [selectedValue, setSelectedValue] = useState();
  const [preview, setPreview] = useState([]);
  const [phone, setPhone] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  let selectedImages = [];

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changePassword, setChangePassword] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangeAddress = (e) => {
    setSelectedValue(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token === null) {
      navigate("/login");
    }
  }, [context?.isLogin]);

  const valideValue = Object.values(formFields).every((el) => el);
  const valideValue2 = Object.values(changePassword).every((el) => el);

  useEffect(() => {
    if (
      context?.userDetails?._id !== "" &&
      context?.userDetails?._id !== undefined &&
      context?.userDetails?._id !== null
    ) {
      fetchDataFromApi(
        `/api/address/get?userId=${context?.userDetails?._id}`,
      ).then((res) => {
        context?.setAddress(res?.data);
      });

      setUserId(context?.userDetails?._id);
      setFormFields({
        name: context?.userDetails?.name,
        email: context?.userDetails?.email,
        mobile: context?.userDetails?.mobile,
      });

      const ph = `${context?.userDetails?.mobile}`;
      setPhone(ph);

      setChangePassword({
        email: context?.userDetails?.email,
      });
    }
  }, [context?.userDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.email === "") {
      context.openAlertbox("error", "Please enter email");
      return false;
    }

    if (formFields.name === "") {
      context.openAlertbox("error", "Please enter fullname");
      return false;
    }

    if (formFields.mobile === "") {
      context.openAlertbox("error", "Please enter mobile");
      return false;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then(
      (res) => {

        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertbox("success", res?.data?.message);
        } else {
          context.openAlertbox("error", res?.data?.message);
          setIsLoading(false);
        }
      },
    );
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (changePassword.newPassword === "") {
      context.openAlertbox("error", "Please enter new password");
      return false;
    }

    if (changePassword.confirmPassword === "") {
      context.openAlertbox("error", "Please enter confirm password");
      return false;
    }

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      context.openAlertbox(
        "error",
        "New password and confirm password does not match",
      );
      setIsLoading2(false);
      return false;
    }

    postData("/api/user/change-password", changePassword, {
      withCredentials: true,
    }).then((res) => {
      if (res?.error !== true) {
        setIsLoading2(false);
        context.openAlertbox("success", res?.message);
      } else {
        context.openAlertbox("error", res?.message);
        setIsLoading2(false);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });

    setChangePassword(() => {
      return {
        ...changePassword,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const userAvatar = [];
    if (
      context?.userDetails?.avatar !== "" &&
      context?.userDetails?.avatar !== undefined
    ) {
      userAvatar.push(context?.userDetails?.avatar);
      setPreview(userAvatar);
    }
  }, [context?.userDetails]);

  const onChangeFile = async (e, url) => {
    try {
      setPreview([]);
      const files = e.target.files;
      setUploading(true);
      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpg" ||
            files[i].type === "image/jpeg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append(`avatar`, file);
        } else {
          context.openAlertbox("error", "Please select a valid image file.");
          setUploading(false);
          return false;
        }
      }

      uploadImage("/api/user/user-avatar", formdata).then((res) => {
        setUploading(false);
        let avatar = [];
        avatar.push(res?.data?.avatar);
        setPreview(avatar);
        context.openAlertbox("success", "Avatar updated successfully.");
      });
    } catch (error) {

      context.openAlertbox("error", "Something went wrong.");
    }
  };

  return (
    <>
      <div className="card my-4 pt-5 w-[100%] sm:w-[100%] lg:w-[65%] shadow-md sm:rounded-lg bg-white px-5 pb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-[600]">User Profile</h2>
          <Button
            className="!ml-auto"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            Change Password
          </Button>
        </div>

        <br />

        <div className="w-[110px]  h-[110px] rounded-full mb-4 overflow-hidden relative group flex items-center justify-center bg-gray-200">
          {uploading ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              {preview?.length !== 0 ? (
                preview?.map((img, index) => {
                  return (
                    <img
                      src={img}
                      key={index}
                      className="w-full h-full object-cover"
                    />
                  );
                })
              ) : (
                <img
                  src={"/profile.png"}
                  className="w-full h-full object-cover"
                />
              )}
            </>
          )}

          <div className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
            <FaCloudUploadAlt className="text-[#fff] text-[25px]" />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="absolute top-0 left-0 w-full h-full opacity-0"
              onChange={(e) => onChangeFile(e, "/api/user/user-avatar")}
            />
          </div>
        </div>

        <form className="form mt-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="col">
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="name"
                value={formFields.name}
                disabled={isLoading ? true : false}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                type="email"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="email"
                value={formFields.email}
                disabled={true}
                onChange={handleChange}
              />
            </div>
               <div className="col">
              <PhoneInput
                defaultCountry="in"
                value={phone}
                disabled={isLoading ? true : false}
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields({
                    mobile: phone,
                  });
                }}
              />
            </div>
          </div>
        

          <br />
          <div
            className="flex items-center justify-center p-5 border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f1faff] rounded-md cursor-pointer hover:bg-[#e7f3f9]"
            onClick={() =>
              context.setIsOpenFullScreen({
                open: true,
                model: "Add New Address",
              })
            }
          >
            <span className="text-[14px] font-[500]">Add Address</span>
          </div>

          <div className="flex flex-col mt-4 gap-2">
            {context?.address?.length > 0 ? (
              context?.address?.map((address, index) => {
                return (
                  <>
                    <label className="addressBox flex items-center justify-center bg-[#f1f1f1] p-3 rounded-md w-full  cursor-pointer border border-dashed border-[rgba(0,0,0,0.2)]">
                      <Radio
                        {...label}
                        name="address"
                        checked={selectedValue === address?._id}
                        onChange={handleChangeAddress}
                        value={address?._id}
                      />
                      <span className="text-[12px]">
                        {address?.address_line +
                          " " +
                          address?.city +
                          " " +
                          address?.state +
                          " " +
                          address?.country +
                          " " +
                          address?.pincode}
                      </span>
                    </label>
                  </>
                );
              })
            ) : (
              <p className="text-center text-[14px] font-[500] text-[rgba(0,0,0,0.5)]">
                No address found
              </p>
            )}
          </div>
          
          <br />
          <div className="flex items-center gap-4">
            <Button
              className="btn-blue btn-lg w-full"
              type="submit"
              disabled={!valideValue}
            >
              {isLoading ? (
                <CircularProgress color="inherit" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
      <Collapse isOpened={showChangePassword}>
        <div className="card bg-white shadow-md rounded-md w-[100%] sm:w-[100%] lg:w-[65%] p-5">
          <div className="flex items-center pb-3">
            <h2 className="text-[18px] font-[600] pb-0">Change Password</h2>
          </div>
          <hr />
          <form className="form mt-8" onSubmit={handleChangePassword}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="col">
                <TextField
                  label="New Password"
                  variant="outlined"
                  type="password"
                  size="small"
                  className="w-full"
                  name="newPassword"
                  value={changePassword.newPassword}
                  disabled={isLoading2 ? true : false}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="confirmPassword"
                  value={changePassword.confirmPassword}
                  disabled={isLoading2 ? true : false}
                  onChange={handleChange}
                />
              </div>
            </div>
            <br />
            <div className="flex items-center gap-4">
              <Button
                className="btn-blue btn-lg w-[100%]"
                type="submit"
                disabled={!valideValue2}
              >
                {isLoading2 ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Collapse>
    </>
  );
};

export default Profile;
