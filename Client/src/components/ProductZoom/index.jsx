import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function ProductZoom(props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSmall = useRef();

  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderBig.current.swiper.slideTo(index);
    zoomSliderSmall.current.swiper.slideTo(index);
  };

  return (
    <>
      <div className="flex gap-3">
        <div className="slider w-[15%]">
          <Swiper
            ref={zoomSliderSmall}
            direction={"vertical"}
            slidesPerView={5}
            spaceBetween={0}
            navigation={true}
            modules={[Navigation]}
            className={`zoomProductSliderThumbs h-[500px] overflow-hidden ${props?.images?.length > 5 && 'space'}`}
          >
            {props?.images?.length !== 0 &&
              props?.images?.map((img, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div
                      className={`item rounded-md overflow-hidden cursor-pointer group ${
                        slideIndex === index ? "opacity-10000" : "opacity-30"
                      }`}
                      onClick={() => goto(index)}
                    >
                      <img
                        src={img}
                        className="w-full transition-all group-hover:scale-105"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>

        <div className="zoomContainer w-[85%] h-[500px] overflow-hidden iiz rounded-md">
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
            ref={zoomSliderBig}
          >
            {props?.images?.length !== 0 &&
              props?.images?.map((img, index) => {
                return (
                  <SwiperSlide key={index}>
                    <InnerImageZoom zoomType="hover" zoomScale={1} src={img} />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default ProductZoom;
