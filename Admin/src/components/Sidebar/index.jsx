import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import Button from "@mui/material/Button";
import { FaRegImage } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { PiSignOut } from "react-icons/pi";
import { SiBloglovin } from "react-icons/si";
import { FaAngleDown } from "react-icons/fa";
import { Collapse } from "react-collapse";
import { useState } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const isOpenSubMenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else setSubmenuIndex(index);
  };
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const sidebarWidth = Number(context.sidebarWidth || 18);
  const expandedSidebarWidth =
    context.windowWidth < 992 ? sidebarWidth / 2 : sidebarWidth;

  const handleSidebarTransitionEnd = () => {
    if (!context.isExpandSidebar) {
      setSubmenuIndex(null);
    }
  };

  const closeSidebarOnMobile = () => {
    if (context.windowWidth < 992) {
      context.setIsExpandSidebar(false);
    }
    setSubmenuIndex(null);
  };

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

  return (
    <>
      <div
        className="sidebar fixed top-0 left-0 bg-[#fff] h-full border-r border-[rgba(0,0,0,0.1)] py-2 px-4 transition-all overflow-hidden"
        onTransitionEnd={handleSidebarTransitionEnd}
        style={{
          width: context.isExpandSidebar ? `${expandedSidebarWidth}%` : "0px",
        }}
      >
        <div className="py-2 w-full">
          <Link to="/" onClick={closeSidebarOnMobile}>
            <img src="/logo4.png" className="w-[240px] " />
          </Link>
        </div>

        <ul className="mt-4 ">
          <li>
            <Link to="/" onClick={closeSidebarOnMobile}>
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                <RxDashboard className="text-[18px]" /> <span>Dashboard</span>
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(1)}
            >
              <FaRegImage className="text-[18px]" /> <span>Home Slides</span>
              <span className=" ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`text-[17px]  transition-all ${submenuIndex === 1 ? "rotate-180" : ""}`}
                />
              </span>
            </Button>

            <Collapse isOpened={submenuIndex === 1 ? true : false}>
              <ul className="w-full">
                <li className="w-full">
                  <Link to="/homeSlider/list" onClick={closeSidebarOnMobile}>
                    <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                      <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>{" "}
                      Home Banner List
                    </Button>
                  </Link>
                </li>
                <li className="w-full">
                  <Button
                    className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3"
                    onClick={() =>
                      context.setIsOpenFullScreen({
                        open: true,
                        model: "Add Home Slide",
                      })
                    }
                  >
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                    Add Home Banner Slide
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>
          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(2)}
            >
              <TbCategory className="text-[20px]" /> <span>Category</span>
              <span className=" ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`text-[17px]  transition-all ${submenuIndex === 2 ? "rotate-180" : ""}`}
                />
              </span>
            </Button>
          </li>

          <Collapse isOpened={submenuIndex === 2 ? true : false}>
            <ul className="w-full">
              <li className="w-full">
                <Link to="/category/list" onClick={closeSidebarOnMobile}>
                  <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>{" "}
                    Category List
                  </Button>
                </Link>
              </li>
              <li className="w-full">
                <Button
                  className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3"
                  onClick={() =>
                    context.setIsOpenFullScreen({
                      open: true,
                      model: "Add New Category",
                    })
                  }
                >
                  <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                  Add Category
                </Button>
              </li>
              <li className="w-full">
                <Link to="/subcategory/list" onClick={closeSidebarOnMobile}>
                  <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                    Sub Category List
                  </Button>
                </Link>
              </li>
              <li className="w-full">
                <Button
                  className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3"
                  onClick={() =>
                    context.setIsOpenFullScreen({
                      open: true,
                      model: "Add New Sub Category",
                    })
                  }
                >
                  <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                  Add Sub Category
                </Button>
              </li>
            </ul>
          </Collapse>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(3)}
            >
              <RiProductHuntLine className="text-[20px]" />{" "}
              <span>Products</span>
              <span className=" ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`text-[17px]  transition-all ${submenuIndex === 3 ? "rotate-180" : ""}`}
                />
              </span>
            </Button>
          </li>

          <Collapse isOpened={submenuIndex === 3 ? true : false}>
            <ul className="w-full">
              <li className="w-full">
                <Link to="/products" onClick={closeSidebarOnMobile}>
                  <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>{" "}
                    Product List
                  </Button>
                </Link>
              </li>
              <li className="w-full">
                <Button
                  className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3"
                  onClick={() =>
                    context.setIsOpenFullScreen({
                      open: true,
                      model: "Add Product",
                    })
                  }
                >
                  <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                  Product Upload
                </Button>
              </li>
            </ul>
          </Collapse>
          <li>
            <Link to="/users" onClick={closeSidebarOnMobile}>
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                <FiUsers className="text-[18px]" /> <span>Users</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/orders" onClick={closeSidebarOnMobile}>
              <Button className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                <IoBagCheckOutline className="text-[20px]" />{" "}
                <span>Orders</span>
              </Button>
            </Link>
          </li>

          <Collapse isOpened={submenuIndex === 4 ? true : false}>
            <ul className="w-full">
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                  <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>{" "}
                  Home Banners List
                </Button>
              </li>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                  <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                  Add Home Banner
                </Button>
              </li>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                  <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                  Home Banner List 2
                </Button>
              </li>
              <li className="w-full">
                <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                  <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                  Add Banner
                </Button>
              </li>
            </ul>
          </Collapse>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => isOpenSubMenu(5)}
            >
              <SiBloglovin className="text-[17px]" /> <span>Blogs</span>
              <span className=" ml-auto w-[30px] h-[30px] flex items-center justify-center">
                <FaAngleDown
                  className={`text-[17px]  transition-all ${submenuIndex === 5 ? "rotate-180" : ""}`}
                />
              </span>
            </Button>
          </li>
          <Collapse isOpened={submenuIndex === 5 ? true : false}>
            <ul className="w-full">
              <li className="w-full">
                <Link to="/blog/list" onClick={closeSidebarOnMobile}>
                  <Button className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3">
                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>{" "}
                    Blog List
                  </Button>
                </Link>
              </li>
              <li className="w-full">
                <Button
                  className="!text-[rgba(0,0,0,0.7)] !capitalize !justify-start !w-full !text-[13px] !font-[500] !pl-9 items-center !py-2 hover:!bg-[#f1f1f1] flex gap-3"
                  onClick={() =>
                    context.setIsOpenFullScreen({
                      open: true,
                      model: "Add Blog",
                    })
                  }
                >
                  <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)] "></span>
                  Add Blog
                </Button>
              </li>
            </ul>
          </Collapse>

          <li>
            <Button
              className="w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
              onClick={() => {
                setSubmenuIndex(null);
                logout();
              }}
            >
              <PiSignOut className="text-[20px]" /> <span>Logout</span>
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
