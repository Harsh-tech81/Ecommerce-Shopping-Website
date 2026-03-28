import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./Pages/Home";
import "./responsive.css";
import "./index.css";
import ProductListing from "./Pages/ProductListing";
import ProductDetails from "./Pages/ProductDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CartPage from "./Pages/Cart";
import Verify from "./Pages/Verify";
import toast, { Toaster } from "react-hot-toast";
import Checkout from "./Pages/Checkout";
import MyAccount from "./Pages/MyAccount";
import MyList from "./Pages/MyList";
import Orders from "./Pages/Orders";
import { useEffect } from "react";
import { fetchDataFromApi, postData } from "./utils/api";
import Address from "./Pages/MyAccount/address";
import ForgotPassword from "./Pages/ForgotPassword";
import Success from "./Pages/Orders/success";
import Failed from "./Pages/Orders/failed";
import SearchPage from "./Pages/Search";
const MyContext = createContext();

function App() {
  const [openProductDetail, setOpenProductDetail] = useState({
    open: false,
    item: {},
  });
  const [maxWidth, setMaxWidth] = useState("lg");
  const [fullWidth, setFullWidth] = useState(true);
  const [catData, setCatData] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openAddressPanel, setOpenAddressPanel] = useState(false);
  const [address, setAddress] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [myListData, setMyListData] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [searchData, setSearchData] = useState([]);
   const [isLarge, setIsLarge] = useState(window.innerWidth >= 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

const [addressMode, setAddressMode] = useState("add");  
  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };
  const toggleAddressPanel = (newOpen) => () => {
    if(newOpen === false){
      setAddressMode("add");
    }
    setOpenAddressPanel(newOpen);
  };
  const handleOpenProductDetailModel = (status, item) => {
    setOpenProductDetail({ open: status, item: item });
  };
  const handleClose = () => {
    setOpenProductDetail({ open: false, item: {} });
  };

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.error === false) {
        setCatData(res?.data);
      }
    });

   const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsLarge(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };



  }, []);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== "" && token !== null && token !== undefined) {
      setIsLogin(true);

      getCartData();
      getMyListData();
      getUserDetails();
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

  const addToCart = (product, userId, quantity) => {
    if (userId === null || userId === undefined) {
      openAlertbox("error", "Please login to add item to cart");
      return;
    }
    const data = {
      productTitle: product?.name,
      productId: product?._id,
      userId,
      price: product?.price,
      oldPrice: product?.oldPrice,
      countInStock: product?.countInStock,
      subTotal: parseInt(product?.price * quantity),
      quantity: quantity,
      rating: product?.rating,
      image: product?.image,
      brand: product?.brand,
      discount: product?.discount,
      size: product?.size,
      ram: product?.ram,
      weight: product?.weight,
    };
    postData("/api/cart/add", data).then((res) => {
      if (res?.error === false) {
        openAlertbox("success", res?.message);
        getCartData();
      } else {
        openAlertbox("error", res?.message);
      }
    });
  };

  const getCartData = () => {
    fetchDataFromApi("/api/cart/get").then((res) => {
      if (res?.error === false) {
        setCartData(res?.data);
      }
    });
  };

  const getMyListData = () => {
    fetchDataFromApi("/api/mylist/").then((res) => {
      if (res?.error === false) {
        setMyListData(res?.data);
      }
    });
  };

  const getUserDetails = () => {
    fetchDataFromApi(`/api/user/user-details`).then((res) => {
      setUserDetails(res.data);
      if (res?.response?.data?.error === true || res?.name === "AxiosError") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        openAlertbox("error", "Your session is expired. Please login again");
        setIsLogin(false);
      }
    });
  };
const editAddress = (id)=>{
  setAddressId(id);
}
  const values = {
    setOpenProductDetail,
    handleClose,
    setOpenCartPanel,
    handleOpenProductDetailModel,
    openCartPanel,
    toggleCartPanel,
    openProductDetail,
    maxWidth,
    setMaxWidth,
    fullWidth,
    setFullWidth,
    openAlertbox,
    isLogin,
    userDetails,
    setUserDetails,
    addToCart,
    addressMode,
    setAddressMode,
    setIsLogin,
    address,
    setAddress,
    setCatData,
    catData,
    cartData,
    setCartData,
    getCartData,
    myListData,
    getMyListData,
    setMyListData,
    toggleAddressPanel,
    openAddressPanel,
    setOpenAddressPanel,
    getUserDetails,
    editAddress,
    addressId,
    setAddressId,
    setSearchData,
    searchData,
    windowWidth,
    isLarge
  };

  return (
    <>
      <Router>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path={"/"} exact={true} element={<Home />} />
            <Route
              path={`/products`}
              exact={true}
              element={<ProductListing />}
            />
            <Route path={"/my-account"} exact={true} element={<MyAccount />} />
            <Route path={"/my-list"} exact={true} element={<MyList />} />
            <Route path={"/checkout"} exact={true} element={<Checkout />} />
            <Route
              path={"/product/:id"}
              exact={true}
              element={<ProductDetails />}
            />
            <Route path={"/verify"} exact={true} element={<Verify />} />
            <Route path={"/my-orders"} exact={true} element={<Orders />} />
            <Route path={"/cart"} exact={true} element={<CartPage />} />
            <Route path={"/login"} exact={true} element={<Login />} />
            <Route path={"/register"} exact={true} element={<Register />} />
            <Route path={"/address"} exact={true} element={<Address />} />
            <Route path={"/order/success"} exact={true} element={<Success />} />
            <Route path={"/order/failed"} exact={true} element={<Failed />} />
             <Route path={"/search"} exact={true} element={<SearchPage />} />
            <Route
              path={"/forgot-password"}
              exact={true}
              element={<ForgotPassword />}
            />
          </Routes>
          <Footer />
        </MyContext.Provider>
      </Router>

      <Toaster />
    </>
  );
}

export default App;
export { MyContext };
