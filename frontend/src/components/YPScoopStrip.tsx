import { useState } from 'react';

/**
 * YPScoopStrip
 * Rich IEEE Navy Newsletter subscription strip — placed just above Footer.
 */
const YPScoopStrip = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('yp_scoop_subscribed') === 'true'
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    localStorage.setItem('yp_scoop_subscribed', 'true');
    setSubscribed(true);
  };

  return (
    <section
      className="py-14 px-4 bg-[#002d42] border-t border-b border-white/10 relative overflow-hidden w-full text-white"
      aria-labelledby="ypscoop-heading"
    >
      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Badge Label */}
        <div className="inline-block mb-3">
          <span className="text-[11px] font-extrabold tracking-widest text-ieee-teal uppercase font-mono bg-ieee-teal/15 px-3 py-1 rounded-full border border-ieee-teal/30">
            YP SCOOP NEWSLETTER
          </span>
        </div>

        {/* Heading */}
        <h2
          id="ypscoop-heading"
          className="text-2xl md:text-3xl font-extrabold text-white font-display leading-tight"
        >
          Stay Connected with IEEE YP Pune
        </h2>

        {/* Subtext */}
        <p className="text-gray-200 text-sm mt-2 mb-6 leading-relaxed font-sans max-w-xl mx-auto">
          Subscribe to YP Scoop — our quarterly e-newsletter keeping members informed about
          activities, opportunities, and developments within the affinity group.
        </p>

        {subscribed ? (
          <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-full px-6 py-2.5 inline-block text-emerald-300 font-bold text-sm">
            ✓ You're subscribed to YP Scoop!
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            aria-label="Subscribe to YP Scoop newsletter"
          >
            <label htmlFor="ypscoop-email" className="sr-only">
              Enter your email address
            </label>
            <input
              id="ypscoop-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="px-5 py-3 rounded-full bg-white text-gray-900 text-sm w-full sm:w-80 border border-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-ieee-teal transition-all font-medium shadow-inner"
              aria-label="Email address for YP Scoop subscription"
            />
            <button
              type="submit"
              className="bg-ieee-teal hover:bg-[#008f88] text-white font-bold px-7 py-3 rounded-full hover:scale-105 transition-all text-xs whitespace-nowrap cursor-pointer uppercase tracking-wider shadow-md"
            >
              Subscribe
            </button>
          </form>
        )}

        {/* Note */}
        <p className="text-gray-400 text-xs mt-4 font-mono">
          First edition released January 2026. Quarterly cadence.
        </p>
      </div>
    </section>
  );
};

export default YPScoopStrip;
