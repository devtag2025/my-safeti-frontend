import { useState } from "react";

const CRIMSON = "#6e0001";

const ReportSearch = ({ onFilterChange, filters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setLocalFilters((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      vehicleRegistration: "",
      startDate: "",
      endDate: "",
      location: "",
      incidentType: "",
      status: "",
      hasMedia: false,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="shadow rounded-lg" style={{ background: "#fff", border: "1px solid #ececec" }}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Report Search & Analysis</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="vehicleRegistration" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration</label>
              <input type="text" id="vehicleRegistration" name="vehicleRegistration" value={localFilters.vehicleRegistration} onChange={handleInputChange} placeholder="Enter vehicle registration" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-opacity-50" />
            </div>

            <div className="flex-1">
              <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
              <select id="incidentType" name="incidentType" value={localFilters.incidentType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-opacity-50">
                <option value="">All Incident Types</option>
                <option value="Speeding">Speeding</option>
                <option value="Running Red Light">Running Red Light</option>
                <option value="Reckless Driving">Reckless Driving</option>
                <option value="Tailgating">Tailgating</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <button type="submit" className="px-5 py-2 text-white rounded-md" style={{ background: CRIMSON }}>Search</button>
              <button type="button" onClick={handleReset} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700">Reset</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportSearch;
