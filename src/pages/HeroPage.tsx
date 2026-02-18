import { useEffect, useState } from "react";
import { logAction } from "../utils/tracker";

interface Story {
  id: string;
  name: string;
  text: string;
  time: string;
}

const STORIES_KEY = "dyod_stories";

function getStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStory(story: Story) {
  const stories = getStories();
  stories.unshift(story);
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
}

interface HeroPageProps {
  onAdminClick: () => void;
}

export default function HeroPage({ onAdminClick }: HeroPageProps) {
  const [videoVisible, setVideoVisible] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showAdminHint, setShowAdminHint] = useState(false);

  // Story Wall state
  const [stories, setStories] = useState<Story[]>(getStories());
  const [storyName, setStoryName] = useState("");
  const [storyText, setStoryText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVideoVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleSnapchat = () => {
    logAction("Clicked Open Snapchat Filter");
    window.location.href = "snapchat://";
    setTimeout(() => {
      window.open("https://www.snapchat.com", "_blank");
    }, 1500);
  };

  const handleSubmitStory = () => {
    if (!storyText.trim()) return;
    logAction("Submitted a Story");
    const newStory: Story = {
      id: Math.random().toString(36).substr(2, 9),
      name: storyName.trim() || "Anonymous 🌸",
      text: storyText.trim(),
      time: new Date().toLocaleString(),
    };
    saveStory(newStory);
    setStories(getStories());
    setStoryText("");
    setStoryName("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
          A campaign by <span className="text-yellow-300 font-bold">Body-Shaming-Group</span> 
            because every body deserves
          respect..  
           & who is perfect?
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

        {/* ── Card 2: SHARE YOUR STORY – Always Visible Public Wall ── */}
        <section className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 p-6 sm:p-8 pb-4">
            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/40">
              <span className="text-4xl">💬</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">Step 2</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-0.5">Share Your Story</h2>
              <p className="text-white/50 text-sm">Your words appear for everyone. You are not alone. 🌸</p>
            </div>
          </div>

          {/* Input Form */}
          <div className="px-6 sm:px-8 pb-6 space-y-3">
            <input
              type="text"
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
              placeholder="Your name (optional — leave blank for Anonymous)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <textarea
              value={storyText}
              onChange={(e) => { setStoryText(e.target.value); logAction("Typing a Story"); }}
              placeholder="Write your story here… share what you felt, what happened, or a message of support 💛"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmitStory}
                disabled={!storyText.trim()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/30 text-sm"
              >
                 Post My Story
              </button>
              {submitted && (
                <span className="text-green-400 text-sm font-bold animate-pulse">✅ Posted!</span>
              )}
            </div>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-rose-400 to-transparent" />

          {/* Public Story Wall */}
          <div className="px-6 sm:px-8 py-5">
            <h3 className="text-sm font-black uppercase tracking-widest text-pink-300 mb-4 flex items-center gap-2">
              <span></span> Community Stories Wall
              <span className="ml-auto text-xs font-normal text-white/30 normal-case tracking-normal">
                {stories.length} {stories.length === 1 ? "story" : "stories"} shared
              </span>
            </h3>

            {stories.length === 0 ? (
              <div className="text-center py-8 text-white/25">
                <p className="text-3xl mb-2"></p>
                <p className="text-sm">No stories yet. Be the first to share yours!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {stories.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition"
                  >
                    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                      <span className="text-pink-300 font-bold text-sm">{s.name}</span>
                      <span className="text-white/25 text-xs">{s.time}</span>
                    </div>
                    <p className="text-white/75 text-sm leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                // src="https://youtu.be/E8umFV69fNg?si=6HW5vak8iMrFGext"
                src="https://www.youtube.com/embed/E8umFV69fNg?si=sLYy4DykX6Z2t_VZ"
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
        Made   by DYOD Sem 1
      </footer>

      {/* Modal removed – story wall is now always visible inline */}
    </div>
  );
}
