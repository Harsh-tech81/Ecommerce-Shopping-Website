import "../Search/style.css";
import Button from "@mui/material/Button";
import { useState, useContext, useEffect, useRef } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpenSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced live search preview
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpenSuggestions(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(() => {
      postData("/api/product/search/get", {
        query: trimmed,
        page: 1,
        limit: 5,
      })
        .then((res) => {
          setIsLoading(false);
          if (res?.success && Array.isArray(res?.product)) {
            setSuggestions(res.product.slice(0, 5));
            setIsOpenSuggestions(true);
          } else {
            setSuggestions([]);
            setIsOpenSuggestions(true);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setSuggestions([]);
        });
    }, 280);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSuggestions([]);
    setIsOpenSuggestions(false);
  };

  const executeSearch = (queryToSearch) => {
    const query = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!query) return;

    setIsOpenSuggestions(false);

    // Call API and store in context as well as navigating with URL query
    postData(`/api/product/search/get`, {
      page: 1,
      limit: 10,
      query,
    }).then((res) => {
      if (context?.setSearchData) {
        context.setSearchData(res);
      }
    });

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const handleSelectProduct = (productId) => {
    setIsOpenSuggestions(false);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="searchBoxWrapper relative w-full" ref={searchRef}>
      <form
        onSubmit={handleSubmit}
        className="searchBox w-full h-[45px] bg-[#f1f1f1] hover:bg-[#eaeaea] transition-all rounded-full relative px-4 flex items-center border border-gray-250 focus-within:border-[#ff5252] focus-within:bg-white focus-within:shadow-md"
      >
        <IoSearch className="text-gray-500 text-[20px] flex-shrink-0" />
        <input
          type="text"
          placeholder="Search for products, brands and more..."
          onChange={onChangeInput}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpenSuggestions(true);
          }}
          value={searchQuery}
          className="w-full h-full focus:outline-none bg-transparent px-3 text-[14px] text-gray-800"
        />

        {isLoading ? (
          <CircularProgress size={18} className="!text-[#ff5252] mr-2 flex-shrink-0" />
        ) : (
          searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 mr-2 p-1 flex-shrink-0 cursor-pointer"
            >
              <IoClose size={18} />
            </button>
          )
        )}

        <Button
          type="submit"
          className="!w-[34px] !h-[34px] !min-w-[34px] !rounded-full !bg-[#ff5252] !text-white hover:!bg-[#e03d3d] flex-shrink-0"
        >
          <IoSearch className="text-white text-[16px]" />
        </Button>
      </form>

      {/* Instant Autocomplete Suggestions Dropdown */}
      {isOpenSuggestions && (
        <div className="searchDropdown absolute top-[50px] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
          {suggestions.length > 0 ? (
            <div>
              <div className="p-2 border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-4">
                Products Matching "{searchQuery}"
              </div>
              <ul className="divide-y divide-gray-50 max-h-[340px] overflow-y-auto">
                {suggestions.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => handleSelectProduct(item._id)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50/50 cursor-pointer transition-colors group"
                  >
                    <div className="w-[42px] h-[42px] rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <img
                        src={item?.images?.[0] || item?.image || "/product-placeholder.png"}
                        alt={item?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-medium text-gray-800 truncate group-hover:text-[#ff5252] transition-colors">
                        {item?.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 m-0 leading-tight">
                        {item?.brand || item?.catName || "In Products"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[13px] font-semibold text-[#ff5252]">
                        &#8377;{item?.price?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div
                onClick={() => executeSearch()}
                className="p-3 bg-gray-50 text-center text-[12px] font-semibold text-[#ff5252] hover:bg-gray-100 cursor-pointer transition-colors border-t border-gray-100"
              >
                View all results for "{searchQuery}" &rarr;
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 text-[13px]">
              No products found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;

