import HomeCatSlider from "../../components/HomeCatSlider";
import HomeSlider from "../../components/HomeSlider";
import { MdLocalShipping } from "react-icons/md";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Swiper, SwiperSlide } from "swiper/react";
import HomeSliderV2 from "../../components/HomeSliderV2";
import "swiper/css";
import { useState, useContext, useEffect } from "react";
import { MyContext } from "../../App";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import BlogItem from "../../components/BlogItem";
import { Navigation,FreeMode } from "swiper/modules";
import BannerBoxV2 from "../../components/bannerBoxV2";
import ProductSlider from "../../components/ProductsSlider";
import { fetchDataFromApi } from "../../utils/api";
import ProductLoading from "../../components/ProductLoading";
import AdsBannerSlider from "../../components/AdsBannerSlider";
function Home() {
  const [value, setValue] = useState(0);
  const context = useContext(MyContext);
  const [homeSliderData, setHomeSliderData] = useState([]);
  const [PopularproductsData, setPopularProductsData] = useState([]);
  const [AllProductData, setAllProductData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [FeaturedProducts, setFeaturedProducts] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi("/api/homeSlides").then((res) => {
      setHomeSliderData(res?.data);
    });
  }, []);

  useEffect(() => {
    fetchDataFromApi("/api/product").then((res) => {
      setAllProductData(res?.products);
    });
    fetchDataFromApi("/api/product/getFeaturedProducts").then((res) => {
      setFeaturedProducts(res?.products);
    });
    fetchDataFromApi("/api/blog").then((res) => {
      setBlogData(res?.blogs || []);
    });
  }, []);

  useEffect(() => {
    fetchDataFromApi(
      `/api/product/getProdByCatId/${context?.catData[0]?._id}`,
    ).then((res) => {
      if (res?.error === false) setPopularProductsData(res?.products);
    });
  }, [context?.catData]);

  const filterByCatId = (id) => {
    setPopularProductsData([]);
    fetchDataFromApi(`/api/product/getProdByCatId/${id}`).then((res) => {
      setPopularProductsData(res?.products);
    });
  };

  return (
    <div className="min-h-max lg:min-h-[65vh] relative">
      {homeSliderData?.length !== 0 && <HomeSlider data={homeSliderData} />}

      {context?.catData?.length !== 0 && (
        <HomeCatSlider data={context?.catData} />
      )}

      <section
        className="bg-white"
        style={{ paddingTop: "16px", paddingBottom: "16px" }}
      >
        <div className="container">
          <div className="flex items-center justify-between flex-col lg:flex-row">
            <div className="leftSec w-full lg:w-[40%]">
              <h2 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] font-[600]">Popular Products</h2>
              <p
                className="text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px]  font-[400]"
                style={{ marginBottom: "0px", marginTop: "0px" }}
              >
                Do not miss the current offers until the end of April.
              </p>
            </div>
            <div className="rightSec w-full lg:w-[60%]">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {context?.catData?.length !== 0 &&
                  context?.catData?.map((cat, index) => {
                    return (
                      <Tab
                        key={index}
                        label={cat?.name}
                        onClick={() => filterByCatId(cat?._id)}
                      />
                    );
                  })}
              </Tabs>
            </div>
          </div>

          {PopularproductsData?.length === 0 && <ProductLoading />}

          {PopularproductsData?.length !== 0 && (
            <ProductSlider items={6} data={PopularproductsData} />
          )}
        </div>
      </section>

      <section
        style={{ paddingTop: "16px", paddingBottom: "16px" }}
        className="bg-white"
      >
        <div className="container flex flex-col lg:flex-row gap-5">
          <div className="part1 w-full  lg:w-[70%] ">
            <HomeSliderV2 />
          </div>

          <div className="part2 scrollable  w-full lg:w-[30%] flex items-center justify-between flex-row lg:flex-col gap-5">
            <BannerBoxV2 info="left" image={"./bannerv23.jpg"}  linked={"/product/69b9459a39c4877cc25f2bab"} price={50000} content={"Apple iPhone 13"}/>
            <BannerBoxV2 info="right" image={"./bannerv21.jpg"} linked={"/product/69b7075ccb68d8e8c7f9211e"} price={129} content={"Top for women"}/>
          </div>
        </div>
      </section>

      <section
        className="bg-white"
        style={{ paddingTop: context?.isLarge ? "20px" : "2px", paddingBottom: context?.isLarge ? "20px" : "15px" }}
      >
        <div className="container">
          <div
            className="freeShipping w-full md:w-[80%] border-2 border-[#ff5252] flex items-center justify-center lg:justify-between flex-col lg:flex-row rounded-md"
            style={{
              padding: "12px",
              marginBottom: "39px !important",
              margin: "auto",
            }}
          >
            <div className="col1 flex items-center gap-2 lg:gap-6">
              <MdLocalShipping className="text-[30px] lg:text-[50px]" />
              <span className="text-[16px] lg:text-[20px] font-[600] uppercase">
                Free Shipping
              </span>
            </div>

            <div className="col2">
              <p className="font-[500] text-center" style={{ marginBottom: "0px" }}>
                Free Delivery Now On Your First Order and Over &#8377;200
              </p>
            </div>

            <p className="font-bold text-[19px] lg:text-[23px]">- Only &#8377;200*</p>
          </div>
          {/* <br />
          <AdsBannerSliderV2 items={4} /> */}
        </div>
      </section>

      <section
        style={{ paddingTop: "0px", paddingBottom: "16px" }}
        className="bg-white"
      >
        <div className="container">
          <h2
            className="text-[20px] font-[600] "
            style={{ marginBottom: "0px", marginTop: "0px" }}
          >
            Latest Products
          </h2>

          {AllProductData?.length === 0 && <ProductLoading />}

          {AllProductData?.length !== 0 && (
            <ProductSlider items={5} data={AllProductData} />
          )}

          {/* <AdsBannerSlider items={3} /> */}
        </div>
      </section>

      <section
        style={{ paddingTop: "0px", paddingBottom: "0px" }}
        className="bg-white"
      >
        <div className="container">
          <h2 className="text-[20px] font-[600]">Featured Products</h2>
          {FeaturedProducts?.length === 0 && <ProductLoading />}

          {FeaturedProducts?.length !== 0 && (
            <ProductSlider items={5} data={FeaturedProducts} />
          )}

          <AdsBannerSlider items={4} />
        </div>
      </section>

      {blogData?.length !== 0 && (
        <section
          style={{ paddingTop: "0px", paddingBottom: "30px" }}
          className="bg-white blogSection"
        >
          <div className="container">
            <h2
              className="text-[20px] font-[600]"
              style={{ marginBottom: "26px" }}
            >
              From The Blog
            </h2>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
               navigation={context?.windowWidth < 992 ? false : true}
              modules={[Navigation, FreeMode]}
          freeMode={true}
          breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween:10,
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
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
              className="blogSlider"
            >
              {
                blogData?.map((blog, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <BlogItem data={blog} />
                    </SwiperSlide>
                  );
                })
              }
            </Swiper>
          </div>
        </section>
      )}
    </div>
  );
}
export default Home;
