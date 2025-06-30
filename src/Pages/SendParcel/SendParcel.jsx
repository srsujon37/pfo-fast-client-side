import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Swal from 'sweetalert2';
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const SendParcel = () => {
  const [deliveryCost, setDeliveryCost] = useState(0);
  const navigate = useNavigate();
  const serviceCenters = useLoaderData();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const axiosSecure = useAxiosSecure();

  // Generate a unique tracking ID (combination of letters and numbers)
  const generateTrackingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let trackingId = '';
    for (let i = 0; i < 10; i++) {
      trackingId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return trackingId;
  };

  // Extract unique regions
  const uniqueRegions = [...new Set(serviceCenters.map((w) => w.region))];
  
  // Get districts by region
  const getDistrictsByRegion = (region) => 
    serviceCenters.filter((w) => w.region === region).map((w) => w.district);

  const parcelType = watch("parcelType");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");
  const weight = watch("weight");

  const calculateCost = (data) => {
    const isSameDistrict = senderRegion === receiverRegion;
    const weightValue = parseFloat(data.weight) || 0;
    let breakdown = [];

    if (data.parcelType === "document") {
      const cost = isSameDistrict ? 60 : 80;
      breakdown.push({
        description: `Document (${isSameDistrict ? 'Same District' : 'Different District'})`,
        amount: cost
      });
      return { total: cost, breakdown };
    } 
    else {
      if (weightValue <= 3) {
        const cost = isSameDistrict ? 110 : 150;
        breakdown.push({
          description: `Non-Document (Up to 3kg, ${isSameDistrict ? 'Same District' : 'Different District'})`,
          amount: cost
        });
        return { total: cost, breakdown };
      } 
      else {
        const extraWeight = Math.ceil(weightValue - 3);
        const baseCost = isSameDistrict ? 110 : 150;
        const extraCost = extraWeight * 40;
        const additionalCharge = isSameDistrict ? 0 : 40;
        const total = baseCost + extraCost + additionalCharge;
        
        breakdown.push({
          description: `Non-Document Base (${isSameDistrict ? 'Same District' : 'Different District'})`,
          amount: baseCost
        });
        breakdown.push({
          description: `Extra Weight (${extraWeight}kg × ৳40)`,
          amount: extraCost
        });
        if (additionalCharge > 0) {
          breakdown.push({
            description: 'Additional District Charge',
            amount: additionalCharge
          });
        }
        
        return { total, breakdown };
      }
    }
  };

  const onSubmit = (data) => {
    const { total, breakdown } = calculateCost(data);
    setDeliveryCost(total);

    const breakdownHtml = `
      <div class="text-left">
        ${breakdown.map(item => `
          <div class="flex justify-between py-1 border-b border-gray-100">
            <span>${item.description}:</span>
            <span class="font-medium">৳${item.amount}</span>
          </div>
        `).join('')}
        <div class="flex justify-between py-2 mt-2 border-t border-gray-200 font-bold">
          <span>Total:</span>
          <span class="text-blue-600">৳${total}</span>
        </div>
      </div>
    `;

    Swal.fire({
      title: 'Confirm Parcel Details',
      html: breakdownHtml,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Edit Details',
      focusConfirm: false,
      customClass: {
        popup: 'text-left'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirm(data, total);
      }
    });
  };

const handleConfirm = async (formData, cost) => {
  try {
    const trackingId = generateTrackingId();
    const parcelData = {
      ...formData,
      trackingId,
      cost,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Log the complete parcel data to console
    console.log('Parcel Data Submitted:', parcelData);
    
    // Here you would typically make an API call to save the data
    // Example:
    // const response = await api.post('/parcels', parcelData);
    // console.log('API Response:', response.data);
    axiosSecure.post('/parcel', parcelData)
    .then(res =>{
      console.log(res.data);
      if (res.data.insertedId) {
        // redirect to a payment page
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Processing to payment gateway",
            showConfirmButton: false,
            timer: 1500
          });
      }
    })
    
    // For demo purposes, we'll just show a success message
    Swal.fire({
      title: 'Parcel Created Successfully!',
      html: `
        <div class="text-left">
          <p>Your tracking ID is: <strong>${trackingId}</strong></p>
          <p class="mt-2">Total Cost: <strong>৳${cost}</strong></p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      // Log again after user closes the success modal
      console.log('Parcel Data After Confirmation:', parcelData);
    });

    reset();
  } catch (error) {
    console.error('Error submitting parcel:', error);
    toast.error("Failed to create parcel. Please try again.");
  }
};
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Send New Parcel</h1>
        <p className="text-gray-600">Fill out the form below to schedule a delivery</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
            <h2 className="text-xl font-semibold text-gray-800">Parcel Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Parcel Type */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Type*</label>
              <select
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.parcelType ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                {...register("parcelType", { required: "Parcel type is required" })}
              >
                <option value="">Select type</option>
                <option value="document">Document</option>
                <option value="non-document">Non-Document</option>
              </select>
              {errors.parcelType && (
                <span className="text-red-500 text-sm mt-1">{errors.parcelType.message}</span>
              )}
            </div>

            {/* Parcel Name */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Name*</label>
              <input
                type="text"
                placeholder="Describe your parcel"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.parcelName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                {...register("parcelName", { required: "Parcel name is required" })}
              />
              {errors.parcelName && (
                <span className="text-red-500 text-sm mt-1">{errors.parcelName.message}</span>
              )}
            </div>

            {/* Weight */}
            {parcelType === "non-document" && (
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)*</label>
                <input
                  type="number"
                  placeholder="Weight in kg"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.weight ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  min="0.1"
                  step="0.1"
                  {...register("weight", { 
                    required: "Weight is required for non-documents",
                    min: { value: 0.1, message: "Weight must be at least 0.1kg" }
                  })}
                />
                {errors.weight && (
                  <span className="text-red-500 text-sm mt-1">{errors.weight.message}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sender Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
            <h2 className="text-xl font-semibold text-gray-800">Sender Information</h2>
          </div>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender Name */}
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                <input
                  type="text"
                  placeholder="Sender name"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.senderName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  defaultValue="John Doe"
                  {...register("senderName", { required: "Sender name is required" })}
                />
                {errors.senderName && (
                  <span className="text-red-500 text-sm mt-1">{errors.senderName.message}</span>
                )}
              </div>

              {/* Sender Contact */}
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact*</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.senderContact ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  {...register("senderContact", { 
                    required: "Contact is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                />
                {errors.senderContact && (
                  <span className="text-red-500 text-sm mt-1">{errors.senderContact.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender Region */}
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">Region*</label>
                <select
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.senderRegion ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  {...register("senderRegion", { required: "Region is required" })}
                >
                  <option value="">Select region</option>
                  {uniqueRegions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </select>
                {errors.senderRegion && (
                  <span className="text-red-500 text-sm mt-1">{errors.senderRegion.message}</span>
                )}
              </div>

              {/* Sender District */}
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">District*</label>
                <select
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.senderDistrict ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  {...register("senderDistrict", { required: "District is required" })}
                  disabled={!senderRegion}
                >
                  <option value="">Select district</option>
                  {senderRegion && getDistrictsByRegion(senderRegion).map((district, index) => (
                    <option key={index} value={district}>{district}</option>
                  ))}
                </select>
                {errors.senderDistrict && (
                  <span className="text-red-500 text-sm mt-1">{errors.senderDistrict.message}</span>
                )}
              </div>
            </div>

            {/* Sender Address */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
              <textarea
                placeholder="Full address"
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.senderAddress ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                {...register("senderAddress", { required: "Address is required" })}
              ></textarea>
              {errors.senderAddress && (
                <span className="text-red-500 text-sm mt-1">{errors.senderAddress.message}</span>
              )}
            </div>

            {/* Pickup Instructions */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Instructions*</label>
              <textarea
                placeholder="Any special instructions for pickup"
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.pickupInstructions ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                {...register("pickupInstructions", { required: "Pickup instructions are required" })}
              ></textarea>
              {errors.pickupInstructions && (
                <span className="text-red-500 text-sm mt-1">{errors.pickupInstructions.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Receiver Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
            <h2 className="text-xl font-semibold text-gray-800">Receiver Information</h2>
          </div>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receiver Name */}
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                <input
                  type="text"
                  placeholder="Receiver name"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.receiverName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  {...register("receiverName", { required: "Receiver name is required" })}
                />
                {errors.receiverName && (
                  <span className="text-red-500 text-sm mt-1">{errors.receiverName.message}</span>
                )}
              </div>

              {/* Receiver Contact */}
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact*</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.receiverContact ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  {...register("receiverContact", { 
                    required: "Contact is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                />
                {errors.receiverContact && (
                  <span className="text-red-500 text-sm mt-1">{errors.receiverContact.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receiver Region */}
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">Region*</label>
                <select
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.receiverRegion ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  {...register("receiverRegion", { required: "Region is required" })}
                >
                  <option value="">Select region</option>
                  {uniqueRegions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </select>
                {errors.receiverRegion && (
                  <span className="text-red-500 text-sm mt-1">{errors.receiverRegion.message}</span>
                )}
              </div>

              {/* Receiver District */}
              <div className="form-control">
                <label className="block text-sm font-medium text-gray-700 mb-1">District*</label>
                <select
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.receiverDistrict ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  {...register("receiverDistrict", { required: "District is required" })}
                  disabled={!receiverRegion}
                >
                  <option value="">Select district</option>
                  {receiverRegion && getDistrictsByRegion(receiverRegion).map((district, index) => (
                    <option key={index} value={district}>{district}</option>
                  ))}
                </select>
                {errors.receiverDistrict && (
                  <span className="text-red-500 text-sm mt-1">{errors.receiverDistrict.message}</span>
                )}
              </div>
            </div>

            {/* Receiver Address */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
              <textarea
                placeholder="Full address"
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.receiverAddress ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                {...register("receiverAddress", { required: "Address is required" })}
              ></textarea>
              {errors.receiverAddress && (
                <span className="text-red-500 text-sm mt-1">{errors.receiverAddress.message}</span>
              )}
            </div>

            {/* Delivery Instructions */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions*</label>
              <textarea
                placeholder="Any special instructions for delivery"
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.deliveryInstructions ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                {...register("deliveryInstructions", { required: "Delivery instructions are required" })}
              ></textarea>
              {errors.deliveryInstructions && (
                <span className="text-red-500 text-sm mt-1">{errors.deliveryInstructions.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button 
            type="submit" 
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
          >
            Submit Parcel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;