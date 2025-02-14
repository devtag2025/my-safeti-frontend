const ReportModal = ({ report, isOpen, onClose }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-bold">Report Details</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="mt-4 space-y-2">
          <p>
            <span className="font-semibold">Vehicle Registration:</span>{" "}
            {report.vehicleRegistration}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(report.date).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {report.location}
          </p>
          <p>
            <span className="font-semibold">Incident Type:</span>{" "}
            {report.incidentType}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {report.description}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {report.status}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
