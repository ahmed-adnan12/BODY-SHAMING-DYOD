import { useEffect, useState } from "react";
import { getAllVisitors, clearAllVisitors, VisitorRecord } from "../utils/tracker";

const ADMIN_PASSWORD = "Adnan123";

interface AdminPageProps {
  onBack: () => void;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [selected, setSelected] = useState<VisitorRecord | null>(null);
  const [cleared, setCleared] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("❌ Wrong password. Try again.");
    }
  };

  useEffect(() => {
    if (authed) {
      setVisitors(getAllVisitors());
    }
  }, [authed]);

  const handleClear = () => {
    if (confirm("Are you sure? This will delete ALL visitor records.")) {
      clearAllVisitors();
      setVisitors([]);
      setSelected(null);
      setCleared(true);
    }
  };

  const handleRefresh = () => {
    setVisitors(getAllVisitors());
    setCleared(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 shadow-2xl shadow-red-500/40 mb-4">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="text-3xl font-black text-white">Admin Access</h1>
            <p className="text-white/40 text-sm mt-1">Restricted – Authorized Personnel Only</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
            <label className="block text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter password..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm mb-3"
            />
            {error && (
              <p className="text-red-400 text-xs mb-3 font-semibold">{error}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
            >
              🔓 Enter Admin Panel
            </button>
            <button
              onClick={onBack}
              className="w-full mt-3 text-white/30 hover:text-white/60 text-sm py-2 transition"
            >
              ← Back to Site
            </button>
          </div>
          <p className="text-center text-white/20 text-xs mt-4">
            Hint: Password is <span className="text-yellow-400/60">kuch bhi</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#1a1a2e] to-[#16213e] text-white">
      {/* ─── Top Bar ─── */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <div>
            <h1 className="text-lg font-black leading-none">Admin Dashboard</h1>
            <p className="text-white/40 text-xs">DYoD Body Shaming Campaign</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg transition border border-white/10"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 bg-red-600/30 hover:bg-red-600/50 text-red-400 text-xs font-bold px-3 py-2 rounded-lg transition border border-red-500/30"
          >
            🗑️ Clear All
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/50 text-xs font-bold px-3 py-2 rounded-lg transition border border-white/10"
          >
            ← Back to Site
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* ─── Stats Cards ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Visitors", value: visitors.length, icon: "👥", color: "from-blue-500 to-blue-700" },
            {
              label: "Mobile Visitors",
              value: visitors.filter((v) => v.deviceType.includes("Mobile")).length,
              icon: "📱",
              color: "from-green-500 to-green-700",
            },
            {
              label: "Desktop Visitors",
              value: visitors.filter((v) => v.deviceType.includes("Desktop")).length,
              icon: "🖥️",
              color: "from-purple-500 to-purple-700",
            },
            {
              label: "Total Actions",
              value: visitors.reduce((a, v) => a + v.actions.length, 0),
              icon: "⚡",
              color: "from-yellow-500 to-orange-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2 shadow-xl"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-lg`}
              >
                {stat.icon}
              </div>
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="text-white/40 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {cleared && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm font-semibold text-center">
             All visitor records cleared.
          </div>
        )}

        {visitors.length === 0 && !cleared && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/40">
            <p className="text-4xl mb-2">🔍</p>
            <p className="font-semibold">No visitor data yet.</p>
            <p className="text-xs mt-1">Data will appear when users visit the site.</p>
          </div>
        )}

        {/* ─── Visitor Table ─── */}
        {visitors.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-black text-lg">👥 All Visitors</h2>
              <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {visitors.length} record{visitors.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-widest">
                    <th className="text-left px-4 py-3">#</th>
                    <th className="text-left px-4 py-3">Time</th>
                    <th className="text-left px-4 py-3">Device</th>
                    <th className="text-left px-4 py-3">Browser</th>
                    <th className="text-left px-4 py-3">OS</th>
                    <th className="text-left px-4 py-3">IP</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Actions</th>
                    <th className="text-left px-4 py-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {[...visitors].reverse().map((v, i) => (
                    <tr
                      key={v.id}
                      className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                      onClick={() => setSelected(v)}
                    >
                      <td className="px-4 py-3 text-white/30 font-mono text-xs">
                        {visitors.length - i}
                      </td>
                      <td className="px-4 py-3 text-white/70 text-xs whitespace-nowrap">
                        {v.timestamp}
                      </td>
                      <td className="px-4 py-3 text-xs">{v.deviceType}</td>
                      <td className="px-4 py-3 text-xs text-blue-300">{v.browser}</td>
                      <td className="px-4 py-3 text-xs text-purple-300">{v.os}</td>
                      <td className="px-4 py-3 text-xs text-green-300 font-mono">
                        {v.ip || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-yellow-300">
                        {v.city && v.country ? `${v.city}, ${v.country}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                          {v.actions.length}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ─── Detail Modal ─── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0c29] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-black">🔍 Visitor Detail</h3>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: "🕐 Visit Time", value: selected.timestamp },
                { label: "📱 Device Type", value: selected.deviceType },
                { label: "🌐 Browser", value: selected.browser },
                { label: "💻 Operating System", value: selected.os },
                { label: "🖥️ Screen Resolution", value: `${selected.screenWidth} × ${selected.screenHeight}` },
                { label: "🎨 Color Depth", value: `${selected.colorDepth}-bit` },
                { label: "🗣️ Language", value: selected.language },
                { label: "⏰ Timezone", value: selected.timezone },
                { label: "🔗 Referrer", value: selected.referrer },
                { label: "🌍 Platform", value: selected.platform },
                { label: "🌐 IP Address", value: selected.ip || "Not fetched" },
                { label: "🏙️ City", value: selected.city || "—" },
                { label: "🌏 Country", value: selected.country || "—" },
                { label: "📡 ISP / Network", value: selected.isp || "—" },
                {
                  label: "📍 Coordinates",
                  value:
                    selected.lat && selected.lon
                      ? `${selected.lat.toFixed(4)}, ${selected.lon.toFixed(4)}`
                      : "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 border border-white/5 rounded-xl p-3"
                >
                  <p className="text-white/40 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-semibold break-all">{item.value}</p>
                </div>
              ))}

              <div className="sm:col-span-2 bg-white/5 border border-white/5 rounded-xl p-3">
                <p className="text-white/40 text-xs mb-2">🖥️ Full User Agent</p>
                <p className="text-white/70 text-xs font-mono break-all leading-relaxed">
                  {selected.userAgent}
                </p>
              </div>

              <div className="sm:col-span-2 bg-white/5 border border-white/5 rounded-xl p-3">
                <p className="text-white/40 text-xs mb-2">
                  ⚡ Actions Performed ({selected.actions.length})
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {selected.actions.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-white/60 bg-white/5 rounded-lg px-3 py-1.5"
                    >
                      <span className="text-yellow-400 flex-shrink-0">▸</span>
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              {selected.lat && selected.lon && (
                <div className="sm:col-span-2">
                  <a
                    href={`https://www.google.com/maps?q=${selected.lat},${selected.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    📍 View approximate location on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
