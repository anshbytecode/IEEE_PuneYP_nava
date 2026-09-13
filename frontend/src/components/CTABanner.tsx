/**
 * CTABanner
 * "Join IEEE Young Professionals Pune Section" call-to-action.
 * Clean light theme with Gold border design.
 */
const CTABanner = () => (
  <section
    className="py-12 px-4 bg-white w-full"
    aria-labelledby="cta-heading"
  >
    {/* Contained light card with Gold border box */}
    <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden bg-white border border-amber-300/80 shadow-md hover:shadow-xl py-14 px-8 text-center relative group transition-all duration-300">
      
      {/* Top Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

      <h2
        id="cta-heading"
        className="text-3xl lg:text-4xl font-extrabold text-ieee-blue leading-tight relative z-10 font-display"
      >
        Join IEEE Young Professionals Pune Section
      </h2>

      <p className="text-gray-600 text-sm md:text-base mt-3 mb-8 max-w-xl mx-auto leading-relaxed relative z-10 font-sans">
        Connect with 500+ early-career engineers, access mentorship, attend technical events,
        and grow your career within the global IEEE ecosystem.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
        {/* Primary button */}
        <a
          href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMYP060"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-ieee-blue to-ieee-teal text-white font-bold px-8 py-3.5 rounded-full hover:shadow-lg hover:scale-105 transition-all w-full sm:w-auto text-center cursor-pointer uppercase tracking-wider text-xs shadow-md"
          aria-label="Join IEEE Young Professionals"
        >
          Join IEEE YP Now
        </a>

        {/* Secondary button */}
        <a
          href="/about"
          className="border-2 border-amber-400/80 text-amber-800 hover:bg-amber-50 font-bold px-8 py-3.5 rounded-full hover:scale-105 transition-all w-full sm:w-auto text-center cursor-pointer uppercase tracking-wider text-xs"
          aria-label="Learn more about IEEE YP Pune"
        >
          Learn More
        </a>
      </div>
    </div>
  </section>
);

export default CTABanner;
