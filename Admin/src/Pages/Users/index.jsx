
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import { MdLocalPhone } from "react-icons/md";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { fetchDataFromApi } from "../../utils/api";
const columns = [
  { id: "userimg", label: "USER IMAGE", minWidth: 80 },
  { id: "username", label: " USER NAME", minWidth: 100 },
  { id: "useremail", label: "USER EMAIL", minWidth: 100 },
  { id: " userphone", label: "USER PHONE NO", minWidth: 100 },
  { id: " created", label: "CREATED", minWidth: 100 },
];

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function Users() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
const [allUser, setAllUser] = useState([]);
  const context = useContext(MyContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    fetchDataFromApi("/api/user/getAllUsers").then((res) => {
      if (res?.error === false) {
        setAllUser( res?.data);
      }
    });
  }, []);
  return (
    <>
      <div className="card my-4 shadow-md sm:rounded-lg bg-white pt-5">
        <div className="flex items-center w-full px-5 justify-between ">
          <div className="col w-[40%]">
            <h2 className="font-[500] text-[18px] ">Users List</h2>
          </div>
        </div>
        <br />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {allUser?.map((user, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell style={{ minWidth: columns.minWidth }}>
                      <div className="flex items-center gap-4 w-[70px]">
                        <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                         
                            <img
                              src={user?.avatar || '/profile.png'}
                              className="w-full group-hover:scale-105 transition-all"
                            />
                          
                        </div>
                      </div>
                    </TableCell>

                    <TableCell style={{ minWidth: columns.minWidth }}>
                     {user?.name}
                    </TableCell>
                    <TableCell style={{ minWidth: columns.minWidth }}>
                      <span className="flex items-center gap-2">
                        {" "}
                        <MdOutlineMarkEmailRead className="text-[15px]" />{" "}
                        {user?.email}
                      </span>
                    </TableCell>
                    <TableCell style={{ minWidth: columns.minWidth }}>
                      <span className="flex items-center gap-2">
                        {" "}
                        <MdLocalPhone className="text-[15px]" /> {user?.mobile || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell style={{ minWidth: columns.minWidth }}>
                      <span className="flex items-center gap-2">
                        {" "}
                        <SlCalender className="text-[13px]" />{user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                      </span>
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

export default Users;
