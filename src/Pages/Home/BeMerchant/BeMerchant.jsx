import React from "react";
import locationMerchant from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div data-aos="fade-up" data-aos-anchor-placement="bottom-center"
      className="bg-[#03373D] bg-[url(assets/be-a-merchant-bg.png)] p-20 rounded-4xl bg-no-repeat mb-10"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={locationMerchant} className="max-w-sm rounded-lg" />
        <div>
          <h1 className="text-5xl text-white font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="text-[#DADADA] py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="btn rounded-4xl mr-2.5 bg-[#CAEB66]">
            Become a Merchant
          </button>
          <button className="btn btn-outline btn-warning rounded-4xl">
            Earn with Profast Courier
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
