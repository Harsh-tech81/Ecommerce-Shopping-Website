import { Swiper, SwiperSlide } from "swiper/react";
import { useContext } from "react";
import { MyContext } from "../../App";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation,Autoplay,FreeMode } from "swiper/modules";
import BannerBox from "../bannerBox";

function AdsBannerSlider(props) {
  const context = useContext(MyContext);
  return (
    <div
      className="w-full"
      style={{ paddingTop: "14px", paddingBottom: "14px" }}
    >
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={context?.windowWidth < 992 ? false : true}
        freeMode={true}
         autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
        modules={[Navigation,Autoplay,FreeMode]}
        className="smlBtn"
           breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween: 5,
            },
            550: {
              slidesPerView:2,
              spaceBetween: 5,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            1100: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
      >
        <SwiperSlide>
          <BannerBox image="./banner17.webp" link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox image="./banner18.webp" link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox image="./banner16.webp" link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox image="./banner19.webp" link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox image="./banner20.webp" link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox image="./banner21.webp" link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBox image="./banner22.webp" link={"/"} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default AdsBannerSlider;
