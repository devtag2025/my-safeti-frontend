import React, { useState } from "react";
import { Filter, Eye, EyeOff } from "lucide-react";

const IncidentFilter = ({ activeFilters, onFilterChange, incidentCounts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const incidentColors = {
    Collision: "#DC2626",
    "Excessive Speed": "#EA580C",
    "Road Rage": "#C2410C",
    "Hoon Driving (Including burnouts, racing)": "#7C2D12",
    Tailgating: "#1D4ED8",
    "Dangerous/Reckless Driving": "#7C3AED",
    "Request For Information": "#FFFFFF",
    Other: "#6B7280",
  };

  const handleFilterToggle = (incidentType) => {
    const newFilters = activeFilters.includes(incidentType)
      ? activeFilters.filter((f) => f !== incidentType)
      : [...activeFilters, incidentType];
    onFilterChange(newFilters);
  };

  const handleSelectAll = () => onFilterChange(Object.keys(incidentColors));
  const handleSelectNone = () => onFilterChange([]);

  const totalCount = Object.values(incidentCounts).reduce((sum, count) => sum + count, 0);
  const activeCount = Object.keys(incidentCounts)
    .filter((key) => activeFilters.includes(key))
    .reduce((sum, key) => sum + incidentCounts[key], 0);

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#6e0001]/20 mb-6 text-[#111827]">
      <div className="p-4 border-b border-[#6e0001]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-[#6e0001]" />
          <h3 className="text-lg font-semibold">Filter Incidents</h3>
          <span className="text-sm text-[#6e0001]/70">
            Showing {activeCount} of {totalCount} incidents
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="text-xs px-3 py-1 bg-[#6e0001]/20 text-[#6e0001] rounded-full hover:bg-[#8a0000]/30 transition-colors font-medium"
          >
            Show All
          </button>
          <button
            onClick={handleSelectNone}
            className="text-xs px-3 py-1 bg-[#f9f9f9]/20 text-[#6e0001]/70 rounded-full hover:bg-[#8a0000]/20 transition-colors font-medium"
          >
            Hide All
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-[#6e0001]/20 rounded-lg transition-colors"
          >
            {isExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Object.entries(incidentColors).map(([incidentType, color]) => {
            const isActive = activeFilters.includes(incidentType);
            const count = incidentCounts[incidentType] || 0;

            return (
              <button
                key={incidentType}
                onClick={() => handleFilterToggle(incidentType)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left
                  ${
                    isActive
                      ? "border-[#6e0001] bg-white/70 shadow-md"
                      : "border-gray-300 bg-white/40 opacity-60 hover:opacity-80"
                  }`}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{incidentType}</div>
                  <div className="text-xs text-[#6e0001]/70">{count} incident{count !== 1 ? "s" : ""}</div>
                </div>
                <div className="flex-shrink-0">
                  {isActive ? <Eye size={16} className="text-[#6e0001]" /> : <EyeOff size={16} className="text-gray-400" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IncidentFilter;
