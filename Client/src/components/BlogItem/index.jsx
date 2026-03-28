import { LuClock8 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
function BlogItem({ data }) {
  const blogImage = Array.isArray(data?.images) ? data?.images[0] : data?.images;

  return (
    <div className="blogItem group">
      <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
        <img
          src={blogImage}
          className="w-full transition-all group-hover:scale-105 group-hover:rotate-1"
        />
        <span
          className="flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-[#ff5252] rounded-md text-[11px] font-[500] gap-1"
          style={{ padding: "2px" }}
        >
          <LuClock8 className="text-[16px]" /> {new Date(data?.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div
        className="info"
        style={{ padding: "14px", paddingTop: "20px", paddingBottom: "20px" }}
      >
        <h2
          className="text-[15px] font-[600] text-black"
          style={{ marginBottom: "8px" }}
        >

            {data?.title}
        
        </h2>
      
<div dangerouslySetInnerHTML={{__html : data?.description?.substr(0,100)+'...'}}/>


        <Link
          to="/"
          className="link font-[500] text-[14px] flex items-center gap-1"
        >
          Read More <IoIosArrowForward />
        </Link>
      </div>
    </div>
  );
}

export default BlogItem;
