import { useState } from "react";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    isPending,
    data: riders = [],
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const handleApprove = async (id, email) => {
    try {
      console.log("Sending email to backend:", email); // ✅ Make sure this is correct and NOT undefined/null

      const res = await axiosSecure.patch(`/riders/${id}/status`, {
        status: "approved",
        email, // ✅ Must send valid email here
      });

      if (res.data.message) {
        Swal.fire("Approved!", "Rider application approved.", "success");
        refetch();
      }
    } catch (err) {
      console.error("Approval error:", err);
      Swal.fire("Error", "Failed to approve rider.", "error");
    }
  };

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/riders/${id}/status`, {
          status: "cancelled",
        });

        if (res.data.message) {
          Swal.fire("Cancelled", "Application has been cancelled.", "success");
          refetch();
        }
      } catch (err) {
        console.error("Cancel error:", err);
        Swal.fire("Error", "Failed to cancel application.", "error");
      }
    }
  };

  if (isPending) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

      {riders.length === 0 ? (
        <p>No pending applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>District</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name || "N/A"}</td>
                  <td>{rider.email || "N/A"}</td>
                  <td>{rider.phone || "N/A"}</td>
                  <td>{rider.region || "N/A"}</td>
                  <td>{rider.district || "N/A"}</td>
                  <td className="flex flex-wrap gap-1">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setSelectedRider(rider)}
                    >
                      <FaEye /> View
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        handleApprove(rider._id, rider.email)
                      }
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() =>
                        handleCancel(rider._id)
                      }
                    >
                      <FaTimesCircle /> Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rider Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-xl font-bold"
              onClick={() => setSelectedRider(null)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">Rider Details</h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRider.phone}
              </p>
              <p>
                <strong>Age:</strong> {selectedRider.age}
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.nidCardNumber}
              </p>
              <p>
                <strong>Bike Brand:</strong> {selectedRider.bikeBrand}
              </p>
              <p>
                <strong>Bike Reg No:</strong> {selectedRider.bikeRegNumber}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.district}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
