import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import { useContext } from "react";
import { AiTwotoneGift } from "react-icons/ai";
import "swiper/css";
import { MyContext } from "../../App";
import { Navigation,FreeMode } from "swiper/modules";
import { RiProductHuntLine } from "react-icons/ri";
import { IoStatsChartSharp } from "react-icons/io5";
import { AiTwotonePieChart } from "react-icons/ai";
import 'swiper/css/free-mode';

function DashboardBoxes(props) {
  const context = useContext(MyContext);
  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        navigation={context?.windowWidth < 992 ? false : true}
        modules={[Navigation,FreeMode]}
        freeMode={true}
        className="dashboardBoxesSlider"
         breakpoints={{
          300: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          650: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
           992: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
        }}
      >
        <SwiperSlide>
          <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa]   rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <AiTwotonePieChart className="text-[35px] text-[#3872fa]" />
            <div className="info w-[70%] ">
              <h3>Total Users</h3>
              <b>{props.users || 0}</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-[#3872fa]" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa]   rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <AiTwotoneGift className="text-[35px] text-[#10b981]" />
            <div className="info w-[70%] ">
              <h3>Total Orders</h3>
              <b>{props.orders || 0}</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-[#10b981]" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box p-5 bg-white cursor-pointer hover:bg-[#fafafa]   rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <AiTwotoneGift className="text-[35px] text-[#7928ca]" />
            <div className="info w-[70%] ">
              <h3>Total Category</h3>
              <b>{props.category || 0}</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-[#7928ca]" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box p-5 bg-white cursor-pointer hover:bg-[#fafafa]   rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <RiProductHuntLine className="text-[35px] text-[#3872fa]" />
            <div className="info w-[70%] ">
              <h3>Total Products</h3>
              <b>{props.products || 0}</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-[#3872fa]" />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default DashboardBoxes;
