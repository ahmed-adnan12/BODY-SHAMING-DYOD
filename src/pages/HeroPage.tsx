import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { logAction } from "../utils/tracker";

type Story = {
  id: string;
  name: string;
  text: string;
  timestamp?: Date | null;
  fake?: boolean;
};

const fakeStories: Story[] = [
  { id: "fake-1", name: "Sadiya", text: "My friends keep saying I'm 'built different' and I take it as the biggest compliment! Turns out being unique is actually a superpower. Who knew?", fake: true },
  { id: "fake-2", name: "Sehrish", text: "Someone told me I'd look better if I lost weight. I told them I'd look better if they minded their business! We both grew that day. 😂", fake: true },
  { id: "fake-3", name: "Zara", text: "I used to hide behind my hair because of my face shape. Now I rock big smiles and let my personality do the talking. Confidence is the best filter!", fake: true },
  { id: "fake-4", name: "Hina", text: "People said I was 'too skinny' to pull off certain outfits. I wore them anyway and now they're asking where I got my confidence. The answer? Self-love, baby!", fake: true },
  { id: "fake-5", name: "Noor", text: "My mom keeps saying I need to eat more. I told her I'm on a mission to become the strongest version of myself. She finally stopped nagging! 💪", fake: true },
  { id: "fake-6", name: "Fatima", text: "A stranger commented on my body at the gym. I thanked them for their 'concern' and kept lifting. Now they're the one avoiding eye contact. Karma is real!", fake: true },
  { id: "fake-7", name: "Ayesha", text: "I used to cover my stretch marks with long sleeves. Now I show them off and call them my 'tiger stripes.' They tell my story of growth and strength!", fake: true },
  { id: "fake-8", name: "Mariam", text: "Someone said I gained weight during finals. I said, 'Yeah, that's called brain weight!' Now I'm the funniest person at every study group. 📚", fake: true },
  { id: "fake-9", name: "Sumbal", text: "My relatives kept comparing me to my thinner cousin. I started comparing myself to who I was yesterday instead. Spoiler: I'm winning every time!", fake: true },
  { id: "fake-10", name: "Rukhsar", text: "People called my broad shoulders 'masculine.' I told them they're actually my superpower shoulders - they carry my dreams! Now I own every room I enter.", fake: true },
  { id: "fake-11", name: "Iqra", text: "Friends joked I was 'all bones.' I told them I'm actually 90% sass and 10% bone structure. They laughed, but I meant it! Confidence over everything.", fake: true },
  { id: "fake-12", name: "Madiha", text: "A shop assistant said my size was 'hard to dress.' I bought the outfit anyway and walked out like a boss. Turns out, I'm the one who knows what looks good!", fake: true },
  { id: "fake-13", name: "Sana", text: "Strangers commented on my body online. I blocked them all and started posting unfiltered photos. My follower count dropped, but my happiness skyrocketed!", fake: true },
  { id: "fake-14", name: "Amina", text: "People asked when I'd 'get my body back' after pregnancy. I told them my body is exactly where it should be - it made a human! That's pretty amazing, right?", fake: true },
  { id: "fake-15", name: "Rabia", text: "Teammates called me slow because I was heavier. I ended up winning the team's spirit award instead. Turns out being supportive matters more than being fast!", fake: true },
  { id: "fake-16", name: "Khadija", text: "People stared at my surgery scars. I started wearing them proudly and telling my story. Now others share their scars too. We're all survivors, not victims!", fake: true },
  { id: "fake-17", name: "Zainab", text: "Someone said no one likes bigger bodies. I surrounded myself with people who love me for who I am. Turns out, quality over quantity wins every time!", fake: true },
  { id: "fake-18", name: "Alisha", text: "I recovered from an eating disorder and learned to love my body again. Now I help others on their journey. My scars are my strength, not my shame!", fake: true },
  { id: "fake-19", name: "Bushra", text: "Coworkers rated bodies at lunch. I started rating their jokes instead. Turns out, my humor is way better than their body commentary. Who's winning now?", fake: true },
  { id: "fake-20", name: "Naila", text: "People said I was 'too big' for traditional outfits. I wore them anyway and looked stunning. Now they're asking for my styling tips. Take that, haters!", fake: true },
  { id: "fake-21", name: "Mehwish", text: "Classmates mocked my facial hair. I started owning it and calling it my 'beauty mark.' Now they're asking for my skincare routine. Irony is delicious!", fake: true },
  { id: "fake-22", name: "Asma", text: "A relative said I shouldn't eat dessert in public. I ordered the biggest cake and shared it with everyone. Best. Decision. Ever. Dessert is life!", fake: true },
  { id: "fake-23", name: "Gulnaz", text: "People teased me for my different posture. I started teaching yoga and now they're asking for my flexibility tips. My difference is my superpower!", fake: true },
  { id: "fake-24", name: "Shabnam", text: "I wore oversized clothes to hide. Now I wear what makes me feel amazing and guess what? The world didn't end. In fact, I feel more alive than ever!", fake: true },
  { id: "fake-25", name: "Tahira", text: "A gym trainer criticized my body. I found a new gym where everyone cheers each other on. Turns out, positive vibes are the best workout fuel!", fake: true },
  { id: "fake-26", name: "Uzma", text: "People said my laugh made my face 'wider.' I laughed louder and more often. Now my laugh is the thing people remember most about me. Win!", fake: true },
  { id: "fake-27", name: "Yasmin", text: "Medication changed my weight and people acted like I failed. I told them my health is my priority, not their beauty standards. They finally got it!", fake: true },
  { id: "fake-28", name: "Shazia", text: "A photographer edited my body without asking. I now only work with photographers who respect authenticity. My real self is good enough, always!", fake: true },
  { id: "fake-29", name: "Faria", text: "Friends called my features 'too much.' I stopped contouring and embraced my natural face. Turns out, I'm actually really pretty without filters!", fake: true },
  { id: "fake-30", name: "Lubna", text: "I was told to lose weight before job interviews. I got hired anyway because my skills spoke louder than my size. Talent always wins in the end!", fake: true },
  { id: "fake-31", name: "Nazia", text: "Classmates still commented on my body at reunions. I started talking about my achievements instead. Now they're asking for my career advice, not my diet tips!", fake: true },
  { id: "fake-32", name: "Saima", text: "My skin folds were mocked once. I started wearing what makes me comfortable and confident. Now I'm the most confident person at every event!", fake: true },
  { id: "fake-33", name: "Rida", text: "I was told I looked better when thinner. I realized compliments shouldn't come with conditions. Now I accept love that's unconditional and real!", fake: true },
  { id: "fake-34", name: "Tooba", text: "Someone tracked my food during Ramadan and made jokes. I shared my faith journey instead. Now they respect my practices more than ever. Respect works!", fake: true },
  { id: "fake-35", name: "Hafsa", text: "People mocked my cellulite at the beach. I started posting unfiltered beach photos and now I'm inspiring others to love their bodies too. Power to us!", fake: true },
  { id: "fake-36", name: "Misbah", text: "I was only praised when I lost weight. I started celebrating my kindness and hard work instead. Now people appreciate me for who I am, not how I look!", fake: true },
  { id: "fake-37", name: "Samia", text: "A doctor dismissed my symptoms saying I needed to slim down. I found a doctor who listened and treated me properly. Your health matters more than size!", fake: true },
  { id: "fake-38", name: "Zuhra", text: "My family compared me to influencers. I unfollowed toxic accounts and followed body-positive ones. Now my feed is full of love and inspiration!", fake: true },
  { id: "fake-39", name: "Laiba", text: "People told me not to wear sleeveless. I wore my favorite dress and felt amazing. Now they're asking where I got it. Confidence is the best outfit!", fake: true },
  { id: "fake-40", name: "Nimra", text: "I was told I was 'too big' to dance. I joined a dance group and now I'm the most confident dancer there. Movement is for EVERY body!", fake: true },
  { id: "fake-41", name: "Areeba", text: "Strangers guessed my diet when they saw me eat. I started eating joyfully without explaining. Now I enjoy every meal without stress. Food is joy!", fake: true },
  { id: "fake-42", name: "Sidra", text: "I was body-shamed so much I stayed silent. Now I speak up and share my story. Every voice matters, and your body deserves respect just as it is!", fake: true },
];

export default function HeroPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [storyText, setStoryText] = useState("");
  const [firestoreStories, setFirestoreStories] = useState<Story[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [videoVisible, setVideoVisible] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.floor(Math.random() * 11) + 4}px`,
        color: `hsl(${Math.floor(Math.random() * 360)} 90% 70% / 0.6)`,
        duration: `${Math.floor(Math.random() * 5) + 2}s`,
      })),
    []
  );

  useEffect(() => {
    const storiesQuery = query(collection(db, "stories"));
    const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
      const stories: Story[] = snapshot.docs
        .map((docItem: any) => {
          const data = docItem.data() as {
            name?: string;
            text?: string;
            timestamp?: { toDate?: () => Date };
          };

          return {
            id: docItem.id,
            name: data.name?.trim() || "Anonymous",
            text: data.text?.trim() || "",
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : null,
          };
        })
        .filter((item: Story) => item.text)
        .sort((a: Story, b: Story) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));

      setFirestoreStories(stories);
      logAction(`Hero synced ${stories.length} Firestore stories`);
    });

    const timer = setTimeout(() => setVideoVisible(true), 1500);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleAdminTap = () => {
    const next = adminTapCount + 1;
    setAdminTapCount(next);
    logAction(`Secret admin tap ${next}`);
    if (next >= 5) {
      navigate("/admin");
    }
  };

  const handleStorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!storyText.trim()) {
      alert("Please write a story before posting!");
      return;
    }

    setIsPosting(true);
    const safeName = name.trim() || "Anonymous";
    const safeText = storyText.trim();

    try {
      logAction(`Submitting story: name=${safeName}, text length=${safeText.length}`);

      // First, submit to Formspree
      const formspreeResponse = await fetch("https://formspree.io/f/xnjbwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: safeName, message: safeText }),
      });

      if (!formspreeResponse.ok) {
        console.error("Formspree error:", formspreeResponse.status, formspreeResponse.statusText);
        logAction(`Formspree failed with status ${formspreeResponse.status}`);
        // Continue anyway - we still want to save to Firestore
      } else {
        logAction("Formspree submission successful");
      }

      // Then, save to Firestore
      await addDoc(collection(db, "stories"), {
        name: safeName,
        text: safeText,
        timestamp: serverTimestamp(),
        isAdmin: false,
      });

      logAction("Firestore story saved successfully");
      setPosted(true);
      setName("");
      setStoryText("");
      logAction("User submitted a story");
      setTimeout(() => setPosted(false), 3000);
    } catch (error) {
      console.error("Error submitting story:", error);
      logAction(`Error submitting story: ${error instanceof Error ? error.message : 'unknown error'}`);
      alert("Oops! Something went wrong while posting your story. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-8 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute animate-pulse rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdminTap}
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl backdrop-blur-sm"
        aria-label="Secret admin button"
      >
        ⚙️
      </button>

      {adminTapCount >= 3 && adminTapCount < 5 && (
        <div className="absolute right-16 top-4 z-20 animate-bounce rounded-full bg-yellow-300 px-3 py-2 text-xs font-bold text-[#2b2156] shadow-lg">
          {5 - adminTapCount} more taps for Admin 🔐
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl space-y-6">
        <header className="space-y-4 text-center">
          <div className="mx-auto w-fit rounded-full border border-yellow-300/40 bg-yellow-300/20 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-yellow-200 uppercase">
            DYoD · Sem 1 Project
          </div>
          <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-pink-300 via-yellow-200 to-purple-300 bg-clip-text text-transparent">Body Shaming</span>
            <br />
            <span className="text-white">Awareness</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/75 sm:text-base">
            A campaign by Body-Shaming-Group because every body deserves respect
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-pink-400/30 px-3 py-1 text-sm text-pink-100">#StopBodyShaming</span>
            <span className="rounded-full bg-purple-400/30 px-3 py-1 text-sm text-purple-100">#BeKind</span>
            <span className="rounded-full bg-yellow-300/30 px-3 py-1 text-sm text-yellow-100">#YouAreEnough</span>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.2em] text-yellow-200 uppercase">Step 1</p>
              <h2 className="text-2xl font-bold">Open Snapchat Filter</h2>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-3xl">
              👻
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logAction("Open Snapchat button clicked");
              window.location.href = "snapchat://";
              setTimeout(() => {
                window.open("https://www.snapchat.com", "_blank", "noopener,noreferrer");
              }, 1500);
            }}
            className="rounded-xl bg-yellow-300 px-5 py-3 font-semibold text-[#302b63] transition hover:brightness-105"
          >
            Launch Snapchat
          </button>
          <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-300" />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.2em] text-pink-200 uppercase">Step 2</p>
              <h2 className="text-2xl font-bold">Share Your Story</h2>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pink-400 to-fuchsia-600 text-3xl">
              💬
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleStorySubmit}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/50 focus:border-pink-300"
              placeholder="Your name (optional — leave blank for Anonymous)"
            />
            <textarea
              rows={4}
              value={storyText}
              onChange={(event) => setStoryText(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/50 focus:border-pink-300"
              placeholder="Write your story here..."
            />
            <button
              type="submit"
              disabled={isPosting}
              className="rounded-xl bg-gradient-to-r from-pink-400 to-rose-500 px-5 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {isPosting ? "Posting..." : "Post My Story 💛"}
            </button>
            {posted && <p className="text-sm font-semibold text-green-300">✅ Posted!</p>}
          </form>

          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold">🌸 Community Stories Wall</h3>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                {firestoreStories.length + fakeStories.length} stories
              </span>
            </div>

            {firestoreStories.length === 0 && (
              <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                No stories yet. Be the first!
              </p>
            )}

            <div className="space-y-3">
              {firestoreStories.map((story) => (
                <article key={story.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-semibold text-pink-200">{story.name}</p>
                    <p className="text-xs text-white/50">
                      {story.timestamp ? story.timestamp.toLocaleString() : "Just now"}
                    </p>
                  </div>
                  <p className="text-sm text-white/75">{story.text}</p>
                </article>
              ))}

              {fakeStories.map((story) => (
                <article key={story.id} className="rounded-2xl bg-white/5 p-4">
                  <p className="mb-2 font-semibold text-pink-200">{story.name}</p>
                  <p className="text-sm text-white/75">{story.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-pink-300 via-fuchsia-400 to-rose-400" />
        </section>

        <section
          className={`rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-700 ${
            videoVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-200 uppercase">Step 3</p>
          <h2 className="mt-1 text-2xl font-bold">Watch & Reflect</h2>
          <p className="mt-2 text-sm text-white/75">
            This short video helps unpack how body shaming affects confidence, mental health, and belonging.
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/E8umFV69fNg?si=sLYy4DykX6Z2t_VZ"
              title="Body Shaming Awareness"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-purple-300 via-violet-400 to-indigo-300" />
        </section>

        <footer className="pb-2 text-center text-sm text-white/30">Made  by Adnan </footer>
      </div>
    </div>
  );
}