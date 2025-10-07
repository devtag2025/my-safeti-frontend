import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="w-full py-6 bg-white">
      <Card className="relative overflow-hidden rounded-2xl border border-[#6e0001]/20 shadow-2xl shadow-[#6e0001]/20 bg-white">
        {/* Crimson gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6e0001] via-[#8a0000] to-[#6e0001] opacity-10"></div>

        {/* Subtle animated accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#6e0001]/10 to-transparent animate-pulse"></div>

        <div className="relative z-10 px-6 py-12 sm:px-12 lg:flex lg:items-center lg:gap-x-10">
          <div className="mx-auto lg:mx-0 lg:flex-auto lg:text-left text-center">
            {/* Greeting */}
            <div className="mb-6 inline-flex items-center rounded-full border border-[#6e0001]/30 bg-white/80 backdrop-blur-md px-4 py-1.5 text-sm text-[#6e0001] shadow-md">
              <Sparkles className="mr-2 h-4 w-4 text-[#6e0001] animate-pulse" />
              <span className="font-medium">
                {user
                  ? `Welcome back, ${user.fullName}`
                  : "Make our roads safer"}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-[#6e0001] to-[#8a0000] bg-clip-text text-transparent">
              {user
                ? "Ready to make a difference today?"
                : "Report Unsafe Driving. Save Lives."}
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-700 max-w-xl mx-auto lg:mx-0">
              Use My Safeti.com.au to report dangerous, reckless or unsafe
              driving you have witnessed with just a few clicks. Your reports
              help contribute to improved road safety outcomes for all road
              users across Australia.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#6e0001] to-[#8a0000] hover:from-[#8a0000] hover:to-[#6e0001] text-white text-xl font-semibold rounded-full px-8 shadow-lg shadow-[#6e0001]/40 transition-all duration-300 hover:scale-105"
              >
                <Link to="/report" className="flex items-center space-x-2">
                  <span>Report Now</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Video Section */}
          <div className="relative aspect-video overflow-hidden mt-8 lg:mt-0 rounded-2xl shadow-xl w-full max-w-xl mx-auto border border-[#6e0001]/20 ring-1 ring-[#6e0001]/30">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#6e0001] to-[#8a0000] rounded-2xl blur-lg opacity-20"></div>

            <video
              src="/images/homePageVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="relative w-full h-full object-cover rounded-2xl"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6e0001] to-transparent opacity-40"></div>
      </Card>
    </div>
  );
};

export default HeroSection;
