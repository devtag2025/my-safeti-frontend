import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlarmClock,
  FileText,
  BarChart4,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <FileText size={30} className="text-[#6e0001]" />,
      title: "Submit a Report",
      description:
        "Quickly report unsafe driving by entering vehicle details, incident type, time, and location.",
      gradient: `from-[${CRIMSON}] to-[${CRIMSON_LIGHT}]`,
      iconBg: "bg-[#6e0001]/10",
    },
    {
      icon: <BarChart4 size={30} className="text-[#6e0001]" />,
      title: "Data Analysis",
      description:
        "Our system analyses patterns and shares anonymized risk data with insurance companies.",
      gradient: `from-[${CRIMSON}] to-[${CRIMSON_LIGHT}]`,
      iconBg: "bg-[#6e0001]/10",
    },
    {
      icon: <Shield size={30} className="text-[#6e0001]" />,
      title: "Impact & Rewards",
      description:
        "Help improve road safety and earn points that can be redeemed for rewards.",
      gradient: `from-[${CRIMSON}] to-[${CRIMSON_LIGHT}]`,
      iconBg: "bg-[#6e0001]/10",
    },
    {
      icon: <AlarmClock size={30} className="text-[#6e0001]" />,
      title: "Real-time Updates",
      description:
        "Receive notifications on the status of your reports and their impact on safety.",
      gradient: `from-[${CRIMSON}] to-[${CRIMSON_LIGHT}]`,
      iconBg: "bg-[#6e0001]/10",
    },
  ];

  return (
    <section className="py-10 bg-white text-slate-800" id="how-it-works">
      <div className="space-y-8 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center">
            <div
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset"
              style={{
                background: "rgba(110,0,1,0.04)",
                color: CRIMSON,
                boxShadow: "0 6px 18px rgba(110,0,1,0.03)",
                borderColor: "rgba(110,0,1,0.08)",
              }}
            >
              <Sparkles className="mr-1 h-3.5 w-3.5 animate-pulse" />
              <span>How it works</span>
            </div>
          </div>

          <h2
            className="text-3xl font-bold"
            style={{
              background:
                `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Driving Change, One Report at a Time
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto">
            Our platform makes it easy to report unsafe driving behavior and
            contribute to safer roads for everyone.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="group overflow-hidden transition-all duration-300 bg-white border rounded-xl"
              style={{
                borderColor: "rgba(110,0,1,0.12)",
                boxShadow: "0 8px 30px rgba(110,0,1,0.04)",
              }}
            >
              {/* Gradient top border */}
              <div
                className={`h-1 bg-gradient-to-r ${step.gradient}`}
                style={{
                  // fallback for tailwind dynamic gradient class
                  background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                }}
              />

              <CardContent className="p-6 relative">
                {/* Soft crimson hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"
                  style={{
                    background: `linear-gradient(180deg, ${CRIMSON}10, transparent)`,
                    pointerEvents: "none",
                  }}
                />

                {/* Icon */}
                <div
                  className={`relative h-12 w-12 rounded-full flex items-center justify-center mb-4 ${step.iconBg}`}
                  style={{
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(110,0,1,0.06)",
                  }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg mb-2" style={{ color: "#111827" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>

                {/* Step indicator */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-slate-500">
                    STEP {index + 1}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300"
                    style={{ color: CRIMSON }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
