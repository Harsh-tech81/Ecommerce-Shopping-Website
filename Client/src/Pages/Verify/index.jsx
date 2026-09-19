import OtpBox from "../../components/OtpBox";
import { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

function Verify() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const email = localStorage.getItem("userEmail") || "";
  const actionType = localStorage.getItem("actionType");

  useEffect(() => {
    if (!email) {
      context.openAlertbox("error", "No email found. Please initiate request again.");
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsVerifying(true);

    if (actionType !== "forgot-password") {
      postData("/api/user/verifyEmail", {
        email,
        otp,
      })
        .then((res) => {
          setIsVerifying(false);
          if (res?.error === false) {
            context.openAlertbox("success", res?.message || "Email verified successfully!");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("latestOtp");
            navigate("/login");
          } else {
            context.openAlertbox("error", res?.message || "Invalid or expired OTP");
          }
        })
        .catch(() => {
          setIsVerifying(false);
          context.openAlertbox("error", "Verification failed. Please try again.");
        });
    } else {
      postData("/api/user/verify-forgot-password-otp", {
        email,
        otp,
      })
        .then((res) => {
          setIsVerifying(false);
          if (res?.error === false) {
            context.openAlertbox("success", res?.message || "OTP verified!");
            localStorage.removeItem("latestOtp");
            navigate("/forgot-password");
          } else {
            context.openAlertbox("error", res?.message || "Invalid or expired OTP");
          }
        })
        .catch(() => {
          setIsVerifying(false);
          context.openAlertbox("error", "Verification failed. Please try again.");
        });
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0 || isResending || !email) return;

    setIsResending(true);
    const endpoint = actionType === "forgot-password" ? "/api/user/forgot-password" : "/api/user/resend-otp";

    postData(endpoint, { email })
      .then((res) => {
        setIsResending(false);
        if (res?.error === false) {
          context.openAlertbox(
            "success",
            res?.message || "A new OTP has been sent! Check your inbox or spam."
          );
          setResendCooldown(30);
        } else {
          context.openAlertbox(
            "error",
            res?.message || "Failed to resend OTP. Please try again."
          );
        }
      })
      .catch(() => {
        setIsResending(false);
        context.openAlertbox("error", "Network error while resending OTP.");
      });
  };

  return (
    <section
      className="section"
      style={{ paddingTop: "36px", paddingBottom: "36px" }}
    >
      <div className="container">
        <div
          className="card shadow-md w-full max-w-[400px] rounded-md bg-white "
          style={{ margin: "auto", padding: "25px" }}
        >
          <div className="items-center flex items-center justify-center">
            <img src="/verify3.png" width="80" alt="Verify" />
          </div>
          <h3
            className="text-center text-[18px] text-black font-[600]"
            style={{ marginTop: "14px", marginBottom: "8px" }}
          >
            Verify OTP
          </h3>

          <p className="text-center text-sm text-gray-600" style={{ marginBottom: "16px" }}>
            OTP sent to{" "}
            <span className="text-[#ff5252] font-bold block mt-1">
              {email}
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
                disabled={otp.length !== 6 || isVerifying}
              >
                {isVerifying ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={18} color="inherit" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </div>
          </form>



          <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
            Didn't receive code? Please check your <b>Spam</b> or <b>Promotions</b> folder.
          </p>

          <div className="text-center mt-2">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isResending}
              className="text-xs text-[#ff5252] font-semibold hover:underline disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
            >
              {isResending ? (
                "Sending new OTP..."
              ) : resendCooldown > 0 ? (
                `Resend OTP in ${resendCooldown}s`
              ) : (
                "Resend OTP"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Verify;
