import React from "react";
import { Link } from "react-router-dom";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Decorative crimson radial glows (placed further back) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none -z-20"
        style={{
          background:
            `radial-gradient(400px 180px at 8% 12%, ${CRIMSON}10, transparent), ` +
            `radial-gradient(360px 160px at 92% 84%, ${CRIMSON_LIGHT}08, transparent)`,
        }}
      />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 bg-[url('/images/pattern.svg')] opacity-5" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
          {/* Left: copy */}
          <div className="w-full md:w-1/2">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 md:mb-6"
              style={{ color: CRIMSON }}
            >
              Report unsafe driving — make Australian roads safer
            </h1>

            <p className="text-base md:text-lg text-slate-700 mb-6 max-w-2xl">
              My Safeti empowers everyday Australians to report at-risk driving
              behaviours and contribute to safer roads for everyone. Share what
              you see — help keep our communities safe.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Link
                to="/report"
                className="inline-flex items-center justify-center px-5 py-3 rounded-md font-semibold shadow-lg transition-transform duration-200"
                style={{
                  background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                  color: "#fff",
                  boxShadow: "0 12px 36px rgba(110,0,1,0.12)",
                }}
                aria-label="Report an incident"
              >
                Report an Incident
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 rounded-md font-semibold border-2 transition-colors duration-200"
                style={{
                  background: "white",
                  color: CRIMSON,
                  borderColor: CRIMSON,
                }}
                aria-label="Create account"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Right: video card */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div
              className="relative rounded-2xl overflow-hidden w-full max-w-2xl"
              style={{
                boxShadow: "0 30px 80px rgba(16,24,40,0.08)",
                borderRadius: 20,
              }}
            >
              {/* Crimson glow border (behind the card) */}
              <div
                aria-hidden
                className="absolute -inset-2 rounded-2xl -z-10"
                style={{
                  background: `linear-gradient(90deg, ${CRIMSON}20, ${CRIMSON_LIGHT}10)`,
                  filter: "blur(24px)",
                  opacity: 0.85,
                }}
              />

              {/* White card surface */}
              <div
                className="relative bg-white rounded-2xl overflow-hidden border"
                style={{
                  borderColor: "rgba(110,0,1,0.06)",
                }}
              >
                {/* Top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                  }}
                />

                {/* Video */}
                <video
                  src="/images/homePageVideo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 md:h-80 object-cover"
                >
                  <source src="/images/homePageVideo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Card footer with small caption */}
                <div
                  className="px-4 py-3 border-t"
                  style={{ borderColor: "rgba(110,0,1,0.04)" }}
                >
                  <p className="text-sm text-slate-600 max-w-[90%] mx-auto">
                    Example: how My Safeti makes it fast and easy to report
                    at-risk driver behaviour.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional: centered subcopy or CTA row (keeps margins consistent) */}
        <div className="mt-8 md:mt-12 max-w-4xl mx-auto text-center md:text-left">
          {/* keep empty or add supporting text/components here */}
        </div>
      </div>

      {/* Bottom thin crimson accent (subtle) */}
      <div
        className="absolute bottom-0 left-0 right-0 -z-20"
        style={{
          height: 6,
          background: `linear-gradient(90deg, transparent, ${CRIMSON}32, transparent)`,
        }}
      />
    </section>
  );
};

export default HeroSection;
