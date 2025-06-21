import React from "react";
import { GrDeliver } from "react-icons/gr";

const HowItWorks = () => {
  return (
    <div className="mt-16 mb-16 bg-[#eaeced] p-6">
        <div>
            <h2 className="text-2xl text-[#03373D] font-bold mb-2">How it Works</h2>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
        {/* card 1 */}
        <div className="bg-white shadow rounded-3xl space-y-4 p-8">
          <GrDeliver size={40} color="#03373D" />
          <h3 className="text-xl text-[#03373D] font-bold">
            Booking Pick & Drop
          </h3>
          <p className="text-[#606060] font-medium">
            From personal packages to business shipments — we deliver on time,
            every time.
          </p>
        </div>
        {/* card 2 */}
        <div className="bg-white shadow rounded-3xl space-y-4 p-8">
          <GrDeliver size={40} color="#03373D" />
          <h3 className="text-xl text-[#03373D] font-bold">
            Cash On Delivery
          </h3>
          <p className="text-[#606060] font-medium">
            From personal packages to business shipments — we deliver on time,
            every time.
          </p>
        </div>
        {/* card 3 */}
        <div className="bg-white shadow rounded-3xl space-y-4 p-8">
          <GrDeliver size={40} color="#03373D" />
          <h3 className="text-xl text-[#03373D] font-bold">
            Delivery Hub
          </h3>
          <p className="text-[#606060] font-medium">
            From personal packages to business shipments — we deliver on time,
            every time.
          </p>
        </div>
        {/* card 4 */}
        <div className="bg-white shadow rounded-3xl space-y-4 p-8">
          <GrDeliver size={40} color="#03373D" />
          <h3 className="text-xl text-[#03373D] font-bold">
            Booking SME & Corporate
          </h3>
          <p className="text-[#606060] font-medium">
            From personal packages to business shipments — we deliver on time,
            every time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
