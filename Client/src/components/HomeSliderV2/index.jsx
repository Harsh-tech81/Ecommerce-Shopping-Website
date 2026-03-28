import { Swiper, SwiperSlide } from "swiper/react";
import Button from "@mui/material/Button";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
function HomeSliderV2() {
  const context = useContext(MyContext);
  return (
    <>
      <Swiper
        loop={true}
        spaceBetween={30}
        effect={"fade"}
        navigation={context?.windowWidth < 992 ? false : true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        className="homeSliderV2"
      >
        <SwiperSlide>
          <div className="item overflow-hidden rounded-md w-full relative">
            <img src="/v21.jpg" />
            <div
              className="info absolute top-0 -right-[100%] opacity-0 transition-all duration-700 w-[50%] z-50 h-[100%] flex items-center flex-col justify-center"
              style={{ padding: "40px" }}
            >
              <h4
                className="text-[10px] lg:text-[18px] font-[500] w-full text-left relative-right-[100%] opacity-0 "
                style={{ marginBottom: "10px" }}
              >
                Big Saving Days Sale
              </h4>
              <h2 className="text-[12px] lg:text-[20px] lg:text-[35px] font-[700] w-full relative-right-[100%] opacity-0">
                Buy New Trend Women Yellow Cotton Blend Top
              </h2>
              <h3
                className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-[18px] font-[500] w-full text-left relative-right-[100%] opacity-0"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                {" "}
                Starting At Only
                <span className="text-[#ff5252] text-[15px] lg:text-[20px] lg:text-[30px] font-[700]">
                  &#8377;399.00
                </span>
              </h3>
              <div className="w-full  relative-right-[100%] opacity-0 btn_">
                <Link to="/product/69c59413ff3f2a203907ef87">
                <Button className="btn-org">SHOP NOW</Button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="item overflow-hidden rounded-md w-full">
            <img src="/v22.jpg" />
            <div
              className="info absolute top-0 -right-[100%] opacity-0 transition-all duration-700 w-[50%] z-50 h-[100%] flex items-center flex-col justify-center"
              style={{ padding: "40px" }}
            >
              <h4
                className="text-[10px] lg:text-[18px] font-[500] w-full text-left relative-right-[100%] opacity-0"
                style={{ marginBottom: "10px" }}
              >
                Big Saving Days Sale
              </h4>
              <h2 className="text-[12px] lg:text-[20px] lg:text-[35px] font-[700] w-full relative-right-[100%] opacity-0">
                Apple iPhone 13 128GB, Pink
              </h2>
              <h3
                className="flex gap-2 lg:gap-3 items-center text-[10px] lg:text-[18px] font-[500] w-full text-left relative-right-[100%] opacity-0"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                {" "}
                Starting At Only
                <span className="text-[#ff5252] text-[15px] lg:text-[20px] lg:text-[30px] font-[700]">
                  &#8377;50,000
                </span>
              </h3>
              <div className="w-full relative-right-[100%] opacity-0 btn_">
                <Link to="/product/69b9459a39c4877cc25f2bab">
                  <Button className="btn btn-org">SHOP NOW</Button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default HomeSliderV2;
