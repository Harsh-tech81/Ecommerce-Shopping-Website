import { Link } from "react-router-dom";
import Search from "../Search";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { PiShoppingCartLight } from "react-icons/pi";
import { FiHeart } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import Navigation from "../Header/Navigation";
import { useContext, useState } from "react";
import { MyContext } from "../../App";
import { FaRegUser } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CiLocationOn } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { fetchDataFromApi } from "../../utils/api";
import { HiOutlineMenu } from "react-icons/hi";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const context = useContext(MyContext);
  const logout = () => {
    setAnchorEl(null);
    fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("accessToken")}`,
      { withCredentials: true },
    ).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        context.setUserDetails(null);
        context?.setCartData([]);
        context?.setMyListData([]);
        navigate("/");
      }
    });
  };

  return (
    <header className="bg-white sticky -top-[47px] z-[100]">
      <div className="top-strip py-2 border-t border-gray-250 border-b">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="col1 w-1/2 hidden lg:block">
              <p className="text-xs font-medium">
                Get up to 50% off new season styles,limited time only!
              </p>
            </div>
            <div className="col2 flex items-center justify-between w-full lg:w-1/2 lg:justify-end">
              <ul className="flex items-center gap-3 w-full justify-between lg:w-[200px]">
                <li className="list-none">
                  <Link
                    to="/help-center"
                    className="text-[11px] lg:text-[13px] link font-[500] transition"
                  >
                    {" "}
                    Help Center{" "}
                  </Link>
                </li>
                <li className="list-none">
                  <Link
                    to="/order-tracking"
                    className="text-[11px] lg:text-[13px] link font-[500] transition"
                  >
                    Order Tracking{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

<div
  className="header border-gray-250 border-b"
  style={{
    paddingTop: context?.isLarge ? "16px" : "8px",
    paddingBottom: context?.isLarge ? "16px" : "8px"
  }}
>
        <div className="container flex items-center justify-between">
          {/* {
            context?.windowWidth <= 992 && <Button className="!w-[35px] !min-w-[35px] !h-[35px] !rounded-full !text-gray-800" onClick={() => setIsOpenCatPanel(true)}><HiOutlineMenu size={22}/></Button>
          } */}
          <div className="col1 w-[40%]  lg:w-1/4 ">
            <Link to={"/"}>
              <img src="/logo4.png" alt="Logo" width={230} height={180} />
            </Link>
          </div>
          <div
            className="col2 fixed top-0 left-0 w-full h-full lg:w-[45%] lg:static bg-white z-50 hidden lg:block"
            style={{ padding: "8px" }}
          >
            <Search />
          </div>
          <div
            className="col3 w-[5%]  lg:w-[35%] flex items-center"
            style={{ paddingLeft: "14px" }}
          >
            <ul className="flex items-center gap-0 lg:gap-3 w-full justify-end">
              {context.isLogin ? (
                <>
                {
                  context?.windowWidth > 992 &&  <li>
                    <Button
                      className="!text-[#000] flex gap-0 lg:gap-3 items-center myAccountWrap cursor-pointer"
                      onClick={handleClick}
                    >
                      <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-[#f1f1f1]">
                        <FaRegUser className="text-[16px] text-[rgba(0,0,0,0.7)] " />
                      </Button>
                      {context?.windowWidth > 992 && (
                        <div className="info flex flex-col ">
                          <h4 className="text-[14px] leading-4  text-left font-[500] text-[rgba(0,0,0,0.6)] capitalize justify-start">
                            {context?.userDetails?.name}
                          </h4>
                          <span className="text-[13px] text-[rgba(0,0,0,0.6)] font-[400] lowercase text-left justify-start">
                            {context?.userDetails?.email}
                          </span>
                        </div>
                      )}
                    </Button>

                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&::before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <Link to="/my-account" className="w-full block">
                        <MenuItem
                          onClick={handleClose}
                          className="flex gap-2"
                          style={{ paddingTop: "8px", paddingBottom: "8px" }}
                        >
                          <FaRegUser className="text-[18px]" />{" "}
                          <span className="text-[14px]">My Account</span>
                        </MenuItem>
                      </Link>
                      <Link to="/address" className="w-full block">
                        <MenuItem
                          onClick={handleClose}
                          className="flex gap-2"
                          style={{ paddingTop: "8px", paddingBottom: "8px" }}
                        >
                          <CiLocationOn className="text-[18px]" />
                          <span className="text-[14px]"> Address </span>
                        </MenuItem>
                      </Link>
                      <Link to="/my-orders" className="w-full block">
                        <MenuItem
                          onClick={handleClose}
                          className="flex gap-2"
                          style={{ paddingTop: "8px", paddingBottom: "8px" }}
                        >
                          <IoBagCheckOutline className="text-[18px]" />
                          <span className="text-[14px]"> Orders</span>
                        </MenuItem>
                      </Link>
                      <Link to="/my-list" className="w-full block">
                        <MenuItem
                          onClick={handleClose}
                          className="flex gap-2"
                          style={{ paddingTop: "8px", paddingBottom: "8px" }}
                        >
                          <FiHeart className="text-[18px]" />
                          <span className="text-[14px]"> My List</span>
                        </MenuItem>
                      </Link>

                      <MenuItem
                        onClick={logout}
                        className="flex gap-2"
                        style={{ paddingTop: "8px", paddingBottom: "8px" }}
                      >
                        <IoIosLogOut className="text-[18px]" />{" "}
                        <span className="text-[14px]">Logout</span>
                      </MenuItem>
                    </Menu>
                  </li>
                }
                 
                </>
              ) : (
                <li
                  className={`list-none ${
                    context?.windowWidth <= 576
                      ? "flex flex-col items-start gap-1"
                      : "flex items-center gap-1"
                  }`}
                >
                  <Link
                    to="/login"
                    className={`link transition font-[500] ${
                      context?.windowWidth <= 576 ? "text-[14px]" : "text-[15px]"
                    }`}
                  >
                    Login
                  </Link>
                  {context?.windowWidth > 576 && <span>|</span>}
                  <Link
                    to="/register"
                    className={`link transition font-[500] ${
                      context?.windowWidth <= 576 ? "text-[14px]" : "text-[15px]"
                    }`}
                  >
                    Register
                  </Link>
                </li>
              )}

              {context?.windowWidth > 992 && (
                <li>
                  <Tooltip title="Wishlist">
                    <Link to="/my-list">
                      <IconButton aria-label="heart">
                        <StyledBadge
                          badgeContent={
                            context?.myListData?.length > 0
                              ? context?.myListData?.length
                              : 0
                          }
                          color="secondary"
                        >
                          <FiHeart />
                        </StyledBadge>
                      </IconButton>
                    </Link>
                  </Tooltip>
                </li>
              )}

              <li>
                <Tooltip title="Cart">
                  <IconButton
                    aria-label="cart"
                    onClick={() => context.setOpenCartPanel(true)}
                  >
                    <StyledBadge
                      badgeContent={
                        context?.cartData?.length > 0
                          ? context?.cartData?.length
                          : 0
                      }
                      color="secondary"
                    >
                      <PiShoppingCartLight />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Navigation isOpenCatPanel={isOpenCatPanel} setIsOpenCatPanel={setIsOpenCatPanel} />
    </header>
  );
}

export default Header;
