import { Button } from "@mui/material";
import { IoHomeOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { LuHeart } from "react-icons/lu";
import { BsBagCheck } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";

function MobileNav() {
  return (
    <div
      className="mobileNav bg-white w-full grid grid-cols-4 fixed bottom-0 left-0 place-items-center gap-5 z-[51]"
      style={{ padding: "10px", paddingLeft: "12px", paddingRight: "12px" }}
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <Button className="mobile-nav-btn flex-col !w-[40px] !min-w-[40px] !capitalize text-gray-700">
          <IoHomeOutline size={18} />
          <span className="text-[12px]">Home</span>
        </Button>
      </NavLink>

      <NavLink
        to="/my-list"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <Button className="mobile-nav-btn flex-col !w-[40px] !min-w-[40px] !capitalize text-gray-700">
          <LuHeart size={18} />
          <span className="text-[12px]">Wishlist</span>
        </Button>
      </NavLink>
      <NavLink
        to="/my-orders"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <Button className="mobile-nav-btn flex-col !w-[40px] !min-w-[40px] !capitalize text-gray-700">
          <BsBagCheck size={18} />
          <span className="text-[12px]">Orders</span>
        </Button>
      </NavLink>
      <NavLink
        to="/my-account"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <Button className="mobile-nav-btn flex-col !w-[40px] !min-w-[40px] !capitalize text-gray-700">
          <FiUser size={18} />
          <span className="text-[12px]">Account</span>
        </Button>
      </NavLink>
    </div>
  );
}

export default MobileNav;
