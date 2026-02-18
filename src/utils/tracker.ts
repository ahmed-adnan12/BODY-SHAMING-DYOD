import { db } from "./Firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";

export interface VisitorRecord {
  id: string;
  timestamp: string;
  deviceType: string;
  browser: string;
  os: string;
  platform: string;
  userAgent: string;
  language: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  referrer: string;
  ip?: string;
  city?: string;
  country?: string;
  isp?: string;
  lat?: number;
  lon?: number;
  actions: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────

function getBrowserName(ua: string): string {
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  return "Unknown";
}

function getOS(ua: string): string {
  if (ua.includes("Windows NT")) return "Windows";
  if (ua.includes("Mac OS X")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Unknown";
}

function getDeviceType(ua: string): string {
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) return "📱 Mobile";
  return "🖥️ Desktop";
}

// ── Session state ─────────────────────────────────────────────────────

let sessionRecord: VisitorRecord | null = null;
let sessionDocId: string | null = null;

// ── Init — call once when app loads ──────────────────────────────────

export async function initTracker(): Promise<void> {
  const ua = navigator.userAgent;

  // Fetch IP & geo info
  let ip = "", city = "", country = "", isp = "";
  let lat: number | undefined, lon: number | undefined;

  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    ip      = data.ip            || "";
    city    = data.city          || "";
    country = data.country_name  || "";
    isp     = data.org           || "";
    lat     = data.latitude;
    lon     = data.longitude;
  } catch {
    // silent — no network or blocked
  }

  sessionRecord = {
    id: "",
    timestamp:   new Date().toLocaleString(),
    deviceType:  getDeviceType(ua),
    browser:     getBrowserName(ua),
    os:          getOS(ua),
    platform:    navigator.platform,
    userAgent:   ua,
    language:    navigator.language,
    timezone:    Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenWidth:  screen.width,
    screenHeight: screen.height,
    colorDepth:   screen.colorDepth,
    referrer:    document.referrer || "Direct",
    ip, city, country, isp, lat, lon,
    actions: ["✅ Page Visited"],
  };

  try {
    const docRef = await addDoc(collection(db, "visitors"), {
      ...sessionRecord,
      createdAt: serverTimestamp(),
    });
    sessionDocId    = docRef.id;
    sessionRecord.id = docRef.id;
  } catch (e) {
    console.error("Firestore write failed:", e);
  }
}

// ── Log an action (e.g. button click) ────────────────────────────────

export function logAction(action: string): void {
  if (!sessionRecord) return;
  sessionRecord.actions.push(action);

  if (sessionDocId) {
    updateDoc(doc(db, "visitors", sessionDocId), {
      actions: sessionRecord.actions,
    }).catch(() => {});
  }
}

// ── Admin: get all visitors ───────────────────────────────────────────

export async function getAllVisitors(): Promise<VisitorRecord[]> {
  try {
    const q    = query(collection(db, "visitors"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VisitorRecord));
  } catch (e) {
    console.error("Firestore read failed:", e);
    return [];
  }
}

// ── Admin: delete all visitors ────────────────────────────────────────

export async function clearAllVisitors(): Promise<void> {
  try {
    const snap    = await getDocs(collection(db, "visitors"));
    const deletes = snap.docs.map((d) => deleteDoc(doc(db, "visitors", d.id)));
    await Promise.all(deletes);
  } catch (e) {
    console.error("Firestore clear failed:", e);
  }
}