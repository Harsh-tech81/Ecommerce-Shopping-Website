import Button from "@mui/material/Button";
import { Link, NavLink } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import OtpBox from "../../components/OtpBox";
import { useState } from "react";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

function VerifyAccount() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);

    const actionType = localStorage.getItem("actionType");

    if (actionType !== "forgot-password") {
      postData("/api/user/verifyEmail", {
        email: localStorage.getItem("userEmail"),
        otp,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertbox("success", res?.message);
          localStorage.removeItem("userEmail");
          setLoading(false);
          navigate("/login");
        } else {
          context.openAlertbox("error", res?.message);
          setLoading(false);
        }
      });
    } else {
      postData("/api/user/verify-forgot-password-otp", {
        email: localStorage.getItem("userEmail"),
        otp,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertbox("success", res?.message);
          setLoading(false);
          navigate("/change-password");
        } else {
          context.openAlertbox("error", res?.message);
          setLoading(false);
        }
      });
    }
  };

  return (
    <section className="bg-white w-full h-[100vh]">
      <header className="w-full static lg:fixed top-0 left-0 px-4 py-3 flex items-center justify-center sm:justify-between z-50"> 
        <Link to="/">
          <img src="/logo5.png" className="!w-[200px] " />
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          <NavLink to="/login" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <CgLogIn className="text-[18px]" /> Login
            </Button>
          </NavLink>

          <NavLink to="/sign-up" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <FaRegUser className="text-[15px]" /> Sign Up
            </Button>
          </NavLink>
        </div>
      </header>

      <img
        src="/loginbg.webp"
        className="w-full fixed top-0 left-0 opacity-5"
      />

      <div className="loginBox card w-full md:w-[600px] h-[auto] pb-27 px-3 mx-auto pt-5 lg:pt-20 relative z-50 ">
        <div className="text-center">
          <img src="/verify3.png" className="w-[100px] m-auto" />
        </div>

        <h1 className="text-center text-[18px] sm:text-[35px] font-[800] mt-4 ">
          Welcome Back! <br /> Please Verify Your Email
        </h1>

        <br />

        <p className="text-center text-[15px]">
          OTP send to &nbsp;
          <span className="text-[#5858df] font-bold text-[12px] sm:text-[14px]">
            {localStorage.getItem("userEmail")}
          </span>
        </p>

        <br />

        <form onSubmit={verifyOtp}>
          <div className="text-center flex items-center justify-center flex-col ">
            <OtpBox length={6} onChange={handleOtpChange} />
          </div>

          <br />
          <div className="w-[300px] m-auto">
            <Button
              type="submit"
              className="btn-blue w-full"
              disabled={otp.length !== 6}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default VerifyAccount;
