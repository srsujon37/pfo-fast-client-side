import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  // রাইডার ডাটা নিয়ে আসা
  const { data: riders = [], refetch, isLoading } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  // Deactivate করার ফাংশন
  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/riders/${id}/status`, {
          status: "deactivated",
        });
        if (res.data.modifiedCount > 0) {
          Swal.fire("Deactivated!", "Rider has been deactivated.", "success");
          refetch();
        }
      } catch (error) {
        console.error("Deactivation error:", error);
        Swal.fire("Error", "Failed to deactivate rider.", "error");
      }
    }
  };

  // Approve করার ফাংশন
  const handleApprove = async (id) => {
    try {
      const res = await axiosSecure.patch(`/riders/${id}/status`, {
        status: "approved",
      });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Approved!", "Rider has been approved.", "success");
        refetch();
      }
    } catch (error) {
      console.error("Approval error:", error);
      Swal.fire("Error", "Failed to approve rider.", "error");
    }
  };

  // নাম অনুসারে সার্চ করা
  const filteredRiders = riders.filter((rider) =>
    rider.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="input input-bordered w-full max-w-md mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredRiders.length === 0 ? (
        <p>No active riders found.</p>
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
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>
                    <span
                      className={`badge ${
                        rider.status === "approved"
                          ? "badge-success"
                          : rider.status === "active"
                          ? "badge-info"
                          : "badge-warning"
                      }`}
                    >
                      {rider.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    {rider.status !== "approved" && (
                      <button
                        onClick={() => handleApprove(rider._id)}
                        className="btn btn-sm btn-success"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="btn btn-sm btn-error"
                    >
                      Deactivate
                    </button>
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

export default ActiveRiders;

