import React from 'react'
import HomeNavbar from '../components/layout/HomeNavbar'
import Footer from '../components/Landing/Footer'

const OurPartner = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827] relative">
      {/* Subtle crimson radial glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#6e0001]/10 via-transparent to-[#8a0000]/20 opacity-50 pointer-events-none"></div>

      <HomeNavbar />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* Icon/Illustration */}
          <div className="my-8">
            <div className="mx-auto w-32 h-32 bg-white/30 rounded-full flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm border border-[#6e0001]/30">
              <svg className="w-16 h-16 text-[#6e0001]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Our <span className="text-[#6e0001]">Partners</span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#8a0000]">
            Coming Soon
          </h2>

          <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto text-[#111827]/80">
            We're working with amazing partners to bring you the best road safety solutions. 
            This page will showcase our trusted collaborators and sponsors who share our vision 
            of making every journey a safe one.
          </p>

          {/* Partner Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            {[
              {
                title: "Government Partners",
                description: "Official collaborations with transport authorities",
                iconColor: "text-[#6e0001]",
                bgColor: "bg-[#6e0001]/20",
                svgPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"
              },
              {
                title: "Safety Organizations",
                description: "Leading road safety advocacy groups",
                iconColor: "text-[#8a0000]",
                bgColor: "bg-[#8a0000]/20",
                svgPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              },
              {
                title: "Technology Partners",
                description: "Innovative tech companies driving safety forward",
                iconColor: "text-[#6e0001]",
                bgColor: "bg-[#6e0001]/20",
                svgPath: "M13 10V3L4 14h7v7l9-11h-7z"
              },
            ].map((partner) => (
              <div key={partner.title} className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#6e0001]/30">
                <div className={`w-12 h-12 ${partner.bgColor} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                  <svg className={`w-6 h-6 ${partner.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={partner.svgPath} />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#111827] mb-2">{partner.title}</h3>
                <p className="text-[#111827]/70 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>

          {/* Coming Soon Badge */}
          <div className="my-12">
            <div className="inline-flex items-center px-4 py-2 bg-[#6e0001]/20 text-[#6e0001] rounded-full text-sm font-medium backdrop-blur-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Launch Expected Q3 2025
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default OurPartner
