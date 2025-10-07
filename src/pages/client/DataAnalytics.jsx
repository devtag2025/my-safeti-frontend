import { useState } from "react";
import IncidentBarChart from "./IncidentBarChart";
import IncidentPieChart from "./IncidentPieChart";
import GeoHeatmap from "./GeoHeatmap";
import TimeBasedTrends from "./TimeBasedTrends";

const CRIMSON = "#6e0001";

const DataAnalytics = ({ reports }) => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [exportFormat, setExportFormat] = useState("pdf");

  return (
    <div className="space-y-6">
      <div className="p-6 shadow rounded-lg" style={{ background: "#fff", border: "1px solid #ececec" }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Data Analytics Center</h2>
            <p className="text-gray-600 mt-1">Gain insights into driver behavior and trends</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="p-2 border border-gray-300 rounded-md">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="p-2 border border-gray-300 rounded-md">
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="png">PNG</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 shadow rounded-lg" style={{ background: "#fff", border: "1px solid #ececec" }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Incidents Breakdown</h3>
          <IncidentBarChart reports={reports} timeframe={timeframe} accentColor={CRIMSON} />
        </div>

        <div className="p-6 shadow rounded-lg" style={{ background: "#fff", border: "1px solid #ececec" }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Incident Distribution</h3>
          <IncidentPieChart reports={reports} accentColor={CRIMSON} />
        </div>

        <div className="p-6 shadow rounded-lg" style={{ background: "#fff", border: "1px solid #ececec" }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution</h3>
          <GeoHeatmap reports={reports} accentColor={CRIMSON} />
        </div>

        <div className="p-6 shadow rounded-lg" style={{ background: "#fff", border: "1px solid #ececec" }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Time-based Trends</h3>
          <TimeBasedTrends reports={reports} timeframe={timeframe} accentColor={CRIMSON} />
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics;
