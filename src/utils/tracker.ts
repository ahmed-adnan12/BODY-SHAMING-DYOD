export interface VisitorRecord {
  id: string;
  timestamp: string;
  userAgent: string;
  platform: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  timezone: string;
  referrer: string;
  deviceType: string;
  browser: string;
  os: string;
  actions: string[];
  ip?: string;
  country?: string;
  city?: string;
  isp?: string;
  lat?: number;
  lon?: number;
}

function detectBrowser(ua: string): string {
  if (ua.includes("Edg/")) return "Microsoft Edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome")) return "Google Chrome";
  if (ua.includes("Firefox")) return "Mozilla Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("MSIE") || ua.includes("Trident")) return "Internet Explorer";
  return "Unknown Browser";
}

function detectOS(ua: string): string {
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac OS X") && !ua.includes("iPhone") && !ua.includes("iPad")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone")) return "iOS (iPhone)";
  if (ua.includes("iPad")) return "iOS (iPad)";
  if (ua.includes("Linux")) return "Linux";
  return "Unknown OS";
}

function detectDevice(ua: string): string {
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) return "📱 Mobile";
  if (ua.includes("iPad") || ua.includes("Tablet")) return "📟 Tablet";
  return "🖥️ Desktop";
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

const STORAGE_KEY = "dyod_visitors";

function getStoredVisitors(): VisitorRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVisitors(visitors: VisitorRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
  } catch {
    // storage full or unavailable
  }
}

export function logAction(action: string): void {
  const visitors = getStoredVisitors();
  const sessionId = sessionStorage.getItem("dyod_session_id");
  if (!sessionId) return;
  const idx = visitors.findIndex((v) => v.id === sessionId);
  if (idx !== -1) {
    visitors[idx].actions.push(`[${new Date().toLocaleTimeString()}] ${action}`);
    saveVisitors(visitors);
  }
}

export async function trackVisitor(): Promise<void> {
  const ua = navigator.userAgent;
  const existingId = sessionStorage.getItem("dyod_session_id");
  const visitors = getStoredVisitors();

  // If already tracked this session, just update actions
  if (existingId && visitors.find((v) => v.id === existingId)) {
    return;
  }

  const id = generateId();
  sessionStorage.setItem("dyod_session_id", id);

  const record: VisitorRecord = {
    id,
    timestamp: new Date().toLocaleString(),
    userAgent: ua,
    platform: navigator.platform || "Unknown",
    language: navigator.language || "Unknown",
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || "Direct Visit",
    deviceType: detectDevice(ua),
    browser: detectBrowser(ua),
    os: detectOS(ua),
    actions: [`[${new Date().toLocaleTimeString()}] Opened Website`],
  };

  // Try to get IP info
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      record.ip = data.ip;
      record.country = data.country_name;
      record.city = data.city;
      record.isp = data.org;
      record.lat = data.latitude;
      record.lon = data.longitude;
    }
  } catch {
    record.ip = "Could not fetch";
  }

  visitors.push(record);
  saveVisitors(visitors);
}

export function getAllVisitors(): VisitorRecord[] {
  return getStoredVisitors();
}

export function clearAllVisitors(): void {
  localStorage.removeItem(STORAGE_KEY);
}
