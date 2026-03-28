import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { GoTrash } from "react-icons/go";
import TooltipW from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { FaRegEye } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const columns = [
  { id: "image", label: "IMAGE", minWidth: 250 },
  { id: "action", label: " Action", minWidth: 100 },
];

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function HomeSliderBanners() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categoryFilterValue, setCategoryFilterValue] = useState("");
  const [homeSlidesList, setHomeSlidesList] = useState([]);
  const context = useContext(MyContext);
  useEffect(() => {
    fetchDataFromApi("/api/homeSlides/").then((res) => {
      setHomeSlidesList(res?.data);
    });
  }, [context?.isOpenFullScreen]);

  const handleChangeCatFilter = (event) => {
    setCategoryFilterValue(event.target.value);
  };

  const deleteHomeSlide = (id) => {
    deleteData(`/api/homeSlides/delete/${id}`).then((res) => {
      context.openAlertbox("success", "Home Slide deleted successfully");
      fetchDataFromApi("/api/homeSlides/").then((res) => {
        setHomeSlidesList(res?.data);
      });
    });
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
      <div className="grid grid-cols-1 md:grid-cols-2  px-2 py-0 mt-md:mt-2">
        <h2 className="text-[18px] font-[600]">
          Home Slider Banners <span className="font-[400] text-[14px]"></span>
        </h2>

        <div className="col  flex items-center gap-3 justify-start md:justify-end">
      
          <Button
            className="btn-blue btn-sm !text-white"
            onClick={() =>
              context.setIsOpenFullScreen({
                open: true,
                model: "Add Home Slide",
              })
            }
          >
            Add Home Slide
          </Button>
        </div>
      </div>

      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <br />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={60}>
                  <Checkbox {...label} size="small" />
                </TableCell>
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
              {homeSlidesList?.length !== 0 &&
                homeSlidesList?.map((item, index) => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Checkbox {...label} size="small" />
                      </TableCell>
                      <TableCell width={300}>
                        <div className="flex items-center gap-4 w-[300px]">
                          <div className="img w-full rounded-md overflow-hidden group">
                            <img
                              src={item?.images[0]}
                              className="w-full group-hover:scale-105 transition-all"
                            />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell width={100}>
                        <div className="flex items-center gap-1">
                          <TooltipW title="Delete" placement="top">
                            <Button
                              className="!w-[35px] !h-[35px]  bg-[#f1f1f1]  !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px] "
                              style={{ minWidth: "35px" }}
                              onClick={() => deleteHomeSlide(item?._id)}
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

export default HomeSliderBanners;
