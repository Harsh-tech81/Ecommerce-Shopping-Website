import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api.js";

function ForgotPassword() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowPassword2, setIsShowPassword2] = useState(false);
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
    <section
      className="section "
      style={{ paddingTop: "16px", paddingBottom: "16px" }}
    >
      <div className="container">
        <div
          className="card shadow-md w-[400px] rounded-md bg-white "
          style={{ margin: "auto", padding: "20px" }}
        >
          <h3 className="text-center text-[20px] text-black">Reset Form</h3>
          <form
            className="w-full"
            style={{ marginTop: "30px" }}
            onSubmit={handleSubmit}
          >
            <div
              className="form-group w-full relative"
              style={{ marginBottom: "16px" }}
            >
              <TextField
                type={isShowPassword ? "text" : "password"}
                id="password"
                label="New Password"
                variant="outlined"
                className="w-full"
                name="newPassword"
                value={formFields.newPassword}
                onChange={handleChange}
                disabled={isLoading ? true : false}
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
              className="form-group w-full relative"
              style={{ marginBottom: "16px" }}
            >
              <TextField
                type={isShowPassword2 ? "text" : "password"}
                id="confirm_password"
                label="Confirm Password"
                variant="outlined"
                className="w-full"
                name="confirmPassword"
                value={formFields.confirmPassword}
                onChange={handleChange}
                disabled={isLoading ? true : false}
              />

              <Button
                type="button"
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                onClick={() => setIsShowPassword2(!isShowPassword2)}
              >
                {isShowPassword2 ? (
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
              <div
                className="flex items-center w-full"
                style={{ marginTop: "14px", marginBottom: "14px" }}
              >
                <Button
                  className="btn-org w-full btn-lg flex gap-3"
                  type="submit"
                  disabled={!valideValue}
                >
                  {isLoading ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
  
}

export default ForgotPassword;
