import { useContext,useEffect } from "react";
import MyListItems from "./myListItems";
import { MyContext } from "../../App";
import AccountSidebar from "../../components/AccountSidebar";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
function MyList() {
  const context = useContext(MyContext);
useEffect(()=>{
  window.scrollTo(0,0);
},[]);
  return (
    <section
      className="w-full"
      style={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      <div className="container flex gap-5" style={{ padding: "20px", flexDirection: context?.isLarge ? "row" : "column" }}>
        {context?.windowWidth > 992 && (
          <div className="col1" style={{ width: context?.isLarge ? "20%" : "100%" }}>
            <AccountSidebar />
          </div>
        )}
        <div className="col2" style={{ width: context?.isLarge ? "70%" : "100%" }}>
          <div className="shadow-md rounded-md bg-white">
            <div
              className="border-b border-[rgba(0,0,0,0.1)]"
              style={{ padding: "10px 30px" }}
            >
              <h2>My List</h2>
              <p style={{ marginTop: "0px" }}>
                There are{" "}
                <span className="font-bold text-[#ff5252]">
                  {context?.myListData?.length || 0}
                </span>{" "}
                products in my list
              </p>
            </div>
            {context?.myListData?.length !== 0 ? (
              context?.myListData?.map((item, index) => {
                return <MyListItems item={item} key={index} />;
              })
            ) : (
              <div
                className="flex items-center justify-center flex-col gap-5"
                style={{ padding: "30px 20px" }}
              >
                <img src="/list.png" alt="" className="w-[100px]" />
                <h3>My List is currently empty</h3>
                <Link to="/">
                  <Button className="btn-org btn-sm">Continue Shopping</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyList;
