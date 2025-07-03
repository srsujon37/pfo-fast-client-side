import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const BeARider = () => {
  const { user } = useAuth();
  const mapData = useLoaderData();
  const [selectedRegion, setSelectedRegion] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const axiosSecure = useAxiosSecure()

  // Extract unique regions
  const uniqueRegions = [...new Set(mapData.map(item => item.region))];

  useEffect(() => {
    if (selectedRegion) {
      const districts = mapData
        .filter(item => item.region === selectedRegion)
        .map(item => item.district);
      setFilteredDistricts([...new Set(districts)]);
    } else {
      setFilteredDistricts([]);
    }
  }, [selectedRegion, mapData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const riderData = {
      name: user?.displayName,
      email: user?.email,
      age: form.age.value,
      region: form.region.value,
      district: form.district.value,
      phone: form.phone.value,
      nid: form.nid.value,
      bikeBrand: form.bikeBrand.value,
      bikeReg: form.bikeReg.value,
      status: 'pending'
    };

    // Replace this with axios/fetch to your server
    console.log(riderData);

    axiosSecure.post('/riders', riderData)
        .then(res => {
            if(res.data.insertedId){
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'Your rider application has been submitted successfully.',
                });
            }
        })
    
    // Swal.fire({
    //   icon: 'success',
    //   title: 'Application Submitted!',
    //   text: 'Your rider application has been submitted successfully.',
    // });

    form.reset();
    setSelectedRegion('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Be A Rider</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={user?.displayName}
            readOnly
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={user?.email}
            readOnly
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Age</label>
          <input
            type="number"
            name="age"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Region</label>
            <select
              name="region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Region</option>
              {uniqueRegions.map((region, idx) => (
                <option key={idx} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">District</label>
            <select
              name="district"
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select District</option>
              {filteredDistricts.map((district, idx) => (
                <option key={idx} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phone"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">NID Card Number</label>
          <input
            type="text"
            name="nid"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bike Brand</label>
          <input
            type="text"
            name="bikeBrand"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bike Registration Number</label>
          <input
            type="text"
            name="bikeReg"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeARider;
