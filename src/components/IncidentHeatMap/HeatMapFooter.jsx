import { Lightbulb } from "lucide-react";
import React from "react";

const HeatMapFooter = () => {
  return (
    <div className="bg-[#111827] border-t border-[#6e0001]/50 text-[#f9f9f9]">
      <div className="container mx-auto px-6 py-6">
        <div className="max-w-6xl mx-auto text-center flex flex-col md:flex-row items-center justify-center gap-4">
          <Lightbulb className="w-8 h-8 text-[#ffcc00] animate-pulse" />
          <p className="text-[#f0f0f0] text-sm md:text-base max-w-3xl">
            <strong>How to use:</strong> Use the filter controls above to
            show/hide specific incident types. Click on any colored marker to
            view detailed information. Zoom in to explore specific neighborhoods
            and zoom out for broader regional patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeatMapFooter;
