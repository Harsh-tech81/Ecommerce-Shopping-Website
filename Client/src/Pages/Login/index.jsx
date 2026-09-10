import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { postData } from "../../utils/api.js";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase.jsx";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function Login() {
  const context = useContext(MyContext);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openForgotModal, setOpenForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.email === "") {
      context.openAlertbox("error", "Please enter email");
      return false;
    }

    if (formFields.password === "") {
      context.openAlertbox("error", "Please enter password");
      return false;
    }

    postData("/api/user/login", formFields, { withCredentials: true }).then(
      (res) => {
     
        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertbox("success", res?.message);
          setFormFields({
            email: "",
            password: "",
          });
          localStorage.setItem("accessToken", res?.data?.accessToken);
          localStorage.setItem("refreshToken", res?.data?.refreshToken);
          context.setIsLogin(true);
          navigate("/");
        } else {
          context.openAlertbox("error", res?.message);
          setIsLoading(false);
        }
      },
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };
useEffect(() => {
window.scrollTo(0, 0);
},[]);
  const handleOpenForgotModal = () => {
    setForgotEmail(formFields.email || "");
    setOpenForgotModal(true);
  };

  const handleSendForgotOtp = (e) => {
    if (e) e.preventDefault();
    const targetEmail = (forgotEmail || formFields.email || "").trim();
    if (!targetEmail) {
      context.openAlertbox("error", "Please enter your registered email address");
      return;
    }

    setIsForgotLoading(true);

    postData("/api/user/forgot-password", {
      email: targetEmail,
    })
      .then((res) => {
        setIsForgotLoading(false);
        if (res?.error === false) {
          localStorage.setItem("userEmail", targetEmail);
          localStorage.setItem("actionType", "forgot-password");
          setOpenForgotModal(false);
          context.openAlertbox(
            "success",
            res?.message || "OTP sent! Please check your email inbox or spam folder."
          );
          navigate("/verify");
        } else {
          context.openAlertbox(
            "error",
            res?.message || "Failed to send OTP. Please check your email."
          );
        }
      })
      .catch((err) => {
        setIsForgotLoading(false);
        context.openAlertbox("error", "Network request failed. Please check connection.");
      });
  };

  const SignWithGoogle = () => {
    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const fields = {
          name: user?.providerData[0]?.displayName,
          email: user?.providerData[0]?.email,
          role : "USER",  
          password: null,
          avatar: user?.photoURL || user?.providerData[0]?.photoURL || "",
          mobile: user?.providerData[0]?.phoneNumber,
        };

        postData("/api/user/authWithGoogle", fields)
          .then((res) => {

            if (res?.error !== true) {
              setIsLoading(false);
              context.openAlertbox("success","Login Successful");
              localStorage.setItem("accessToken", res?.data?.accessToken);
              localStorage.setItem("refreshToken", res?.data?.refreshToken);
              context.setIsLogin(true);
              localStorage.removeItem("actionType");
              navigate("/");
            } else {
              context.openAlertbox("error", res?.message);
              setIsLoading(false);
            }
          })
          .catch(() => {
            setIsLoading(false);
            context.openAlertbox("error", "User registration failed");
          });
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        setIsLoading(false);
        context.openAlertbox("error", "Google sign-in failed");
      });
  };
  
  return (
    <section
      className="section "
      style={{ paddingTop: "16px", paddingBottom: "16px" }}
    >
      <div className="container">
        <div
          className="card shadow-md rounded-md bg-white "
          style={{ margin: "auto", padding: "20px", width: context?.isLarge ? "400px" : "100%" }}
        >
          <h3 className="text-center text-[18px] text-black">
            Login to your account
          </h3>
          <form
            className="w-full"
            style={{ marginTop: "30px" }}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="form-group w-full" style={{ marginBottom: "16px" }}>
              <TextField
                type="email"
                id="email"
                value={formFields.email}
                disabled={isLoading ? true : false}
                name="email"
                label="Email "
                variant="outlined"
                className="w-full"
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div
              className="form-group w-full relative"
              style={{ marginBottom: "16px" }}
            >
              <TextField
                type={isShowPassword ? "text" : "password"}
                id="password"
                label="Password"
                value={formFields.password}
                disabled={isLoading ? true : false}
                name="password"
                variant="outlined"
                className="w-full"
                onChange={handleChange}
                autoComplete="new-password"
              />
              <Button
                type="button"
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>
            <a
              className="link cursor-pointer text-[14px] font-[600] text-[#ff5252] hover:underline"
              onClick={handleOpenForgotModal}
            >
              Forgot Password?
            </a>
            <div
              className="flex items-center w-full"
              style={{ marginTop: "14px", marginBottom: "14px" }}
            >
              <Button
                className="btn-org w-full btn-lg flex gap-3"
                type="submit"
                disabled={!valideValue}
              >
                {isLoading ? <CircularProgress color="inherit" /> : "Login"}
              </Button>
            </div>

            <p className="text-center">
              Not Registered?{" "}
              <Link
                to="/register"
                className="link cursor-pointer text-[14px] font-[600] text-[#ff5252]"
              >
                Sign Up
              </Link>
            </p>

            <p className="text-center font-[500] ">
              Or continue with social account
            </p>
            <Button className="flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black" onClick={SignWithGoogle}>
              <FcGoogle className="text-[20px]" />
              Login with Google
            </Button>
          </form>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog
        open={openForgotModal}
        onClose={() => !isForgotLoading && setOpenForgotModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: { borderRadius: "14px", padding: "10px" },
        }}
      >
        <DialogTitle className="!font-[700] text-center !text-[20px] !text-gray-800">
          Reset Password
        </DialogTitle>
        <form onSubmit={handleSendForgotOtp}>
          <DialogContent className="!pt-1">
            <p className="text-gray-600 text-[13px] mb-4 text-center leading-relaxed">
              Enter your registered email address below. We will send you a 6-digit verification OTP.
            </p>
            <TextField
              type="email"
              label="Registered Email Address"
              fullWidth
              size="small"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              autoFocus
              placeholder="e.g. name@example.com"
              disabled={isForgotLoading}
            />
          </DialogContent>
          <DialogActions className="!px-6 !pb-4 !pt-2 flex justify-between gap-2">
            <Button
              onClick={() => setOpenForgotModal(false)}
              disabled={isForgotLoading}
              className="!text-gray-600 !capitalize"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isForgotLoading || !forgotEmail.trim()}
              className="!bg-[#ff5252] !text-white !capitalize !font-[600] !px-5"
            >
              {isForgotLoading ? (
                <div className="flex items-center gap-2 text-white">
                  <CircularProgress size={16} color="inherit" />
                  <span>Sending OTP...</span>
                </div>
              ) : (
                "Send OTP"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </section>
  );
}

export default Login;
