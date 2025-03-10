import React, { useState } from "react";
import { filterUserReports } from "../../api/reportService";

const UserFilterReports = ({ onFilterResults, userId }) => {
    const [filters, setFilters] = useState({
        vehicleRegistration: "",
        date: "",
        location: "",
        incidentType: "",
        description: "",
        mediaFlag: "",
        status: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle Input Changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters({
            ...filters,
            [name]: name === "mediaFlag" ? (value === "" ? "" : value === "true") : value, // Ensure mediaFlag is boolean
        });
    };

    // Handle API Call on Filter Apply
    const handleApplyFilters = async () => {
        setLoading(true);
        setError(null);

        try {
            const appliedFilters = { ...filters };

            // Remove empty filters
            Object.keys(appliedFilters).forEach((key) => {
                if (appliedFilters[key] === "") {
                    delete appliedFilters[key];
                }
            });

            // Convert mediaFlag to boolean
            if (appliedFilters.mediaFlag !== undefined) {
                appliedFilters.mediaFlag = appliedFilters.mediaFlag === "true";
            }

            // Format date
            if (appliedFilters.date) {
                appliedFilters.date = new Date(appliedFilters.date).toISOString().split("T")[0]; // YYYY-MM-DD
            }

            // Ensure userId is included
            if (userId) {
                appliedFilters.userId = userId;
            }

            console.log("Sending filters to API:", appliedFilters); // Debugging

            // Fetch filtered reports
            const reports = await filterUserReports(appliedFilters);
            onFilterResults(reports); // Send data back to parent component
        } catch (err) {
            setError(err.message || "Something went wrong while fetching reports.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg flex flex-wrap gap-4 items-center justify-between mb-6">
            <input
                type="text"
                name="vehicleRegistration"
                placeholder="Vehicle Registration"
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                value={filters.vehicleRegistration}
                onChange={handleFilterChange}
            />

            <input
                type="date"
                name="date"
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                value={filters.date}
                onChange={handleFilterChange}
            />

            <input
                type="text"
                name="location"
                placeholder="Location"
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                value={filters.location}
                onChange={handleFilterChange}
            />

            <select
                name="incidentType"
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                value={filters.incidentType}
                onChange={handleFilterChange}
            >
                <option value="">All Incident Types</option>
                <option value="Speeding">Speeding</option>
                <option value="Running Red Light">Running Red Light</option>
                <option value="Reckless Driving">Reckless Driving</option>
                <option value="Tailgating">Tailgating</option>
                <option value="Other">Other</option>
            </select>

            <select
                name="status"
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                value={filters.status}
                onChange={handleFilterChange}
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>

            <input
                type="text"
                name="description"
                placeholder="Description"
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                value={filters.description}
                onChange={handleFilterChange}
            />

            <select
                name="mediaFlag"
                className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                value={filters.mediaFlag}
                onChange={handleFilterChange}
            >
                <option value="">Media (Any)</option>
                <option value="true">With Media</option>
                <option value="false">Without Media</option>
            </select>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
                onClick={handleApplyFilters}
                disabled={loading}
            >
                {loading ? "Applying..." : "Apply Filters"}
            </button>

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default UserFilterReports;
