import Button from "@mui/material/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { LoadingButton } from "@mui/lab";
import { FaRegEye } from "react-icons/fa";
import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FcGoogle } from "react-icons/fc";
import { useContext } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { postData } from "../../utils/api.js";
import { useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase.jsx";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const valideValue = Object.values(formFields).every((el) => el);

  useEffect(() => {
    setFormFields({ email: "", password: "" });
  }, []);

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

  const forgotPassword = () => {
    if (formFields.email === "") {
      context.openAlertbox("error", "Please enter email");
      return false;
    } else {
      context.openAlertbox("success", `OTP send to ${formFields.email}`);
      localStorage.setItem("userEmail", formFields.email);
      localStorage.setItem("actionType", "forgot-password");

      postData("/api/user/forgot-password", {
        email: formFields.email,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertbox("success", "Check your mail");
          navigate("/verify-account");
        } else {
          context.openAlertbox("error", res?.message);
        }
      });
    }
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

  const handleClickGoogle = () => {
    setLoading(true);

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const fields = {
          name: user?.providerData[0]?.displayName,
          email: user?.providerData[0]?.email,
          role: "USER",
          password: null,
          avatar: "",
          mobile: user?.providerData[0]?.phoneNumber,
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
          if (res?.error !== true) {
            context.openAlertbox("success", "Login Successful");
            localStorage.setItem("accessToken", res?.data?.accessToken);
            localStorage.setItem("refreshToken", res?.data?.refreshToken);
            context.setIsLogin(true);
            localStorage.removeItem("actionType");
            navigate("/");
          } else {
            context.openAlertbox("error", res?.message);
          }
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        context.openAlertbox("error", "Google sign-in failed");
        setLoading(false);
      });
  };

  return (
    <section className="bg-white w-full">
      <header className="w-full static lg:fixed top-0 left-0 px-4 py-3 flex items-center justify-center sm:justify-between z-50">
        <Link to="/">
          <img src="/logo5.png" className="!w-[200px] " />
        </Link>

        <div className="hidden sm:flex items-center gap-0">
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

      <div className="loginBox card w-full md:w-[600px] h-[auto] pb-27 mx-auto pt-5 lg:pt-20 relative z-50 ">
        <div className="text-center">
          <img src="/icon.svg" className="m-auto" />
        </div>

        <h1 className="text-center text-[18px] sm:text-[35px] font-[800] mt-4 ">
          Welcome Back! <br /> Sign in with your credentials.
        </h1>

        <div className="flex items-center w-full mt-5 justify-center gap-4">
          <LoadingButton
            size="small"
            onClick={handleClickGoogle}
            loading={loading}
            loadingPosition="end"
            endIcon={<FcGoogle />}
            variant="outlined"
            className="!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)] "
          >
            Signin with Google
          </LoadingButton>
        </div>

        <br />
        <div className="w-full flex items-center justify-center gap-3">
          <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
          <span className="text-[10px] lg:text-[14px] font-[500]">
            Or, Sign in with your email
          </span>
          <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
        </div>

        <br />
        <form
          className="w-full px-8 mt-3"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Email</h4>
            <input
              type="email"
              value={formFields.email}
              disabled={isLoading ? true : false}
              name="email"
              onChange={handleChange}
              autoComplete="off"
              className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus : border-[rgba(0,0,0,0.7)] focus : outline-none px-3"
            />
          </div>
          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Password</h4>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={formFields.password}
                disabled={isLoading ? true : false}
                name="password"
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus : border-[rgba(0,0,0,0.7)] focus : outline-none px-3"
              />
              <Button
                className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaRegEyeSlash className="text-[18px]" />
                ) : (
                  <FaRegEye className="text-[18px]" />
                )}
              </Button>
            </div>
          </div>
          <div className="form-group mb-4 w-full flex items-center justify-between">
            <FormControlLabel
              className=""
              control={<Checkbox defaultChecked />}
              label="Remember Me"
            />

            <Link
              onClick={forgotPassword}
              className="text-[#3872fa] font-[700] text-[15px] hover:underline hover:text-gray-700 cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px]"> Don't have an account? </span>
            <Link
              to='/sign-up'
              className="text-[#3872fa] font-[700] text-[15px] hover:underline hover:text-gray-700 cursor-pointer"
            >
             Sign Up
            </Link>
          </div>

          <Button
            className="btn-blue w-full btn-lg"
            type="submit"
            disabled={!valideValue}
          >
            {isLoading ? <CircularProgress color="inherit" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default Login;
