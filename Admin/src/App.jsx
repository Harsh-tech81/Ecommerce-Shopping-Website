import './App.css';
import './responsive.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { createContext } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Products from "./Pages/Products";
import toast, { Toaster } from "react-hot-toast";
import HomeSliderBanners from "./Pages/HomeSliderBanners";
import CategoryList from "./Pages/Category";
import SubCategoryList from "./Pages/Category/SubCategoryList";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import VerifyAccount from "./Pages/VerifyAccount";
import ChangePassword from "./Pages/ChangePassword";
import { useEffect } from "react";
import { fetchDataFromApi } from "./utils/api";
import Profile from "./Pages/Profile";
import ProductDetails from "./Pages/Products/productDetails";
import BlogList from "./Pages/Blog";
const MyContext = createContext();

function App() {
  const [isExpandSidebar, setIsExpandSidebar] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [sidebarWidth,setSidebarWidth]=useState('18');
  const [isOpenFullScreen, setIsOpenFullScreen] = useState({
    open: false,
    model: "",
    id: "",
  });
  const isMobileSidebarOpen = windowWidth < 992 && isExpandSidebar;
  const contentRightMobileClass = isMobileSidebarOpen
    ? "opacity-0 pointer-events-none"
    : "opacity-100";

const getCat=()=>{
 fetchDataFromApi("/api/category").then((res) => {
      setCatData(res?.data);
    });
}

  useEffect(() => {
   getCat();
   const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

useEffect(() => {
    if (windowWidth < 992) {
      setIsExpandSidebar(false);
      setSidebarWidth(100)
    } else{
      setSidebarWidth(18)
    }
  }, [windowWidth]);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
  }, [isMobileSidebarOpen]);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== "" && token !== null && token !== undefined) {
      setIsLogin(true);
      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        setUserDetails(res.data);
        if (res?.response?.data?.error === true) {
          if (res?.response?.data?.message === "You have not logged in") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            openAlertbox("error", "You session is expired Please login again");
            setIsLogin(false);
            navigate("/login");
          }
        }
      });
    } else {
      setIsLogin(false);
    }


  }, [isLogin]);

  const openAlertbox = (status, msg) => {
    if (status === "success") {
      toast.success(msg);
    }
    if (status === "error") {
      toast.error(msg);
    }
  };

  const values = {
    isExpandSidebar,
    setIsExpandSidebar,
    isLogin,
    setIsLogin,
    isOpenFullScreen,
    setIsOpenFullScreen,
    userDetails,
    setUserDetails,
    openAlertbox,
    address,
    setAddress,
    catData,
    setCatData,
    getCat,
    windowWidth,
    setWindowWidth,
    sidebarWidth,
    setSidebarWidth
  };

  const router = createBrowserRouter([
    {
      path: "/",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper transition-all ${isExpandSidebar === true ? "opacity-100" : "opacity-0"}`}
                style={{
                  width: isExpandSidebar
                    ? `${windowWidth < 992 ? sidebarWidth / 2 : sidebarWidth}%`
                    : "0px",
                }}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 transition-all ${contentRightMobileClass}`}
                style={{ width: isExpandSidebar ? `${100 - sidebarWidth}%` : "100%" }}
              >
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/profile",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <Profile />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/login",
      exact: true,
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/change-password",
      exact: true,
      element: (
        <>
          <ChangePassword />
        </>
      ),
    },
    {
      path: "/sign-up",
      exact: true,
      element: (
        <>
          <SignUp />
        </>
      ),
    },
    {
      path: "/products",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <Products />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/homeSlider/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <HomeSliderBanners />
              </div>
            </div>
          </section>
        </>
      ),
    },
     {
      path: "/blog/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <BlogList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <CategoryList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/subcategory/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <SubCategoryList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/users",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <Users />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/orders",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <Orders />
              </div>
            </div>
          </section>
        </>
      ),
    },
        {
      path: "/product/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden
                   sidebarWrapper ${isExpandSidebar === true ? "w-[18%]" : "w-[0px] opacity-0"} transition-all `}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight px-5 py-4 ${isExpandSidebar === true ? "w-[82%]" : "w-[100%]"} ${contentRightMobileClass} transition-all `}
              >
                {" "}
                <ProductDetails />
              </div>
            </div>
          </section>
        </>
      ),
    },
  
    {
      path: "/verify-account",
      exact: true,
      element: (
        <>
          <VerifyAccount />
        </>
      ),
    },

  ]);

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />

   

        <Toaster />
      </MyContext.Provider>
    </>
  );
}

export default App;
export { MyContext };
