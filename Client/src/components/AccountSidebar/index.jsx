import Button from "@mui/material/Button";
import { CiLocationOn } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { uploadImage, fetchDataFromApi } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

function AccountSidebar() {
  const context = useContext(MyContext);
  const formdata = new FormData();
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  let selectedImages = [];

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

  const logout = () => {
    fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("accessToken")}`,
      { withCredentials: true },
    ).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
      }
    });
  };

  const onChangeFile = async (e) => {
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
    <div className="card bg-white shadow-md rounded-md sticky top-[160px]">
      <div
        className="w-full flex items-center justify-center flex-col "
        style={{ padding: "15px" }}
      >
        <div
          className="w-[110px]  h-[110px] rounded-full overflow-hidden relative group flex items-center justify-center bg-gray-200"
          style={{ marginBottom: "8px" }}
        >
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
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/profile.png";
                      }}
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
              onChange={onChangeFile}
            />
          </div>
        </div>

        <h3>{context?.userDetails?.name}</h3>
        <span className="text-[12px] font-[500]">
          {context?.userDetails?.email}
        </span>
      </div>

      <ul
        className="list-none bg-[#f1f1f1] myAccountTabs"
        style={{ paddingBottom: "10px" }}
      >
        <li className="w-full">
          <NavLink to="/my-account" exact={true} activeClassName="isActive">
            <Button
              className=" !text-left !justify-start w-full  !text-[rgba(0,0,0,0.8)]  !rounded-none flex items-center gap-2 !capitalize"
              style={{ paddingLeft: "20px" }}
            >
              <FaRegUser className="text-[17px] " /> My Profile
            </Button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink to="/address" exact={true} activeClassName="isActive">
            <Button
              className=" !text-left !justify-start w-full  !text-[rgba(0,0,0,0.8)]  !rounded-none flex items-center gap-2 !capitalize"
              style={{ paddingLeft: "20px" }}
            >
              <CiLocationOn className="text-[19px] " />
              Address
            </Button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink to="/my-list" exact={true} activeClassName="isActive">
            <Button
              className=" !text-left !justify-start w-full  !text-[rgba(0,0,0,0.8)]  !rounded-none flex items-center gap-2 !capitalize"
              style={{ paddingLeft: "20px" }}
            >
              <FiHeart className="text-[18px] " /> My List
            </Button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink to="/my-orders" exact={true} activeClassName="isActive">
            <Button
              className=" !text-left !justify-start w-full  !text-[rgba(0,0,0,0.8)]  !rounded-none flex items-center gap-2 !capitalize"
              style={{ paddingLeft: "20px" }}
            >
              <IoBagCheckOutline className="text-[18px] " /> My Orders
            </Button>
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink to="/" exact={true} activeClassName="isActive">
            <Button
              className=" !text-left  !justify-start w-full  !text-[rgba(0,0,0,0.8)]  !rounded-none flex items-center gap-2 !capitalize"
              style={{ paddingLeft: "20px" }}
              onClick={logout}
            >
              <IoIosLogOut className="text-[19px] " /> Logout
            </Button>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default AccountSidebar;
