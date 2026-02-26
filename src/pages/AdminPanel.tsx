import { FormEvent, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { logAction } from "../utils/tracker";

type Tab = "overview" | "add" | "view";

type FirestoreStory = {
  id: string;
  name: string;
  text: string;
  timestamp?: Date | null;
};

const FAKE_STORY_COUNT = 42;

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stories, setStories] = useState<FirestoreStory[]>([]);
  const [storyName, setStoryName] = useState("");
  const [storyText, setStoryText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;

    const storiesQuery = query(collection(db, "stories"));
    const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
      const list: FirestoreStory[] = snapshot.docs
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
        .filter((item: FirestoreStory) => item.text)
        .sort((a: FirestoreStory, b: FirestoreStory) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));

      setStories(list);
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === "admin" && password === "dyod2025") {
      setIsLoggedIn(true);
      setLoginError("");
      logAction("Admin logged in");
      return;
    }

    setLoginError("Invalid username or password.");
  };

  const handleAddStory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!storyText.trim()) return;

    await addDoc(collection(db, "stories"), {
      name: storyName.trim() || "Anonymous",
      text: storyText.trim(),
      timestamp: serverTimestamp(),
      isAdmin: true,
    });

    setStoryName("");
    setStoryText("");
    setSuccessMessage("✅ Story added! Visible to everyone.");
    setTimeout(() => setSuccessMessage(""), 3000);
    logAction("Admin added a story");
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "stories", id));
    logAction(`Admin deleted story ${id}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-8 text-white">
        <div className="mx-auto grid min-h-[80vh] max-w-md place-items-center">
          <div className="w-full rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <div className="space-y-2 text-center">
              <p className="text-4xl">🔐</p>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-white/70">Body Shaming Awareness · DYoD Project</p>
            </div>

            <form className="mt-6 space-y-3" onSubmit={handleLogin}>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/50"
                placeholder="Username"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/50"
                placeholder="Password"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-yellow-300 to-pink-400 px-4 py-3 font-semibold text-[#2f275c]"
              >
                Login
              </button>
            </form>

            {loginError && <p className="mt-3 text-sm text-rose-300">{loginError}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="sticky top-3 z-20 rounded-2xl border border-white/10 bg-[#120f33]/80 p-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold"> Admin Dashboard</h1>
              <span className="rounded-full bg-yellow-300/30 px-2 py-1 text-xs text-yellow-100"> Adnan</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(false);
                setPassword("");
                setUsername("");
                setActiveTab("overview");
                logAction("Admin logged out");
              }}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm"
            >
              Logout
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-3 py-2 text-sm ${activeTab === "overview" ? "bg-pink-400 text-white" : "bg-white/10"}`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("add")}
              className={`rounded-lg px-3 py-2 text-sm ${activeTab === "add" ? "bg-pink-400 text-white" : "bg-white/10"}`}
            >
              Add Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("view")}
              className={`rounded-lg px-3 py-2 text-sm ${activeTab === "view" ? "bg-pink-400 text-white" : "bg-white/10"}`}
            >
              View All
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <section className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60">Total Stories</p>
              <p className="mt-2 text-3xl font-bold">{stories.length + FAKE_STORY_COUNT}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60">Firestore Stories</p>
              <p className="mt-2 text-3xl font-bold">{stories.length}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-white/60"> formspree Stories</p>
              <p className="mt-2 text-3xl font-bold">{FAKE_STORY_COUNT}</p>
            </article>
          </section>
        )}

        {activeTab === "add" && (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <form className="space-y-3" onSubmit={handleAddStory}>
              <input
                value={storyName}
                onChange={(event) => setStoryName(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/50"
                placeholder="Name"
              />
              <textarea
                rows={5}
                value={storyText}
                onChange={(event) => setStoryText(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/50"
                placeholder="Write story..."
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 px-5 py-3 font-semibold text-[#2f275c]"
              >
                Add to Wall
              </button>
            </form>
            {successMessage && <p className="mt-3 text-sm text-green-300">{successMessage}</p>}
          </section>
        )}

        {activeTab === "view" && (
          <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
            {stories.map((story) => (
              <article key={story.id} className="rounded-xl bg-black/20 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-pink-200">{story.name}</p>
                    <p className="text-xs text-white/50">
                      {story.timestamp ? story.timestamp.toLocaleString() : "No timestamp"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(story.id)}
                    className="rounded-lg bg-rose-400/20 px-3 py-1 text-sm text-rose-200"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-white/70">{story.text}</p>
              </article>
            ))}
            {stories.length === 0 && <p className="text-sm text-white/70">No Firestore stories found.</p>}
          </section>
        )}
      </div>
    </div>
  );
}