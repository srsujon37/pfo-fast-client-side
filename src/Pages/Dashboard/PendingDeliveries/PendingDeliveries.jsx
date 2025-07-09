import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // load parcels assigned to the current rider
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["riderParcels"],
    enabled: !!user.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcelId, newStatus }) => {
      const res = await axiosSecure.patch(
        `/parcels/${parcelId}/delivery-status`,
        {
          delivery_status: newStatus,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rider-parcels"]);
      Swal.fire("Updated!", "Parcel status updated successfully", "success");
    },
    onError: () => {
      Swal.fire("Error", "Could not update status", "error");
    },
  });

  const handleStatusUpdate = (parcelId, currentStatus) => {
    const newStatus =
      currentStatus === "rider_assigned" ? "in_transit" : "delivered";

    updateStatusMutation.mutate({ parcelId, newStatus });
  };

  if (isLoading) return <p>Loading parcels...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Deliveries</h2>
      {parcels.length === 0 ? (
        <p>No pending deliveries.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Parcel</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Weight</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.trackingId}</td>
                  <td>{parcel.parcelName}</td>
                  <td>
                    <p>{parcel.senderName}</p>
                    <p className="text-sm text-gray-500">
                      {parcel.senderDistrict}, {parcel.senderRegion}
                    </p>
                  </td>
                  <td>
                    <p>{parcel.receiverName}</p>
                    <p className="text-sm text-gray-500">
                      {parcel.receiverDistrict}, {parcel.receiverRegion}
                    </p>
                  </td>
                  <td>{parcel.weight} kg</td>
                  <td>
                    <span className="badge badge-info capitalize">
                      {parcel.delivery_status}
                    </span>
                  </td>
                  <td>
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          handleStatusUpdate(parcel._id, parcel.delivery_status)
                        }
                      >
                        Mark as Picked Up
                      </button>
                    )}
                    {parcel.delivery_status === "in_transit" && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          handleStatusUpdate(parcel._id, parcel.delivery_status)
                        }
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
