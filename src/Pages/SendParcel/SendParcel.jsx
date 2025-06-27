import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useState } from "react";

const SendParcel = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const parcelType = watch("parcelType");

  // Mock data - replace with your actual data
  const regions = [
    { id: 1, name: "Dhaka" },
    { id: 2, name: "Chittagong" },
    { id: 3, name: "Sylhet" },
    { id: 4, name: "Rajshahi" },
    { id: 5, name: "Khulna" },
  ];

  const serviceCenters = [
    { id: 1, name: "Main Center", regionId: 1 },
    { id: 2, name: "Uttara Branch", regionId: 1 },
    { id: 3, name: "Agrabad Branch", regionId: 2 },
    { id: 4, name: "Zindabazar Branch", regionId: 3 },
  ];

  // Calculate delivery cost based on type, service center and weight
  const calculateCost = (data) => {
    // This is a mock calculation - replace with your actual logic
    let baseCost = data.parcelType === "document" ? 50 : 100;
    const weightCost = data.weight ? parseInt(data.weight) * 5 : 0;
    const serviceCenterModifier = data.receiverServiceCenter === "2" ? 1.2 : 1;
    
    const totalCost = (baseCost + weightCost) * serviceCenterModifier;
    return Math.round(totalCost);
  };

  const onSubmit = (data) => {
    const cost = calculateCost(data);
    setDeliveryCost(cost);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      // Here you would typically make an API call to save the data
      // For example:
      // const response = await api.post('/parcels', {
      //   ...formData,
      //   creation_date: new Date().toISOString(),
      //   status: 'pending',
      //   cost: deliveryCost
      // });
      
      // Mock success
      toast.success("Parcel created successfully!");
      reset();
      setShowConfirmation(false);
      // Optionally navigate to another page
      navigate('/');
    } catch (error) {
      toast.error("Failed to create parcel. Please try again.", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Send Parcel</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info Section */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Parcel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Parcel Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Parcel Type*</span>
                </label>
                <select
                  className={`select select-bordered ${errors.parcelType ? 'select-error' : ''}`}
                  {...register("parcelType", { required: "Parcel type is required" })}
                >
                  <option value="">Select type</option>
                  <option value="document">Document</option>
                  <option value="non-document">Non-Document</option>
                </select>
                {errors.parcelType && (
                  <span className="text-error text-sm">{errors.parcelType.message}</span>
                )}
              </div>

              {/* Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title*</span>
                </label>
                <input
                  type="text"
                  placeholder="Parcel title"
                  className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <span className="text-error text-sm">{errors.title.message}</span>
                )}
              </div>

              {/* Weight (conditionally shown) */}
              {parcelType === "non-document" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Weight in kg"
                    className="input input-bordered"
                    min="0"
                    step="0.1"
                    {...register("weight")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sender Info Section */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Sender Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sender Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name*</span>
                </label>
                <input
                  type="text"
                  placeholder="Sender name"
                  className={`input input-bordered ${errors.senderName ? 'input-error' : ''}`}
                  defaultValue="John Doe" // Prefilled value
                  {...register("senderName", { required: "Sender name is required" })}
                />
                {errors.senderName && (
                  <span className="text-error text-sm">{errors.senderName.message}</span>
                )}
              </div>

              {/* Sender Contact */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contact*</span>
                </label>
                <input
                  type="text"
                  placeholder="Phone number"
                  className={`input input-bordered ${errors.senderContact ? 'input-error' : ''}`}
                  {...register("senderContact", { 
                    required: "Contact is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                />
                {errors.senderContact && (
                  <span className="text-error text-sm">{errors.senderContact.message}</span>
                )}
              </div>

              {/* Sender Region */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Region*</span>
                </label>
                <select
                  className={`select select-bordered ${errors.senderRegion ? 'select-error' : ''}`}
                  {...register("senderRegion", { required: "Region is required" })}
                >
                  <option value="">Select region</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
                {errors.senderRegion && (
                  <span className="text-error text-sm">{errors.senderRegion.message}</span>
                )}
              </div>

              {/* Sender Service Center */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Service Center*</span>
                </label>
                <select
                  className={`select select-bordered ${errors.senderServiceCenter ? 'select-error' : ''}`}
                  {...register("senderServiceCenter", { required: "Service center is required" })}
                >
                  <option value="">Select service center</option>
                  {serviceCenters.map(center => (
                    <option key={center.id} value={center.id}>{center.name}</option>
                  ))}
                </select>
                {errors.senderServiceCenter && (
                  <span className="text-error text-sm">{errors.senderServiceCenter.message}</span>
                )}
              </div>

              {/* Sender Address */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Address*</span>
                </label>
                <textarea
                  placeholder="Full address"
                  className={`textarea textarea-bordered h-24 ${errors.senderAddress ? 'textarea-error' : ''}`}
                  {...register("senderAddress", { required: "Address is required" })}
                ></textarea>
                {errors.senderAddress && (
                  <span className="text-error text-sm">{errors.senderAddress.message}</span>
                )}
              </div>

              {/* Pickup Instructions */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Pickup Instructions*</span>
                </label>
                <textarea
                  placeholder="Any special instructions for pickup"
                  className={`textarea textarea-bordered h-24 ${errors.pickupInstructions ? 'textarea-error' : ''}`}
                  {...register("pickupInstructions", { required: "Pickup instructions are required" })}
                ></textarea>
                {errors.pickupInstructions && (
                  <span className="text-error text-sm">{errors.pickupInstructions.message}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Receiver Info Section */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Receiver Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Receiver Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name*</span>
                </label>
                <input
                  type="text"
                  placeholder="Receiver name"
                  className={`input input-bordered ${errors.receiverName ? 'input-error' : ''}`}
                  {...register("receiverName", { required: "Receiver name is required" })}
                />
                {errors.receiverName && (
                  <span className="text-error text-sm">{errors.receiverName.message}</span>
                )}
              </div>

              {/* Receiver Contact */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Contact*</span>
                </label>
                <input
                  type="text"
                  placeholder="Phone number"
                  className={`input input-bordered ${errors.receiverContact ? 'input-error' : ''}`}
                  {...register("receiverContact", { 
                    required: "Contact is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                />
                {errors.receiverContact && (
                  <span className="text-error text-sm">{errors.receiverContact.message}</span>
                )}
              </div>

              {/* Receiver Region */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Region*</span>
                </label>
                <select
                  className={`select select-bordered ${errors.receiverRegion ? 'select-error' : ''}`}
                  {...register("receiverRegion", { required: "Region is required" })}
                >
                  <option value="">Select region</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
                {errors.receiverRegion && (
                  <span className="text-error text-sm">{errors.receiverRegion.message}</span>
                )}
              </div>

              {/* Receiver Service Center */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Service Center*</span>
                </label>
                <select
                  className={`select select-bordered ${errors.receiverServiceCenter ? 'select-error' : ''}`}
                  {...register("receiverServiceCenter", { required: "Service center is required" })}
                >
                  <option value="">Select service center</option>
                  {serviceCenters.map(center => (
                    <option key={center.id} value={center.id}>{center.name}</option>
                  ))}
                </select>
                {errors.receiverServiceCenter && (
                  <span className="text-error text-sm">{errors.receiverServiceCenter.message}</span>
                )}
              </div>

              {/* Receiver Address */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Address*</span>
                </label>
                <textarea
                  placeholder="Full address"
                  className={`textarea textarea-bordered h-24 ${errors.receiverAddress ? 'textarea-error' : ''}`}
                  {...register("receiverAddress", { required: "Address is required" })}
                ></textarea>
                {errors.receiverAddress && (
                  <span className="text-error text-sm">{errors.receiverAddress.message}</span>
                )}
              </div>

              {/* Delivery Instructions */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Delivery Instructions*</span>
                </label>
                <textarea
                  placeholder="Any special instructions for delivery"
                  className={`textarea textarea-bordered h-24 ${errors.deliveryInstructions ? 'textarea-error' : ''}`}
                  {...register("deliveryInstructions", { required: "Delivery instructions are required" })}
                ></textarea>
                {errors.deliveryInstructions && (
                  <span className="text-error text-sm">{errors.deliveryInstructions.message}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary px-8">
            Submit Parcel
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Parcel Details</h3>
            <p className="py-4">
              The estimated delivery cost is: <span className="font-bold">${deliveryCost}</span>
            </p>
            <p className="pb-4">Do you want to proceed with this parcel?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowConfirmation(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendParcel;