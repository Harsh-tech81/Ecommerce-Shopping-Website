
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { FaRegPlusSquare } from "react-icons/fa";
import { FiMinusSquare } from "react-icons/fi";
import { useState } from "react";



function CategoryCollapse() {
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

  return (
    <>
      <div className="scroll">
        <ul className="w-full">
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button
                className="w-full text-left! justify-start! text-[rgba(0,0,0,1)]!"
                style={{ padding: "0 12px !important" }}
              >
                Fashion
              </Button>
            </Link>

            {submenuIndex === 0 ? (
              <FiMinusSquare
                onClick={() => openSubmenu(0)}
                className="absolute top-[10px] right-[15px] cursor-pointer"
              />
            ) : (
              <FaRegPlusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => openSubmenu(0)}
              />
            )}

            {submenuIndex === 0 && (
              <ul className="submenu  w-full " style={{ paddingLeft: "15px" }}>
                <li className="list-none relative flex items-center flex-col ">
                  <Link to="/" className="w-full">
                    <Button className="w-full text-left! justify-start! px-3! text-[rgba(0,0,0,1)]!">
                      Apparel
                    </Button>
                  </Link>

                  {innerSubmenuIndex === 0 ? (
                    <FiMinusSquare
                      onClick={() => openInnerSubmenu(0)}
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openInnerSubmenu(0)}
                    />
                  )}

                  {innerSubmenuIndex === 0 && (
                    <ul
                      className="inner_submenu  w-full "
                      style={{ paddingLeft: "15px" }}
                    >
                      <li
                        className="list-none relative "
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Smart Tablet
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Crepe T-Shirt
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Leather Watch
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Rolling Diamond
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li className="list-none relative flex items-center flex-col ">
                  <Link to="/" className="w-full">
                    <Button className="w-full text-left! justify-start! px-3! text-[rgba(0,0,0,1)]!">
                      Outerwear
                    </Button>
                  </Link>

                  {innerSubmenuIndex === 1 ? (
                    <FiMinusSquare
                      onClick={() => openInnerSubmenu(1)}
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openInnerSubmenu(1)}
                    />
                  )}

                  {innerSubmenuIndex === 1 && (
                    <ul
                      className="inner_submenu  w-full "
                      style={{ paddingLeft: "15px" }}
                    >
                      <li
                        className="list-none relative "
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Smart Tablet
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Crepe T-Shirt
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Leather Watch
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Rolling Diamond
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>

          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="w-full text-left! justify-start! px-3! text-[rgba(0,0,0,1)]!">
                Electronics
              </Button>
            </Link>

            {submenuIndex === 1 ? (
              <FiMinusSquare
                onClick={() => openSubmenu(1)}
                className="absolute top-[10px] right-[15px] cursor-pointer"
              />
            ) : (
              <FaRegPlusSquare
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => openSubmenu(1)}
              />
            )}

            {submenuIndex === 1 && (
              <ul className="submenu  w-full " style={{ paddingLeft: "15px" }}>
                <li className="list-none relative flex items-center flex-col ">
                  <Link to="/" className="w-full">
                    <Button className="w-full text-left! justify-start! px-3! text-[rgba(0,0,0,1)]!">
                      Laptop
                    </Button>
                  </Link>

                  {innerSubmenuIndex === 1 ? (
                    <FiMinusSquare
                      onClick={() => openInnerSubmenu(1)}
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => openInnerSubmenu(1)}
                    />
                  )}

                  {innerSubmenuIndex === 1 && (
                    <ul
                      className="inner_submenu  w-full "
                      style={{ paddingLeft: "15px" }}
                    >
                      <li
                        className="list-none relative "
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          HP Laptop
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Acer Laptop
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Gaming Laptop
                        </Link>
                      </li>
                      <li
                        className="list-none relative"
                        style={{ marginBottom: "3px" }}
                      >
                        <Link
                          to="/"
                          className="link w-full text-left! justify-start! px-3! transition text-[14px]"
                        >
                          Dell Laptop
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  );
}

export default CategoryCollapse;
