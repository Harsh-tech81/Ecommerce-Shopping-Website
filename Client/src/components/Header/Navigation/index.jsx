import Button from "@mui/material/Button";
import { RiMenu2Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";
import { useState, useEffect } from "react";
import "../Navigation/style.css";
import { useContext } from "react";
import { MyContext } from "../../../App";
import MobileNav from "./MobileNav";

function Navigation(props) {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [catData, setCatData] = useState([]);
  const openCategoryPanel = () => {
    setIsOpenCatPanel(true);
  };
  const context = useContext(MyContext);
  useEffect(() => {
    setCatData(context?.catData);
  }, [context?.catData]);

  useEffect(() => {
    setIsOpenCatPanel(props?.isOpenCatPanel);
  }, [props.isOpenCatPanel]);

  return (
    <>
      <nav className="navigation">
        <div className="container flex items-center justify-start lg:justify-end gap-8">
          {context?.windowWidth > 992 && (
            <div className="col1 w-[20%]">
              <Button
                className="text-black! gap-2 w-full"
                onClick={openCategoryPanel}
              >
                <RiMenu2Line className="text-[18px]" />
                SHOP BY CATEGORIES
                <MdKeyboardArrowDown
                  className="text-[18px]  font-bold"
                  style={{ marginLeft: "auto" }}
                />
              </Button>
            </div>
          )}

          <div className="col2  w-full lg:w-[60%] hidden lg:block">
            <ul className="flex items-center gap-3 nav">
              <li className="list-none">
                <Link to="/" className="link transition text-[14px] font-[500]">
                  <Button
                    className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]"
                    style={{ paddingTop: "16px", paddingBottom: "16px" }}
                  >
                    Home
                  </Button>
                </Link>
              </li>


              {context?.windowWidth > 992 && catData?.length !== 0 &&
                catData?.map((cat, index) => {
                  return (
                    <li className="list-none relative" key={index}>
                      <Link
                        to={`/products?catId=${cat._id}`}
                        className="link transition text-[14px] font-[500]"
                      >
                        <Button
                          className="link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] "
                          style={{ paddingTop: "16px", paddingBottom: "16px" }}
                        >
                          {cat?.name}
                        </Button>
                      </Link>

                      {cat?.children?.length !== 0 && (
                        <div className="submenu absolute top-[120%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                          <ul>
                            {cat?.children?.map((subCat, index_) => {
                              return (
                                <li
                                  className="list-none w-full relative"
                                  key={index_}
                                >
                                  <Link
                                    to={`/products?subCatId=${subCat._id}`}
                                    className="w-full"
                                  >
                                    <Button className="text-[rgba(0,0,0,0.9)]! w-full text-left! justify-start! rounded-none!  hover:!text-[#ff5252] ">
                                      {subCat?.name}
                                    </Button>
                                  </Link>

                                  {subCat?.children?.length !== 0 && (
                                    <div className="submenu absolute top-[0%] left-[100%] min-w-[150px] bg-white shadow-md opacity-0 transition-all ">
                                      <ul>
                                        {subCat?.children?.map(
                                          (subSubCat, index__) => {
                                            return (
                                              <li
                                                className="list-none w-full"
                                                key={index__}
                                              >
                                                <Link
                                                  to={`/products?thirdLevelCatId=${subSubCat._id}`}
                                                  className="w-full"
                                                >
                                                  <Button className="text-[rgba(0,0,0,0.9)]! w-full text-left! justify-start! rounded-none! hover:!text-[#ff5252]">
                                                    {subSubCat?.name}
                                                  </Button>
                                                </Link>
                                              </li>
                                            );
                                          },
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}

            </ul>
          </div>
          <div className="col3 w-[21%] hidden lg:block">
            <p className="text-[14px] font-[500] flex items-center gap-3 mb-0 mt-0">
              <GoRocket className=" text-[18px]" />
              Free International Delivery
            </p>
          </div>
        </div>
      </nav>

      {/* Category Panel*/}
      {catData?.length !== 0 && (
        <CategoryPanel
          isOpenCatPanel={isOpenCatPanel}
          setIsOpenCatPanel={setIsOpenCatPanel}
          propsSetIsOpenCatPanel={props.setIsOpenCatPanel}
          data={catData}
        />
      )}
      {context?.windowWidth <= 992 && <MobileNav />}
    </>
  );
}

export default Navigation;
