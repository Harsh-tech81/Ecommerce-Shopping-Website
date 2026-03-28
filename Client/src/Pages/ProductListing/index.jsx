import Sidebar from "../../components/Sidebar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { IoGridSharp } from "react-icons/io5";
import ProductItem from "../../components/ProductItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useContext } from "react";
import Pagination from "@mui/material/Pagination";
import ProductLoading from "../../components/ProductLoading";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";

function ProductListing() {
  const [itemView, setItemView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z");
  const context = useContext(MyContext);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSortBy = (name, order, products, value) => {
    setSelectedSortVal(value);
    postData(`/api/product/sortBy`, {
      sortBy: name,
      order: order,
      products: products,
    }).then((res) => {
      setProductData(res?.products);
      setAnchorEl(null);
    });
  };

  return (
    <section style={{ paddingTop: "0px", paddingBottom: "0px" }}>
      

      <div className="bg-white " style={{ padding: "15px", marginTop: "16px" }}>
        <div className="container flex gap-3" style={{ flexDirection: context?.isLarge ? "row" : "column" }}>
          {context?.windowWidth > 992 && (
            <div className="sidebarWrapper bg-white" style={{ width: context?.isLarge ? "20%" : "100%" }}>
              <Sidebar
                productData={productData}
                setProductData={setProductData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
              />
            </div>
          )}

          <div
            className="rightContent"
            style={{ width: context?.isLarge ? "80%" : "100%", paddingTop: "10px", paddingBottom: "10px" }}
          >
            <div
              className="flex items-center justify-between rounded-md bg-[#f1f1f1] w-full sticky top-[130px] z-[99]"
              style={{ padding: "10px 15px", marginBottom: "16px", flexDirection: context?.isLarge ? "row" : "column", gap: context?.isLarge ? "0px" : "10px" }}
            >
              <div className="col1 flex items-center itemViewActions">
            
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                    itemView === "grid" && "active"
                  }`}
                  onClick={() => setItemView("grid")}
                >
                  <IoGridSharp className="text-[rgba(0,0,0,0.8)]" />
                </Button>

                <span
                  className="text-[14px] font-[500] text-[rgba(0,0,0,0.7)]"
                  style={{ paddingLeft: "20px" }}
                >
                  There are {productData?.length || 0} products.
                </span> 
              </div>

              <div
                className="col2 flex items-center justify-end gap-3 "
                style={{ marginLeft: context?.isLarge ? "auto" : "0", paddingRight: "12px" }}
              >
                <span
                  className="text-[14px] font-[500] text-[rgba(0,0,0,0.7)]"
                  style={{ paddingLeft: "20px" }}
                >
                  Sort By
                </span>

                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!text-[12px]  !bg-white !text-[#000] !capitalize !font-[600]"
                  style={{ padding: "6px 29px" }}
                >
                  {selectedSortVal}
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() =>
                      handleSortBy("name", "asc", productData, "Name, A to Z")
                    }
                    className="!text-[13px] !text-[#000] !capitalize "
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy("name", "desc", productData, "Name, Z to A")
                    }
                    className="!text-[13px] !text-[#000] !capitalize "
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy(
                        "price",
                        "asc",
                        productData,
                        "Price, Low to High",
                      )
                    }
                    className="!text-[13px] !text-[#000] !capitalize "
                  >
                    Price, Low to High
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy(
                        "price",
                        "desc",
                        productData,
                        "Price, High to Low",
                      )
                    }
                    className="!text-[13px] !text-[#000] !capitalize "
                  >
                    Price, High to Low
                  </MenuItem>
                </Menu>
              </div>
            </div>

            <div
              className={`grid gap-4`}
              style={{ gridTemplateColumns: itemView === "grid" ? (context?.isLarge ? "repeat(5, 1fr)" : "repeat(2, 1fr)") : "1fr" }}
            >
              {itemView === "grid" && (
                <>
                  {isLoading ? (
                    <ProductLoading view={itemView} />
                  ) : (
                    productData?.length !== 0 &&
                    productData?.map((item, index) => {
                      return <ProductItem key={index} item={item} />;
                    })
                  )}
                </>
              ) }
            </div>
            {totalPages > 1 && (
              <div
                className="flex items-center justify-center "
                style={{ marginTop: "16px" }}
              >
                <Pagination
                  showFirstButton
                  showLastButton
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductListing;
