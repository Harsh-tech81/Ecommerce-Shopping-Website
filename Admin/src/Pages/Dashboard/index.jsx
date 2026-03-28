import DashboardBoxes from "../../components/DashboardBoxes";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";
import Badge from "../../components/Badge";
import Rating from "@mui/material/Rating";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { useContext } from "react";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchDataFromApi,
  deleteData,
  deleteMultipleData,
} from "../../utils/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { MdKeyboardArrowDown } from "react-icons/md";
import TooltipW from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const columns = [
  { id: "product", label: "PRODUCT", minWidth: 150 },
  { id: "category", label: " CATEGORY", minWidth: 100 },
  {
    id: "subcategory",
    label: "SUB CATEGORY",
    minWidth: 150,
  },
  {
    id: "price",
    label: "PRICE",
    minWidth: 100,
  },
  {
    id: "sales",
    label: "SALES",
    minWidth: 100,
  },
  {
    id: "stock",
    label: "STOCK",
    minWidth: 80,
  },
  {
    id: "rating",
    label: "RATING",
    minWidth: 80,
  },
  {
    id: "actions",
    label: "ACTIONS",
    minWidth: 80,
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function Dashboard() {
  const [isOpenOrderIndex, setIsOpenOrderIndex] = useState(null);
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const isShowOrderedProduct = (index) => {
    if (isOpenOrderIndex === index) {
      setIsOpenOrderIndex(null);
    } else {
      setIsOpenOrderIndex(index);
    }
  };


  const [chart1Data, setChart1Data] = useState([
    { name: "JAN", TotalSales: 4000, TotalUsers: 2400, amt: 2400 },
    { name: "FEB", TotalSales: 3000, TotalUsers: 1398, amt: 2210 },
    { name: "MAR", TotalSales: 2000, TotalUsers: 9800, amt: 2290 },
    { name: "APR", TotalSales: 2780, TotalUsers: 3908, amt: 2000 },
    { name: "MAY", TotalSales: 1890, TotalUsers: 4800, amt: 2181 },
    { name: "JUN", TotalSales: 2390, TotalUsers: 3800, amt: 2500 },
    { name: "JUL", TotalSales: 3490, TotalUsers: 4300, amt: 2100 },
    { name: "AUG", TotalSales: 4000, TotalUsers: 2400, amt: 2400 },
    { name: "SEP", TotalSales: 3000, TotalUsers: 1398, amt: 2210 },
    { name: "OCT", TotalSales: 2000, TotalUsers: 9800, amt: 2290 },
    { name: "NOV", TotalSales: 2780, TotalUsers: 3908, amt: 2000 },
    { name: "DEC", TotalSales: 1890, TotalUsers: 4800, amt: 2181 },
  ]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [productData, setProductData] = useState([]);
  const [productCat, setProductCat] = useState("");
  const [orders, setOrders] = useState([]);
  const [users,setUsers] = useState([]);
  const [allReviews,setAllReviews] = useState([]);  
  const [totalOrdersData, setTotalOrdersData] = useState([]);
  const [productCatSub, setProductCatSub] = useState("");
  const [productCatThird, setProductCatThird] = useState("");
  const [sortedIds, setSortedIds] = useState([]);
  const [categoryFilterValue, setCategoryFilterValue] = useState("");


  const handleChangeCatFilter = (event) => {
    setCategoryFilterValue(event.target.value);
  };

  useEffect(() => {
    getProducts();
  }, [context?.isOpenFullScreen]);
  useEffect(() => {
    fetchDataFromApi("/api/order/order-list").then((res) => {
      if (res?.error === false) {
        setOrders(res?.data || []);
        setTotalOrdersData(res?.data || []);
      }
    });
  }, []);


  const getProducts = async () => {
    setIsLoading(true);
    fetchDataFromApi("/api/product").then((res) => {
      let productArr = [];
      if (res?.error === false) {
        for (let i = 0; i < res?.products?.length; i++) {
          productArr[i] = res?.products[i];
          productArr[i].checked = false;
        }
        setTimeout(() => {
          setProductData(productArr);
          setIsLoading(false);
        }, 300);
      }
    });
  };

  const handleCheckboxChange = (e, id, index) => {
    const updatedItems = productData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item,
    );
    setProductData(updatedItems);

    const selectedIds = updatedItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };

  const deleteProduct = (id) => {
    deleteData(`/api/product/${id}`).then((res) => {
      getProducts();
      context.openAlertbox("success", "Product Deleted Successfully");
    });
  };
  const deleteMultipleProducts = () => {
    if (sortedIds.length === 0) {
      context.openAlertbox("error", "Please select products to delete");
      return;
    }
    try {
      deleteMultipleData("/api/product/deleteMultiple", {
        data: { ids: sortedIds },
      }).then((res) => {
        getProducts();
        context.openAlertbox("success", "Products Deleted Successfully");
      });
    } catch (err) {
      context.openAlertbox(
        "error",
        "An error occurred while deleting products",
      );
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangeCat = (event) => {
    setProductCat(event.target.value);
    setProductCatSub("");
    setProductCatThird("");
    setIsLoading(true);
    fetchDataFromApi(`/api/product/getProdByCatId/${event.target.value}`).then(
      (res) => {
        if (res?.error === false) {
          setProductData(res?.products);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      },
    );
  };
  const handleChangeCatSub = (event) => {
    setProductCatSub(event.target.value);
    setProductCat("");
    setProductCatThird("");
    setIsLoading(true);
    fetchDataFromApi(
      `/api/product/getProdBySubCatId/${event.target.value}`,
    ).then((res) => {
      if (res?.error === false) {
        setProductData(res?.products);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    });
  };
  const handleChangeCatThirdLevel = (event) => {
    setProductCatThird(event.target.value);
    setProductCat("");
    setProductCatSub("");
    setIsLoading(true);
    fetchDataFromApi(
      `/api/product/getProdByThirdCatId/${event.target.value}`,
    ).then((res) => {
      if (res?.error === false) {
        setProductData(res?.products);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    });
  };
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const updatedItems = productData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProductData(updatedItems);
    if (isChecked) {
      const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

useEffect(()=>{
fetchDataFromApi("/api/user/getAllUsers").then((res)=>{
  if(res?.error === false){
    setUsers(res?.data);
  }
})
fetchDataFromApi("/api/user/getAllReviews").then((res)=>{
  if(res?.error === false){
    setAllReviews(res?.data);
  }
})
},[]);

  return (
    <>
      <div className="w-full bg-[#f1faff]  px-5 py-5 border border-[rgba(0,0,0,0.1)] flex items-center gap-8 mb-5 justify-between rounded-md">
        <div className="info">
          <h1 className="text-[28px] sm:text-[35px] font-bold leading-10 mb-3">
            Welcome, <br /> Harsh Kumar
          </h1>
          <p>
            Here’s What happening on your store today. See the statistics at
            once.
          </p>
          <br />
          <Button
            className="btn-blue !capitalize"
            onClick={() =>
              context.setIsOpenFullScreen({
                open: true,
                model: "Add Product",
              })
            }
          >
            <FaPlus /> Add Product
          </Button>
        </div>
        <img src="/adminlogo.webp" className="w-[250px] hidden lg:block" />
      </div>
      {productData?.length !== 0 &&
        users?.length !== 0 &&
        allReviews?.length !== 0 && (
          <DashboardBoxes
            orders={totalOrdersData?.length}
            products={productData?.length}
            users={users?.length}
            reviews={allReviews?.length}
            category={context?.catData?.length}
          />
        )}

        {/* <div className="col w-[35%] ml-auto flex items-center gap-3 justify-end">
          {sortedIds?.length !== 0 && (
            <Button
              className="btn-sm"
              size="small"
              variant="contained"
              color="error"
              onClick={deleteMultipleProducts}
            >
              Delete
            </Button>
          )}
        </div> */}

      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 w-full px-5 justify-start gap-4">

          <div className="col ">
            <h4 className="font-[600] text-[13px] mb-2">Category By</h4>
            {context?.catData?.length !== 0 && (
              <Select
                labelId="demo-simple-select-label"
                style={{ zoom: "80%" }}
                id="productCatDrop"
                className="w-full"
                size="small"
                value={productCat}
                label="Product Category"
                onChange={handleChangeCat}
              >
                {context?.catData?.map((cat, index) => {
                  return (
                    <MenuItem value={cat?._id} key={index}>
                      {cat?.name}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          </div>

          <div className="col">
            <h4 className="font-[600] text-[13px] mb-2">
              Sub Category By
            </h4>
            {context?.catData?.length !== 0 && (
              <Select
                labelId="demo-simple-select-label"
                id="productCatDrop"
                className="w-full"
                size="small"
                style={{ zoom: "80%" }}
                value={productCatSub}
                label="Product Sub Category"
                onChange={handleChangeCatSub}
              >
                {context?.catData?.map((cat) => {
                  return (
                    cat?.children?.length !== 0 &&
                    cat?.children?.map((subCat, index) => {
                      return (
                        <MenuItem value={subCat?._id} key={index}>
                          {subCat?.name}
                        </MenuItem>
                      );
                    })
                  );
                })}
              </Select>
            )}
          </div>

          <div className="col">
            <h4 className="font-[600] text-[13px] mb-2">
              Third Level Sub Category By
            </h4>
            {context?.catData?.length !== 0 && (
              <Select
                labelId="demo-simple-select-label"
                id="productCatDrop"
                className="w-full"
                style={{ zoom: "80%" }}
                size="small"
                value={productCatThird}
                label="Product Third Level Category"
                onChange={handleChangeCatThirdLevel}
              >
                {context?.catData?.map((cat) => {
                  return (
                    cat?.children?.length !== 0 &&
                    cat?.children?.map((subCat) => {
                      return (
                        subCat?.children?.length !== 0 &&
                        subCat?.children?.map((thirdLevelCat, index) => {
                          return (
                            <MenuItem value={thirdLevelCat?._id} key={index}>
                              {thirdLevelCat?.name}
                            </MenuItem>
                          );
                        })
                      );
                    })
                  );
                })}
              </Select>
            )}
          </div>

        </div>
        <br />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    {...label}
                    size="small"
                    onChange={handleSelectAll}
                    checked={
                      productData?.length > 0
                        ? productData.every((item) => item.checked)
                        : false
                    }
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading === false ? (
                productData?.length !== 0 &&
                productData
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.reverse()
                  ?.map((product, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <Checkbox
                            {...label}
                            size="small"
                            checked={product.checked === true ? true : false}
                            onChange={(e) =>
                              handleCheckboxChange(e, product._id, index)
                            }
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <div className="flex items-center gap-4 w-[300px]">
                            <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                              <Link
                                to={`/product/${product?._id}`}
                                data-discover="true"
                              >
                                <LazyLoadImage
                                  alt={"image"}
                                  effect="blur"
                                  src={product?.images[0]}
                                  className="w-full group-hover:scale-105 transition-all"
                                />
                              </Link>
                            </div>
                            <div className="info w-[75%] ">
                              <h3 className="font-[600] text-[12px] leading-4 hover:text-[#3872fa]">
                                <Link
                                  to={`/product/${product?._id}`}
                                  data-discover="true"
                                >
                                  {product?.name}
                                </Link>
                              </h3>
                              <span className="text-[12px]">
                                {product?.brand}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          {product?.catName}
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          {product?.subCat}
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <div className="flex gap-1 flex-col">
                            <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
                              ₹{product?.price?.toFixed(2)}
                            </span>
                            <span className="price text-[14px] font-[600] text-[#3872fa]">
                              ₹{product?.oldPrice?.toFixed(2)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <p className="text-[14px] w-[100px] whitespace-nowrap">
                            {" "}
                            <span className="font-[600]">{product?.sale} </span>
                            sale
                          </p>
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          {product?.countInStock}
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <p className="text-[14px] w-[100px]">
                            <Rating
                              name="half-rating"
                              size="small"
                              defaultValue={product?.rating || 0}
                              readOnly
                            />
                          </p>
                        </TableCell>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <div className="flex items-center gap-1">
                            <TooltipW title="Edit" placement="top">
                              <Button
                                className="!w-[35px] !h-[35px]  bg-[#f1f1f1]  !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px] "
                                onClick={() =>
                                  context.setIsOpenFullScreen({
                                    open: true,
                                    model: "Edit Product",
                                    id: product?._id,
                                  })
                                }
                              >
                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                              </Button>
                            </TooltipW>
                            <TooltipW title="View" placement="top">
                              <Link to={`/product/${product?._id}`}>
                                <Button className="!w-[35px] !h-[35px]  bg-[#f1f1f1]  !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px] ">
                                  <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                </Button>
                              </Link>
                            </TooltipW>{" "}
                            <TooltipW title="Delete" placement="top">
                              <Button
                                className="!w-[35px] !h-[35px]  bg-[#f1f1f1]  !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px] "
                                style={{ minWidth: "35px" }}
                                onClick={() => deleteProduct(product?._id)}
                              >
                                <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                              </Button>
                            </TooltipW>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <>
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <div className="flex justify-center items-center w-full min-h-[400px]">
                        <CircularProgress color="inherit" />
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={productData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Table for Recent Orders */}

      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5 flex-col sm:flex-row">
          <h2 className="text-[18px] font-[600] text-left mb-2 lg:mb-0">Recent Orders</h2>
        </div>
        <div className="relative overflow-x-auto" style={{ marginTop: "0px" }}>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50  dark:bg-gray-100 dark:text-gray-400">
              <tr>
                <th scope="col" style={{ padding: "12px 24px" }}>
                  &nbsp;
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Order Id
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Paymant Id
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Name
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Address
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  pincode
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Total Amount
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Email
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  User Id
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Order Status
                </th>
                <th
                  scope="col"
                  style={{ padding: "12px 24px" }}
                  className="whitespace-nowrap"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.length !== 0 &&
                orders?.map((order, index) => {
                  return (
                    <>
                      <tr
                        className="bg-white border-b dark:bg-white dark:border-gray-700"
                        key={index}
                      >
                        <td
                          className="font-[500]"
                          style={{ padding: "12px 15px" }}
                        >
                          <Button
                            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1] "
                            onClick={() => isShowOrderedProduct(index)}
                          >
                            {isOpenOrderIndex === index ? (
                              <IoIosArrowUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                            ) : (
                              <MdKeyboardArrowDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                            )}
                          </Button>
                        </td>
                        <td
                          className="font-[500]"
                          style={{ padding: "12px 15px" }}
                        >
                          <span className="text-[#ff5252] font-[500]">
                            {order?._id}
                          </span>
                        </td>

                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]"
                        >
                          <span className="text-[#ff5252] font-[500]">
                            {order?.paymentId
                              ? order?.paymentId
                              : "CASH ON DELIVERY"}
                          </span>
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500] whitespace-nowrap"
                        >
                          {order?.userId?.name}
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]"
                        >
                          {order?.userId?.mobile}
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]"
                        >
                          <span className="block w-[400px] font-[500]">
                            {order?.delivery_address?.address_line},{" "}
                            {order?.delivery_address?.city},{" "}
                            {order?.delivery_address?.landmark},{" "}
                            {order?.delivery_address?.country}
                          </span>
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]"
                        >
                          {order?.delivery_address?.pincode}
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]"
                        >
                          {order?.totalAmt}
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]"
                        >
                          {order?.userId?.email}
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]"
                        >
                          <span className="text-[#ff5252] font-[500]">
                            {order?.userId?._id}
                          </span>
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]"
                        >
                          <Badge status={order?.order_status} />
                        </td>
                        <td
                          style={{ padding: "15px 10px" }}
                          className="font-[500]  whitespace-nowrap"
                        >
                          {order?.createdAt?.split("T")[0]}
                        </td>
                      </tr>
                      {isOpenOrderIndex === index && (
                        <tr>
                          <td style={{ paddingLeft: "140px" }} colSpan="4">
                            <div className="relative overflow-x-auto">
                              <table className="w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 ">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50  dark:bg-gray-100 dark:text-gray-400">
                                  <tr>
                                    <th
                                      scope="col"
                                      style={{ padding: "12px 24px" }}
                                      className="whitespace-nowrap"
                                    >
                                      Product Id
                                    </th>
                                    <th
                                      scope="col"
                                      style={{ padding: "12px 24px" }}
                                      className="whitespace-nowrap"
                                    >
                                      Product Title
                                    </th>
                                    <th
                                      scope="col"
                                      style={{ padding: "12px 24px" }}
                                    >
                                      Image
                                    </th>
                                    <th
                                      scope="col"
                                      style={{ padding: "12px 24px" }}
                                    >
                                      Quantity
                                    </th>
                                    <th
                                      scope="col"
                                      style={{ padding: "12px 24px" }}
                                    >
                                      Price
                                    </th>
                                    <th
                                      scope="col"
                                      style={{ padding: "12px 24px" }}
                                    >
                                      Sub Total
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order?.products?.length > 0 &&
                                    order?.products?.map((product, index) => {
                                      return (
                                        <>
                                          <tr
                                            className="bg-white border-b dark:bg-white dark:border-gray-700"
                                            key={index}
                                          >
                                            <td
                                              className="font-[500]"
                                              style={{
                                                padding: "12px 15px",
                                              }}
                                            >
                                              <span className="text-[#ff5252] font-[500] text-gray-600">
                                                {product?._id}
                                              </span>
                                            </td>

                                            <td
                                              style={{
                                                padding: "15px 10px",
                                              }}
                                              className="font-[500]"
                                            >
                                              <span className=" font-[500]">
                                                <div className="w-[200px]">
                                                  {product?.productTitle}
                                                </div>
                                              </span>
                                            </td>
                                            <td
                                              style={{
                                                padding: "15px 10px",
                                              }}
                                              className="font-[500]"
                                            >
                                              <img
                                                src={product?.image}
                                                className="w-[40px] h-[40px] object-cover rounded-md"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                padding: "15px 10px",
                                              }}
                                              className="font-[500]"
                                            >
                                              {product?.quantity}
                                            </td>
                                            <td
                                              style={{
                                                padding: "15px 10px",
                                              }}
                                              className="font-[500]"
                                            >
                                              <span className="block w-[400px] font-[500]">
                                                {product?.price?.toLocaleString(
                                                  "en-IN",
                                                  {
                                                    style: "currency",
                                                    currency: "INR",
                                                    maximumFractionDigits: 0,
                                                  },
                                                )}
                                              </span>
                                            </td>
                                            <td
                                              style={{
                                                padding: "15px 10px",
                                              }}
                                              className="font-[500]"
                                            >
                                              {product?.subTotal?.toLocaleString(
                                                "en-IN",
                                                {
                                                  style: "currency",
                                                  currency: "INR",
                                                  maximumFractionDigits: 0,
                                                },
                                              )}
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {/* 
      <div className="card my-4 shadow-md sm:rounded-lg bg-white ">
        <div className="flex items-center justify-between px-5 py-5 pb-0">
          <h2 className="text-[18px] font-[600]">Total Users & Total Sales</h2>
        </div>

        <div className="flex items-center gap-5 px-5 py-5 pt-1">
          <span className="flex items-center gap-1 text-[15px]">
            <span className="block w-[8px] h-[8px] rounded-full bg-green-600"></span>
            Total Users
          </span>
          <span className="flex items-center gap-1 text-[15px]">
            <span className="block w-[8px] h-[8px] rounded-full bg-purple-600"></span>
            Total Sales
          </span>
        </div>

        <LineChart
          width={1000}
          height={500}
          data={chart1Data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="none" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="TotalSales"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="TotalUsers"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </div> */}
    </>
  );
}

export default Dashboard;
