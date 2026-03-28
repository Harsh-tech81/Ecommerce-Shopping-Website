import  { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { MyContext } from "../../App";
import {
  deleteData,
  fetchDataFromApi,
} from "../../utils/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const columns = [
  { id: "image", label: "Image", minWidth: 100 },
  { id: "title", label: "Title", minWidth: 200 },
  { id: "description", label: "Description", minWidth: 300 },
  { id: "action", label: "Action", minWidth: 100 },
];

function BlogList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [blogData, setBlogData] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    getData();
  }, [context?.isOpenFullScreen]);

  const getData = () => {
    fetchDataFromApi("/api/blog").then((res) => {
      setBlogData(res?.blogs);
    });
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };
  
  const deleteBlog = (id) => {
    deleteData(`/api/blog/${id}`).then((res) => {
      context.openAlertbox("success", "Blog deleted successfully");
      getData();
    });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600]">
          Blog List
          <span className="font-[400] text-[14px]"></span>
        </h2>
        <div className="col w-[25%] ml-auto flex items-center justify-end gap-3">
          <Button
            className="btn-blue !text-white btn-sm"
            onClick={() =>
              context.setIsOpenFullScreen({
                open: true,
                model: "Add Blog",
              })
            }
          >
            Add Blog
          </Button>
        </div>
      </div>
      <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    width={column.minWidth}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {blogData?.length !== 0 &&
                blogData?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell width={100}>
                        <div className="flex items-center gap-4 w-[200px]">
                          <div className="img w-full rounded-md overflow-hidden group">
                            <img
                              src={item?.images[0]}
                              className="w-full group-hover:scale-105 transition-all 
"
                            />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell width={200}>
                        <span className="text-[15px] inline-block font-[500] w-[200px] sm:w-[200px] md:w-[200px]">
                          {" "}
                          {item?.title}{" "}
                        </span>
                      </TableCell>
                      <TableCell width={300}>
                        <div className="w-[250px] sm:w-[200px] md:w-[200px]"
                          dangerouslySetInnerHTML={{
                            __html: item?.description?.substr(0, 150) + "...",
                          }}
                        />
                      </TableCell>
                      <TableCell width={100}>
                        <div className="flex items-center gap-1">
                          <Button
                            className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] hover:!bg-[#f1f1f1] !rounded-full !min-w-[35px]"
                            onClick={() =>
                              context.setIsOpenFullScreen({
                                open: true,
                                model: "Edit Blog",
                                id: item?._id,
                              })
                            }
                          >
                            <AiOutlineEdit className="text-[20px] text-[rgba(0,0,0,0.7)]" />
                          </Button>
                          <Button
                            className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] hover:!bg-[#f1f1f1] !rounded-full !min-w-[35px]"
                            onClick={() => deleteBlog(item?._id)}
                          >
                            <GoTrash className="text-[18px] text-[rgba(0,0,0,0.7)]" />
                          </Button>
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
          count={blogData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
}

export default BlogList;
