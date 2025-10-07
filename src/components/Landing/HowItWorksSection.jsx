import React from "react";

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle radial crimson glow in background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6e0001]/5 via-transparent to-[#8a0000]/5"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6e0001] via-[#8a0000] to-[#6e0001] bg-clip-text text-transparent mb-4">
            How My Safeti Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform enables you to report dangerous driving behaviours
            in just a few simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Observe Incident",
              desc: "Witness unsafe driving behaviour or an at-risk situation, and optionally capture it with dashcam footage.",
            },
            {
              step: "2",
              title: "Submit Report",
              desc: "Enter vehicle registration, incident details, date, time and location through our secure form.",
            },
            {
              step: "3",
              title: "Data Analysis",
              desc: "Reports are verified and analysed to identify patterns and high-risk drivers.",
            },
            {
              step: "4",
              title: "Safety Impact",
              desc: "Insurance companies access the data for risk assessment, improving road safety for all.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-[#6e0001]/20 p-6 shadow-md hover:shadow-xl hover:shadow-[#6e0001]/20 transition-all duration-300 text-center hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-[#6e0001] to-[#8a0000] w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4 shadow-lg shadow-[#6e0001]/30 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl font-bold">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#6e0001] group-hover:text-[#8a0000] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
