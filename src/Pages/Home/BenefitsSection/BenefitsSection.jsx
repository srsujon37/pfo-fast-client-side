import React from "react";
import trackImg from "../../../assets/live-tracking.png";
import safeImg from "../../../assets/safe-delivery.png";
import supportImg from "../../../assets/safe-delivery.png";


const benefits = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: trackImg,
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: safeImg,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: supportImg,
  },
];

const BenefitsSection = () => {
  return (
    <div className="bg-gray-50 py-10">
      {/* Top dotted line */}
      <div className="border-t border-dashed border-l-2 border-green-800 w-full mb-20 mt-7 "></div>

      <div className="container mx-auto px-4 space-y-10 ">
        {benefits.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-center bg-white rounded-4xl shadow-sm p-6 gap-6 "
          >
            {/* Left Image */}
            <div className="w-full md:w-1/4 flex justify-center">
              <img src={item.image} alt={item.title} className="max-h-32" />
            </div>

            {/* Vertical Dotted Line */}
            <div className="hidden md:block border-l-2 border-dashed border-green-700 h-24"></div>

            {/* Right Content */}
            <div className="w-full md:w-3/4 text-center md:text-left space-y-2">
              <h3 className="text-xl font-extrabold text-[#03373D]">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom dotted line */}
      <div className="border-t border-dashed border-l-2 border-green-800 w-full mt-20 mb-8"></div>
    </div>
  );
};

export default BenefitsSection;
