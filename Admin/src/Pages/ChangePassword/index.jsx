import Button from "@mui/material/Button";
import { Link, NavLink } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api.js";

function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    email: localStorage.getItem("userEmail"),
    newPassword: "",
    confirmPassword: "",
  });

  const valideValue = Object.values(formFields).every((el) => el);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.newPassword === "") {
      context.openAlertbox("error", "Please enter new password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword === "") {
      context.openAlertbox("error", "Please enter confirm password");
      setIsLoading(false);
      return false;
    }

    if (formFields.newPassword !== formFields.confirmPassword) {
      context.openAlertbox(
        "error",
        "NewPassword and ConfirmPassword not match",
      );
      setIsLoading(false);
      return false;
    }

    postData("/api/user/change-password", formFields).then((res) => {
      if (res?.error === false) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
        setIsLoading(false);
        context.openAlertbox("success", res?.message);
        navigate("/login");
      } else {
        setIsLoading(false);
        context.openAlertbox("error", res?.message);
      }
    });
  };

  return (
    <section className="bg-white w-full">
      <header className="w-full static lg:fixed top-0 left-0 px-4 py-3 flex items-center justify-center sm:justify-between z-50"> 
        <Link to="/">
          <img src="/logo5.png" className="!w-[200px]"/>
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
          Welcome Back! <br /> You can change your password from here
        </h1>

        <br />

        <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">New Password</h4>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formFields.newPassword}
                disabled={isLoading ? true : false}
                onChange={handleChange}
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

          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Confirm Password</h4>
            <div className="relative w-full">
              <input
                type={showPassword2 ? "text" : "password"}
                name="confirmPassword"
                value={formFields.confirmPassword}
                onChange={handleChange}
                disabled={isLoading ? true : false}
                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus : border-[rgba(0,0,0,0.7)] focus : outline-none px-3"
              />
              <Button
                className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? (
                  <FaRegEyeSlash className="text-[18px]" />
                ) : (
                  <FaRegEye className="text-[18px]" />
                )}
              </Button>
            </div>
          </div>

          <Button
            className="btn-blue w-full btn-lg"
            type="submit"
            disabled={!valideValue}
          >
            {isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default ChangePassword;
