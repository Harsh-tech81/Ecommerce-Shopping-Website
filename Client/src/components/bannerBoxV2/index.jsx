import "../bannerBoxV2/style.css";
import { Link } from "react-router-dom";
function BannerBoxV2({ info, image, linked, price, content }) {
  return (
    <div className="bannerBoxV2 box w-full rounded-md overflow-hidden group relative">
      <img
        src={image}
        className="w-full transition-all duration-150 group-hover:scale-105"
      />
      <div
        className={`info absolute top-0 ${
          info === "left" ? "left-0" : "right-0"
        } w-[70%] h-[100%] z-50 flex flex-col justify-center items-center gap-2`}
        style={{
          padding: "20px",
          paddingLeft: info === "left" ? "30px" : "45px",
        }}
      >
        <h2 className="text-[18px] font-[600] w-full">{content}</h2>
        <span className="text-[20px] text-[#ff5252] font-[600] w-full">
          &#8377;{price.toFixed(2)}
        </span>
        <div className="w-full transition-all duration-150">
          <Link to={linked} className="text-[15px] font-[600] link underline">
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BannerBoxV2;
