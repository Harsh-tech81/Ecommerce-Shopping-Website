import "../../components/Sidebar/style.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Collapse } from "react-collapse";
import { IoIosArrowDown } from "react-icons/io";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoIosArrowUp } from "react-icons/io";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useContext } from "react";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
function Sidebar(props) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    catId: [],
    subCatId: [],
    thirdsubCatId: [],
    minPrice: "",
    maxPrice: "",
    rating: "",
    page: 1,
    limit: 5,
  });
  const context = useContext(MyContext);
  const [price, setPrice] = useState([0, 200000]);
  const location = useLocation();
  const handleCheckBoxChange = (field, value) => {
    context?.setSearchData([]);
    const currentValues = filters[field] || [];
    const updatedValues = currentValues?.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    setFilters((prev) => ({ ...prev, [field]: updatedValues }));

    if (field === "catId") {
      setFilters((prev) => ({ ...prev, subCatId: [], thirdsubCatId: [] }));
    }
  };

  useEffect(() => {
    const url = window.location.href;
    const queryParameters = new URLSearchParams(location.search);
    if (url.includes("catId")) {
      const categoryId = queryParameters.get("catId");
      const catArr = [];
      catArr.push(categoryId);
      filters.catId = catArr;
      filters.subCatId = [];
      filters.thirdsubCatId = [];
      filters.rating = [];
      context?.setSearchData([]);
    }
    if (url.includes("subCatId")) {
      const subCategoryId = queryParameters.get("subCatId");
      const subCatArr = [];
      subCatArr.push(subCategoryId);
      filters.subCatId = subCatArr;
      filters.thirdsubCatId = [];
      filters.catId = [];
      filters.rating = [];
      context?.setSearchData([]);
    }
    if (url.includes("thirdLevelCatId")) {
      const thirdsubCategoryId = queryParameters.get("thirdLevelCatId");
      const thirdsubCatArr = [];
      thirdsubCatArr.push(thirdsubCategoryId);
      filters.thirdsubCatId = thirdsubCatArr;
      filters.subCatId = [];
      filters.catId = [];
      filters.rating = [];
      context?.setSearchData([]);
    }

    filters.page = 1;
    setTimeout(() => {
      filterData();
    }, 200);

// context?.setSearchData([]);
  // if (context?.searchData?.product?.length > 0) {
  //  props.setProductData(context?.searchData?.product?.slice((props.page - 1) * (Number(filters?.limit) || 5), props.page * (Number(filters?.limit) || 5)));
  //       props.setTotalPages(Math.ceil((context?.searchData?.product?.length || 0) / (Number(filters?.limit) || 5)));
  //       props.setIsLoading(false);
  //       window.scrollTo(0, 0);
  //   }
  }, [location]);

  const filterData = () => {
    props.setIsLoading(true);
  if (context?.searchData?.product?.length > 0) {
        const limit = Number(filters?.limit) || 5;
        const currentPage = Number(props?.page) || 1;
        const startIndex = (currentPage - 1) * limit;
        const endIndex = currentPage * limit;

        props.setProductData(
          context?.searchData?.product?.slice(startIndex, endIndex),
        );
        props.setTotalPages(
          Math.ceil((context?.searchData?.product?.length || 0) / limit),
        );
        props.setIsLoading(false);
        window.scrollTo(0, 0);
    } else {
      postData("/api/product/filters", filters).then((res) => {
        props.setProductData(res?.products || []);
        props.setTotalPages(res?.totalPages);
        props.setIsLoading(false);
        window.scrollTo(0, 0);
      });
    }
  };

  useEffect(() => {
    filters.page = props.page;
    filterData();
  }, [filters, props.page]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, minPrice: price[0], maxPrice: price[1] }));
  }, [price]);

  return (
    <aside
      className="sidebar sticky top-[130px] z-[50] "
      style={{ paddingTop: "16px", paddingBottom: "16px" }}
    >
      <div className="box">
        <h3
          className="w-full text-[16px] font-[600] flex items-center"
          style={{ marginBottom: "10px", paddingRight: "20px" }}
        >
          Shop By Category
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !text-[#000]"
            style={{ marginLeft: "auto" }}
          >
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpen}>
          <div
            className="scroll relative -left-[13px]"
            style={{ paddingRight: "20px", paddingLeft: "20px" }}
          >
            {context?.catData?.length > 0 &&
              context?.catData?.map((cat, index) => (
                <FormControlLabel
                  key={index}
                  value={cat?._id}
                  checked={filters?.catId?.includes(cat?._id)}
                  control={<Checkbox size="small" />}
                  label={cat?.name}
                  onChange={() => handleCheckBoxChange("catId", cat?._id)}
                  className="w-full"
                />
              ))}
          </div>
        </Collapse>
      </div>

      <div className="box" style={{ marginTop: "16px" }}>
        <h3
          className="w-full text-[16px] font-[600] flex items-center"
          style={{ marginBottom: "10px", paddingRight: "20px" }}
        >
          Filter By Price
        </h3>

        <RangeSlider
          value={price}
          onInput={(value) => setPrice(value)}
          min={100}
          max={200000}
          step={5}
        />

        <div
          className="flex priceRange"
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <span className="text-[13px]">
            From : <strong className="text-dark"> Rs: {price[0]}</strong>
          </span>
          <span className="text-[13px]" style={{ marginLeft: "auto" }}>
            To : <strong className="text-dark"> Rs: {price[1]}</strong>
          </span>
        </div>
      </div>

      <div className="box" style={{ marginTop: "15px" }}>
        <h3
          className="w-full text-[16px] font-[600] flex items-center"
          style={{ marginBottom: "10px", paddingRight: "20px" }}
        >
          Filter By Rating
        </h3>
        <div className="flex items-center">
          <FormControlLabel
            value={5}
            checked={filters?.rating?.includes(5)}
            control={<Checkbox size="small" />}
            onChange={() => handleCheckBoxChange("rating", 5)}
          />
          <Rating name="rating" value={5} size="small" readOnly />
        </div>
        <div className="flex items-center">
          <FormControlLabel
            value={4}
            checked={filters?.rating?.includes(4)}
            control={<Checkbox size="small" />}
            onChange={() => handleCheckBoxChange("rating", 4)}
          />
          <Rating name="rating" value={4} size="small" readOnly />
        </div>
        <div className="flex items-center">
          <FormControlLabel
            value={3}
            checked={filters?.rating?.includes(3)}
            control={<Checkbox size="small" />}
            onChange={() => handleCheckBoxChange("rating", 3)}
          />
          <Rating name="rating" value={3} size="small" readOnly />
        </div>
        <div className="flex items-center">
          <FormControlLabel
            value={2}
            checked={filters?.rating?.includes(2)}
            control={<Checkbox size="small" />}
            onChange={() => handleCheckBoxChange("rating", 2)}
          />
          <Rating name="rating" value={2} size="small" readOnly />
        </div>
        <div className="flex items-center">
          <FormControlLabel
            value={1}
            checked={filters?.rating?.includes(1)}
            control={<Checkbox size="small" />}
            onChange={() => handleCheckBoxChange("rating", 1)}
          />
          <Rating name="rating" value={1} size="small" readOnly />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
