import React from 'react';
import BangladeshMap from './BangladeshMap';
import { useLoaderData } from 'react-router';


const Coverage = () => {
    const serviceCenters = useLoaderData();
    return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
        We are available in 64 districts
      </h2>

      {/* Search box later here */}

      <BangladeshMap serviceCenters={serviceCenters} />
    </div>
    );
};

export default Coverage;