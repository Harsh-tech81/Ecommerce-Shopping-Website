import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useContext } from "react";
import { MyContext } from "../../App";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation,FreeMode } from "swiper/modules";
import ProductItem from "../ProductItem";

function ProductSlider(props) {
  const context = useContext(MyContext);
  return (
    <div
      className="productsSlider"
      style={{ paddingTop: "14px", paddingBottom: "14px" }}
    >
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={context?.windowWidth < 992 ? false : true}
        modules={[Navigation, FreeMode]}
        className="mySwiper"
         freeMode={true}
          breakpoints={{
            300: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            550: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1100: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
          }}
      >
        {props?.data?.length !== 0 &&
          props?.data?.map((product, index) => {
            return (
              <SwiperSlide key={index}>
                <ProductItem item={product} />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}

export default ProductSlider;
