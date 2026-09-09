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
      <div className="flex flex-col md:flex-row gap-3">
        {/* Desktop Vertical Thumbnails */}
        <div className="slider hidden md:block md:w-[15%]">
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
                        slideIndex === index ? "opacity-100" : "opacity-30"
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

        {/* Main Zoom Display */}
        <div className="zoomContainer w-full md:w-[85%] h-[320px] sm:h-[420px] md:h-[500px] overflow-hidden iiz rounded-md">
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
            ref={zoomSliderBig}
            onSlideChange={(swiper) => setSlideIndex(swiper.activeIndex)}
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

        {/* Mobile Horizontal Thumbnails */}
        {props?.images && props?.images?.length > 1 && (
          <div className="flex md:hidden gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none">
            {props?.images?.map((img, index) => (
              <div
                key={index}
                className={`w-16 h-16 shrink-0 rounded-md border-2 overflow-hidden cursor-pointer transition-all ${
                  slideIndex === index ? "border-[#ff5252] opacity-100" : "border-gray-200 opacity-60"
                }`}
                onClick={() => goto(index)}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ProductZoom;
