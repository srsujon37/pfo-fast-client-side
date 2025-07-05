import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // 🔄 Mutation to update user role
  const mutation = useMutation({
    mutationFn: async ({ email, role }) => {
      const res = await axiosSecure.patch(`/users/${email}/role`, { role });
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire("Success", data.message, "success");
      handleSearch(); // refresh user list after mutation
    },
    onError: (error) => {
      Swal.fire("Error", "Failed to change role", "error");
      console.error("Mutation error:", error);
    },
  });

  // 🔍 Search users by email
  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axiosSecure.get(`/users/search?email=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // 🔁 Role toggle handler
  const handleRoleChange = (email, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    mutation.mutate({ email, role: newRole });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Make Admin Panel</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search user by email"
          className="input input-bordered w-full max-w-xs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Created At</th>
                <th>Current Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((user) => {
                const action =
                  user.role === "admin" ? "Active Admin" : "Make Admin";

                return (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.role || "user"}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          user.role === "admin" ? "btn-warning" : "btn-success"
                        }`}
                        onClick={() =>
                          handleRoleChange(user.email, user.role || "user")
                        }
                        disabled={mutation.isPending}
                      >
                        {action}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
