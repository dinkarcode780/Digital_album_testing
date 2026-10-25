// import React from "react";
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaWhatsapp,
//   FaQuestionCircle,
// } from "react-icons/fa";

// const faqs = [
//   {
//     id: 1,
//     question: "How can I download my selected photos?",
//     answer: "After the studio approves your selection, the Download button will appear in your album.",
//   },
//   {
//     id: 2,
//     question: "Can I change my selected photos later?",
//     answer: "Yes, until the studio locks your selection, you can modify it anytime.",
//   },
//   {
//     id: 3,
//     question: "Why can't I download videos?",
//     answer: "Video downloads depend on the permissions given by the studio.",
//   },
// ];

// const Support = () => {
//   return (
//     <div className="max-w-7xl mx-auto px-5 py-8">

//       {/* Heading */}

//       <div className="text-center">

//         <h1 className="text-4xl font-bold">
//           Help & Support
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Need help? Contact us or raise a support request.
//         </p>

//       </div>

//       {/* Contact Cards */}

//       <div className="grid md:grid-cols-3 gap-6 mt-10">

//         <div className="bg-white rounded-xl shadow p-6 text-center">

//           <FaPhoneAlt
//             className="mx-auto text-purple-600"
//             size={35}
//           />

//           <h3 className="font-bold mt-4">
//             Phone
//           </h3>

//           <p className="text-gray-500 mt-2">
//             +91 9876543210
//           </p>

//         </div>

//         <div className="bg-white rounded-xl shadow p-6 text-center">

//           <FaEnvelope
//             className="mx-auto text-purple-600"
//             size={35}
//           />

//           <h3 className="font-bold mt-4">
//             Email
//           </h3>

//           <p className="text-gray-500 mt-2">
//             support@albumstudio.com
//           </p>

//         </div>

//         <div className="bg-white rounded-xl shadow p-6 text-center">

//           <FaMapMarkerAlt
//             className="mx-auto text-purple-600"
//             size={35}
//           />

//           <h3 className="font-bold mt-4">
//             Address
//           </h3>

//           <p className="text-gray-500 mt-2">
//             Begusarai, Bihar
//           </p>

//         </div>

//       </div>

//       {/* Support Form */}

//       <div className="bg-white rounded-xl shadow mt-10 p-6">

//         <h2 className="text-2xl font-bold mb-6">
//           Raise a Support Ticket
//         </h2>

//         <div className="grid md:grid-cols-2 gap-5">

//           <input
//             type="text"
//             placeholder="Your Name"
//             className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
//           />

//           <input
//             type="email"
//             placeholder="Email Address"
//             className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
//           />

//         </div>

//         <input
//           type="text"
//           placeholder="Subject"
//           className="border rounded-lg px-4 py-3 mt-5 w-full outline-none focus:ring-2 focus:ring-purple-500"
//         />

//         <textarea
//           rows="5"
//           placeholder="Describe your issue..."
//           className="border rounded-lg px-4 py-3 mt-5 w-full outline-none focus:ring-2 focus:ring-purple-500 resize-none"
//         ></textarea>

//         <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg">

//           Submit Ticket

//         </button>

//       </div>

//       {/* FAQ */}

//       <div className="mt-12">

//         <h2 className="text-2xl font-bold mb-6">
//           Frequently Asked Questions
//         </h2>

//         <div className="space-y-5">

//           {faqs.map((faq) => (

//             <div
//               key={faq.id}
//               className="bg-white rounded-xl shadow p-5"
//             >

//               <div className="flex items-center gap-3">

//                 <FaQuestionCircle className="text-purple-600" />

//                 <h3 className="font-semibold">
//                   {faq.question}
//                 </h3>

//               </div>

//               <p className="text-gray-500 mt-3">
//                 {faq.answer}
//               </p>

//             </div>

//           ))}

//         </div>

//       </div>

//       {/* WhatsApp */}

//       <div className="bg-green-500 text-white rounded-xl mt-10 p-6 flex justify-between items-center flex-col md:flex-row gap-4">

//         <div>

//           <h2 className="text-2xl font-bold">
//             Need Instant Help?
//           </h2>

//           <p className="mt-2">
//             Chat with our support team on WhatsApp.
//           </p>

//         </div>

//         <button className="bg-white text-green-600 px-6 py-3 rounded-lg flex items-center gap-2 font-semibold">

//           <FaWhatsapp />

//           Chat Now

//         </button>

//       </div>

//     </div>
//   );
// };

// export default Support;

import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaQuestionCircle,
  FaChevronDown,
  FaArrowRight,
  FaHeadset,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";

const faqs = [
  {
    id: 1,
    question: "How can I download my selected photos?",
    answer:
      "After the studio approves your selection, the Download button will appear in your album.",
  },
  {
    id: 2,
    question: "Can I change my selected photos later?",
    answer:
      "Yes, until the studio locks your selection, you can modify it anytime.",
  },
  {
    id: 3,
    question: "Why can't I download videos?",
    answer:
      "Video downloads depend on the permissions given by the studio.",
  },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#faf8ff] via-[#f5f1ff] to-[#eee8ff] px-4 py-8 md:px-8">

      {/* =====================================================
          BACKGROUND ANIMATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 animate-pulse rounded-full bg-purple-300/20 blur-3xl" />

      <div
        className="pointer-events-none absolute -right-32 top-[35%] h-96 w-96 rounded-full bg-violet-300/20 blur-3xl"
        style={{
          animation: "float 7s ease-in-out infinite",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-[35%] h-72 w-72 rounded-full bg-fuchsia-200/20 blur-3xl"
        style={{
          animation: "float 9s ease-in-out infinite reverse",
        }}
      />

      {/* Floating dots */}

      <div className="pointer-events-none absolute left-[12%] top-[20%] h-3 w-3 animate-bounce rounded-full bg-purple-400/40" />

      <div className="pointer-events-none absolute right-[15%] top-[18%] h-4 w-4 animate-pulse rounded-full bg-violet-400/40" />

      <div className="pointer-events-none absolute bottom-[25%] right-[30%] h-2 w-2 animate-ping rounded-full bg-purple-500/50" />


      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =====================================================
            HERO
        ====================================================== */}

        <div className="mb-10 text-center">

          {/* Badge */}

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-xl">

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white">

              <FaHeadset className="text-xs" />

            </span>

            <span className="text-sm font-semibold text-purple-700">
              We're here to help
            </span>

          </div>


          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 md:text-5xl">

            Help &{" "}

            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">

              Support

            </span>

          </h1>


          <p className="mx-auto mt-4 max-w-2xl text-gray-500 md:text-lg">

            Need help with your digital album?
            Contact us or raise a support request.
            We're always happy to help.

          </p>


          {/* Status */}

          <div className="mt-5 inline-flex items-center gap-2 text-sm text-gray-500">

            <span className="relative flex h-3 w-3">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />

            </span>

            Support team is online

          </div>

        </div>


        {/* =====================================================
            CONTACT CARDS
        ====================================================== */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* PHONE */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/70
              bg-white/50
              p-7
              text-center
              shadow-[0_15px_40px_rgba(124,58,237,0.08)]
              backdrop-blur-xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-[0_25px_60px_rgba(124,58,237,0.18)]
            "
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-200/30 transition-transform duration-500 group-hover:scale-150" />


            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-300/40 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">

              <FaPhoneAlt className="text-xl" />

            </div>


            <h3 className="relative mt-5 text-xl font-bold text-gray-800">
              Phone
            </h3>

            <p className="relative mt-2 text-gray-500">
              +91 9876543210
            </p>


            <button className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition-all hover:gap-3">

              Call Support

              <FaArrowRight className="text-xs" />

            </button>

          </div>


          {/* EMAIL */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/70
              bg-white/50
              p-7
              text-center
              shadow-[0_15px_40px_rgba(124,58,237,0.08)]
              backdrop-blur-xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-[0_25px_60px_rgba(124,58,237,0.18)]
            "
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-200/30 transition-transform duration-500 group-hover:scale-150" />


            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-300/40 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">

              <FaEnvelope className="text-xl" />

            </div>


            <h3 className="relative mt-5 text-xl font-bold text-gray-800">
              Email
            </h3>

            <p className="relative mt-2 text-gray-500">
              support@albumstudio.com
            </p>


            <button className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition-all hover:gap-3">

              Send Email

              <FaArrowRight className="text-xs" />

            </button>

          </div>


          {/* ADDRESS */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/70
              bg-white/50
              p-7
              text-center
              shadow-[0_15px_40px_rgba(124,58,237,0.08)]
              backdrop-blur-xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-[0_25px_60px_rgba(124,58,237,0.18)]
            "
          >

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-fuchsia-200/30 transition-transform duration-500 group-hover:scale-150" />


            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-300/40 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">

              <FaMapMarkerAlt className="text-xl" />

            </div>


            <h3 className="relative mt-5 text-xl font-bold text-gray-800">
              Address
            </h3>

            <p className="relative mt-2 text-gray-500">
              Begusarai, Bihar
            </p>


            <button className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition-all hover:gap-3">

              View Location

              <FaArrowRight className="text-xs" />

            </button>

          </div>

        </div>


        {/* =====================================================
            SUPPORT FORM + SIDE INFO
        ====================================================== */}

        <div className="mt-10 grid gap-7 lg:grid-cols-[1.5fr_0.8fr]">

          {/* FORM */}

          <div className="rounded-3xl border border-white/70 bg-white/55 p-6 shadow-[0_20px_60px_rgba(124,58,237,0.1)] backdrop-blur-2xl md:p-8">

            <div className="mb-7">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                  <FaPaperPlane />

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    Raise a Support Ticket
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Tell us what you need help with.
                  </p>

                </div>

              </div>

            </div>


            <div className="grid gap-5 md:grid-cols-2">

              <input
                type="text"
                placeholder="Your Name"
                className="
                  w-full
                  rounded-xl
                  border
                  border-purple-100
                  bg-white/70
                  px-4
                  py-3.5
                  outline-none
                  transition-all
                  placeholder:text-gray-400
                  focus:border-purple-400
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

              <input
                type="email"
                placeholder="Email Address"
                className="
                  w-full
                  rounded-xl
                  border
                  border-purple-100
                  bg-white/70
                  px-4
                  py-3.5
                  outline-none
                  transition-all
                  placeholder:text-gray-400
                  focus:border-purple-400
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

            </div>


            <input
              type="text"
              placeholder="Subject"
              className="
                mt-5
                w-full
                rounded-xl
                border
                border-purple-100
                bg-white/70
                px-4
                py-3.5
                outline-none
                transition-all
                placeholder:text-gray-400
                focus:border-purple-400
                focus:ring-4
                focus:ring-purple-100
              "
            />


            <textarea
              rows="5"
              placeholder="Describe your issue..."
              className="
                mt-5
                w-full
                resize-none
                rounded-xl
                border
                border-purple-100
                bg-white/70
                px-4
                py-3.5
                outline-none
                transition-all
                placeholder:text-gray-400
                focus:border-purple-400
                focus:ring-4
                focus:ring-purple-100
              "
            />


            <button
              className="
                group
                mt-6
                flex
                items-center
                gap-3
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-violet-600
                px-7
                py-3.5
                font-semibold
                text-white
                shadow-lg
                shadow-purple-300/40
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                hover:shadow-purple-300/50
                active:translate-y-0
              "
            >

              Submit Ticket

              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

            </button>

          </div>


          {/* SIDE CARD */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 p-7 text-white shadow-[0_20px_60px_rgba(124,58,237,0.25)]">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10" />


            <div className="relative">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl">

                <FaHeadset className="text-2xl" />

              </div>


              <h2 className="mt-6 text-2xl font-bold">
                We're here for you
              </h2>

              <p className="mt-3 leading-relaxed text-purple-100">
                Our support team is ready to help you with your photos,
                videos and digital album.
              </p>


              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md">

                  <FaClock />

                  <div>

                    <p className="font-semibold">
                      Support Hours
                    </p>

                    <p className="text-sm text-purple-100">
                      Mon - Sat · 9 AM - 7 PM
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md">

                  <FaEnvelope />

                  <div>

                    <p className="font-semibold">
                      Response Time
                    </p>

                    <p className="text-sm text-purple-100">
                      Usually within 24 hours
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            FAQ
        ====================================================== */}

        <div className="mt-12">

          <div className="mb-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                <FaQuestionCircle />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Frequently Asked Questions
                </h2>

                <p className="text-sm text-gray-500">
                  Quick answers to common questions.
                </p>

              </div>

            </div>

          </div>


          <div className="space-y-4">

            {faqs.map((faq) => {

              const isOpen = openFaq === faq.id;

              return (

                <div
                  key={faq.id}
                  className={`
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-white/55
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    ${
                      isOpen
                        ? "border-purple-300 shadow-lg shadow-purple-100"
                        : "border-white/70 shadow-sm hover:border-purple-200 hover:shadow-md"
                    }
                  `}
                >

                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          transition-all
                          duration-300
                          ${
                            isOpen
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-600"
                          }
                        `}
                      >

                        <FaQuestionCircle />

                      </div>


                      <span className="font-semibold text-gray-800">
                        {faq.question}
                      </span>

                    </div>


                    <FaChevronDown
                      className={`
                        flex-shrink-0
                        text-purple-500
                        transition-transform
                        duration-300
                        ${isOpen ? "rotate-180" : ""}
                      `}
                    />

                  </button>


                  <div
                    className={`
                      grid transition-all duration-300
                      ${
                        isOpen
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]"
                      }
                    `}
                  >

                    <div className="overflow-hidden">

                      <p className="px-5 pb-5 pl-[76px] leading-relaxed text-gray-500">

                        {faq.answer}

                      </p>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        </div>


        {/* =====================================================
            WHATSAPP CTA
        ====================================================== */}

        <div className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#10b981] p-7 text-white shadow-[0_20px_60px_rgba(22,163,74,0.2)] md:p-9">

          {/* Decorative circles */}

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 left-[40%] h-52 w-52 rounded-full bg-white/10" />


          <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">

            <div className="flex items-center gap-5">

              <div className="flex h-16 w-16 flex-shrink-0 animate-pulse items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl">

                <FaWhatsapp className="text-3xl" />

              </div>


              <div>

                <h2 className="text-2xl font-bold">
                  Need Instant Help?
                </h2>

                <p className="mt-1 text-green-50">
                  Chat directly with our support team on WhatsApp.
                </p>

              </div>

            </div>


            <button
              className="
                group
                flex
                items-center
                gap-3
                rounded-xl
                bg-white
                px-7
                py-3.5
                font-bold
                text-green-600
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              <FaWhatsapp className="text-lg" />

              Chat Now

              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          CUSTOM ANIMATION
      ====================================================== */}

      <style>{`

        @keyframes float {

          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-20px);
          }

          100% {
            transform: translateY(0px);
          }

        }

      `}</style>

    </div>
  );
};

export default Support;