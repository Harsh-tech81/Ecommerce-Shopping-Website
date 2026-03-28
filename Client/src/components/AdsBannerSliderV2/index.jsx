import { Swiper, SwiperSlide } from "swiper/react";
import BannerBoxV2 from "../bannerBoxV2";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
import BannerBox from "../bannerBox";

function AdsBannerSliderV2(props) {
  return (
    <div
      className="w-full"
      style={{ paddingTop: "14px", paddingBottom: "14px" }}
    >
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        className="smlBtn"
      >
        <SwiperSlide>
          <BannerBoxV2 info="left" image={"./bagbanner.png"} link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2 info="right" image={"./slipper.jpg"} link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2 info="right" image={"./bannerv21.jpg"} link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2 info="left" image={"./bannerv23.jpg"} link={"/"} />
        </SwiperSlide>
        {/* <SwiperSlide>
          <BannerBoxV2 image="./banner20.webp" link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2 image="./banner21.webp" link={"/"} />
        </SwiperSlide>
        <SwiperSlide>
          <BannerBoxV2 image="./banner22.webp" link={"/"} />
        </SwiperSlide> */}
      </Swiper>
    </div>
  );
}

export default AdsBannerSliderV2;
