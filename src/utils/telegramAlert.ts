/**
 * Telegram Dispatcher for Cyber Access Gate Telemetry
 * Directly dispatches visitor access notifications to the owner's Telegram Bot.
 */

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getDeviceDescription(): string {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "Server / Unknown";
  }

  const screenDim = window.screen ? `${window.screen.width}x${window.screen.height}` : "Unknown Res";
  const ua = navigator.userAgent || "";

  let os = "Unknown OS";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Browser";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";

  return `${browser} on ${os} (${screenDim})`;
}

interface GeoData {
  city?: string;
  region?: string;
  country_name?: string;
  country?: string;
  org?: string;
}

export async function sendTelegramAlert(visitorName: string): Promise<boolean> {
  const name = visitorName && visitorName.trim().length > 0 ? visitorName.trim() : "Anonymous Guest";

  const referrer =
    typeof document !== "undefined" && document.referrer && document.referrer.trim().length > 0
      ? document.referrer
      : "Direct Link / Chat";

  const page =
    typeof window !== "undefined"
      ? (window.location.pathname || "/") + (window.location.search || "")
      : "/";

  const device = getDeviceDescription();

  // Public Geo & ISP telemetry with 2-second timeout
  let city = "Unknown";
  let country = "Unknown";
  let org = "Unknown ISP";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const geoRes = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (geoRes.ok) {
      const data: GeoData = await geoRes.json();
      if (data.city) city = data.city;
      if (data.country_name || data.country) country = data.country_name || data.country || "Unknown";
      if (data.org) org = data.org;
    }
  } catch {
    // Graceful fallback if adblocker, network timeout, or offline
  }

  const istTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const token =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_TELEGRAM_BOT_TOKEN) ||
    "8632241749:AAHDQHTbNpRYp--Ql26DJR_q9_353FLpVCQ";

  const chatId =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_TELEGRAM_CHAT_ID) ||
    "931155647";

  const messageText = [
    "🚨 <b>Portfolio Access Triggered!</b>",
    "",
    `👤 <b>Visitor / Handle:</b> <code>${escapeHtml(name)}</code>`,
    `🌐 <b>Source:</b> ${escapeHtml(referrer)}`,
    `📍 <b>Location:</b> ${escapeHtml(city)}, ${escapeHtml(country)}`,
    `🏢 <b>Network / ISP:</b> ${escapeHtml(org)}`,
    `💻 <b>Device:</b> ${escapeHtml(device)}`,
    `📄 <b>Target Page:</b> <code>${escapeHtml(page)}</code>`,
    `🕒 <b>Time (IST):</b> ${escapeHtml(istTime)}`,
  ].join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: "HTML",
        text: messageText,
      }),
    });

    if (!response.ok) {
      console.warn("[Telegram Alert] Dispatch response status:", response.status);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[Telegram Alert] Failed to dispatch alert:", err);
    return false;
  }
}
