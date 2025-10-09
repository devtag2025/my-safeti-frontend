import React from "react";

const HeatMapHeader = () => {
  return (
    <div className="bg-gradient-to-r from-[#6e0001] to-[#8a0000] text-white shadow-lg">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide text-[#ffcccc]">
            Road Safety Heat Map
          </h1>
          <p className="text-xl text-[#ffcccc] mb-3">
            Live visualization of reported incidents across UAE
          </p>
          <p className="text-lg text-[#ffe6e6] max-w-2xl mx-auto">
            Track dangerous driving patterns and road safety issues in
            real-time. Each marker represents a verified incident report from
            our community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeatMapHeader;