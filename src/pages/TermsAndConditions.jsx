import Footer from "../components/Landing/Footer";
import HomeNavbar from "../components/layout/HomeNavbar";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827] font-inter relative">
      {/* Subtle crimson radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#6e0001]/10 via-transparent to-[#8a0000]/20 opacity-50 pointer-events-none"></div>

      <HomeNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#6e0001] to-[#8a0000] text-white shadow-lg py-16 h-[500px] flex items-center relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide">
              Terms & <span className="text-[#fb7185]">Conditions</span>
            </h1>
            <p className="text-xl text-[#f87171] mb-3">
              Please read these terms and conditions carefully before using the
              My Safeti platform.
            </p>
            <p className="text-lg text-[#fde2e4] max-w-2xl mx-auto">
              These terms govern your access to and use of the My Safeti
              platform, ensuring a safe and trusted experience for everyone.
            </p>
            <div className="mt-8 text-[#f87171]">
              <p className="text-lg">Effective Date: 30/08/2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-6 flex-1 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-12 border border-[#6e0001]/30 text-[#111827]">
            
            {/* Sections */}
            {[
              {
                title: "1. Definitions",
                content: (
                  <ul className="space-y-2 text-[#111827]/80">
                    <li>
                      <span className="font-semibold">"My Safeti" / "We" / "Us" / "Our"</span> – My Safeti AU Pty Ltd (ABN: [Insert ABN])
                    </li>
                    <li>
                      <span className="font-semibold">"User" / "You" / "Your"</span> – any individual who accesses, registers, or uses the Platform
                    </li>
                    <li>
                      <span className="font-semibold">"Registered Partners"</span> – insurance companies, law enforcement agencies, legal firms, and other authorised entities
                    </li>
                    <li>
                      <span className="font-semibold">"Content"</span> – any information, report, or media submitted by users
                    </li>
                  </ul>
                ),
              },
              {
                title: "2. Use of the Platform",
                content: (
                  <ul className="space-y-2 text-[#111827]/80">
                    <li>The Platform allows users to report at-risk driver behaviour and incidents.</li>
                    <li>Users may submit written reports and indicate whether dash cam or other media exists.</li>
                    <li>Direct upload of digital media is not permitted; users are contacted if footage is requested.</li>
                  </ul>
                ),
              },
              {
                title: "3. Privacy Policy",
                content: (
                  <div className="space-y-6 text-[#111827]/80">
                    <div>
                      <h3 className="font-semibold mb-2 text-[#6e0001]">Data Collection</h3>
                      <p>We collect and store information that you provide, including your name, contact details, reports, and bank details.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-[#6e0001]">Data Sharing</h3>
                      <p>Details shared only with Registered Partners:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Insurance Companies</li>
                        <li>Law Enforcement Agencies</li>
                        <li>Legal Firms (under lawful request)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-[#6e0001]">Bank Details</h3>
                      <p>Used solely for reward payments; never shared externally.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-[#6e0001]">Data Security</h3>
                      <p>Industry-standard safeguards in place, but absolute protection cannot be guaranteed.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-[#6e0001]">Retention</h3>
                      <p>Reports and details retained as long as legally required.</p>
                    </div>
                  </div>
                ),
              },
              {
                title: "4. Rewards for Media Provision",
                content: (
                  <div className="space-y-4">
                    <div className="bg-[#fb7185]/20 p-6 rounded-lg">
                      <p className="font-medium mb-3">If dash cam footage is requested, received, and approved:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Monetary reward: <span className="font-semibold text-[#6e0001]">$50 – $100 AUD</span></li>
                        <li>Payment within <span className="font-semibold">45 days</span> of approval</li>
                        <li>Payment via supplied bank details</li>
                      </ul>
                    </div>
                    <p>Users are responsible for accurate bank details. My Safeti is not liable for misdirected payments.</p>
                  </div>
                ),
              },
              // Add remaining sections in similar style...
            ].map((section) => (
              <div key={section.title} className="mb-10">
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-[#6e0001]">{section.title}</h2>
                <div>{section.content}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
