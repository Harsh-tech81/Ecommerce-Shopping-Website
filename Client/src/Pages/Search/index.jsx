import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { IoGridSharp } from "react-icons/io5";
import ProductItem from "../../components/ProductItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useContext, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import ProductLoading from "../../components/ProductLoading";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useSearchParams, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

function SearchPage() {
  const [itemView, setItemView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z");

  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortBy = (name, order, products, value) => {
    setSelectedSortVal(value);
    setAnchorEl(null);
    if (!products || products.length === 0) return;

    postData(`/api/product/sortBy`, {
      sortBy: name,
      order: order,
      products: products,
    }).then((res) => {
      if (res?.products) {
        setProductData(res.products);
      }
    });
  };

  const fetchSearchResults = (queryStr, pageNum = 1) => {
    if (!queryStr) {
      // If no query parameter in URL, check context.searchData
      if (context?.searchData?.product && context.searchData.product.length > 0) {
        setProductData(context.searchData.product);
        setTotalCount(context.searchData.total || context.searchData.product.length);
        setTotalPages(context.searchData.totalPages || 1);
      } else {
        setProductData([]);
        setTotalCount(0);
        setTotalPages(1);
      }
      return;
    }

    setIsLoading(true);
    postData("/api/product/search/get", {
      query: queryStr,
      page: pageNum,
      limit: 12,
    })
      .then((res) => {
        setIsLoading(false);
        if (res?.success && Array.isArray(res?.product)) {
          setProductData(res.product);
          setTotalCount(res.total || res.product.length);
          setTotalPages(res.totalPages || Math.ceil((res.total || res.product.length) / 12) || 1);
        } else {
          setProductData([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setProductData([]);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
    fetchSearchResults(queryParam, 1);
  }, [queryParam]);

  // Also sync if context.searchData changes
  useEffect(() => {
    if (!queryParam && context?.searchData?.product) {
      setProductData(context.searchData.product);
      setTotalCount(context.searchData.total || context.searchData.product.length);
      setTotalPages(context.searchData.totalPages || 1);
    }
  }, [context?.searchData]);

  const handlePageChange = (e, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchSearchResults(queryParam, value);
  };

  return (
    <section style={{ paddingTop: "20px", paddingBottom: "40px" }} className="min-h-[70vh]">
      <div className="container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="/"
            className="link transition text-[13px]"
          >
            Home
          </Link>
          <span className="text-[13px] text-gray-500">Search Results</span>
          {queryParam && (
            <span className="text-[13px] font-semibold text-[#ff5252]">"{queryParam}"</span>
          )}
        </Breadcrumbs>
      </div>

      <div className="container" style={{ marginTop: "16px" }}>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-3 mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Button
                className={`!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !text-[#000] ${
                  itemView === "grid" ? "!bg-white shadow-sm !text-[#ff5252]" : ""
                }`}
                onClick={() => setItemView("grid")}
              >
                <IoGridSharp className="text-[18px]" />
              </Button>

              <span className="text-[13px] sm:text-[14px] font-[500] text-gray-600">
                {queryParam ? (
                  <>
                    Results for <strong className="text-gray-900">"{queryParam}"</strong>
                    <span className="text-gray-400 ml-1">({totalCount} items)</span>
                  </>
                ) : (
                  <span>Showing {productData.length} products</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[12px] sm:text-[13px] font-[500] text-gray-500 hidden sm:inline">
                Sort By:
              </span>

              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="!text-[12px] !bg-white !text-[#000] !capitalize !font-[600] !rounded-md !px-3 !py-1.5 shadow-sm border border-gray-200"
              >
                {selectedSortVal}
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    elevation: 3,
                    sx: { borderRadius: "8px", minWidth: 160 },
                  },
                }}
              >
                <MenuItem
                  onClick={() => handleSortBy("name", "asc", productData, "Name, A to Z")}
                  className="!text-[13px] !text-[#000] !capitalize"
                >
                  Name, A to Z
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortBy("name", "desc", productData, "Name, Z to A")}
                  className="!text-[13px] !text-[#000] !capitalize"
                >
                  Name, Z to A
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortBy("price", "asc", productData, "Price, Low to High")}
                  className="!text-[13px] !text-[#000] !capitalize"
                >
                  Price, Low to High
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortBy("price", "desc", productData, "Price, High to Low")}
                  className="!text-[13px] !text-[#000] !capitalize"
                >
                  Price, High to Low
                </MenuItem>
              </Menu>
            </div>
          </div>

          {/* Content / Product Grid */}
          {isLoading ? (
            <div className="py-12">
              <ProductLoading view={itemView} />
            </div>
          ) : productData && productData.length > 0 ? (
            <>
              <div
                className="grid gap-3 sm:gap-4"
                style={{
                  gridTemplateColumns:
                    itemView === "grid"
                      ? context?.windowWidth <= 640
                        ? "repeat(2, 1fr)"
                        : context?.windowWidth <= 1024
                        ? "repeat(3, 1fr)"
                        : "repeat(5, 1fr)"
                      : "1fr",
                }}
              >
                {productData.map((item, index) => (
                  <ProductItem key={item._id || index} item={item} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-8">
                  <Pagination
                    showFirstButton
                    showLastButton
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4 text-[#ff5252]">
                <IoSearchOutline size={40} />
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-semibold text-gray-800 mb-2">
                No matching products found
              </h3>
              <p className="text-gray-500 text-[14px] max-w-[360px] mb-6">
                We couldn't find any products matching "{queryParam}". Try checking for spelling errors or using more general terms.
              </p>
              <Button
                onClick={() => navigate("/products")}
                className="btn-org !px-6 !py-2.5 !rounded-full"
              >
                Explore All Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchPage;

