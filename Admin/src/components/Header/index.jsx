import { RiMenu2Line } from "react-icons/ri";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import {forwardRef} from "react";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import "../../../src/App.css";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import Divider from "@mui/material/Divider";
import { PiSignOut } from "react-icons/pi";
import { useContext } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import AddProduct from "../../Pages/Products/AddProduct.jsx";
import AddHomeSlide from "../../Pages/HomeSliderBanners/AddHomeSlide.jsx";
import AddCatSlide from "../../Pages/Category/AddCatSlide.jsx";
import AddSubCatSlide from "../../Pages/Category/AddSubCatSlide.jsx";
import AddAddress from "../../Pages/Address/addAdress.jsx";
import EditCategory from "../../Pages/Category/EditCategory.jsx";
import EditProduct from "../../Pages/Products/EditProduct.jsx";
import AddBlog from "../../Pages/Blog/AddBlog.jsx";
import EditBlog from "../../Pages/Blog/EditBlog.jsx";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Header() {
  const navigate = useNavigate();

  const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const open = Boolean(anchorMyAcc);
  const handleClick = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorMyAcc(null);
  };

  const context = useContext(MyContext);

  const logout = () => {
    setAnchorMyAcc(null);
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

  return (
    <>
      <header
        className="w-full h-[auto] py-2 bg-[#fff] shadow-md flex items-center justify-between transition-all pr-7"
        style={{
          paddingLeft: context.isExpandSidebar
            ? context.windowWidth < 992
              ? "50%"
              : "18%"
            : "1.25rem",
        }}
      >
        <div className="part1">
          <Button
            className="w-10! h-10! rounded-full! min-w-10! text-[rgba(0,0,0,0.8)]!"
            onClick={() => context.setIsExpandSidebar(!context.isExpandSidebar)}
          >
            <RiMenu2Line
              className="text-[22px]"
              style={{ color: "rgba(0,0,0,0.8)" }}
            />
          </Button>
        </div>

        <div className="part2 w-[40%] flex items-center justify-end gap-5">
   

          {context.isLogin ? (
            <div className="relative">
              <div
                className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer "
                onClick={handleClick}
              >
                <img
                  src={context?.userDetails?.avatar || "/profile.png"}
                  className="w-full h-full object-cover"
                />
              </div>

              <Menu
                anchorEl={anchorMyAcc}
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
                <MenuItem onClick={handleClose} className="!bg-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer ">
                      <img
                        src={context?.userDetails?.avatar || "/profile.png"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="info">
                      <h3 className="text-[15px] font-[500] leading-5">
                        {context?.userDetails?.name}
                      </h3>
                      <p className="text-[12px] font-[400] opacity-70">
                        {context?.userDetails?.email}
                      </p>
                    </div>
                  </div>
                </MenuItem>

                <Divider />
                <Link to="/profile">
                  <MenuItem
                    onClick={handleClose}
                    className="flex items-center gap-3"
                  >
                    <FaRegUser className="text-[16px]" />{" "}
                    <span className="text-[14px]">Profile</span>
                  </MenuItem>
                </Link>
                <MenuItem onClick={logout} className="flex items-center gap-3">
                  <PiSignOut className="text-[18px]" />{" "}
                  <span className="text-[14px]">Sign Out</span>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to="/login">
              <Button className="!rounded-full btn-sm btn-blue">Sign In</Button>
            </Link>
          )}
        </div>
      </header>
      <Dialog
        fullScreen
        open={context?.isOpenFullScreen.open}
        onClose={() =>
          context?.setIsOpenFullScreen({
            open: false,
          })
        }
       TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() =>
                context?.setIsOpenFullScreen({
                  open: false,
                })
              }
              aria-label="close"
            >
              <IoMdClose className="text-gray-800" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className="text-gray-800">
                {" "}
                {context?.isOpenFullScreen?.model}
              </span>
            </Typography>
          </Toolbar>
        </AppBar>
        {context?.isOpenFullScreen?.model === "Add Product" && <AddProduct />}
        {context?.isOpenFullScreen?.model === "Add Home Slide" && (
          <AddHomeSlide />
        )}
        {context?.isOpenFullScreen?.model === "Add New Category" && (
          <AddCatSlide />
        )}
        {context?.isOpenFullScreen?.model === "Add New Sub Category" && (
          <AddSubCatSlide />
        )}
        {context?.isOpenFullScreen?.model === "Add New Address" && (
          <AddAddress />
        )}
        {context?.isOpenFullScreen?.model === "Edit Category" && (
          <EditCategory />
        )}
            {context?.isOpenFullScreen?.model === "Edit Product" && (
          <EditProduct />
        )}
            {context?.isOpenFullScreen?.model === "Add Blog" && (
          <AddBlog />
        )}
          {context?.isOpenFullScreen?.model === "Edit Blog" && (
          <EditBlog />
        )}
      </Dialog>
    </>
  );
}

export default Header;
