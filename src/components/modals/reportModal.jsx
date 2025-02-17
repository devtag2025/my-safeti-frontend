import {
  X,
  Calendar,
  MapPin,
  FileText,
  ClipboardList,
  Car,
  Info,
  Tag,
} from "lucide-react";

const ReportModal = ({ report, isOpen, onClose }) => {
  if (!isOpen || !report) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-indigo-600" />
            Report Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-gray-700">
              Vehicle Registration:
            </span>
            <span className="text-gray-900">{report.vehicleRegistration}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-gray-900">
              {new Date(report.date).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-gray-700">Location:</span>
            <span className="text-gray-900">{report.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-gray-700">Incident Type:</span>
            <span className="text-gray-900">{report.incidentType}</span>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="text-gray-900">{report.description}</span>
          </div>

          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-gray-700">Status:</span>
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                report.status === "pending" ? "bg-yellow-500" : "bg-green-500"
              }`}
            >
              {report.status}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
