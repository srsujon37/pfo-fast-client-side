import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // 📦 Load parcels: status = pending, payment_status = paid
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ["paid-pending-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels?status=pending&payment_status=paid");
      return res.data;
    },
  });

  // 🧑‍🦱 Load riders by receiverDistrict when modal opens
  const {
    data: riders = [],
    isLoading: ridersLoading,
  } = useQuery({
    queryKey: ["riders-by-district", selectedParcel?.receiverDistrict],
    enabled: !!selectedParcel && isModalOpen,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/by-district?district=${selectedParcel.receiverDistrict}`);
      return res.data;
    },
  });

  // 🚀 Mutation for assigning a rider
  const assignMutation = useMutation({
    mutationFn: async ({ riderId, parcelId, riderName }) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/assign-rider`, {
        riderId,
        parcelId,
        riderName,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Rider Assigned",
        text: "The rider has been assigned successfully!",
      });
      queryClient.invalidateQueries(["paid-pending-parcels"]);
      queryClient.invalidateQueries(["riders-by-district", selectedParcel?.receiverDistrict]);
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Assign error:", error);
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: "Something went wrong. Please try again.",
      });
    },
  });

  const openAssignModal = (parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedParcel(null);
    setIsModalOpen(false);
  };

  const handleAssign = (rider) => {
    assignMutation.mutate({
      riderId: rider._id,
      parcelId: selectedParcel._id,
      riderName: rider.email, // ✅ riderName পাঠানো হয়েছে
    });
  };

  if (isLoading) return <p className="text-center">Loading parcels...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load parcels.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcel</h2>

      {parcels.length === 0 ? (
        <p>No pending & paid parcels found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Parcel Name</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Weight</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.trackingId}</td>
                  <td>{parcel.parcelName}</td>
                  <td>
                    <p className="font-medium">{parcel.senderName}</p>
                    <p className="text-sm text-gray-500">
                      {parcel.senderDistrict}, {parcel.senderRegion}
                    </p>
                  </td>
                  <td>
                    <p className="font-medium">{parcel.receiverName}</p>
                    <p className="text-sm text-gray-500">
                      {parcel.receiverDistrict}, {parcel.receiverRegion}
                    </p>
                  </td>
                  <td>{parcel.weight}</td>
                  <td>৳ {parcel.cost}</td>
                  <td>
                    <span className="badge badge-warning capitalize">{parcel.status}</span>
                  </td>
                  <td>
                    <span className="badge badge-success capitalize">{parcel.payment_status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => openAssignModal(parcel)}
                    >
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🚚 Assign Rider Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle absolute top-2 right-2"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              Available Riders in {selectedParcel.receiverDistrict}
            </h3>

            {ridersLoading ? (
              <p>Loading riders...</p>
            ) : riders.length === 0 ? (
              <p>No available riders in this district.</p>
            ) : (
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider) => (
                    <tr key={rider._id}>
                      <td>{rider.name}</td>
                      <td>{rider.email}</td>
                      <td>{rider.phone}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAssign(rider)}
                          disabled={assignMutation.isPending}
                        >
                          {assignMutation.isPending ? "Assigning..." : "Assign"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;