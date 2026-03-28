import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useState } from "react";


function QtyBox(props) {
  const [quantity, setQuantity] = useState(1);

  const plusQty = () => {
    setQuantity((prevQty) => prevQty + 1);
    props?.handleSelectQty(quantity + 1);
  };
  const minusQty = () => {
    setQuantity((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
    if (quantity > 1) {
      props?.handleSelectQty(quantity - 1);
    }
  };

  return (
    <div className="qtyBox flex items-center relative">
      <input
        type="number"
        className="w-full h-[40px] text-[15px] focus:outline-none border border-[rgba(0,0,0,0.2)] rounded-md"
        value={quantity}
        style={{ padding: "6px", paddingLeft: "12px" }}
        readOnly
      />

      <div className="flex items-center flex-col justify-between h-[40px] absolute right-0 top-0 z-50 ">
        <Button
          className="!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] !rounded-none hover:!bg-[#f1f1f1]"
          onClick={plusQty}
        >
          <FaAngleUp className="text-[14px] opacity-55" />
        </Button>
        <Button
          className="!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] !rounded-none hover:!bg-[#f1f1f1]"
          onClick={minusQty}
        >
          <FaAngleDown className="text-[14px] opacity-55" />
        </Button>
      </div>

    
    </div>
  );
}

export default QtyBox;
