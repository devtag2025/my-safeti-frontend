import { useState, useEffect } from "react";
import { Search, Bell, UserX, UserCheck, Mail } from "lucide-react";
import { fetchClients, updateClient } from "../../api/clientService";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    subject: "",
    message: "",
    email: "",
  });

  // Fetch users from the API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const clientsData = await fetchClients();
        // console.log("clientsData",clientsData)
        setUsers(clientsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Handle user status change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateClient(userId, { approvalStatus: newStatus });
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, approvalStatus: newStatus } : user
        )
      );
    } catch (err) {
      console.error(`Error updating client to ${newStatus}:`, err);
    }
  };

  // Open notification modal
  const openNotificationModal = (user) => {
    setSelectedUser(user);
    setNotification({
      ...notification,
      email: user.email,
    });
    setIsNotificationModalOpen(true);
  };

  // Send notification
  const sendNotification = async () => {
    const response = await axios.post(
      "https://safe-street-backend.vercel.app/api/auth/emailSender",
      notification
    );

    // Close modal and reset form
    setIsNotificationModalOpen(false);
    setNotification({ subject: "", message: "", email: "" });
    setSelectedUser(null);

    // Show success alert (in a real app, use a proper notification system)
    alert("Notification sent successfully!");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.customId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.approvalStatus?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = filterRole === "" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "" || user.approvalStatus === filterStatus;
  
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle error state
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center mt-10 text-red-500">
          Failed to load users: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="client">Client</option>
            </select>

            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {/* Users Table */}
      <div className="bg-white overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Full Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                State
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Registered
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.customId || user._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {/* User avatar placeholder */}
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                          {user.fullName
                            ? user.fullName.charAt(0).toUpperCase()
                            : user.email.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email.split("@")[0].charAt(0).toUpperCase() +
                            user.email.split("@")[0].slice(1)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.fullName || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.state || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  user.approvalStatus === "approved"
                    ? "bg-green-100 text-green-800"
                    : user.approvalStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
                    >
                      {user.approvalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Notification button */}
                      <button
                        onClick={() => openNotificationModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded-full"
                        title="Send notification"
                      >
                        <Bell className="w-5 h-5" />
                      </button>

                      {/* Status toggle buttons - for client approval process */}
                      {user.role === "client" &&
                        user.approvalStatus === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(user._id, "approved")
                              }
                              className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded-full"
                              title="Approve client"
                            >
                              <UserCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(user._id, "rejected")
                              }
                              className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded-full"
                              title="Reject client"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                          </>
                        )}

                      {/* Regular status management for other users */}
                      {(user.role !== "client" ||
                        user.approvalStatus !== "pending") &&
                        (user.approvalStatus !== "approved" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(user._id, "approved")
                            }
                            className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded-full"
                            title="Activate user"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusChange(user._id, "rejected")
                            }
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded-full"
                            title="Suspend user"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Notification Modal */}
      {isNotificationModalOpen && (
        <div
          className="fixed z-30 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            {/* Background overlay with improved transition */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setIsNotificationModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal container with improved animation and styling */}
            <div
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700"
              style={{
                animation: "fadeInUp 0.3s ease-out",
              }}
            >
              {/* Modal header */}
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                  id="modal-title"
                >
                  Send Notification
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                  onClick={() => setIsNotificationModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Sending notification to:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {selectedUser?.name || selectedUser?.email}
                      </span>
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Notification subject"
                          value={notification.subject}
                          onChange={(e) =>
                            setNotification({
                              ...notification,
                              subject: e.target.value,
                            })
                          }
                        />
                        {!notification.subject && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Please provide a subject for the notification
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows="4"
                          className="mt-1 p-2 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter your message here"
                          value={notification.message}
                          onChange={(e) =>
                            setNotification({
                              ...notification,
                              message: e.target.value,
                            })
                          }
                        ></textarea>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Please provide details in your message
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.message.length} characters
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
                  onClick={sendNotification}
                  disabled={!notification.subject || !notification.message}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  Send Notification
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsNotificationModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add this style for animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
