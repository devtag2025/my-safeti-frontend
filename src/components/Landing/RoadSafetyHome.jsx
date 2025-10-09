import React from "react";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";

const RoadSafetyPanel = ({ deathStats }) => {
  return (
    <div className="relative h-[500px] overflow-hidden font-sans rounded-xl border border-[#6e0001]/20 shadow-md">
      <div className="flex h-full relative">
        {/* Left: Stats with background image */}
        <div
          className="relative hidden lg:flex w-full lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://www.tac.vic.gov.ae/__data/assets/git_bridge/0019/313327/static/files/tac-stats.png')",
            clipPath: "polygon(0 0, 100% 0, 65% 100%, 0 100%)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${CRIMSON}dd, ${CRIMSON_LIGHT}cc)`,
              }}
            />
            <div className="relative z-10 flex flex-col justify-center items-center h-full px-10">
              {deathStats?.stats?.slice(0, 2).map((s, i) => (
                <div key={i} className="mb-10 text-center group">
                  <h4 className="text-gray-200 text-[15px] font-medium mb-2">
                    {s.subtitle}
                  </h4>
                  <span className="text-white text-[72px] leading-none font-bold drop-shadow-2xl group-hover:text-[#ffd6d6] transition-colors duration-300">
                    {s.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile version of stats */}
        <div
          className="relative flex lg:hidden w-full lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://www.tac.vic.gov.ae/__data/assets/git_bridge/0019/313327/static/files/tac-stats.png')",
          }}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${CRIMSON}dd, ${CRIMSON_LIGHT}cc)`,
            }}
          />
          <div className="relative z-10 flex flex-col justify-center items-center h-full w-full px-10 text-center">
            <div className="mb-10">
              <h4 className="text-gray-200 text-[15px] font-medium mb-2">
                Lives lost in 2025 to date
              </h4>
              <div className="flex items-end justify-center">
                <span className="text-white text-[72px] leading-none font-bold mr-3 drop-shadow-2xl">
                  143
                </span>
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-gray-200 text-[15px] font-medium mb-2">
                Lives lost in 2024 to date
              </h4>
              <span className="text-white text-[72px] leading-none font-bold drop-shadow-2xl">
                131
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Message */}
        <div className="w-1/2 hidden lg:flex items-center bg-white">
          <div className="px-12 py-12 max-w-xl">
            <h2
              className="text-3xl font-bold mb-6"
              style={{
                background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Working towards safer roads
            </h2>
            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
              <p>
                We along with our road safety partners are working to achieve
                the vision of no deaths or serious injuries on our roads. We are
                moving towards a future where every journey is a safe one.
              </p>
              <p className="font-semibold text-[#6e0001]">
                It is not acceptable to see death or serious injuries as
                inevitable on our roads.
              </p>
              <a
                href="https://www.tac.vic.gov.ae/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#6e0001] hover:text-[#8a0000] font-bold text-sm uppercase tracking-wide pt-2 transition-all duration-300 group"
              >
                Find out more about road safety
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadSafetyPanel;
