import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccountSidebar from "../../components/AccountSidebar";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { editData, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { Collapse } from "react-collapse";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

function MyAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changePassword, setChangePassword] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token === null) {
      navigate("/");
    }
  }, [context?.isLogin]);

  const valideValue = Object.values(formFields).every((el) => el);
  const valideValue2 = Object.values(changePassword).every((el) => el);

  useEffect(() => {
    if (
      context?.userDetails?._id !== "" &&
      context?.userDetails?._id !== undefined &&
      context?.userDetails?._id !== null
    ) {
      setUserId(context?.userDetails?._id);
      setFormFields({
        name: context?.userDetails?.name,
        email: context?.userDetails?.email,
        mobile: context?.userDetails?.mobile,
      });
      const ph = `${context?.userDetails?.mobile}`;
      setPhone(ph);
      setChangePassword({
        email: context?.userDetails?.email,
      });
    }
  }, [context?.userDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.email === "") {
      context.openAlertbox("error", "Please enter email");
      return false;
    }

    if (formFields.name === "") {
      context.openAlertbox("error", "Please enter fullname");
      return false;
    }

    if (formFields.mobile === "") {
      context.openAlertbox("error", "Please enter mobile");
      return false;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then(
      (res) => {

        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertbox("success", res?.data?.message);
        } else {
          context.openAlertbox("error", res?.data?.message);
          setIsLoading(false);
        }
      },
    );
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (changePassword.newPassword === "") {
      context.openAlertbox("error", "Please enter new password");
      return false;
    }

    if (changePassword.confirmPassword === "") {
      context.openAlertbox("error", "Please enter confirm password");
      return false;
    }

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      context.openAlertbox(
        "error",
        "New password and confirm password does not match",
      );
      setIsLoading2(false);
      return false;
    }

    postData("/api/user/change-password", changePassword, {
      withCredentials: true,
    }).then((res) => {
      if (res?.error !== true) {
        setIsLoading2(false);
        context.openAlertbox("success", res?.message);
      } else {
        context.openAlertbox("error", res?.message);
        setIsLoading2(false);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });

    setChangePassword(() => {
      return {
        ...changePassword,
        [name]: value,
      };
    });
  };

  return (
    <section
      className="w-full"
      style={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      <div className="container flex flex-col lg:flex-row gap-5" >

          <div className="col1">
            <AccountSidebar />
          </div>


        <div className="col2" >
          <div
            className="card bg-white shadow-md rounded-md "
            style={{ padding: "30px", marginBottom: "20px" }}
          >
            <div
              className="flex items-center"
              style={{ paddingBottom: "10px" }}
            >
              <h2 style={{ paddingBottom: "0px" }}>My Profile</h2>
              <Button
                className="!ml-auto"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                Change Password
              </Button>
            </div>
            <hr />
            <form style={{ marginTop: "35px" }} onSubmit={handleSubmit}>
              <div className="flex items-center gap-5">
                <div >
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    type="text"
                    size="small"
                    className="w-full"
                    name="name"
                    value={formFields.name}
                    disabled={isLoading ? true : false}
                    onChange={handleChange}
                  />
                </div>
                <div >
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    size="small"
                    className="w-full"
                    name="email"
                    value={formFields.email}
                    disabled={true}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div
                className="flex items-center gap-5"
                style={{ marginTop: "20px" }}
              >
                <div>
                  <PhoneInput
                    defaultCountry="in"
                    value={phone}
                    disabled={isLoading ? true : false}
                    onChange={(phone) => {
                      setPhone(phone);
                      setFormFields({
                        mobile: phone,
                      });
                    }}
                  />
                </div>
              </div>
              <br />
              <div className="flex items-center gap-4">
                <Button
                  className="btn-org btn-lg w-[160px]"
                  type="submit"
                  disabled={!valideValue}
                >
                  {isLoading ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <Collapse isOpened={showChangePassword}>
            <div
              className="card bg-white shadow-md rounded-md "
              style={{ padding: "30px" }}
            >
              <div
                className="flex items-center"
                style={{ paddingBottom: "10px" }}
              >
                <h2 style={{ paddingBottom: "10px" }}>Change Password</h2>
              </div>
              <hr />
              <form
                style={{ marginTop: "25px" }}
                onSubmit={handleChangePassword}
              >
                <div className="flex items-center gap-5" >
                  <div >
                    <TextField
                      label="New Password"
                      variant="outlined"
                      type="password"
                      size="small"
                      className="w-full"
                      name="newPassword"
                      value={changePassword.newPassword}
                      disabled={isLoading2 ? true : false}
                      onChange={handleChange}
                    />
                  </div>
                  <div >
                    <TextField
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="confirmPassword"
                      value={changePassword.confirmPassword}
                      disabled={isLoading2 ? true : false}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <br />
                <div className="flex items-center gap-4">
                  <Button
                    className="btn-org btn-lg w-[200px]"
                    type="submit"
                    disabled={!valideValue2}
                  >
                    {isLoading2 ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Collapse>
        </div>
      </div>
    </section>
  );
}

export default MyAccount;
