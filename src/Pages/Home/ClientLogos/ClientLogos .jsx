import React from 'react';
import Marquee from 'react-fast-marquee';
import logo1 from '../../../assets/brands/amazon.png';
import logo2 from '../../../assets/brands/amazon_vector.png';
import logo3 from '../../../assets/brands/casio.png';
import logo4 from '../../../assets/brands/moonstar.png';
import logo5 from '../../../assets/brands/randstad.png';
import logo6 from '../../../assets/brands/start-people 1.png';
import logo7 from '../../../assets/brands/start.png';

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const ClientLogos = () => {
  return (
    <div className="bg-gray-100 py-10">
      <h2 className="text-3xl font-bold text-[#03373D] text-center mb-12">We've helped thousands of sales teams</h2>
      <Marquee speed={50} pauseOnHover={true} gradient={false}>
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index}`}
            className="h-6 mx-12"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default ClientLogos;
