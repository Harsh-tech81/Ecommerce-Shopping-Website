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
import { useEffect, useState } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi,deleteData } from "../../utils/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";


const columns = [
  { id: "image", label: "IMAGE", minWidth: 150 },
  { id: "catname", label: " CATEGORY NAME", minWidth: 150 },
  { id: "action", label: " Action", minWidth: 100 },
];

const label = { inputProps: { "aria-label": "Checkbox demo" } };


function CategoryList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categoryFilterValue, setCategoryFilterValue] = useState("");

  const context = useContext(MyContext);

useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      context?.setCatData(res?.data);
    });
  }, [context?.isOpenFullScreen]);

const deleteCategory = (id) => {
  deleteData(`/api/category/delete/${id}`).then((res)=>{
    context.openAlertbox('success', 'Category Deleted Successfully');
    fetchDataFromApi("/api/category").then((res) => {
      context.setCatData(res?.data);
    });
  });
}


  const handleChangeCatFilter = (event) => {
    setCategoryFilterValue(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600]">
          Category List <span className="font-[400] text-[14px]"></span>
        </h2>

        <div className="col w-[40%] ml-auto flex items-center gap-3 justify-end">
 
          <Button
            className="btn-blue btn-sm !text-white"
            onClick={() =>
              context.setIsOpenFullScreen({
                open: true,
                model: "Add New Category",
              })
            }
          >
            Add Category
          </Button>
        </div>
      </div>

      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <br />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
              
                {columns.map((column) => (
                  <TableCell
                    width={column.minWidth}
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {context.catData?.length !== 0 &&
                context.catData?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                  

                      <TableCell width={100}>
                        <div className="flex items-center gap-4 w-[50px]">
                          <div className="img w-full rounded-md overflow-hidden group">
                            <Link to={`/category/${item.id}`}>
                              <LazyLoadImage
                                alt={"image"}
                                effect="blur"
                                src={item?.images[0]}
                                className="w-full group-hover:scale-105 transition-all"
                              />
                             
                            </Link>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell width={100}>{item?.name}</TableCell>

                      <TableCell width={100}>
                        <div className="flex items-center gap-1">
                          <TooltipW title="Edit" placement="top">
                            <Button className="!w-[35px] !h-[35px]  bg-[#f1f1f1]  !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px] " 
                            onClick={()=>context.setIsOpenFullScreen({
                              open : true,
                              model : 'Edit Category',
                              id  : item?._id
                            })}

                            >
                              <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                            </Button>
                          </TooltipW>

                          <TooltipW title="Delete" placement="top">
                            <Button
                              className="!w-[35px] !h-[35px]  bg-[#f1f1f1]  !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px] "
                              style={{ minWidth: "35px" }}
                                      onClick={()=>deleteCategory(item?._id)}
                            >
                              <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                            </Button>
                          </TooltipW>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={10}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
}

export default CategoryList;
