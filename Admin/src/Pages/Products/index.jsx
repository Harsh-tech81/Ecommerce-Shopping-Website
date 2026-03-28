import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
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
import { FaRegEye } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { MyContext } from "../../App";
import Rating from "@mui/material/Rating";
import {
  fetchDataFromApi,
  deleteData,
} from "../../utils/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from "@mui/material/CircularProgress";

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

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function Products() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [productData, setProductData] = useState([]);
  const [productCat, setProductCat] = useState("");
  const [productCatSub, setProductCatSub] = useState("");
  const [productCatThird, setProductCatThird] = useState("");
  const [sortedIds, setSortedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const isMobile = (context?.windowWidth || window.innerWidth) < 768;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      getProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, [context?.isOpenFullScreen]);

  const handleCheckboxChange = (e, id) => {
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
    deleteData(`/api/product/${id}`).then(() => {
      getProducts();
      context.openAlertbox("success", "Product Deleted Successfully");
    });
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

  const paginatedProducts = productData
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    ?.reverse();

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-0 mt-1">
        <h2 className="text-[20px] font-[600]">
          Products <span className="font-[400] text-[14px]"></span>
        </h2>

   
      </div>

      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="flex flex-wrap items-start w-full px-4 sm:px-5 justify-start gap-3 sm:gap-5">
          <div className="w-full sm:w-[48%] lg:w-[15%]">
            <h4 className="font-[600] text-[13px] mb-2 mt-4">Category By</h4>
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

          <div className="w-full sm:w-[48%] lg:w-[15%]">
            <h4 className="font-[600] text-[13px] mb-2 mt-4">
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

          <div className="w-full sm:w-[48%] lg:w-[15%]">
            <h4 className="font-[600] text-[13px] mb-2 mt-4">
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
        {isMobile ? (
          <div className="px-3 pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-[600]">Products</span>
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
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center w-full min-h-[220px]">
                <CircularProgress color="inherit" />
              </div>
            ) : paginatedProducts?.length ? (
              <div className="flex flex-col gap-3">
                {paginatedProducts.map((product, index) => (
                  <div
                    key={product?._id || index}
                    className="border border-[rgba(0,0,0,0.1)] rounded-xl p-3"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        {...label}
                        size="small"
                        checked={product.checked === true}
                        onChange={(e) => handleCheckboxChange(e, product._id)}
                      />
                      <div className="img w-[60px] h-[60px] rounded-md overflow-hidden group shrink-0">
                        <Link to={`/product/${product?._id}`} data-discover="true">
                          <LazyLoadImage
                            alt={"image"}
                            effect="blur"
                            src={product?.images[0]}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-[600] text-[13px] leading-4 hover:text-[#3872fa] line-clamp-2">
                          <Link to={`/product/${product?._id}`} data-discover="true">
                            {product?.name}
                          </Link>
                        </h3>
                        <span className="text-[12px] text-[rgba(0,0,0,0.7)]">{product?.brand}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-[12px]">
                      <div>
                        <span className="font-[600]">Category:</span> {product?.catName}
                      </div>
                      <div>
                        <span className="font-[600]">Sub Cat:</span> {product?.subCat}
                      </div>
                      <div>
                        <span className="font-[600]">Stock:</span> {product?.countInStock}
                      </div>
                      <div className="flex items-center">
                        <Rating
                          name="half-rating"
                          size="small"
                          defaultValue={product?.rating || 0}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1 flex-col">
                        <span className="oldPrice line-through text-gray-500 text-[12px] font-[500]">
                          ₹{product?.oldPrice?.toFixed(2)}
                        </span>
                        <span className="price text-[14px] font-[600] text-[#3872fa]">
                          ₹{product?.price?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TooltipW title="Edit" placement="top">
                          <Button
                            className="!w-[32px] !h-[32px] bg-[#f1f1f1] !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[32px]"
                            onClick={() =>
                              context.setIsOpenFullScreen({
                                open: true,
                                model: "Edit Product",
                                id: product?._id,
                              })
                            }
                          >
                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                          </Button>
                        </TooltipW>
                        <TooltipW title="View" placement="top">
                          <Link to={`/product/${product?._id}`}>
                            <Button className="!w-[32px] !h-[32px] bg-[#f1f1f1] !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[32px]">
                              <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[16px]" />
                            </Button>
                          </Link>
                        </TooltipW>
                        <TooltipW title="Delete" placement="top">
                          <Button
                            className="!w-[32px] !h-[32px] bg-[#f1f1f1] !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[32px]"
                            onClick={() => deleteProduct(product?._id)}
                          >
                            <GoTrash className="text-[rgba(0,0,0,0.7)] text-[16px]" />
                          </Button>
                        </TooltipW>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[13px] text-[rgba(0,0,0,0.6)] py-8">
                No products found.
              </div>
            )}
          </div>
        ) : (
          <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
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
                  paginatedProducts?.length !== 0 &&
                  paginatedProducts?.map((product, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell style={{ minWidth: columns.minWidth }}>
                          <Checkbox
                            {...label}
                            size="small"
                            checked={product.checked === true ? true : false}
                            onChange={(e) =>
                              handleCheckboxChange(e, product._id)
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
                              ₹{product?.oldPrice?.toFixed(2)}
                            </span>
                            <span className="price text-[14px] font-[600] text-[#3872fa]">
                              ₹{product?.price?.toFixed(2)}
                            </span>
                          </div>
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
        )}
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
    </>
  );
}

export default Products;
