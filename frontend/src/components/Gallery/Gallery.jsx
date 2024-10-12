import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";

import img1 from "../../assets/images/demo.jpg";

// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import "../../assets/css/Gallery.css";

import img2 from "../../assets/images/Gallery/Fresher_s2K22/_MAK5821.jpg";
import img4 from "../../assets/images/Gallery/Fresher_s2K22/_MAK5834.jpg";
import img5 from "../../assets/images/Gallery/Fresher_s2K22/_MAK5870.jpg";
import img6 from "../../assets/images/Gallery/Fresher_s2K22/_MAK5828.jpg";
import img7 from "../../assets/images/Gallery/Fresher_s2K22/_MAK5873.jpg";
import img8 from "../../assets/images/Gallery/Fresher_s2K22/_MAK5940.jpg";

import img3 from "../../assets/images/Gallery/Farewell_22/IMG_4868.jpg";
import img9 from "../../assets/images/Gallery/Farewell_22/IMG_5743.jpg";
import img10 from "../../assets/images/Gallery/Farewell_22/IMG20220507131707_01.jpg";

// workshop
import img_w_1 from "../../assets/images/Gallery/Workshop/emr1.jpeg";
import img_w_2 from "../../assets/images/Gallery/Workshop/emr2.jpeg";
import img_w_3 from "../../assets/images/Gallery/Workshop/emr3.jpeg";
import img_w_4 from "../../assets/images/Gallery/Workshop/emr4.jpeg";
import img_w_5 from "../../assets/images/Gallery/Workshop/emr5.jpeg";
import img_w_6 from "../../assets/images/Gallery/Workshop/emr6.jpeg";
import img_w_7 from "../../assets/images/Gallery/Workshop/emr7.jpeg";
import img_w_8 from "../../assets/images/Gallery/Workshop/emr8.jpeg";
import img_w_9 from "../../assets/images/Gallery/Workshop/emr9.jpeg";
import img_w_10 from "../../assets/images/Gallery/Workshop/emr10.jpeg";

// freshers2k23
import img_f_1 from "../../assets/images/Gallery/Fresher_s2K23/img1.jpg";
import img_f_2 from "../../assets/images/Gallery/Fresher_s2K23/img2.jpg";
import img_f_3 from "../../assets/images/Gallery/Fresher_s2K23/img3.jpg";
import img_f_4 from "../../assets/images/Gallery/Fresher_s2K23/img4.jpg";
import img_f_6 from "../../assets/images/Gallery/Fresher_s2K23/img6.jpg";
import img_f_8 from "../../assets/images/Gallery/Fresher_s2K23/img8.jpg";
import img_f_9 from "../../assets/images/Gallery/Fresher_s2K23/img9.jpg";
import img_f_10 from "../../assets/images/Gallery/Fresher_s2K23/img10.jpg";
import img_f_11 from "../../assets/images/Gallery/Fresher_s2K23/img11.jpg";
import img_f_12 from "../../assets/images/Gallery/Fresher_s2K23/img12.jpg";

// freshers 2k24
import img_f_13 from "../../assets/images/Gallery/Fresher_s2K24/img1.jpg";
import img_f_14 from "../../assets/images/Gallery/Fresher_s2K24/img2.jpg";
import img_f_15 from "../../assets/images/Gallery/Fresher_s2K24/img3.jpg";
import img_f_16 from "../../assets/images/Gallery/Fresher_s2K24/img4.jpg";
import img_f_17 from "../../assets/images/Gallery/Fresher_s2K24/img5.jpg";
import img_f_18 from "../../assets/images/Gallery/Fresher_s2K24/img6.jpg";
import img_f_19 from "../../assets/images/Gallery/Fresher_s2K24/img7.jpeg";
import img_f_20 from "../../assets/images/Gallery/Fresher_s2K24/img8.jpg";
import img_f_21 from "../../assets/images/Gallery/Fresher_s2K24/img9.jpg";
import img_f_22 from "../../assets/images/Gallery/Fresher_s2K24/img10.jpg";

// techspardha 2k23
import img_t_1 from "../../assets/images/Gallery/Techspardha_2K23/img1.jpg";
import img_t_2 from "../../assets/images/Gallery/Techspardha_2K23/img2.jpg";
import img_t_3 from "../../assets/images/Gallery/Techspardha_2K23/img3.jpg";
import img_t_4 from "../../assets/images/Gallery/Techspardha_2K23/img4.jpg";

// farewell
import img_fw_1 from "../../assets/images/Gallery/Farewell_22/img1.jpg";
import img_fw_2 from "../../assets/images/Gallery/Farewell_22/img2.jpg";
import img_fw_3 from "../../assets/images/Gallery/Farewell_22/img3.jpg";

function Gallery() {
  return (
    <div className="gallary-container">
      <div className="home_content">
        <div className="home_heading-1">Welcome To</div>
        <div className="home_heading-2" align="centre">
          Art Gallery of EMR Club
        </div>
      </div>

      <div className="p3">
        <h1 className="ss">Freshers 2K24</h1>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          navigation={true}
          pagination={false}
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={window.innerWidth < 768 ? 1 : "auto"}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_13} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_14} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_15} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_16} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_17} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_18} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_19} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_20} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_21} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_22} />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="p2">
        <h1 className="ss">Embedded Workshops</h1>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          navigation={true}
          pagination={false}
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={window.innerWidth < 768 ? 1 : "auto"}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_1} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_2} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_3} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_4} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_5} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_6} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_7} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_8} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_9} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_w_10} />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      
      <div className="p5">
        <h1 className="ss">Techspardha 2K23</h1>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          navigation={true}
          pagination={false}
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={window.innerWidth < 768 ? 1 : "auto"}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img6} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img4} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_t_4} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img6} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_t_1} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_t_4} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_t_3} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_t_2} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img6} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_t_1} />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="p3">
        <h1 className="ss">Freshers 2K23</h1>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          navigation={true}
          pagination={false}
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={window.innerWidth < 768 ? 1 : "auto"}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_1} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_2} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_3} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_4} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_6} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_8} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_9} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_10} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_11} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_f_12} />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="dd">
        <h1 className="ss">Freshers 2K22</h1>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          navigation={true}
          pagination={false}
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={window.innerWidth < 768 ? 1 : "auto"}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: -19,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img2} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img4} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img5} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img6} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img7} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img8} />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div>
              <img className="slide-image" src={img2} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img4} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img5} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img6} />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="p1">
        <h1 className="ss">Farewell 2K22</h1>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow]}
          navigation={true}
          pagination={false}
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={window.innerWidth < 768 ? 1 : "auto"}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img3} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img9} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img10} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_fw_1} />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_fw_2} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_fw_3} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img3} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img9} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img10} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img className="slide-image" src={img_fw_1} />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default Gallery;
