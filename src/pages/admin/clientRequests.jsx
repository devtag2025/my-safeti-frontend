import { useState, useEffect } from "react";
import { fetchClients, updateClient } from "../../api/clientService";

const ClientRequests = () => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ role: "", approvalStatus: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const clientsData = await fetchClients();
        setClients(clientsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, []);

  // ✅ Handle Client Approval/Rejection
  const handleUpdateStatus = async (userId, status) => {
    try {
      await updateClient(userId, status);
      setClients(
        clients.map((user) =>
          user._id === userId ? { ...user, approvalStatus: status } : user
        )
      );
    } catch (err) {
      console.error(`Error updating client to ${status}:`, err);
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading clients...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load clients
      </div>
    );

  // ✅ Filter clients
  const filteredClients = clients.filter(
    (user) =>
      (!filters.role || user.role === filters.role) &&
      (filters.approvalStatus === "" ||
        user.approvalStatus === filters.approvalStatus)
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Client Requests</h2>

      {/* 🔍 Filters */}
      <div className="flex space-x-3 mb-4">
        <select
          className="border px-3 py-2 rounded-md text-gray-700"
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>

        <select
          className="border px-3 py-2 rounded-md text-gray-700"
          onChange={(e) =>
            setFilters({ ...filters, approvalStatus: e.target.value })
          }
        >
          <option value="">All Approval Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 📋 Clients Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Approval Status
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No clients found.
                </td>
              </tr>
            ) : (
              filteredClients.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        user.approvalStatus === "approved"
                          ? "bg-green-500"
                          : user.approvalStatus === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {user.approvalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === "client" &&
                      user.approvalStatus === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(user._id, "approved")
                            }
                            className="mr-2 px-3 py-1 bg-green-500 text-white rounded-md"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(user._id, "rejected")
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded-md"
                          >
                            Reject
                          </button>
                        </>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientRequests;
