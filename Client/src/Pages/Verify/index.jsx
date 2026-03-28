import OtpBox from "../../components/OtpBox";
import {  useState } from "react";
import Button from "@mui/material/Button";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../App";

function Verify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const verifyOtp = (e) => {
    e.preventDefault();

const actionType = localStorage.getItem("actionType");

if(actionType!=="forgot-password"){
    postData("/api/user/verifyEmail", {
      email: localStorage.getItem("userEmail"),
      otp,
    }).then((res) => {
      if (res?.error === false) {
        context.openAlertbox("success", res?.message);
        localStorage.removeItem("userEmail");
        navigate("/login");
      } else {
        context.openAlertbox("error", res?.message);
      }
    });
}else{
 postData("/api/user/verify-forgot-password-otp", {
      email: localStorage.getItem("userEmail"),
      otp,
    }).then((res) => {
      if (res?.error === false) {
        context.openAlertbox("success", res?.message);
        navigate("/forgot-password");
      } else {
        context.openAlertbox("error", res?.message);
      }
    });
}

  };

  return (
    <section
      className="section"
      style={{ paddingTop: "36px", paddingBottom: "36px" }}
    >
      <div className="container">
        <div
          className="card shadow-md w-[400px] rounded-md bg-white "
          style={{ margin: "auto", padding: "25px" }}
        >
          <div className="items-center flex items-center justify-center">
            <img src="/verify3.png" width="80" />
          </div>
          <h3
            className="text-center text-[18px] text-black"
            style={{ marginTop: "14px", marginBottom: "14px" }}
          >
            Verify OTP
          </h3>

          <p className="text-center" style={{ marginBottom: "13px" }}>
            OTP send to{" "}
            <span className="text-[#ff5252] font-bold">
              {localStorage.getItem("userEmail")}
            </span>
          </p>

          <form onSubmit={verifyOtp}>
            <OtpBox length={6} onChange={handleOtpChange} />
            <div
              className="flex items-center justify-center"
              style={{ marginTop: "25px", padding: "6px 0px" }}
            >
              <Button
                type="submit"
                className="btn-org w-full btn-lg"
                disabled={otp.length !== 6}
              >
                Verify OTP
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Verify;
