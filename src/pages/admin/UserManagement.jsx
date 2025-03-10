import { useState, useEffect } from "react";
import { Search, Bell, UserX, UserCheck, Mail } from "lucide-react";
import { fetchClients, updateClient } from "../../api/clientService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notification, setNotification] = useState({ subject: "", message: "" });

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
      setUsers(users.map(user => 
        user._id === userId ? { ...user, approvalStatus: newStatus } : user
      ));
    } catch (err) {
      console.error(`Error updating client to ${newStatus}:`, err);
    }
  };

  // Open notification modal
  const openNotificationModal = (user) => {
    setSelectedUser(user);
    setIsNotificationModalOpen(true);
  };

  // Send notification
  const sendNotification = () => {
    // In a real implementation, you would send this notification to your backend
    console.log(`Sending notification to ${selectedUser.email}:`, notification);
    
    // Close modal and reset form
    setIsNotificationModalOpen(false);
    setNotification({ subject: "", message: "" });
    setSelectedUser(null);
    
    // Show success alert (in a real app, use a proper notification system)
    alert("Notification sent successfully!");
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === "" || user.role === filterRole;
    const matchesStatus = filterStatus === "" || user.approvalStatus === filterStatus;
    
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
      <div className="bg-white overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {/* User avatar placeholder */}
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name || "No name"}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                        user.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
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
                      {user.role === "client" && user.approvalStatus === "pending" && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(user._id, "approved")}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded-full"
                            title="Approve client"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(user._id, "rejected")}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded-full"
                            title="Reject client"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      
                      {/* Regular status management for other users */}
                      {(user.role !== "client" || user.approvalStatus !== "pending") && (
                        user.approvalStatus !== 'approved' ? (
                          <button 
                            onClick={() => handleStatusChange(user._id, "approved")}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded-full"
                            title="Activate user"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStatusChange(user._id, "rejected")}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded-full"
                            title="Suspend user"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        )
                      )}
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
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsNotificationModalOpen(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Send Notification to {selectedUser?.name || selectedUser?.email}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                          type="text"
                          id="subject"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Notification subject"
                          value={notification.subject}
                          onChange={(e) => setNotification({...notification, subject: e.target.value})}
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          id="message"
                          rows="4"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Enter your message here"
                          value={notification.message}
                          onChange={(e) => setNotification({...notification, message: e.target.value})}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={sendNotification}
                >
                  Send
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsNotificationModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;