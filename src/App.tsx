import { FormEvent, useEffect, useMemo, useState } from "react";
import { logAction } from "./utils/logAction";

type Story = {
  id: string;
  name: string;
  story: string;
  flagged: boolean;
  createdAt: string;
};

const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000`;

const particlePool = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 6}s`,
  duration: `${8 + Math.random() * 10}s`,
  size: `${4 + Math.random() * 8}px`
}));

export function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [name, setName] = useState("");
  const [storyText, setStoryText] = useState("");
  const [hint, setHint] = useState("");
  const [tapCount, setTapCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [typedLogged, setTypedLogged] = useState(false);

  const tapsRemaining = useMemo(() => Math.max(0, 5 - tapCount), [tapCount]);

  useEffect(() => {
    const timer = window.setTimeout(() => setVideoVisible(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    void fetchStories();
  }, []);

  useEffect(() => {
    if (tapCount >= 3 && tapCount < 5) {
      setHint(`Hint: ${tapsRemaining} taps left to unlock admin.`);
      const timer = window.setTimeout(() => setHint(""), 2200);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [tapCount, tapsRemaining]);

  const fetchStories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/stories`);
      if (!response.ok) {
        return;
      }
      const data: Story[] = await response.json();
      setStories(data);
    } catch (error) {
      console.error("Failed to fetch stories", error);
    }
  };

  const handleStorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !storyText.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), story: storyText.trim() })
      });

      if (!response.ok) {
        throw new Error("Story submit failed");
      }

      await logAction("Submitted a story");
      setName("");
      setStoryText("");
      setTypedLogged(false);
      await fetchStories();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSnapchat = async () => {
    await logAction("Clicked Snapchat");
    window.open("https://www.snapchat.com", "_blank", "noopener,noreferrer");
  };

  const handleAdminTap = async () => {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 5) {
      await logAction("Unlocked admin panel");
      window.location.href = `${API_BASE}/admin`;
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(140deg,#0f0c29_0%,#302b63_48%,#24243e_100%)] px-4 py-8 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        {particlePool.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Admin access"
        onClick={handleAdminTap}
        className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-lg text-white/70 backdrop-blur-sm transition hover:text-white"
      >
        ⚙️
      </button>

      <section className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-10 rounded-3xl border border-white/15 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-md sm:p-10">
          <h1 className="bg-gradient-to-r from-pink-300 via-yellow-200 to-violet-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
            Body Shaming Awareness
          </h1>
          <p className="mt-4 text-lg font-semibold text-pink-100">#StopBodyShaming #BeKind #YouAreEnough</p>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
            This campaign is a safe space for empathy, healing, and action. Share your voice, stand beside others,
            and remind every person that dignity is never tied to body shape, size, or appearance.
          </p>
          {hint ? <p className="mt-3 text-xs text-yellow-200">{hint}</p> : null}
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="glass-card flex flex-col justify-between rounded-2xl p-6">
            <div>
              <h2 className="text-2xl font-bold text-yellow-200">Snapchat Filter</h2>
              <p className="mt-3 text-white/80">Try our filter and share kindness-forward content with your circle.</p>
            </div>
            <button
              type="button"
              onClick={openSnapchat}
              className="mt-8 rounded-xl bg-yellow-300 px-4 py-3 font-bold text-slate-900 transition hover:scale-[1.02] hover:bg-yellow-200"
            >
              Open Snapchat
            </button>
          </article>

          <article className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-pink-200">Share Your Story</h2>
            <p className="mt-3 text-white/80">Your words can help someone feel seen and less alone.</p>
            <form className="mt-5 space-y-4" onSubmit={handleStorySubmit}>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-pink-300 focus:outline-none"
                required
              />
              <textarea
                value={storyText}
                onChange={async (event) => {
                  setStoryText(event.target.value);
                  if (!typedLogged) {
                    setTypedLogged(true);
                    await logAction("Typed a story");
                  }
                }}
                placeholder="Write your experience..."
                className="h-32 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-pink-300 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-pink-300 via-yellow-200 to-violet-300 px-4 py-3 font-bold text-slate-900 transition hover:brightness-110 disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Submit Story"}
              </button>
            </form>
          </article>

          <article className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-violet-200">Watch &amp; Reflect</h2>
            <p className="mt-3 text-white/80">Take a moment to reflect on words that build people up.</p>
            <div
              className={`mt-5 overflow-hidden rounded-2xl transition-all duration-700 ${
                videoVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <iframe
                className="h-56 w-full"
                src="https://www.youtube.com/embed/7rWUPH6FvOw"
                title="Body positivity reflection"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </article>
        </div>

        <section className="glass-card relative z-10 mt-8 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-yellow-200">Community Wall</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {stories.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-white/25 p-4 text-sm text-white/70">
                No stories yet. Be the first voice of courage.
              </p>
            ) : (
              stories.map((story) => (
                <article
                  key={story.id}
                  className={`rounded-xl border p-4 ${story.flagged ? "border-red-400/60 bg-red-900/20" : "border-white/20 bg-black/20"}`}
                >
                  <p className="text-sm font-bold text-pink-200">{story.name}</p>
                  <p className="mt-2 text-sm text-white/85">{story.story}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
