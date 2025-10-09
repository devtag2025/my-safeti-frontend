import React from "react";

const IncidentMarker = ({ incident, color, onClick }) => {
  const date = new Date(incident.date).toLocaleDateString("en-AE");
  const time = new Date(incident.date).toLocaleTimeString("en-AE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        zIndex: 10,
      }}
      title={`${incident.incidentType} - ${date} ${time}`}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${color}, #ffffff20)`,
          border: "2px solid #6e0001aa",
          boxShadow: `0 0 8px ${color}, 0 2px 4px rgba(110,0,1,0.5)`,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.4)";
          e.target.style.boxShadow = `0 0 12px ${color}, 0 4px 6px rgba(110,0,1,0.7)`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = `0 0 8px ${color}, 0 2px 4px rgba(110,0,1,0.5)`;
        }}
      />
    </div>
  );
};

export default IncidentMarker;
