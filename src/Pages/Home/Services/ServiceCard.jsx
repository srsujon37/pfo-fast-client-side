import React from "react";
import { FaShippingFast, FaGlobeAsia, FaWarehouse, FaMoneyBillWave, FaBuilding, FaUndo } from "react-icons/fa";

const icons = {
  "Express & Standard Delivery": <FaShippingFast size={40} className="text-blue-500 mx-auto mb-2" />,
  "Nationwide Delivery": <FaGlobeAsia size={40} className="text-green-500 mx-auto mb-2" />,
  "Fulfillment Solution": <FaWarehouse size={40} className="text-purple-500 mx-auto mb-2" />,
  "Cash on Home Delivery": <FaMoneyBillWave size={40} className="text-yellow-500 mx-auto mb-2" />,
  "Corporate Service / Contract In Logistics": <FaBuilding size={40} className="text-indigo-500 mx-auto mb-2" />,
  "Parcel Return": <FaUndo size={40} className="text-pink-500 mx-auto mb-2" />,
};

const ServiceCard = ({ service }) => {

    const {title, description} = service
  return (
    <div className="bg-white hover:bg-[#CAEB66] rounded-xl shadow-md p-6 text-center hover:shadow-lg transition ">
      {icons[title]}
      <h3 className="text-2xl text-[#03373D] font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;
