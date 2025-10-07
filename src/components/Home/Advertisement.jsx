import React, { useState, useEffect } from "react";
import { getActiveAds } from "../../api/adsService";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

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
  }, []);

  useEffect(() => {
    if (advertisements.length <= 1) return;

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

  if (loading && advertisements.length === 0 && !error) {
    return null;
  }

  return (
    <div className="w-full mx-auto">
      <Card className="border border-[#6e0001]/20 shadow-lg shadow-[#6e0001]/10 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="relative">
            {/* Header with crimson gradient */}
            <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#6e0001]/90 via-[#6e0001]/60 to-transparent z-10 p-4">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#6e0001] via-[#8a0000] to-rose-500 bg-clip-text text-transparent">
                Featured Offers
              </h2>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="h-96 bg-white/40 flex items-center justify-center">
                <div className="space-y-4 w-full px-8">
                  <Skeleton className="h-6 w-2/3 mx-auto bg-[#6e0001]/20" />
                  <Skeleton className="h-72 w-full rounded-lg bg-[#6e0001]/20" />
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="m-4 bg-rose-100 border-rose-300 text-rose-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Carousel */}
            {!loading && advertisements.length > 0 && (
              <div className="relative w-full h-96">
                {/* Carousel Wrapper */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  {advertisements.map((ad, index) => (
                    <div
                      key={ad._id}
                      className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
                        index === currentSlide
                          ? "opacity-100 translate-x-0"
                          : index < currentSlide
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                      }`}
                      onClick={() => ad.link && window.open(ad.link, "_blank")}
                    >
                      {ad.mediaType === "image" ? (
                        <img
                          src={ad.mediaUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/1200/500";
                            e.target.alt = "Image not available";
                          }}
                        />
                      ) : ad.mediaType === "video" ? (
                        <video
                          controls
                          className="w-full h-full object-cover"
                          poster="/api/placeholder/1200/500"
                        >
                          <source src={ad.mediaUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500">
                            No media available
                          </span>
                        </div>
                      )}

                      {/* Ad Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent backdrop-blur-sm p-6">
                        <h3 className="text-xl font-bold text-[#6e0001]">
                          {ad.title}
                        </h3>
                        {ad.description && (
                          <p className="mt-2 line-clamp-2 text-gray-700">
                            {ad.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider Controls */}
                {advertisements.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute top-1/2 left-4 z-30 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#6e0001]/20 hover:bg-[#6e0001]/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6e0001]/40"
                      onClick={prevSlide}
                    >
                      <ChevronLeft className="w-6 h-6 text-[#6e0001]" />
                      <span className="sr-only">Previous</span>
                    </button>
                    <button
                      type="button"
                      className="absolute top-1/2 right-4 z-30 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#6e0001]/20 hover:bg-[#6e0001]/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6e0001]/40"
                      onClick={nextSlide}
                    >
                      <ChevronRight className="w-6 h-6 text-[#6e0001]" />
                      <span className="sr-only">Next</span>
                    </button>
                  </>
                )}

                {/* Slider Indicators */}
                {advertisements.length > 1 && (
                  <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
                    {advertisements.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "bg-[#6e0001] shadow-lg shadow-[#6e0001]/40 scale-110"
                            : "bg-gray-400/50 hover:bg-gray-500/70"
                        }`}
                        aria-current={index === currentSlide ? "true" : "false"}
                        onClick={() => setCurrentSlide(index)}
                      ></button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Advertisement;
