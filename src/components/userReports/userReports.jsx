import React from 'react'

function userReports() {
    return (
        <>
            <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-700">Client Dashboard</h2>
                <div className="flex space-x-3">
                    <select
                        className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                        onChange={(e) =>
                            setFilters({ ...filters, incidentType: e.target.value })
                        }
                    >
                        <option value="">All Incident Types</option>
                        <option value="Speeding">Speeding</option>
                        <option value="Running Red Light">Running Red Light</option>
                        <option value="Reckless Driving">Reckless Driving</option>
                        <option value="Tailgating">Tailgating</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring focus:ring-indigo-300"
                        onChange={(e) =>
                            setFilters({ ...filters, status: e.target.value })
                        }
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>
        </>
    )
}

export default userReports