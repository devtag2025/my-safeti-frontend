import React from "react";

const StatisticsSection = ({ stats }) => {
  if (!stats) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden font-sans">
      {/* Crimson radial background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(110,0,1,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#6e0001]">
            Making Australian Roads Safer
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform is driving meaningful change for road safety in
            Australia.
          </p>
          <div className="mt-3 h-1 w-24 bg-gradient-to-r from-[#6e0001] to-[#8a0000] mx-auto rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Reports */}
          <div className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-[#6e0001]/20 shadow-md hover:shadow-lg hover:shadow-[#6e0001]/20 transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#6e0001] to-[#8a0000] group-hover:scale-110 transition-transform duration-300">
              {stats?.totalApprovedReports ?? "—"}
            </div>
            <div className="text-slate-600 group-hover:text-[#6e0001] transition-colors duration-300">
              Reports Submitted
            </div>
          </div>

          {/* High-Risk Drivers */}
          <div className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-[#6e0001]/20 shadow-md hover:shadow-lg hover:shadow-[#6e0001]/20 transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#6e0001] to-[#8a0000] group-hover:scale-110 transition-transform duration-300">
              {stats?.highRiskDrivers?.toLocaleString() ?? "—"}
            </div>
            <div className="text-slate-600 group-hover:text-[#6e0001] transition-colors duration-300">
              High-Risk Drivers Identified
            </div>
          </div>

          {/* Insurance Partner */}
          <div className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-[#6e0001]/20 shadow-md hover:shadow-lg hover:shadow-[#6e0001]/20 transition-all duration-300 hover:-translate-y-2">
            <div className="text-3xl md:text-4xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#6e0001] to-[#8a0000] group-hover:scale-110 transition-transform duration-300">
              {stats?.insurancePartner ?? "—"}
            </div>
            <div className="text-slate-600 group-hover:text-[#6e0001] transition-colors duration-300">
              Insurance Partner
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
