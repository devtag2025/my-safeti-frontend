import ReportIcon from "../../assets/svgs/ReportIcon";
import MagnifierIcon from "../../assets/svgs/MagnifierIcon";
import RewardIcon from "../../assets/svgs/RewardIcon";
import HIWCard from "../cards/hiwCard";
import Button from "../buttons/primaryButton";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <ReportIcon size={40} color="#201B2B" />,
      title: "Submit a Report",
      description: "Enter vehicle details, time, and location.",
    },
    {
      icon: <MagnifierIcon size={40} color="#201B2B" />,
      title: "Data Analysis",
      description: "We analyze reports and share risk data with insurers.",
    },
    {
      icon: <RewardIcon size={40} color="#201B2B" />,
      title: "Impact & Rewards",
      description: "Improve road safety and earn rewards!",
    },
  ];

  return (
    <section className="py-4 w-[80%] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <HIWCard
            key={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
      <div className="text-center mt-6">
        <Button onClick={() => navigate("/report")}>Report Now</Button>
      </div>
    </section>
  );
};

export default HowItWorks;
