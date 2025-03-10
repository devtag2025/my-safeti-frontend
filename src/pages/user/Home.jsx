import HeroSection from "../../components/Home/HeroSection";
import HowItWorks from "../../components/Home/HowItWorks";
import Advertisement from "../../components/Home/ads";
import ReportsStats from "./ReportsStats";

const Home = () => {
  return (
    <div className="mb-4">
      <HeroSection />
      <ReportsStats />
      <HowItWorks />
      <Advertisement />
    </div>
  );
};

export default Home;
