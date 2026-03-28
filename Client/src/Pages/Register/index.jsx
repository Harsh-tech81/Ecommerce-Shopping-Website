import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { postData } from "../../utils/api.js";
import { MyContext } from "../../App";
import { useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../../src/firebase.jsx";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function Register() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    name: "",
    password: "",
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
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
  
  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.name === "") {
      context.openAlertbox("error", "Please enter full name");
      return false;
    }

    if (formFields.email === "") {
      context.openAlertbox("error", "Please enter email");
      return false;
    }

    if (formFields.password === "") {
      context.openAlertbox("error", "Please enter password");
      return false;
    }

    postData("/api/user/register", formFields)
      .then((res) => {

        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertbox("success", res?.message);
          localStorage.setItem("userEmail", formFields.email);
          localStorage.removeItem("actionType");
          setFormFields({
            email: "",
            name: "",
            password: "",
          });

          navigate("/verify");
        } else {
          context.openAlertbox("error", res?.message);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        context.openAlertbox("error", "User registration failed");
      });
  };
useEffect(() => {
window.scrollTo(0, 0);
},[]);
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
            Register with a new account
          </h3>
          <form
            className="w-full"
            style={{ marginTop: "30px" }}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="form-group w-full" style={{ marginBottom: "16px" }}>
              <TextField
                type="text"
                id="name"
                label="Full Name "
                value={formFields.name}
                disabled={isLoading ? true : false}
                onChange={handleChange}
                name="name"
                variant="outlined"
                className="w-full"
                autoComplete="off"
              />
            </div>
            <div className="form-group w-full" style={{ marginBottom: "16px" }}>
              <TextField
                type="email"
                id="email"
                label="Email "
                value={formFields.email}
                name="email"
                disabled={isLoading ? true : false}
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
                name="password"
                disabled={isLoading ? true : false}
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
            <div
              className="flex items-center w-full"
              style={{ marginTop: "14px", marginBottom: "14px" }}
            >
              <Button
                className="btn-org w-full btn-lg flex gap-3"
                type="submit"
                disabled={!valideValue}
              >
                {isLoading ? <CircularProgress color="inherit" /> : "Register"}
              </Button>
            </div>

            <p className="text-center">
              Already have an account?
              <Link
                to="/login"
                className="link cursor-pointer text-[14px] font-[600] text-[#ff5252]"
              >
                Login
              </Link>
            </p>

            <p className="text-center font-[500] ">
              Or continue with social account
            </p>
            <Button
              type="button"
              className="flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black"
              onClick={SignWithGoogle}
            >
              <FcGoogle className="text-[20px]" />
              SIGN UP with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
