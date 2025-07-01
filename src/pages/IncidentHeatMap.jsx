import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import HomeNavbar from "../components/layout/HomeNavbar";
import { Calendar, Clock, Car, MapPin, X } from "lucide-react";

// Custom Marker Component
const IncidentMarker = ({ incident, color, onClick }) => {
  const date = new Date(incident.date).toLocaleDateString("en-AU");
  const time = new Date(incident.date).toLocaleTimeString("en-AU", {
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
      }}
      title={`${incident.incidentType} - ${date} ${time}`}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: color,
          border: "2px solid #ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      />
    </div>
  );
};

// Info Window Component
const InfoWindow = ({ incident, color, onClose, addressString }) => {
  const date = new Date(incident.date).toLocaleDateString("en-AU");
  const time = new Date(incident.date).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -120%)",
        backgroundColor: "white",
        padding: "0",
        minWidth: "320px",
        maxWidth: "400px",
        fontFamily: "'Inter', sans-serif",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        zIndex: 1000,
        pointerEvents: "auto",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: color,
          padding: "16px 20px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: "6px",
            width: "28px",
            height: "28px",
            cursor: "pointer",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.3)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")
          }
        >
          <X size={16} />
        </button>

        <h3
          style={{
            margin: "0",
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
            paddingRight: "40px",
            lineHeight: "1.3",
          }}
        >
          {incident.incidentType}
        </h3>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Calendar size={16} color="#6b7280" />
            <span
              style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}
            >
              {date}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Clock size={16} color="#6b7280" />
            <span
              style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}
            >
              {time}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Car size={16} color="#6b7280" />
            <span
              style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}
            >
              {incident.vehicleType}
            </span>
          </div>

          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
          >
            <MapPin
              size={16}
              color="#6b7280"
              style={{ marginTop: "2px", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "#374151",
                fontWeight: "500",
                lineHeight: "1.4",
                wordBreak: "break-word",
              }}
            >
              {addressString}
            </span>
          </div>
        </div>

        {incident.description && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#f9fafb",
              borderLeft: `3px solid ${color}`,
              borderRadius: "6px",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                color: "#6b7280",
                fontStyle: "italic",
                lineHeight: "1.5",
              }}
            >
              "
              {incident.description.length > 100
                ? incident.description.substring(0, 100) + "..."
                : incident.description}
              "
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const IncidentHeatMap = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geocodedIncidents, setGeocodedIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);

  const incidentColors = {
    Collision: "#DC2626",
    "Excessive Speed": "#EA580C",
    "Road Rage": "#C2410C",
    "Hoon Driving (Including burnouts, racing)": "#7C2D12",
    Tailgating: "#1D4ED8",
    "Dangerous/Reckless Driving": "#7C3AED",
    Other: "#6B7280",
  };

  const getResponsiveZoom = () => {
    const width = window.innerWidth;

    if (width < 640) return 3.5;
    if (width < 768) return 4;
    if (width < 1024) return 4.5;
    return 5;
  };

  const mapDefaultProps = {
    center: {
      lat: -25.2744,
      lng: 133.7751,
    },
    zoom: getResponsiveZoom(),
  };

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  // Build address string from database fields
  const buildAddressString = (incident) => {
    const parts = [];
    if (incident.streetNumber) parts.push(incident.streetNumber);
    if (incident.location) parts.push(incident.location);
    if (incident.crossStreet) parts.push(`near ${incident.crossStreet}`);
    if (incident.suburb) parts.push(incident.suburb);
    if (incident.state) parts.push(incident.state);
    parts.push("Australia");
    return parts.join(", ");
  };

  // Geocode address using Google Maps API
  const geocodeAddress = async (addressString, geocoder) => {
    return new Promise((resolve) => {
      geocoder.geocode(
        {
          address: addressString,
          region: "AU",
        },
        (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            console.error(
              "Geocoding failed:",
              status,
              "for address:",
              addressString
            );
            resolve(null);
          }
        }
      );
    });
  };

  // Fetch incidents from API
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.safestreet.com.au/api/report/reportsForHeatMap"
      );
      setIncidents(response.data);
    } catch (err) {
      setError("Failed to load incident data");
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Maps API loaded
  const handleApiLoaded = ({ map, maps }) => {
    setMapsApi({ map, maps });
  };

  // Geocode all incidents when maps API is loaded
  useEffect(() => {
    const geocodeAllIncidents = async () => {
      if (!mapsApi || incidents.length === 0) return;

      const geocoder = new mapsApi.maps.Geocoder();
      const geocoded = [];

      for (const incident of incidents) {
        const addressString = buildAddressString(incident);
        const coordinates = await geocodeAddress(addressString, geocoder);

        if (coordinates) {
          geocoded.push({
            ...incident,
            ...coordinates,
            addressString,
            color:
              incidentColors[incident.incidentType] || incidentColors["Other"],
          });
        }
      }

      setGeocodedIncidents(geocoded);
    };

    geocodeAllIncidents();
  }, [mapsApi, incidents]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleMarkerClick = (incident) => {
    setSelectedIncident(incident);
  };

  const handleCloseInfoWindow = () => {
    setSelectedIncident(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading incident data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HomeNavbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-6 pt-24 pb-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Road Safety Heat Map
              </h1>
              <p className="text-xl text-blue-100 mb-3">
                Live visualization of reported incidents across Australia
              </p>
              <p className="text-lg text-blue-200 max-w-2xl mx-auto">
                Track dangerous driving patterns and road safety issues in
                real-time. Each marker represents a verified incident report
                from our community.
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Interactive Map
                    </h3>
                    <p className="text-gray-600">
                      Click on markers for detailed incident information
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {geocodedIncidents.length} incidents plotted
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-[600px] lg:h-[700px]">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                    }}
                    defaultCenter={mapDefaultProps.center}
                    defaultZoom={mapDefaultProps.zoom}
                    options={mapOptions}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={handleApiLoaded}
                  >
                    {geocodedIncidents.map((incident, index) => (
                      <IncidentMarker
                        key={index}
                        lat={incident.lat}
                        lng={incident.lng}
                        incident={incident}
                        color={incident.color}
                        onClick={() => handleMarkerClick(incident)}
                      />
                    ))}

                    {selectedIncident && (
                      <InfoWindow
                        key={`info-${selectedIncident.lat}-${selectedIncident.lng}`}
                        lat={selectedIncident.lat}
                        lng={selectedIncident.lng}
                        incident={selectedIncident}
                        color={selectedIncident.color}
                        addressString={selectedIncident.addressString}
                        onClose={handleCloseInfoWindow}
                      />
                    )}
                  </GoogleMapReact>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white border-t">
          <div className="container mx-auto px-6 py-6">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-gray-600">
                💡 <strong>How to use:</strong> Click on any colored marker to
                view incident details. Zoom in to explore specific neighborhoods
                and zoom out for broader regional patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentHeatMap;
