import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { useState, useContext } from "react";
import { MyContext } from "../../App";
import MenuItem from "@mui/material/MenuItem";
import { HiOutlineDotsVertical } from "react-icons/hi";
function AddressBox(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const context = useContext(MyContext);
  const open = Boolean(anchorEl);
  const address = props?.address || {};
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;
  const editAddress = (id) => {
    setAnchorEl(null);
    context?.setAddressMode("edit");
    context?.setOpenAddressPanel(true);
    context?.editAddress(id);
    context?.setAddressId(id);
  };



  return (
    <div
      className="group addressBox relative  bg-[#fafafa]  rounded-md w-full  cursor-pointer border border-dashed border-[rgba(0,0,0,0.2)] "
      style={{ padding: "10px" }}
    >
      <span
        className="inline-block bg-[#f1f1f1] text-[12px] rounded-sm"
        style={{ padding: "5px" }}
      >
        {address?.addressType}
      </span>
      <h4
        className="flex items-center gap-4 text-[14px]"
        style={{ paddingTop: "10px" }}
      >
        <span>{context?.userDetails?.name}</span>
        <span>{address?.mobile}</span>
      </h4>
      <span className="text-[13px] block w-100" style={{ paddingTop: "2px" }}>
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
      <div className="absolute top-[20px] right-[20px]">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <HiOutlineDotsVertical />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            },
            list: {
              "aria-labelledby": "long-button",
            },
          }}
        >
          <MenuItem
            className="text-[14px]"
            onClick={() => editAddress(address?._id)}
          >
            Edit
          </MenuItem>

          <MenuItem
            className="text-[14px]"
            onClick={() => {
              handleClose();
              props?.handleDeleteAddress(address?._id);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default AddressBox;
