/**
 * Client-Side Daily Visit Collector & Session Throttler
 * Captures unique visits per session, guards against refresh inflation,
 * persists daily visit logs locally, and dispatches telemetry increments.
 */

export interface DailyVisitLogEntry {
  sessionHash: string;
  timestamp: string; // ISO string
  istTime: string;
  referrer: string;
  referrerCategory: "LinkedIn" | "WhatsApp" | "Resume" | "Direct" | string;
  device: string;
  page: string;
}

export interface DailyVisitorLog {
  date: string; // YYYY-MM-DD IST
  totalCount: number;
  visits: DailyVisitLogEntry[];
}

function getTodayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getISTTimestamp(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

function getSessionHash(): string {
  if (typeof sessionStorage === "undefined") {
    return `sess_${Math.random().toString(36).substring(2, 10)}`;
  }

  let hash = sessionStorage.getItem("visitor_session_hash");
  if (!hash) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      hash = `sess_${crypto.randomUUID().slice(0, 8)}`;
    } else {
      hash = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    }
    sessionStorage.setItem("visitor_session_hash", hash);
  }
  return hash;
}

function getReferrerCategory(): { rawReferrer: string; category: string } {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return { rawReferrer: "Direct", category: "Direct" };
  }

  const rawReferrer = document.referrer || "";
  const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
  const href = window.location.href || "";
  const refLower = rawReferrer.toLowerCase();
  const uaLower = ua.toLowerCase();
  const hrefLower = href.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const utmSource = (searchParams.get("utm_source") || searchParams.get("ref") || searchParams.get("source") || "").toLowerCase();

  if (
    refLower.includes("linkedin") ||
    refLower.includes("lnkd.in") ||
    refLower.includes("licdn") ||
    uaLower.includes("linkedin") ||
    utmSource.includes("linkedin") ||
    utmSource.includes("lnkd") ||
    searchParams.has("lipi") ||
    searchParams.has("li_fat_id") ||
    searchParams.has("li_sv") ||
    hrefLower.includes("lipi=")
  ) {
    return { rawReferrer: rawReferrer || "LinkedIn Link", category: "LinkedIn" };
  }

  if (
    refLower.includes("whatsapp") ||
    refLower.includes("wa.me") ||
    uaLower.includes("whatsapp") ||
    utmSource.includes("whatsapp")
  ) {
    return { rawReferrer: rawReferrer || "WhatsApp", category: "WhatsApp" };
  }

  if (
    refLower.includes("resume") ||
    utmSource.includes("resume") ||
    window.location.pathname.toLowerCase().includes("resume")
  ) {
    return { rawReferrer: rawReferrer || "Resume Link", category: "Resume" };
  }

  if (rawReferrer.length > 0) {
    try {
      const parsed = new URL(rawReferrer);
      return { rawReferrer, category: parsed.hostname.replace(/^www\./, "") };
    } catch {
      return { rawReferrer, category: "Web Referrer" };
    }
  }

  return { rawReferrer: "Direct", category: "Direct" };
}

function getDeviceInfo(): string {
  if (typeof navigator === "undefined") return "Desktop";
  const ua = navigator.userAgent || "";

  if (/mobile|android|iphone|ipod/i.test(ua)) return "Mobile";
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  return "Desktop";
}

function saveToLocalDailyLog(entry: DailyVisitLogEntry) {
  if (typeof localStorage === "undefined") return;

  try {
    const today = getTodayIST();
    const stored = localStorage.getItem("daily_visitor_log");
    let log: DailyVisitorLog;

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DailyVisitorLog;
        if (parsed.date === today && Array.isArray(parsed.visits)) {
          log = parsed;
        } else {
          log = { date: today, totalCount: 0, visits: [] };
        }
      } catch {
        log = { date: today, totalCount: 0, visits: [] };
      }
    } else {
      log = { date: today, totalCount: 0, visits: [] };
    }

    log.visits.push(entry);
    log.totalCount = log.visits.length;

    // Keep up to 200 recent entries for today to bound storage
    if (log.visits.length > 200) {
      log.visits = log.visits.slice(-200);
    }

    localStorage.setItem("daily_visitor_log", JSON.stringify(log));
  } catch (e) {
    console.warn("[VisitorTracker] Failed to update localStorage daily log:", e);
  }
}

import { detectBotOrCrawler } from "./rawTelemetry";

/**
 * Initializes visitor tracking for the current session.
 * Guaranteed to run only once per session using sessionStorage,
 * ensuring refreshing doesn't inflate daily counts.
 */
export async function initVisitorTracker(): Promise<void> {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return;
  }

  // 1. Anti-inflation Guard: Prevent refreshing from inflating the count
  try {
    const hasVisitedThisSession = sessionStorage.getItem("visited_today_session");
    if (hasVisitedThisSession === "true") {
      return;
    }
    sessionStorage.setItem("visited_today_session", "true");
  } catch {
    // Storage restricted (e.g. strict sandbox), safely continue
  }

  try {
    const sessionHash = getSessionHash();
    const today = getTodayIST();
    const istTime = getISTTimestamp();
    const { rawReferrer, category: referrerCategory } = getReferrerCategory();
    const device = getDeviceInfo();
    const page = window.location.pathname || "/";
    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const webdriver = typeof navigator !== "undefined" ? navigator.webdriver : false;

    const botResult = detectBotOrCrawler(ua, undefined, { webdriver });

    // 2. Check if first time today across sessions for this browser
    let isUniqueToday = false;
    try {
      if (typeof localStorage !== "undefined") {
        const lastDailyVisit = localStorage.getItem("last_daily_visitor_date");
        if (lastDailyVisit !== today) {
          isUniqueToday = true;
          localStorage.setItem("last_daily_visitor_date", today);
        }
      }
    } catch {}

    const visitEntry: DailyVisitLogEntry = {
      sessionHash,
      timestamp: new Date().toISOString(),
      istTime,
      referrer: rawReferrer,
      referrerCategory,
      device,
      page,
    };

    // 3. Save entry to structured local daily log
    saveToLocalDailyLog(visitEntry);

    // 4. Asynchronously dispatch telemetry increment to lightweight API / KV
    fetch("/api/telemetry/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "view",
        isUnique: isUniqueToday,
        referrerCategory,
        visitorId: sessionHash,
        device,
        isBot: botResult.isBot,
        timestamp: visitEntry.timestamp,
      }),
    }).catch(() => {
      // Background non-blocking dispatch
    });
  } catch (err) {
    console.warn("[VisitorTracker] Error during tracking execution:", err);
  }
}

