// LocationPicker.jsx
import { useState, useEffect, useRef } from "react";
import { MapPinIcon } from "lucide-react";

export default function LocationPicker({ onLocationSelect, defaultLocation }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  
  // Default location (Sydney, Australia)
  const DEFAULT_LAT = -33.8688;
  const DEFAULT_LNG = 151.2093;

  // Initialize Google Maps
  useEffect(() => {
    // Load the Google Maps script if it's not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else if (!mapLoaded) {
      initMap();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize map once the script is loaded
  const initMap = () => {
    if (!mapRef.current) return;

    const initialPosition = defaultLocation 
      ? { lat: defaultLocation.lat, lng: defaultLocation.lng }
      : { lat: DEFAULT_LAT, lng: DEFAULT_LNG };

    const map = new window.google.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new window.google.maps.Marker({
      position: initialPosition,
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Create a geocoder instance
    const geocoder = new window.google.maps.Geocoder();
    geocoderRef.current = geocoder;

    // Add click listener to map
    map.addListener("click", (event) => {
      marker.setPosition(event.latLng);
      updateLocation(event.latLng);
    });

    // Add drag listener to marker
    marker.addListener("dragend", () => {
      updateLocation(marker.getPosition());
    });

    // Set up the search box
    const searchBox = new window.google.maps.places.SearchBox(
      document.getElementById("map-search-input")
    );

    // Bias the SearchBox results towards current map's viewport
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      // If the place has a geometry, then present it on a map
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      updateLocation(place.geometry.location);
    });

    // If there's a default location, update the address
    if (defaultLocation && defaultLocation.address) {
      setAddress(defaultLocation.address);
      // Also set the search value to the address
      setSearchValue(defaultLocation.address);
    }

    // Store references
    markerRef.current = marker;
    setMapLoaded(true);
    setPosition(initialPosition);
  };

  // Update location based on marker position
  const updateLocation = (latLng) => {
    const lat = latLng.lat();
    const lng = latLng.lng();
    
    setPosition({ lat, lng });
    
    // Get address from coordinates using geocoder
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          setSearchValue(formattedAddress);
          
          // Pass location data to parent component
          onLocationSelect({
            lat,
            lng,
            address: formattedAddress,
            streetNumber: getAddressComponent(results[0], "street_number"),
            street: getAddressComponent(results[0], "route"),
            suburb: getAddressComponent(results[0], "locality") || 
                   getAddressComponent(results[0], "sublocality"),
            state: getAddressComponent(results[0], "administrative_area_level_1"),
            crossStreet: "" // This would need more advanced logic to determine
          });
        }
      });
    }
  };

  // Helper function to extract address components
  const getAddressComponent = (place, type) => {
    if (!place || !place.address_components) return "";
    
    const component = place.address_components.find(
      comp => comp.types.includes(type)
    );
    
    return component ? component.long_name : "";
  };

  // Toggle map visibility
  const toggleMap = () => {
    setShowMap(!showMap);
    // Initialize map if it's being shown and not already initialized
    if (!showMap && mapLoaded) {
      // Force map to render correctly by triggering a resize event
      setTimeout(() => {
        window.google.maps.event.trigger(mapRef.current, 'resize');
        if (markerRef.current && position) {
          const map = markerRef.current.getMap();
          map.setCenter(position);
        }
      }, 100);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="map-search-input"
            type="text"
            placeholder="Search for a location or click on map"
            className="block w-full pl-9 pr-3 py-1.5 rounded-md border border-gray-300 text-gray-900 placeholder:text-gray-400 sm:text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={toggleMap}
          className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100"
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>
      
      {showMap && (
        <div className="border border-gray-300 rounded-md overflow-hidden mt-2">
          <div 
            ref={mapRef} 
            className="w-full h-64 bg-gray-100"
          ></div>
          {address && (
            <div className="p-2 bg-gray-50 text-sm text-gray-700 border-t border-gray-300">
              <strong>Selected:</strong> {address}
            </div>
          )}
        </div>
      )}
    </div>
  );
}