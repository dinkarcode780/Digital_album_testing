// import React from "react";
// import { FaStar, FaQuoteLeft } from "react-icons/fa";

// import { Swiper, SwiperSlide } from "swiper/react";
// import {
//   EffectCoverflow,
//   Pagination,
//   Autoplay,
// } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/pagination";

// const testimonials = [
//   {
//     id: 1,
//     name: "Rahul Kumar",
//     event: "Wedding Photography",
//     image: "https://i.pravatar.cc/150?img=1",
//     rating: 5,
//     review:
//       "Amazing experience! The team captured every beautiful moment perfectly. Highly recommended.",
//   },
//   {
//     id: 2,
//     name: "Priya Sharma",
//     event: "Pre Wedding Shoot",
//     image: "https://i.pravatar.cc/150?img=5",
//     rating: 5,
//     review:
//       "The photos and cinematic videos were beyond our expectations. Thank you Album Studio!",
//   },
//   {
//     id: 3,
//     name: "Ankit Singh",
//     event: "Engagement",
//     image: "https://i.pravatar.cc/150?img=12",
//     rating: 4,
//     review:
//       "Professional photographers and quick delivery. Loved the editing quality.",
//   },
//   {
//     id: 4,
//     name: "Neha Kumari",
//     event: "Birthday Shoot",
//     image: "https://i.pravatar.cc/150?img=20",
//     rating: 5,
//     review:
//       "Beautiful memories captured forever. The album quality is excellent.",
//   },
//   {
//     id: 5,
//     name: "Rohit Raj",
//     event: "Wedding",
//     image: "https://i.pravatar.cc/150?img=15",
//     rating: 5,
//     review:
//       "Very cooperative team. Every photo tells a story. We are extremely happy.",
//   },
//   {
//     id: 6,
//     name: "Sneha Verma",
//     event: "Reception",
//     image: "https://i.pravatar.cc/150?img=32",
//     rating: 4,
//     review:
//       "Excellent service and timely delivery. Highly satisfied with the work.",
//   },
// ];

// const Testimonials = () => {
//   return (
//     <section className="max-w-7xl mx-auto px-5 py-14">

//       {/* Heading */}

//       <div className="text-center mb-12">

//         <h2 className="text-4xl font-bold">
//           What Our Clients Say
//         </h2>

//         <p className="text-gray-500 mt-3">
//           Thousands of beautiful memories delivered with love ❤️
//         </p>

//       </div>

//       {/* Slider */}

//       <Swiper
//         effect={"coverflow"}
//         grabCursor={true}
//         centeredSlides={true}
//         loop={true}
//         slidesPerView={"auto"}
//         speed={1000}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//         }}
//         coverflowEffect={{
//           rotate: 0,
//           stretch: 0,
//           depth: 180,
//           modifier: 2,
//           slideShadows: false,
//           scale: 0.9,
//         }}
//         pagination={{
//           clickable: true,
//         }}
//         modules={[
//           EffectCoverflow,
//           Pagination,
//           Autoplay,
//         ]}
//         className="py-8 pb-16"
//       >
//         {testimonials.map((item) => (
//           <SwiperSlide
//             key={item.id}
//             className="!w-[340px]"
//           >
//             <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl duration-500 p-7">

//               {/* Quote */}

//               <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

//                 <FaQuoteLeft className="text-purple-600 text-2xl" />

//               </div>

//               {/* Review */}

//               <p className="text-gray-600 mt-6 leading-8 min-h-[130px]">
//                 {item.review}
//               </p>

//               {/* Rating */}

//               <div className="flex gap-1 mt-5">

//                 {[...Array(item.rating)].map((_, index) => (
//                   <FaStar
//                     key={index}
//                     className="text-yellow-400"
//                   />
//                 ))}

//               </div>

//               {/* User */}

//               <div className="flex items-center gap-4 mt-7">

//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-16 h-16 rounded-full border-4 border-purple-100 object-cover"
//                 />

//                 <div>

//                   <h3 className="font-bold text-lg">
//                     {item.name}
//                   </h3>

//                   <p className="text-sm text-gray-500">
//                     {item.event}
//                   </p>

//                 </div>

//               </div>

//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//     </section>
//   );
// };

// export default Testimonials;

import React from "react";
import { FaStar, FaQuoteLeft, FaHeart } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Rahul Kumar",
    event: "Wedding Photography",
    image: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    review:
      "Amazing experience! The team captured every beautiful moment perfectly. Highly recommended.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    event: "Pre Wedding Shoot",
    image: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    review:
      "The photos and cinematic videos were beyond our expectations. Thank you Album Studio!",
  },
  {
    id: 3,
    name: "Ankit Singh",
    event: "Engagement",
    image: "https://i.pravatar.cc/150?img=12",
    rating: 4,
    review:
      "Professional photographers and quick delivery. Loved the editing quality.",
  },
  {
    id: 4,
    name: "Neha Kumari",
    event: "Birthday Shoot",
    image: "https://i.pravatar.cc/150?img=20",
    rating: 5,
    review:
      "Beautiful memories captured forever. The album quality is excellent.",
  },
  {
    id: 5,
    name: "Rohit Raj",
    event: "Wedding",
    image: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    review:
      "Very cooperative team. Every photo tells a story. We are extremely happy.",
  },
  {
    id: 6,
    name: "Sneha Verma",
    event: "Reception",
    image: "https://i.pravatar.cc/150?img=32",
    rating: 4,
    review:
      "Excellent service and timely delivery. Highly satisfied with the work.",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-page">

      {/* Background */}
      <div className="testimonial-orb testimonial-orb-one" />
      <div className="testimonial-orb testimonial-orb-two" />

      {/* ================= HEADER ================= */}
      <div className="testimonial-header">

        <div className="testimonial-eyebrow">
          <span />
          <FaHeart />
          <span>WORDS FROM OUR CLIENTS</span>
          <span />
        </div>

        <h2 className="testimonial-title">
          Love That
          <span>Speaks For Us</span>
        </h2>

        <p className="testimonial-subtitle">
          Every celebration has a story. Here are a few words from
          the beautiful people who trusted us with theirs.
        </p>

      </div>


      {/* ================= SLIDER ================= */}
      <div className="testimonial-slider-wrap">

        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView="auto"
          speed={900}
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 180,
            modifier: 1.8,
            slideShadows: false,
            scale: 0.86,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[
            EffectCoverflow,
            Pagination,
            Autoplay,
          ]}
          className="testimonial-swiper"
        >

          {testimonials.map((item, index) => (
            <SwiperSlide
              key={item.id}
              className="!w-[350px] testimonial-slide"
            >

              <article className="testimonial-card">

                {/* Top decoration */}
                <div className="testimonial-card-top">

                  <div className="testimonial-quote">
                    <FaQuoteLeft />
                  </div>

                  <span className="testimonial-number">
                    0{index + 1}
                  </span>

                </div>


                {/* Review */}
                <p className="testimonial-review">
                  "{item.review}"
                </p>


                {/* Stars */}
                <div className="testimonial-stars">

                  {[...Array(5)].map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={
                        starIndex < item.rating
                          ? "star-active"
                          : "star-inactive"
                      }
                    />
                  ))}

                  <span>
                    {item.rating}.0
                  </span>

                </div>


                {/* Divider */}
                <div className="testimonial-divider">
                  <span />
                  <FaHeart />
                  <span />
                </div>


                {/* User */}
                <div className="testimonial-user">

                  <div className="testimonial-avatar">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="testimonial-avatar-ring" />

                  </div>

                  <div className="testimonial-user-info">

                    <h3>{item.name}</h3>

                    <p>{item.event}</p>

                  </div>

                </div>

              </article>

            </SwiperSlide>
          ))}

        </Swiper>

      </div>


      {/* Bottom text */}
      <div className="testimonial-bottom">
        <span className="testimonial-bottom-line" />

        <p>
          Creating memories that stay forever.
        </p>

        <span className="testimonial-bottom-line" />
      </div>

    </section>
  );
};

export default Testimonials;