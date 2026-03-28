import Button from "@mui/material/Button";
import { useState, useContext } from "react";
import { MyContext } from "../../App";
import { FaAngleDown } from "react-icons/fa";
import EditSubCatBox from "./EditSubCatBox";

function SubCategoryList() {
  const context = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(0);

  const expand = (index) => {
    if (isOpen === index) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(index);
    }
  };
  return (
    <>
      <div className="flex items-center flex-col md:flex-row justify-start md:justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600] w-full md:w-[50%] mb-1 mb:mb-0">Sub Category List</h2>

        <div className="col mr-auto md:mr-0 flex items-center gap-3 justify-end">
          <Button
            className="btn-blue btn-sm !text-white "
            onClick={() =>
              context.setIsOpenFullScreen({
                open: true,
                model: "Add New Sub Category",
              })
            }
          >
            Add New Sub Category
          </Button>
        </div>
      </div>

      <div className="card my-4 pt-5 pb-5 px-5 shadow-md sm:rounded-lg bg-white">
        {context?.catData?.length !== 0 && (
          <ul className="w-full">
            {context?.catData?.map((firstLevelCat, index) => {
              return (
                <li className="w-full mb-1" key={index}>
                  <div className="flex items-center w-full p-2 bg-[#f1f1f1] rounded-sm px-4">
                    <span className="font-[500] flex items-center gap-4 text-[14px]">
                      {firstLevelCat?.name}
                    </span>
                    <Button
                      className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black !ml-auto"
                      onClick={() => expand(index)}
                    >
                      <FaAngleDown />
                    </Button>
                  </div>

                  {isOpen === index && (
                    <>
                      {firstLevelCat?.children?.length !== 0 && (
                        <ul className="w-full">
                          {firstLevelCat?.children?.map((subCat, index_) => {
                            return (
                              <li className="w-full py-1" key={index_}>
                                <EditSubCatBox
                                  name={subCat?.name}
                                  id={subCat?._id}
                                  catData={context?.catData}
                                  index={index_}
                                  selectedCat={subCat?.parentId}
                                  selectedCatName={subCat?.parentCatName}
                                />

                                {subCat?.children?.length !== 0 && (
                                  <ul className="pl-4">
                                    {subCat?.children?.map(
                                      (thirdlevel, index__) => {
                                        return (
                                          <li
                                            className="w-full hover:bg-[#f1f1f1]"
                                            key={index__}
                                          >
                                            <EditSubCatBox
                                              name={thirdlevel?.name}
                                              id={thirdlevel?._id}
                                              catData={firstLevelCat?.children}
                                              index={index__}
                                              selectedCat={thirdlevel?.parentId}
                                              selectedCatName={
                                                thirdlevel?.parentCatName
                                              }
                                            />
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
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export default SubCategoryList;
