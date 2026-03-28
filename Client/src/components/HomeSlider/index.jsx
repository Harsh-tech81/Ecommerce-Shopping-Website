import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useContext } from "react";
import { MyContext } from "../../App";
import { Navigation, Autoplay } from "swiper/modules";

function HomeSlider(props) {
  const context = useContext(MyContext);
  return (
    <div>
      <div className="homeSlider relative z-[99] " style={{ paddingTop: context?.isLarge ? '20px' : '10px', paddingBottom:  context?.isLarge ? '20px' : '10px' }}>
        <div className="container">
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={context?.windowWidth > 992 ? true : false}
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            className="SliderHome"
          >
            {props?.data?.length !== 0 &&
              props?.data?.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="item rounded-[10px] overflow-hidden">
                      <img src={item?.images[0]} alt="" className="w-full" />
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default HomeSlider;
