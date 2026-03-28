import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useRef, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdFilterVintage } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { CircularProgress } from "@mui/material";

function ProductDetails() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [product, setProduct] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const zoomSliderBig = useRef();
  const zoomSliderSmall = useRef();
  const { id } = useParams();
  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderBig.current?.swiper?.slideTo(index);
    zoomSliderSmall.current?.swiper?.slideTo(index);
  };

  useEffect(() => {
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      if (res?.error === false) {
        setProduct(res?.product);
      }
    });
  }, [id]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between px-2 py-0 mt-3">
        <h2 className="text-[18px] font-[600]">Product Details</h2>
      </div>
      <br />

      {product?._id !== undefined &&
      product?._id !== null &&
      product?._id !== "" ? (
        <>
          <div className="productDetails flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-[40%]">
              {product?.images?.length !== 0 && (
                <div className="flex flex-col-reverse md:flex-row gap-3">
                  <div className="slider w-full md:w-[15%]">
                    <Swiper
                      ref={zoomSliderSmall}
                      direction={isMobile ? "horizontal" : "vertical"}
                      slidesPerView={isMobile ? 4 : 5}
                      spaceBetween={6}
                      navigation={true}
                      modules={[Navigation]}
                      className={`zoomProductSliderThumbs overflow-hidden ${isMobile ? "h-[92px]" : "h-[400px]"}`}
                    >
                      {product?.images?.map((item, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <div
                              className={`item rounded-md overflow-hidden cursor-pointer group ${
                                slideIndex === index
                                  ? "opacity-10000"
                                  : "opacity-30"
                              }`}
                              onClick={() => goto(index)}
                            >
                              <img
                                src={item}
                                className="w-full transition-all group-hover:scale-105"
                              />
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>

                  <div className="zoomContainer w-full md:w-[85%] overflow-hidden iiz rounded-md">
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={0}
                      navigation={false}
                      ref={zoomSliderBig}
                    >
                      {product?.images?.map((item, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <InnerImageZoom
                              zoomType={isMobile ? "click" : "hover"}
                              zoomScale={1}
                              src={item}
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:w-[60%]">
              <h1 className="text-[22px] sm:text-[25px] font-[500] mb-4">{product?.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-1 sm:gap-0">
                <span className="w-full sm:w-[32%] lg:w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                  <MdBrandingWatermark className="opacity-65" /> Brand :{" "}
                </span>
                <span className="text-[14px]">{product?.brand}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-1 sm:gap-0">
                <span className="w-full sm:w-[32%] lg:w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                  <BiSolidCategoryAlt className="opacity-65" /> Category :{" "}
                </span>
                <span className="text-[14px]">{product?.catName}</span>
              </div>
              {product?.productRam?.length !== 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-1 sm:gap-0">
                  <span className="w-full sm:w-[32%] lg:w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                    <MdFilterVintage className="opacity-65" /> RAM :{" "}
                  </span>
                  <div className="flex gap-2 items-center flex-wrap">
                    {product?.productRam?.map((item, index) => {
                      return (
                        <span
                          key={index}
                          className="text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500] rounded-md"
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {product?.size?.length !== 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-1 sm:gap-0">
                  <span className="w-full sm:w-[32%] lg:w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                    <MdFilterVintage className="opacity-65" /> SIZE :{" "}
                  </span>
                  <div className="flex gap-2 items-center flex-wrap">
                    {product?.size?.map((item, index) => {
                      return (
                        <span
                          key={index}
                          className="text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500] rounded-md"
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {product?.productWeight?.length !== 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-1 sm:gap-0">
                  <span className="w-full sm:w-[32%] lg:w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                    <MdFilterVintage className="opacity-65" /> Weight :
                  </span>
                  <div className="flex gap-2 items-center flex-wrap">
                    {product?.productWeight?.map((item, index) => {
                      return (
                        <span
                          key={index}
                          className="text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500] rounded-md"
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-1 sm:gap-0">
                <span className="w-full sm:w-[32%] lg:w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                  <MdRateReview className="opacity-65" /> Review :{" "}
                </span>
                <span className="text-[14px]">
                  ({product?.reviews?.length || 0}) Review
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-1 sm:gap-0">
                <span className="w-full sm:w-[32%] lg:w-[20%] font-[500] flex items-center gap-2 text-[14px]">
                  <BsPatchCheckFill className="opacity-65" /> Published :{" "}
                </span>
                <span className="text-[14px]">
                  {product?.createdAt
                    ? new Date(product.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <br />
              <h2 className="text-[20px] font-[500]">Product Description</h2>
              {product?.description && (
                <p className="text-[14px] leading-6 break-words">{product.description}</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <CircularProgress color="inherit" />
        </div>
      )}
    </>
  );
}

export default ProductDetails;
