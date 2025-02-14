import { useState } from "react";
import { MapPinIcon } from "lucide-react";
import DownIcon from "../../assets/svgs/ChevronDown";
import { createReport } from "../../api/reportService";

export default function IncidentReportForm() {
  const [formData, setFormData] = useState({
    vehicleRegistration: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    location: "",
    incidentType: "Speeding",
    description: "",
    mediaFlag: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Submitting form...");
      await createReport(formData);
      setSuccess(true);
      setFormData({
        vehicleRegistration: "",
        date: new Date().toISOString().split("T")[0],
        time: "",
        location: "",
        incidentType: "Speeding",
        description: "",
        mediaFlag: false,
      });
    } catch (err) {
      console.error("Error submitting report:", err);
      localStorage.setItem("formError", err || "Something went wrong");
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">Report submitted successfully!</p>
      )}
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Incident Report
          </h2>
          <p className="mt-1 text-sm text-gray-600 text-center">
            Please provide accurate information about the incident.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-gray-900">
                Vehicle Registration Number
              </label>
              <input
                type="text"
                name="vehicleRegistration"
                value={formData.vehicleRegistration}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-gray-300 placeholder:text-gray-400 sm:text-sm"
                placeholder="ABC123"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-900">
                Incident Type
              </label>
              <div className="mt-2 relative">
                <select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-gray-900 outline-gray-300 sm:text-sm"
                >
                  <option>Speeding</option>
                  <option>Reckless Driving</option>
                  <option>Running Red Light</option>
                  <option>Tailgating</option>
                  <option>Other</option>
                </select>
                <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-900">
                Incident Location
              </label>
              <div className="mt-2 flex">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-gray-300 placeholder:text-gray-400 sm:text-sm"
                  placeholder="Enter location or use current location"
                />
                <button
                  type="button"
                  className="ml-2 bg-indigo-600 p-2 rounded-md text-white hover:bg-indigo-500"
                >
                  <MapPinIcon className="size-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-gray-300 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-900">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-gray-300 sm:text-sm"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-900">
                Incident Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-gray-300 sm:text-sm"
                placeholder="Describe what happened..."
              />
            </div>

            <div className="col-span-full flex items-center gap-x-3">
              <input
                id="mediaFlag"
                name="mediaFlag"
                type="checkbox"
                checked={formData.mediaFlag}
                onChange={handleChange}
                className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="mediaFlag"
                className="text-sm font-medium text-gray-900"
              >
                I have photos/videos of this incident
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </form>
  );
}
