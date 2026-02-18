import { useEffect, useState } from "react";
import { logAction } from "../utils/tracker";

interface HeroPageProps {
  onAdminClick: () => void;
}

export default function HeroPage({ onAdminClick }: HeroPageProps) {
  const [videoVisible, setVideoVisible] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showAdminHint, setShowAdminHint] = useState(false);

  useEffect(() => {
    // Reveal video after 1.5 seconds for dramatic effect
    const t = setTimeout(() => setVideoVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleSnapchat = () => {
    logAction("Clicked Open Snapchat Filter");
    // Deep link to Snapchat
    window.location.href = "snapchat://";
    setTimeout(() => {
      window.open("https://www.snapchat.com", "_blank");
    }, 1500);
  };

  const handleShare = () => {
    logAction("Clicked Share Your Story");
    setStoryOpen(true);
  };

  const handleShareClose = () => setStoryOpen(false);

  const handleNativeShare = async () => {
    logAction("Used Native Share");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Body Shaming Awareness – DYoD",
          text: "Join the movement against body shaming! Check this out 👇",
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard! Share it with everyone 💛");
    }
  };

  // Secret admin — tap logo 5 times
  const handleLogoTap = () => {
    const next = adminClickCount + 1;
    setAdminClickCount(next);
    if (next >= 3) setShowAdminHint(true);
    if (next >= 5) {
      setAdminClickCount(0);
      setShowAdminHint(false);
      onAdminClick();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white relative overflow-x-hidden">
      {/* ─── Floating particles ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 10 + 4}px`,
              height: `${Math.random() * 10 + 4}px`,
              background: `hsl(${Math.random() * 360},80%,70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 4 + 2}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ─── Admin Secret Button (top right) ─── */}
      <button
        onClick={handleLogoTap}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white/50 hover:text-white text-xs font-bold border border-white/20"
        title="..."
      >
        ⚙️
      </button>
      {showAdminHint && (
        <div className="absolute top-16 right-4 z-50 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-lg shadow-lg animate-bounce">
          {5 - adminClickCount} more taps for Admin 
        </div>
      )}

      {/* ─── HEADER ─── */}
      <header className="relative z-10 text-center pt-14 pb-6 px-4">
        <div className="inline-block mb-3">
          <span className="text-xs uppercase tracking-widest font-semibold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 rounded-full px-4 py-1">
            DYoD · Sem 1 Project
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-300 to-purple-400">
            Body Shaming
          </span>
          <br />
          <span className="text-white">Awareness</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto">
          A campaign by <span className="text-yellow-300 font-bold"></span> &amp;{" "}
          <span className="text-pink-300 font-bold">Body-Shamiing group</span> — because every body deserves
          respect. 💛
        </p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <span className="text-xs bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-full px-3 py-1">
            #StopBodyShaming
          </span>
          <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full px-3 py-1">
            #BeKind
          </span>
          <span className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-full px-3 py-1">
            #YouAreEnough
          </span>
        </div>
      </header>

      {/* ─── THREE SECTIONS ─── */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-20 space-y-8">

        {/* ── Card 1: SNAP ── */}
        <section className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/40">
              <span className="text-5xl"></span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest font-semibold text-yellow-400">
                Step 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-2">Open Snapchat Filter</h2>
              <p className="text-white/60 text-sm sm:text-base mb-4">
                Use our exclusive Body Shaming Awareness Snapchat filter! Show your support and
                spread the message with a snap. 
              </p>
              <button
                onClick={handleSnapchat}
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/30 text-sm sm:text-base"
              >
                <span></span> Open Snapchat Now
              </button>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-transparent" />
        </section>

        {/* ── Card 2: SHARE YOUR STORY ── */}
        <section className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col sm:flex-row-reverse items-center gap-6 p-6 sm:p-8">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/40">
              <span className="text-5xl"></span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">
                Step 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-2">Share Your Story</h2>
              <p className="text-white/60 text-sm sm:text-base mb-4">
                Your voice matters. Share your experience with body shaming and inspire others to
                speak up. Together we are stronger. 
              </p>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/30 text-sm sm:text-base"
              >
                <span>💬</span> Share Your Story
              </button>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-rose-400 to-transparent" />
        </section>

        {/* ── Card 3: VIDEO ── */}
        <section
          className={`rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl transition-all duration-1000 ${
            videoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="p-6 sm:p-8">
            <span className="text-xs uppercase tracking-widest font-semibold text-purple-400">
              Step 3
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-2">Watch & Reflect</h2>
            <p className="text-white/60 text-sm sm:text-base mb-5">
              Watch this powerful video on body shaming and understand why words can hurt. Let's
              spread awareness together. 
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/oQ1X-9ovam0?rel=0&modestbranding=1&autoplay=0"
                title="Body Shaming Awareness Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => logAction("Watched Video Section")}
              />
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-400 to-transparent" />
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 text-center pb-8 text-white/30 text-xs">
        Made with 💛 by Adnan &amp; Muzamil · DYoD Sem 1
      </footer>

      {/* ─── SHARE STORY MODAL ─── */}
      {storyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8">
            <h3 className="text-2xl font-black text-white mb-1">Your Story Matters 💛</h3>
            <p className="text-white/50 text-sm mb-5">
              Share anonymously or with your name. Your words could change someone's life.
            </p>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 h-36"
              placeholder="Write your story here... (e.g., 'I was told I was too fat to wear...')"
              onChange={() => logAction("Typing in Share Story box")}
            />
            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                onClick={() => {
                  logAction("Submitted Story");
                  alert(
                    "Thank you for sharing! Your story has been saved. Together we fight body shaming! 💛"
                  );
                  handleShareClose();
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-3 px-4 rounded-full transition text-sm"
              >
                Submit Story 
              </button>
              <button
                onClick={handleNativeShare}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-full transition text-sm border border-white/10"
              >
                Share Page 
              </button>
              <button
                onClick={handleShareClose}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white/50 font-bold py-3 px-4 rounded-full transition text-sm border border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
