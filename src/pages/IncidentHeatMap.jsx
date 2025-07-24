import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import HomeNavbar from "../components/layout/HomeNavbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  X,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";

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
const InfoWindow = ({
  incident,
  color,
  onClose,
  addressString,
  onAddWitnessInfo,
}) => {
  const date = new Date(incident.date).toLocaleDateString("en-AU");
  const time = new Date(incident.date).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isRFI = incident.incidentType === "Request For Information";

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
          backgroundColor: isRFI ? "black" : color,
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

        {/* Add Witness Info Button - Only show for RFI (white dots) */}
        {isRFI && (
          <div style={{ marginTop: "16px" }}>
            <button
              onClick={onAddWitnessInfo}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
            >
              <Eye size={16} />
              Add Witness Information
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Component
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

  const handleSelectAll = () => {
    onFilterChange(Object.keys(incidentColors));
  };

  const handleSelectNone = () => {
    onFilterChange([]);
  };

  const totalCount = Object.values(incidentCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const activeCount = Object.keys(incidentCounts)
    .filter((key) => activeFilters.includes(key))
    .reduce((sum, key) => sum + incidentCounts[key], 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Incidents
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              Showing {activeCount} of {totalCount} incidents
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-medium"
            >
              Show All
            </button>
            <button
              onClick={handleSelectNone}
              className="text-xs px-3 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors font-medium"
            >
              Hide All
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Object.entries(incidentColors).map(([incidentType, color]) => {
              const isActive = activeFilters.includes(incidentType);
              const count = incidentCounts[incidentType] || 0;

              return (
                <button
                  key={incidentType}
                  onClick={() => handleFilterToggle(incidentType)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${
                      isActive
                        ? "border-gray-300 bg-white shadow-sm"
                        : "border-gray-100 bg-gray-50 opacity-50 hover:opacity-75"
                    }
                  `}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {incidentType}
                    </div>
                    <div className="text-xs text-gray-500">
                      {count} incident{count !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <Eye size={16} className="text-green-500" />
                    ) : (
                      <EyeOff size={16} className="text-gray-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
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
  const [activeFilters, setActiveFilters] = useState([]);
  const [incidentCounts, setIncidentCounts] = useState({});
  const [witnessDialogOpen, setWitnessDialogOpen] = useState(false);
  const [witnessInfo, setWitnessInfo] = useState("");
  const [witnessEmail, setWitnessEmail] = useState("");
  const [submittingWitness, setSubmittingWitness] = useState(false);

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
        "http://localhost:3000/api/report/reportsForHeatMap"
      );
      setIncidents(response.data);

      // Calculate incident counts and set initial filters
      const counts = {};
      response.data.forEach((incident) => {
        const type = incident.incidentType;
        counts[type] = (counts[type] || 0) + 1;
      });
      setIncidentCounts(counts);

      // Initially show all incident types
      setActiveFilters(Object.keys(incidentColors));
    } catch (err) {
      setError("Failed to load incident data");
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWitnessSubmit = async () => {
    if (!witnessInfo.trim() || !selectedIncident) return;

    try {
      setSubmittingWitness(true);
      await axios.post(
        `http://localhost:3000/api/report/witness/${selectedIncident._id}`,
        {
          info: witnessInfo.trim(),
          contactEmail: witnessEmail.trim() || null,
        }
      );

      setWitnessDialogOpen(false);
      setWitnessInfo("");
      setWitnessEmail("");
      alert(
        "Thank you! Your witness information has been submitted anonymously."
      );
    } catch (error) {
      console.error("Error submitting witness info:", error);
      alert("Failed to submit witness information. Please try again.");
    } finally {
      setSubmittingWitness(false);
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

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    // Close info window if selected incident is no longer visible
    if (
      selectedIncident &&
      !newFilters.includes(selectedIncident.incidentType)
    ) {
      setSelectedIncident(null);
    }
  };

  // Filter incidents based on active filters
  const filteredIncidents = geocodedIncidents.filter((incident) =>
    activeFilters.includes(incident.incidentType)
  );

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

        {/* Filter and Map Section */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Filter Component */}
            <IncidentFilter
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              incidentCounts={incidentCounts}
            />

            {/* Map */}
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
                    {filteredIncidents.length} incidents plotted
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
                    {filteredIncidents.map((incident, index) => (
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
                        onAddWitnessInfo={() => setWitnessDialogOpen(true)}
                      />
                    )}
                    <Dialog
                      open={witnessDialogOpen}
                      onOpenChange={setWitnessDialogOpen}
                    >
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add Witness Information</DialogTitle>
                          <DialogDescription>
                            Share what you witnessed about this incident. Your
                            information will be submitted anonymously.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="witness-info">
                              What did you see?
                            </Label>
                            <Textarea
                              id="witness-info"
                              placeholder="e.g., Red SUV, partial plate 7XK, backed into a black sedan at around 3:15pm..."
                              value={witnessInfo}
                              onChange={(e) => setWitnessInfo(e.target.value)}
                              rows={4}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="witness-email">
                              Contact Email (Optional)
                            </Label>
                            <Input
                              id="witness-email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={witnessEmail}
                              onChange={(e) => setWitnessEmail(e.target.value)}
                              className="mt-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Only provide if you're willing to be contacted for
                              follow-up questions
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setWitnessDialogOpen(false);
                              setWitnessInfo("");
                              setWitnessEmail(""); 
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleWitnessSubmit}
                            disabled={!witnessInfo.trim() || submittingWitness}
                          >
                            {submittingWitness
                              ? "Submitting..."
                              : "Submit Anonymously"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                💡 <strong>How to use:</strong> Use the filter controls above to
                show/hide specific incident types. Click on any colored marker
                to view detailed information. Zoom in to explore specific
                neighborhoods and zoom out for broader regional patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentHeatMap;
