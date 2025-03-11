import React, { useState, useEffect } from "react";
import { getActiveAds } from "../../api/adsService";

const Advertisement = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getActiveAds();
        const activeAds = data.filter(
          (ad) =>
            ad.active &&
            (!ad.expiryDate || new Date(ad.expiryDate) > new Date())
        );
        setAdvertisements(activeAds);
      } catch (err) {
        setError(err.message || "Failed to fetch advertisements");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();

    // Auto-slide every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === advertisements.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [advertisements.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === advertisements.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? advertisements.length - 1 : prev - 1
    );
  };

  return (
    <>
      {advertisements.length > 0 && (
        <div className="w-[90%] lg:w-[60%] mx-auto mt-6 relative">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Featured Offers
          </h2>

          {loading && (
            <p className="text-gray-500 text-center">Loading ads...</p>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Carousel */}
          <div
            id="default-carousel"
            className="relative w-full"
            data-carousel="slide"
          >
            {/* Carousel Wrapper */}
            <div className="relative overflow-hidden rounded-lg h-[600px]">
              {advertisements.map((ad, index) => (
                <div
                  key={ad._id}
                  className={`absolute w-full transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0 hidden"
                  }`}
                  data-carousel-item
                  onClick={() => ad.link && window.open(ad.link, "_blank")}
                >
                  {ad.mediaType === "image" ? (
                    <img
                      src={ad.mediaUrl}
                      alt={ad.title}
                      className="block w-full h-full object-fill cursor-pointer rounded-lg"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/600/400";
                        e.target.alt = "Image not available";
                      }}
                    />
                  ) : ad.mediaType === "video" ? (
                    <video
                      controls
                      className="block w-full h-full object-cover rounded-lg"
                      poster="/api/placeholder/600/400"
                    >
                      <source src={ad.mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No media available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
              {advertisements.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  aria-current={index === currentSlide ? "true" : "false"}
                  onClick={() => setCurrentSlide(index)}
                ></button>
              ))}
            </div>

            {/* Slider Controls */}
            <button
              type="button"
              className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={prevSlide}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={nextSlide}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Advertisement;