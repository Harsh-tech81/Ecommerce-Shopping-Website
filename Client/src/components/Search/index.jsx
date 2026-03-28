import "../Search/style.css";
import Button from "@mui/material/Button";
import { useState, useContext } from "react";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  };
  const search = () => {
    const obj = {
      page: 1,
      limit: 5,
      query: searchQuery,
    };
    if (searchQuery !== "") {
      postData(`/api/product/search/get`, obj).then((res) => {
        context.setSearchData(res);
        navigate("/search");
      });
    }
  };
  return (
    <div className="searchBox w-full h-12.5 bg-[#e5e5e5] rounded-[5px] relative p-2 flex align-center">
      <input
        type="text"
        placeholder="Search for products..."
        onChange={onChangeInput}
        value={searchQuery}
        className="w-90 h-8.75 focus:outline-none bg-inherit p-2 text-[15px]"
      />
      <Button
        className="absolute! top-2 right-1.25 z-50 w-9.25! min-w-9.25! h-9.25 rounded-full! text-black!"
        onClick={search}
      >
        <IoSearch className="text-[#4e4e4e] text-[22px]" />
      </Button>
    </div>
  );
}

export default Search;
