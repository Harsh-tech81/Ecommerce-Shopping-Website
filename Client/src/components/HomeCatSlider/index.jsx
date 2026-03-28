import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { useContext } from "react";
import { MyContext } from "../../App";

import { Link } from "react-router-dom";
function HomeCatSlider(props) {
  const context = useContext(MyContext);
  return (
    <div
      className="homeCatSlider"
      style={{ paddingTop: context?.isLarge ? '20px' : '0px', paddingBottom:  context?.isLarge ? '20px' : '10px' }}
    >
      <div className="container">
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          navigation={context?.windowWidth < 992 ? false : true}
          className="mySwiper"
          modules={[Navigation, FreeMode]}
          freeMode={true}
          breakpoints={{
            300: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            550: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            900: {
              slidesPerView: 5,
              spaceBetween: 5,
            },
            1100: {
              slidesPerView: 8,
              spaceBetween: 5,
            },
          }}
        >
          {props?.data?.map((cat, index) => {
            return (
              <SwiperSlide key={index}>
                <Link to="/">
                  <div
                    className="item bg-white rounded-sm text-center flex items-center justify-center flex-col"
                    style={{ paddingLeft: "10px", paddingRight: "10px",paddingTop: context?.isLarge ?  '20px' : '7px', paddingBottom: context?.isLarge ?  '20px' : '7px' }}
                  >
                    <img src={cat?.images[0]} alt="" className="w-[40px] lg:w-[60px] transition-all" />
                    <h3
                      className="text-[12px] lg:text-[15px] font-[500] text-[rgba(0,0,0,0.9)] "
                      style={{ marginTop: "10px" }}
                    >
                      {cat?.name}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default HomeCatSlider;
