import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "./../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels`);
      console.log(res.data); // debug
      return res.data;
    },
  });

  const handlePay = async (id) => {

    console.log('View parcel', id);
    navigate(`/dashboard/payment/${id}`)
    // try {
    //   const res = await axiosSecure.patch(`/parcels/pay/${trackingId}`);
    //   if (res.data.modifiedCount > 0) {
    //     Swal.fire("Payment successful", "", "success");
    //     refetch();
    //   }
    // } catch (err) {
    //   Swal.fire("Payment failed", err.message, "error");
    // }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this parcel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${id}`);

        if (res.data.deletedCount > 0) {
          await Swal.fire({
            title: "Deleted!",
            text: "Parcel has been deleted.",
            icon: "success",
            draggable: true,
          });
          refetch(); // Refresh the data after successful deletion
        } else {
          await Swal.fire({
            title: "Failed",
            text: res.data.message || "Not allowed to delete",
            icon: "error",
          });
        }
      } catch (err) {
        console.error("Delete Error:", err);
        await Swal.fire({
          title: "Delete failed",
          text: err.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Type</th>
              <th>Parcel Name</th>
              <th>Receiver</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.trackingId}</td>
                <td>
                  <span
                    className={`badge ${
                      parcel.parcelType === "document"
                        ? "badge-primary"
                        : "badge-secondary"
                    }`}
                  >
                    {parcel.parcelType}
                  </span>
                </td>
                <td>{parcel.parcelName}</td>
                <td>{parcel.receiverName}</td>
                <td>৳{parcel.cost}</td>
                <td>
                  <span
                    className={`badge ${
                      parcel.status === "pending"
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      parcel.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {parcel.paymentStatus || "unpaid"}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() =>
                        document
                          .getElementById(`modal_${parcel.trackingId}`)
                          .showModal()
                      }
                    >
                      View
                    </button>
                    {parcel.paymentStatus !== "paid" && (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => handlePay(parcel._id)}
                      >
                        Pay
                      </button>
                    )}
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleDelete(parcel._id)}
                    >
                      Delete
                    </button>
                  </div>

                  {/* View Modal */}
                  <dialog id={`modal_${parcel.trackingId}`} className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Parcel Details</h3>
                      <div className="py-4 space-y-2">
                        <p>
                          <strong>Tracking ID:</strong> {parcel.trackingId}
                        </p>
                        <p>
                          <strong>Type:</strong> {parcel.parcelType}
                        </p>
                        <p>
                          <strong>Parcel Name:</strong> {parcel.parcelName}
                        </p>
                        <p>
                          <strong>Weight:</strong> {parcel.weight} kg
                        </p>
                        <p>
                          <strong>Cost:</strong> ৳{parcel.cost}
                        </p>
                        <p>
                          <strong>Status:</strong> {parcel.status}
                        </p>
                        <p>
                          <strong>Sender:</strong> {parcel.senderName} (
                          {parcel.senderContact})
                        </p>
                        <p>
                          <strong>Receiver:</strong> {parcel.receiverName} (
                          {parcel.receiverContact})
                        </p>
                        <p>
                          <strong>Created:</strong>{" "}
                          {new Date(parcel.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
