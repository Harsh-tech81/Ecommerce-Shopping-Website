import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import { useContext } from "react";
import { MyContext } from "../../App";
import { deleteData } from "../../utils/api";

function MyListItems(props) {
  const context = useContext(MyContext);
  const removeItem = (id) => {
    deleteData(`/api/myList/${id}`).then((res) => {
      if (res?.error === false) {
        context?.openAlertbox("success", res?.message);
        context?.getMyListData();
      }
    });
  };

  return (
    <div
      className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)]"
      style={{ padding: "10px", paddingBottom: "10px" }}
    >
      <div className="img overflow-hidden rounded-lg" style={{ width: context?.isLarge ? "15%" : "25%", height: "130px" }}>
        <Link to={`/product/${props.item?.productId}`} className="group">
          <img
            src={props.item?.image}
            className="w-full group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      <div className="info relative" style={{ width: context?.isLarge ? "85%" : "75%" }}>
        <IoCloseSharp
          className="cursor-pointer absolute top-[0px] right-[0px] text-[22px] link transition-all"
          onClick={() => removeItem(props?.item?._id)}
        />
        <span className="text-[11px]">{props.item?.brand}</span>
        <h3 className="text-[16px]">
          <Link
            to={`/product/${props.item?.productId}`}
            className="link cursor-pointer"
          >
            {props.item?.productTitle?.substr(0, 80) + "..."}
          </Link>
        </h3>

        <Rating
          name="size-small"
          defaultValue={props.item?.rating || 0}
          size="small"
          readOnly
        />

        <div
          className="flex items-center gap-3"
          style={{ marginTop: "10px", marginBottom: "6px" }}
        >
          <span className="price text-[14px] font-[600] text-[#000]">
            {props.item?.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </span>
          <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
            &#8377;
            {props.item?.oldPrice?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </span>
          <span className="price text-[14px] font-[600] text-[#ff5252]">
            {props.item?.discount || 0}% OFF
          </span>
        </div>
      </div>
    </div>
  );
}

export default MyListItems;
