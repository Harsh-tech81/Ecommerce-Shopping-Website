import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button"; // always keep in mind to use Capital Button not button bcz capital Button is from material/UI
import { RxCross2 } from "react-icons/rx";
import { FaRegPlusSquare } from "react-icons/fa";
import "../Navigation/style.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMinusSquare } from "react-icons/fi";

function CategoryPanel(props) {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [innerSubmenuIndex, setInnerSubmenuIndex] = useState(null);

  const openSubmenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };

  const openInnerSubmenu = (index) => {
    if (innerSubmenuIndex === index) {
      setInnerSubmenuIndex(null);
    } else {
      setInnerSubmenuIndex(index);
    }
  };

  const toggleDrawer = (newOpen) => {
    if (!newOpen) {
      setSubmenuIndex(null);
      setInnerSubmenuIndex(null);
    }
    props.setIsOpenCatPanel(newOpen);
    props.propsSetIsOpenCatPanel(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="categoryPanel">
      <h3
        className=" text-[16px] font-[500] flex items-center justify-between border-b "
        style={{ padding: "12px" }}
      >
        Shop By Categories
        <RxCross2
          onClick={() => toggleDrawer(false)}
          className="text-[20px] cursor-pointer"
        />
      </h3>

      <div className="scroll">
        <ul className="w-full">
          {props?.data?.length !== 0 &&
            props?.data?.map((cat, index) => {
              return (
                <li
                  className="list-none flex items-center relative flex-col"
                  key={index}
                >
                  <Link to={`/products?catId=${cat._id}`} className="w-full">
                    <Button
                      className="w-full text-left! justify-start! text-[rgba(0,0,0,1)]!"
                      style={{ padding: "0 12px !important" }}
                    >
                      {cat?.name}
                    </Button>
                  </Link>

                  {submenuIndex === index ? (
                    <FiMinusSquare
                      onClick={() => openSubmenu(index)}
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openSubmenu(index)}
                    />
                  )}

                  {submenuIndex === index && (
                    <ul
                      className="submenu  w-full "
                      style={{ paddingLeft: "15px" }}
                    >
                      {cat?.children?.length !== 0 &&
                        cat?.children?.map((subCat, index_) => {
                          return (
                            <li
                              className="list-none relative flex items-center flex-col "
                              key={index_}
                            >
                              <Link to={`/products?subCatId=${subCat._id}`} className="w-full">
                                <Button className="w-full text-left! justify-start! px-3! text-[rgba(0,0,0,1)]!">
                                  {subCat?.name}
                                </Button>
                              </Link>

                              {innerSubmenuIndex === index_ ? (
                                <FiMinusSquare
                                  onClick={() => openInnerSubmenu(index_)}
                                  className="absolute top-[10px] right-[15px] cursor-pointer"
                                />
                              ) : (
                                <FaRegPlusSquare
                                  className="absolute top-[10px] right-[15px] cursor-pointer"
                                  onClick={() => openInnerSubmenu(index_)}
                                />
                              )}

                              {innerSubmenuIndex === index_ && (
                                <ul
                                  className="inner_submenu  w-full "
                                  style={{ paddingLeft: "15px" }}
                                >
                                  {subCat?.children?.length !== 0 &&
                                    subCat?.children?.map(
                                      (subSubCat, index__) => {
                                        return (
                                          <li
                                            className="list-none relative "
                                            style={{ marginBottom: "3px" }}
                                            key={index__}
                                          >
                                            <Link
                                              to={`/products?thirdLevelCatId=${subSubCat._id}`}
                                              className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                                            >
                                              {subSubCat?.name}
                                            </Link>
                                          </li>
                                        );
                                      },
                                    )}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </Box>
  );

  return (
    <>
      <Drawer open={props.isOpenCatPanel} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}

export default CategoryPanel;
