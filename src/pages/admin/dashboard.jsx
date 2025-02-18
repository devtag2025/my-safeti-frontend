import { useState, useEffect } from "react";
import { fetchUsers, updateClientStatus } from "../../api/userService";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ role: "", approvalStatus: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load Users on Mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // ✅ Handle Client Approval/Rejection
  const handleUpdateStatus = async (userId, status) => {
    try {
      await updateClientStatus(userId, status);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, approvalStatus: status } : user
        )
      );
    } catch (err) {
      console.error(`Error updating client to ${status}:`, err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading users...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">Failed to load users</div>
    );

  // ✅ Filter Users
  const filteredUsers = users.filter(
    (user) =>
      (!filters.role || user.role === filters.role) &&
      (filters.approvalStatus === "" ||
        user.approvalStatus === filters.approvalStatus)
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Admin Dashboard</h2>

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

      {/* 📋 Users Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        user.approvalStatus === "approved"
                          ? "bg-green-600"
                          : user.approvalStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-600"
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

export default AdminDashboard;
