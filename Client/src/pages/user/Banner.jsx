import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHandSparkles, FaImages, FaHeart, FaPlay } from "react-icons/fa6";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  EffectCoverflow,
  Pagination,
  Navigation,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Banner = () => {
  const { user } = useSelector((state) => state.auth);
  const userName =
    user?.fullName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Dear User";

  const images = [
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1000&auto=format&fit=crop&q=90",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&auto=format&fit=crop&q=90",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=90",
    "https://cdn.pixabay.com/photo/2025/04/28/19/59/female-model-9565629_640.jpg",
    "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1000&auto=format&fit=crop&q=90",
  ];

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-[#faf7ff] via-[#f3edff] to-[#e8ddff] shadow-[0_20px_60px_rgba(124,58,237,0.15)]">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      {/* Large Glow - Left */}
      <div className="absolute -left-32 -top-32 w-[420px] h-[420px] rounded-full bg-purple-300/20 blur-[90px]" />

      {/* Large Glow - Right */}
      <div className="absolute -right-32 -bottom-32 w-[450px] h-[450px] rounded-full bg-violet-400/20 blur-[100px]" />

      {/* Small Floating Balls */}
      <div className="absolute top-12 right-[42%] w-5 h-5 rounded-full bg-purple-300/60 shadow-lg" />

      <div className="absolute top-24 right-[28%] w-3 h-3 rounded-full bg-violet-400/70" />

      <div className="absolute bottom-24 left-[42%] w-8 h-8 rounded-full bg-purple-300/40 blur-sm" />

      <div className="absolute bottom-20 right-[12%] w-6 h-6 rounded-full bg-pink-300/50" />

      {/* Decorative Rings */}
      <div className="absolute right-[25%] top-10 w-32 h-32 border border-purple-300/20 rounded-full" />

      <div className="absolute right-[22%] top-7 w-44 h-44 border border-purple-300/10 rounded-full" />


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 flex flex-col lg:flex-row min-h-[520px]">

        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <div className="w-full lg:w-[43%] flex flex-col justify-center px-7 md:px-12 lg:px-14 py-12">

          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm">

            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white">

              <FaHeart className="text-xs" />

            </div>

            <span className="text-sm font-semibold text-purple-700">
              Welcome Back
            </span>

          </div>


          {/* Heading */}

          <h3 className="mt-7 text-3xl md:text-4xl font-medium text-gray-700">
            Welcome back,
          </h3>

          <div className="flex items-center gap-3 mt-1">

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent capitalize">
              {userName}
            </h1>

            <FaHandSparkles className="text-yellow-400 text-3xl md:text-4xl animate-pulse" />

          </div>


          {/* Subtitle */}

          <p className="mt-5 text-lg md:text-xl text-gray-500">
            Relive your beautiful moments
          </p>


          {/* Divider */}

          <div className="flex items-center gap-3 mt-6 max-w-[380px]">

            <div className="h-[1px] flex-1 bg-purple-200" />

            <FaHeart className="text-purple-500 text-sm" />

            <div className="h-[1px] flex-1 bg-purple-200" />

          </div>


          {/* Your Memories Glass Card */}

          <div className="mt-7 max-w-[390px] rounded-2xl bg-white/45 backdrop-blur-xl border border-white/80 shadow-[0_10px_40px_rgba(124,58,237,0.08)] p-5">

            <div className="flex items-center gap-4">

              {/* Icon */}

              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-purple-300/40">

                <FaImages className="text-2xl" />

              </div>


              <div>

                <h3 className="text-lg font-bold text-purple-700">
                  Your Memories
                </h3>

                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                  Every picture has a story.
                  <br />
                  Every moment is special.
                </p>

              </div>

            </div>

          </div>


          {/* Explore Button */}

          <Link
            to="/albums"
            className="
              mt-7
              w-fit
              flex
              items-center
              gap-3
              px-6
              py-3.5
              rounded-xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-purple-600
              to-violet-600
              shadow-lg
              shadow-purple-300/40
              hover:shadow-purple-400/50
              hover:-translate-y-1
              active:translate-y-0
              transition-all
              duration-300
            "
          >

            <FaImages />

            Explore Memories

          </Link>

        </div>


        {/* =====================================================
            RIGHT - 3D IMAGE SLIDER
        ====================================================== */}

        <div className="w-full lg:w-[57%] flex items-center justify-center relative px-4 md:px-8 pb-10 lg:pb-0">

          {/* Slider Glow */}

          <div className="absolute w-[380px] md:w-[500px] h-[380px] md:h-[500px] rounded-full bg-purple-300/20 blur-[70px]" />


          {/* 3D Platform */}

          <div
            className="
              absolute
              bottom-12
              md:bottom-16
              w-[330px]
              md:w-[520px]
              h-[55px]
              md:h-[70px]
              rounded-[50%]
              bg-white/40
              backdrop-blur-xl
              border border-white/70
              shadow-[0_20px_50px_rgba(124,58,237,0.2)]
            "
          />


          {/* Swiper */}

          <div className="relative z-10 w-full max-w-[560px]">

            <Swiper
              modules={[
                Autoplay,
                EffectCoverflow,
                Pagination,
                Navigation,
              ]}

              effect="coverflow"

              grabCursor={true}

              centeredSlides={true}

              slidesPerView={1.35}

              spaceBetween={10}

              loop={true}

              speed={900}

              autoplay={{
                delay: 2800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}

              coverflowEffect={{
                rotate: 12,
                stretch: 0,
                depth: 180,
                modifier: 1.2,
                slideShadows: false,
              }}

              pagination={{
                clickable: true,
              }}

              navigation={{
                nextEl: ".banner-next",
                prevEl: ".banner-prev",
              }}

              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                },

                768: {
                  slidesPerView: 1.65,
                },

                1024: {
                  slidesPerView: 1.55,
                },

                1280: {
                  slidesPerView: 1.65,
                },
              }}

              className="premium-memory-slider"
            >

              {images.map((image, index) => (

                <SwiperSlide key={index}>

                  <div
                    className="
                      group
                      relative
                      h-[300px]
                      md:h-[350px]
                      lg:h-[390px]
                      rounded-[28px]
                      overflow-hidden
                      border-[5px]
                      border-white/70
                      bg-white/30
                      backdrop-blur-xl
                      shadow-[0_25px_60px_rgba(91,33,182,0.25)]
                    "
                  >

                    {/* Image */}

                    <img
                      src={image}
                      alt={`Wedding Memory ${index + 1}`}
                      className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                      "
                    />


                    {/* Image Gradient */}

                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-white/10 pointer-events-none" />


                    {/* Glass Label */}

                    <div className="absolute bottom-4 left-4 right-4">

                      <div className="flex items-center justify-between rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 px-4 py-3">

                        <div>

                          <p className="text-white font-semibold text-sm">
                            Beautiful Memory
                          </p>

                          <p className="text-white/80 text-xs mt-1">
                            Moment #{index + 1}
                          </p>

                        </div>

                        <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white">

                          <FaHeart className="text-sm" />

                        </div>

                      </div>

                    </div>

                  </div>

                </SwiperSlide>

              ))}

            </Swiper>


            {/* =================================================
                NAVIGATION ARROWS
            ================================================== */}

            <button
              className="
                banner-prev
                absolute
                z-30
                left-1
                md:-left-2
                top-1/2
                -translate-y-1/2
                w-11
                h-11
                rounded-full
                bg-white/50
                backdrop-blur-xl
                border
                border-white/80
                shadow-lg
                flex
                items-center
                justify-center
                text-purple-600
                hover:bg-white
                hover:scale-110
                transition-all
              "
            >
              ‹
            </button>


            <button
              className="
                banner-next
                absolute
                z-30
                right-1
                md:-right-2
                top-1/2
                -translate-y-1/2
                w-11
                h-11
                rounded-full
                bg-white/50
                backdrop-blur-xl
                border
                border-white/80
                shadow-lg
                flex
                items-center
                justify-center
                text-purple-600
                hover:bg-white
                hover:scale-110
                transition-all
              "
            >
              ›
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM STATS GLASS BAR
      ====================================================== */}

      {/* <div className="relative z-20 px-5 md:px-10 pb-6">

        <div
          className="
            rounded-2xl
            bg-white/40
            backdrop-blur-2xl
            border
            border-white/70
            shadow-[0_10px_40px_rgba(124,58,237,0.08)]
            px-5
            md:px-8
            py-5
          "
        >

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">


            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">

                <FaImages />

              </div>

              <div>

                <p className="text-xl font-bold text-gray-700">
                  500+
                </p>

                <p className="text-xs text-gray-500">
                  Photos
                </p>

              </div>

            </div>



            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">

                <FaPlay />

              </div>

              <div>

                <p className="text-xl font-bold text-gray-700">
                  50+
                </p>

                <p className="text-xs text-gray-500">
                  Videos
                </p>

              </div>

            </div>



            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-red-500">

                <FaHeart />

              </div>

              <div>

                <p className="text-xl font-bold text-gray-700">
                  Unlimited
                </p>

                <p className="text-xs text-gray-500">
                  Memories
                </p>

              </div>

            </div>



            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">

                <FaImages />

              </div>

              <div>

                <p className="text-xl font-bold text-gray-700">
                  Your
                </p>

                <p className="text-xs text-gray-500">
                  Digital Album
                </p>

              </div>

            </div>

          </div>

        </div>

      </div> */}


      {/* =====================================================
          CUSTOM SWIPER PAGINATION STYLE
      ====================================================== */}

      <style>{`

        .premium-memory-slider {
          padding: 30px 5px 55px !important;
        }

        .premium-memory-slider
        .swiper-slide {
          transition:
            transform 0.7s ease,
            opacity 0.7s ease,
            filter 0.7s ease;
        }

        .premium-memory-slider
        .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.65;
          filter: blur(0.5px);
        }

        .premium-memory-slider
        .swiper-slide-active {
          opacity: 1;
        }

        .premium-memory-slider
        .swiper-pagination {
          bottom: 8px !important;
        }

        .premium-memory-slider
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #a78bfa;
          opacity: 0.35;
          transition: all 0.3s ease;
        }

        .premium-memory-slider
        .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 10px;
          background: #7c3aed;
          opacity: 1;
        }

      `}</style>

    </div>
  );
};

export default Banner;