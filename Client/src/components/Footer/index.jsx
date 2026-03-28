import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturn } from "react-icons/pi";
import { BsWallet2 } from "react-icons/bs";
import { LiaGiftSolid } from "react-icons/lia";
import { BiSupport } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaFacebookF } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import Drawer from "@mui/material/Drawer";
import CartPanel from "../CartPanel";
import { useContext, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../App";
import ProductDetailsComponent from "../ProductDetails";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ProductZoom from "../ProductZoom";
import AddAddress from "../../Pages/MyAccount/addAddress";

function Footer() {
  const context = useContext(MyContext);
  const location = useLocation();
  const { setOpenCartPanel } = context;

  useEffect(() => {
    setOpenCartPanel(false);
  }, [location.pathname, setOpenCartPanel]);

  return (
    <>
      <footer
        style={{ paddingTop: "16px", paddingBottom: "16px" }}
        className="bg-[#fafafa]"
      >
        <div className="container">
          <div
            className={`flex ${!context?.isLarge ? "flex-col gap-4" : "items-center justify-center gap-2"}`}
            style={{ 
              paddingBottom: context?.isLarge ? "76px" : "30px", 
              paddingTop: context?.isLarge ? "76px" : "30px" 
            }}
          >
            <div className={`col flex items-center justify-center flex-col group ${context?.isLarge ? "w-[20%]" : "w-full"}`}>
              <LiaShippingFastSolid className={`${context?.isLarge ? "text-[40px]" : "text-[32px]"} transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1`} />
              <h3
                className={`${context?.isLarge ? "text-[16xl]" : "text-[14px]"} font-[600]`}
                style={{ marginTop: "5px", marginBottom: "4px" }}
              >
                Free Shipping
              </h3>
              <p className={`${context?.isLarge ? "text-[12px]" : "text-[11px]"} font-[500]`}>
                For all Orders Over &#8377;100
              </p>
            </div>
            <div className={`col flex items-center justify-center flex-col group ${context?.isLarge ? "w-[20%]" : "w-full"}`}>
              <PiKeyReturn className={`${context?.isLarge ? "text-[40px]" : "text-[32px]"} transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1`} />
              <h3
                className={`${context?.isLarge ? "text-[16xl]" : "text-[14px]"} font-[600]`}
                style={{ marginTop: "5px", marginBottom: "4px" }}
              >
                30 Days Returns
              </h3>
              <p className={`${context?.isLarge ? "text-[12px]" : "text-[11px]"} font-[500]`}>For an Exchange Product</p>
            </div>
            <div className={`col flex items-center justify-center flex-col group ${context?.isLarge ? "w-[20%]" : "w-full"}`}>
              <BsWallet2 className={`${context?.isLarge ? "text-[40px]" : "text-[32px]"} transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1`} />
              <h3
                className={`${context?.isLarge ? "text-[16xl]" : "text-[14px]"} font-[600]`}
                style={{ marginTop: "5px", marginBottom: "4px" }}
              >
                Secured Payment
              </h3>
              <p className={`${context?.isLarge ? "text-[12px]" : "text-[11px]"} font-[500]`}>Payment Cards Accepted</p>
            </div>
            <div className={`col flex items-center justify-center flex-col group ${context?.isLarge ? "w-[20%]" : "w-full"}`}>
              <LiaGiftSolid className={`${context?.isLarge ? "text-[40px]" : "text-[32px]"} transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1`} />
              <h3
                className={`${context?.isLarge ? "text-[16xl]" : "text-[14px]"} font-[600]`}
                style={{ marginTop: "5px", marginBottom: "4px" }}
              >
                Special Gifts
              </h3>
              <p className={`${context?.isLarge ? "text-[12px]" : "text-[11px]"} font-[500]`}>Special Gifts</p>
            </div>
            <div className={`col flex items-center justify-center flex-col group ${context?.isLarge ? "w-[20%]" : "w-full"}`}>
              <BiSupport className={`${context?.isLarge ? "text-[40px]" : "text-[32px]"} transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1`} />
              <h3
                className={`${context?.isLarge ? "text-[16xl]" : "text-[14px]"} font-[600]`}
                style={{ marginTop: "5px", marginBottom: "4px" }}
              >
                Support 24/7
              </h3>
              <p className={`${context?.isLarge ? "text-[12px]" : "text-[11px]"} font-[500]`}>Contact us Anytime</p>
            </div>
          </div>

          <br />
          <hr className="border-t border-t border-[rgba(0,0,0,0.2)]" />

          <div
            className={`footer flex ${!context?.isLarge ? "flex-col" : "items-center"}`}
            style={{ paddingTop: "16px", paddingBottom: "16px" }}
          >
            <div className={`part1 ${context?.isLarge ? "w-[25%] border-r border-[rgba(0,0,0,0.1)]" : "w-full border-b border-[rgba(0,0,0,0.1)] pb-4 mb-4"}`}>
              <h2
                className={`${context?.isLarge ? "text-[18px]" : "text-[16px]"} font-[600]`}
                style={{ marginBottom: "12px", marginTop: context?.isLarge ? "20px" : "0px" }}
              >
                Contact Us
              </h2>
              <p
                className={`${context?.isLarge ? "text-[13px]" : "text-[12px]"} font-[400]`}
                style={{ paddingBottom: "14px" }}
              >
                E-Store - Mega Super Store <br />
                Patna,Bihar,India
              </p>

              <Link
                className={`link ${context?.isLarge ? "text-[13px]" : "text-[12px]"}`}
                to="mailto:sales@estoredelivery.com"
              >
                sales@estoredelivery.com
              </Link>
              <span
                className={`${context?.isLarge ? "text-[22px]" : "text-[18px]"} font-[600] block w-full text-[#ff5252]`}
                style={{ marginTop: "12px", marginBottom: "12px" }}
              >
                (+91) 9876-543-210
              </span>

              <div className="flex items-center gap-2">
                <IoChatboxOutline className={`${context?.isLarge ? "text-[40px]" : "text-[32px]"} text-[#ff5252]`} />
                <span className={`${context?.isLarge ? "text-[16px]" : "text-[14px]"} font-[600]`}>
                  Online Chat <br />
                  Get Expert Help
                </span>
              </div>
            </div>

            <div
              className={`part2 flex ${!context?.isLarge ? "flex-col w-full mt-4" : "w-[40%]"}`}
              style={{ paddingLeft: context?.isLarge ? "35px" : "0px" }}
            >
              <div className={`part2_col1 ${context?.isLarge ? "w-[50%]" : "w-full mb-4"}`}>
                <h2
                  className={`${context?.isLarge ? "text-[18px]" : "text-[16px]"} font-[600]`}
                  style={{ marginBottom: "14px" }}
                >
                  Products
                </h2>
                <ul className="list">
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Prices Drop
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      New Products
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Best Sales
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Contact Us
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Sitemap
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Stores
                    </Link>
                  </li>
                </ul>
              </div>

              <div className={`part2_col2 ${context?.isLarge ? "w-[50%]" : "w-full"}`}>
                <h2
                  className={`${context?.isLarge ? "text-[18px]" : "text-[16px]"} font-[600]`}
                  style={{ marginBottom: "14px" }}
                >
                  Our Company
                </h2>
                <ul className="list">
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Delivery
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Legal Notice
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Terms And Conditions of Use
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      About Us
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Secure Payment
                    </Link>
                  </li>
                  <li
                    className={`${context?.isLarge ? "text-[14px]" : "text-[13px]"} list-none w-full`}
                    style={{ marginBottom: "6px" }}
                  >
                    <Link to="/" className="link">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className={`part3 flex flex-col ${context?.isLarge ? "w-[35%]" : "w-full mt-4"}`}
              style={{ 
                paddingLeft: context?.isLarge ? "120px" : "0px", 
                paddingRight: context?.isLarge ? "30px" : "0px" 
              }}
            >
              <h2
                className={`${context?.isLarge ? "text-[18px]" : "text-[16px]"} font-[600]`}
                style={{ marginBottom: "15px", marginTop: context?.isLarge ? "34px" : "0px" }}
              >
                Subscribe to newsletter
              </h2>
              <p className={`${context?.isLarge ? "text-[13px]" : "text-[12px]"}`}>
                Subscribe to our latest newsletter to get news about special
                discounts.
              </p>
              <form className="" style={{ marginTop: "15px" }}>
                <input
                  type="email"
                  className={`w-full border outline-none rounded-sm focus:border-[rgba(0,0,0,0.3)]`}
                  placeholder="Your Email Address"
                  style={{
                    height: context?.isLarge ? "45px" : "40px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    marginBottom: "10px",
                  }}
                />

                <Button className="btn-org">SUBSCRIBE</Button>
                <FormControlLabel
                  style={{ marginTop: "4px", whiteSpace: "nowrap", fontSize: context?.isLarge ? "14px" : "12px" }}
                  control={<Checkbox />}
                  label="I agree to the terms and conditions and the privacy policy"
                />
              </form>
            </div>
          </div>
        </div>
      </footer>

      <div
        className="bottomStrip border-t border-[rgba(0,0,0,0.2)] bg-white"
        style={{ paddingTop: "12px", paddingBottom: "12px" }}
      >
        <div className={`container flex ${!context?.isLarge ? "flex-col gap-4" : "items-center justify-between"}`}>
          <ul className={`flex items-center ${context?.isLarge ? "gap-2" : "gap-2 justify-center"}`}>
            <li className="list-none">
              <Link
                to="/"
                target="_blank"
                className={`${context?.isLarge ? "w-[35px] h-[35px]" : "w-[30px] h-[30px]"} rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group text-[#3b5998] hover:bg-[#ff5252] transition-all`}
              >
                <FaFacebookF className={`${context?.isLarge ? "text-[18px]" : "text-[14px]"} group-hover:text-white`} />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to="/"
                target="_blank"
                className={`${context?.isLarge ? "w-[35px] h-[35px]" : "w-[30px] h-[30px]"} rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group text-[#3b5998] hover:bg-[#ff5252] transition-all`}
              >
                <AiOutlineYoutube className={`${context?.isLarge ? "text-[18px]" : "text-[14px]"} group-hover:text-white`} />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to="/"
                target="_blank"
                className={`${context?.isLarge ? "w-[35px] h-[35px]" : "w-[30px] h-[30px]"} rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group text-[#3b5998] hover:bg-[#ff5252] transition-all`}
              >
                <FaPinterestP className={`${context?.isLarge ? "text-[18px]" : "text-[14px]"} group-hover:text-white`} />
              </Link>
            </li>
            <li className="list-none">
              <Link
                to="/"
                target="_blank"
                className={`${context?.isLarge ? "w-[35px] h-[35px]" : "w-[30px] h-[30px]"} rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center group text-[#3b5998] hover:bg-[#ff5252] transition-all`}
              >
                <FaInstagram className={`${context?.isLarge ? "text-[18px]" : "text-[14px]"} group-hover:text-white`} />
              </Link>
            </li>
          </ul>

          <div className="flex flex-col items-center">
            <p
              className={`${context?.isLarge ? "text-[13px]" : "text-[12px]"} text-center`}
              style={{ marginBottom: "1px" }}
            >
              &copy; 2026 - Ecommerce Website
            </p>
            <p
              className={`${context?.isLarge ? "text-[13px]" : "text-[12px]"} text-center`}
              style={{ marginTop: "1px" }}
            >
              Made With &#x2764;&#xFE0F; By Harsh Kumar
            </p>
          </div>

          <div className={`flex items-center ${!context?.isLarge ? "justify-center gap-2" : "gap-2"}`} >
            <img src="/f1.png" className={`${context?.isLarge ? "h-[20px]" : "h-[20px]"}`} />
            <img src="/f2.png" className={`${context?.isLarge ? "h-[20px]" : "h-[20px]"}`} />
            <img src="/f3.png" className={`${context?.isLarge ? "h-[20px]" : "h-[20px]"}`} />
            <img src="/f4.png" className={`${context?.isLarge ? "h-[20px]" : "h-[20px]"}`} />
            <img src="/f5.png" className={`${context?.isLarge ? "h-[20px]" : "h-[20px]"}`} />
          </div>
      {context?.windowWidth <= 992 && <><br /><br /></>} 
        </div>
      </div>

      {/* Cart Panel */}

      <Drawer
        open={context.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor="right"
        className="cartPanel"
      >
        <div
          className="flex justify-between items-center gap-3 border-b border-[rgba(0,0,0,0.2)]"
          style={{
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingRight: "20px",
            paddingLeft: "20px",
          }}
        >
          <h4>
            Shopping Cart (
            {context?.cartData?.length > 0 ? context?.cartData?.length : 0}
            ){" "}
          </h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={context.toggleCartPanel(false)}
          />
        </div>
        {context?.cartData?.length !== 0 ? (
          <CartPanel data={context?.cartData} />
        ) : (
          <div
            className="flex items-center justify-center flex-col gap-5"
            style={{ paddingTop: "170px" }}
          >
            <img src="/empty-cart.png" alt="Empty Cart" className="w-[160px]" />
            <h4 className="text-lg font-semibold">
              Your Cart is currently empty.
            </h4>
            <Button
              className="btn-org btn-sm"
              onClick={context.toggleCartPanel(false)}
            >
              Continue Shopping{" "}
            </Button>
          </div>
        )}
      </Drawer>

      {/* Address Pannel */}
      <Drawer
        open={context.openAddressPanel}
        onClose={context.toggleAddressPanel(false)}
        anchor="right"
        className="addressPanel"
      >
        <div
          className="flex justify-between items-center gap-3 border-b border-[rgba(0,0,0,0.2)]"
          style={{
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingRight: "20px",
            paddingLeft: "20px",
          }}
        >
          <h4>{context?.addressMode === "edit" ? "Edit" : "Add"} Delivery Address</h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={context?.toggleAddressPanel(false)}
          />
        </div>

        <AddAddress />
      </Drawer>

      <Dialog
        open={context?.openProductDetail?.open}
        onClose={context?.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={context?.fullWidth}
        maxWidth={context?.maxWidth}
        className="productDetailsModal"
      >
        <DialogContent>
          <div className="flex items-center w-full productDetailsModalContainer relative">
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[0px] right-[0px] !bg-[#f1f1f1]"
              onClick={context?.handleClose}
            >
              <IoCloseSharp className="text-[20px]" />
            </Button>
            {context?.openProductDetail?.item?.length !== 0 && (
              <>
                <div className="col1 w-[40%]">
                  <ProductZoom
                    images={context?.openProductDetail?.item?.images}
                  />
                </div>

                <div
                  className="col2 w-[60%] productContent"
                  style={{
                    paddingRight: "25px",
                    paddingLeft: "60px",
                    paddingBottom: "10px",
                    paddingTop: "10px",
                  }}
                >
                  <ProductDetailsComponent
                    item={context?.openProductDetail?.item}
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Footer;
