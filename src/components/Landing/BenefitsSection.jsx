import React from "react";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";

const BenefitsSection = () => {
  return (
    <section
      className="relative py-20 bg-white overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      {/* Decorative crimson radial glows */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            `radial-gradient(360px 140px at 8% 18%, ${CRIMSON}12, transparent), ` +
            `radial-gradient(320px 120px at 92% 82%, ${CRIMSON_LIGHT}10, transparent)`,
        }}
      />

      {/* Subtle pattern */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-5"
        style={{
          backgroundImage: "url('/images/pattern.svg')",
          backgroundSize: "520px",
        }}
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            id="benefits-heading"
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: CRIMSON }}
          >
            Benefits for Everyone
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            My Safeti creates value for both everyday users and our insurance
            company partners — with a privacy-first approach and trusted
            workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Road Users Card */}
          <div
            className="relative rounded-2xl bg-white p-8 shadow-xl"
            style={{
              border: `1px solid rgba(110,0,1,0.06)`,
              boxShadow: "0 20px 50px rgba(16,24,40,0.06)",
            }}
          >
            {/* Top crimson accent bar */}
            <div
              className="absolute -top-1 left-6 right-6 h-1 rounded-t-xl"
              style={{
                background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                boxShadow: `0 6px 20px ${CRIMSON}20`,
              }}
            />

            <h3
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: CRIMSON }}
            >
              For Road Users
            </h3>

            <ul className="space-y-6 mt-4">
              <li className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    Contribute to road safety
                  </div>
                  <p className="text-slate-600">
                    Help create safer roads for everyone by reporting dangerous
                    driving — quick, trusted, and anonymous when requested.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Earn rewards</div>
                  <p className="text-slate-600">
                    Receive rewards for approved media submissions (typically
                    $50–$100 depending on incident complexity).
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h4l3 9 4-18 3 9h4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Easy reporting</div>
                  <p className="text-slate-600">
                    A simple, mobile-first interface that lets you report
                    incidents in seconds.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Anonymous reporting</div>
                  <p className="text-slate-600">
                    Submit reports without exposing your identity — privacy is
                    central to our design and processes.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Insurance Companies Card */}
          <div
            className="relative rounded-2xl bg-white p-8 shadow-xl"
            style={{
              border: `1px solid rgba(110,0,1,0.06)`,
              boxShadow: "0 20px 50px rgba(16,24,40,0.06)",
            }}
          >
            {/* Top crimson accent bar */}
            <div
              className="absolute -top-1 left-6 right-6 h-1 rounded-t-xl"
              style={{
                background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                boxShadow: `0 6px 20px ${CRIMSON}20`,
              }}
            />

            <h3
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: CRIMSON }}
            >
              For Insurance Companies
            </h3>

            <ul className="space-y-6 mt-4">
              <li className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6M12 3v6m0 6v6"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Enhanced risk assessment</div>
                  <p className="text-slate-600">
                    Access real-world driving behaviour data to refine underwriting models.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7h18M3 12h18M3 17h18"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Optimised premiums</div>
                  <p className="text-slate-600">
                    Adjust pricing using observed driving patterns rather than proxies.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6M7 21h10"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Comprehensive analytics</div>
                  <p className="text-slate-600">
                    Detailed reports and visualisations identify hotspots and long-term trends.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Streamlined claims processing</div>
                  <p className="text-slate-600">
                    Evaluate reports and media efficiently to support fair and timely claims decisions.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
