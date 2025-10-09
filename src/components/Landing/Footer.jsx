import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#6e0001]/20 text-gray-600 py-6 relative overflow-hidden">
      {/* Subtle crimson accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6e0001] to-transparent opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <p className="text-gray-500 text-sm text-center hover:text-[#6e0001] transition-colors duration-300">
          © 2025 My Safeti.com.ae. All rights reserved.
        </p>
      </div>

      {/* Bottom crimson glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#8a0000]/60 to-transparent blur-sm"></div>
    </footer>
  );
};

export default Footer;
