import React, { useState, useEffect } from "react";
import { User, Mail, Shield, CalendarCheck, Edit2, Key } from "lucide-react";
import { getCurrentUser, updateUser } from "../api/userService";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        oldPassword: "",
        newPassword: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
                setFormData({ fullName: userData.fullName, email: userData.email, oldPassword: "", newPassword: "" });
            } catch (err) {
                setError(err.message || "Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.newPassword && formData.newPassword === formData.oldPassword) {
            setError("New password must be different from the old password.");
            setLoading(false);
            return;
        }

        try {
            const updatedUser = await updateUser({
                fullName: formData.fullName,
                email: formData.email,
                ...(formData.newPassword && { oldPassword: formData.oldPassword, password: formData.newPassword }),
            });

            setUser(updatedUser);
            setEditMode(false);
            alert("Profile updated successfully!");
        } catch (err) {
            setError(err.message || "Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-gray-600">Loading user details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h2>

            {!editMode ? (
                <div className="bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto border border-gray-200">
                    <div className="flex items-center space-x-4 mb-4">
                        <User className="w-12 h-12 text-blue-600" />
                        <h1 className="text-2xl font-semibold text-gray-900">{user.fullName}</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="text-gray-600" />
                            <p className="text-lg text-gray-700">{user.email}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Shield className="text-gray-600" />
                            <p className="text-lg text-gray-700 capitalize">
                                Role: <strong>{user.role}</strong>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <CalendarCheck className="text-gray-600" />
                            <p className="text-lg text-gray-700">
                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Shield className="text-gray-600" />
                            <p className={`text-lg ${user.approvalStatus === "pending" ? "text-yellow-600" : "text-green-600"} font-semibold`}>
                                {user.approvalStatus.charAt(0).toUpperCase() + user.approvalStatus.slice(1)}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setEditMode(true)}
                        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition flex items-center justify-center gap-2 w-full"
                    >
                        <Edit2 size={16} /> Edit Profile
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg max-w-lg mx-auto border border-gray-200">
                    <label className="block text-sm font-medium text-gray-900">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 mb-4"
                        required
                    />

                    <label className="block text-sm font-medium text-gray-900">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 mb-4"
                        required
                    />

                    <label className=" text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Key className="w-5 h-5 text-gray-600" /> Old Password (Required for change)
                    </label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 mb-4"
                        placeholder="Enter your old password"
                    />

                    <label className=" text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Key className="w-5 h-5 text-gray-600" /> New Password (Optional)
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 mb-4"
                        placeholder="Enter a new password"
                    />

                    <div className="flex gap-x-4">
                        <button
                            type="submit"
                            className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-500 transition w-full"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="px-5 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-500 transition w-full"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserProfile;
