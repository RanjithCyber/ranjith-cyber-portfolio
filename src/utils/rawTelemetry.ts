/**
 * Automated Deep SOC Telemetry Pipeline
 * Captures visitor fingerprints, hardware profiles, origin, network geo,
 * and persistent visitor statistics, then dispatches real-time alerts to Telegram.
 */

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getSourceApp(): string {
  if (typeof navigator === "undefined") return "🔗 Direct / Shared Link";
  const ua = navigator.userAgent || "";

  if (/whatsapp/i.test(ua)) return "💬 WhatsApp In-App Browser";
  if (/linkedin/i.test(ua)) return "💼 LinkedIn In-App Browser";
  if (/instagram/i.test(ua)) return "📷 Instagram In-App Browser";
  if (/telegram/i.test(ua)) return "✈️ Telegram In-App Browser";

  if (typeof document !== "undefined" && document.referrer && document.referrer.trim().length > 0) {
    return `🌐 Web Referrer: ${document.referrer}`;
  }

  return "🔗 Direct / Shared Link";
}

function getDeviceAndOS(): { os: string; browser: string; screen: string } {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { os: "Unknown OS", browser: "Unknown Browser", screen: "N/A" };
  }

  const dpr = window.devicePixelRatio ? `${window.devicePixelRatio}x scale` : "1x scale";
  const screen = window.screen ? `${window.screen.width}x${window.screen.height} (${dpr})` : "N/A";
  const ua = navigator.userAgent || "";

  let os = "Unknown OS";
  if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Browser";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";

  return { os, browser, screen };
}

function getHardwareSpecs(): { cores: string; ram: string; timezone: string } {
  if (typeof navigator === "undefined") {
    return { cores: "N/A", ram: "N/A", timezone: "N/A" };
  }

  const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : "N/A";
  const ram = (navigator as unknown as { deviceMemory?: number }).deviceMemory
    ? `${(navigator as unknown as { deviceMemory?: number }).deviceMemory}GB RAM`
    : "N/A";

  let timezone = "N/A";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "N/A";
  } catch {
    // fallback
  }

  return { cores, ram, timezone };
}

interface GeoData {
  cityName: string;
  regionName: string;
  countryName: string;
  isp: string;
}

async function fetchNetworkGeo(): Promise<GeoData> {
  const fallback: GeoData = {
    cityName: "Unknown City",
    regionName: "Unknown Region",
    countryName: "Unknown Country",
    isp: "Unknown ISP",
  };

  // 1. Primary fast IP endpoint: freeipapi.com with 2-second timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("https://freeipapi.com/api/json", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return {
        cityName: data.cityName || fallback.cityName,
        regionName: data.regionName || fallback.regionName,
        countryName: data.countryName || fallback.countryName,
        isp: data.asnOrganization || (data.asn ? `ASN ${data.asn}` : fallback.isp),
      };
    }
  } catch {
    // Fallback to secondary endpoint
  }

  // 2. Secondary fallback endpoint: ipapi.co
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return {
        cityName: data.city || fallback.cityName,
        regionName: data.region || fallback.regionName,
        countryName: data.country_name || data.country || fallback.countryName,
        isp: data.org || fallback.isp,
      };
    }
  } catch {
    // Graceful silent fallback
  }

  return fallback;
}

function getVisitorFingerprint(): { visitorId: string; visitCount: number } {
  let visitorId = "";
  let visitCount = 1;

  if (typeof localStorage === "undefined") {
    return { visitorId: `VIS-${Math.floor(1000 + Math.random() * 9000)}`, visitCount: 1 };
  }

  try {
    visitorId = localStorage.getItem("visitor_id") || "";
    if (!visitorId) {
      visitorId = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem("visitor_id", visitorId);
    }

    const storedCount = parseInt(localStorage.getItem("visit_count") || "0", 10);
    visitCount = (isNaN(storedCount) ? 0 : storedCount) + 1;
    localStorage.setItem("visit_count", visitCount.toString());
  } catch {
    visitorId = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;
    visitCount = 1;
  }

  return { visitorId, visitCount };
}

export async function initAutomatedTelemetry(): Promise<void> {
  // Guard against SSR
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") return;

  // Session throttle guard: prevent duplicate alerts on refresh or internal navigation
  try {
    if (sessionStorage.getItem("telemetry_sent") === "true") {
      return;
    }
    sessionStorage.setItem("telemetry_sent", "true");
  } catch {
    // Storage access blocked; continue safely
  }

  try {
    const sourceApp = getSourceApp();
    const { os, browser, screen } = getDeviceAndOS();
    const { cores, ram, timezone } = getHardwareSpecs();
    const { visitorId, visitCount } = getVisitorFingerprint();
    const geo = await fetchNetworkGeo();

    const visitSuffix = visitCount > 1 ? `${visitCount}th visit` : "1st visit";
    const istTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const token =
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_TELEGRAM_BOT_TOKEN) ||
      "8632241749:AAHDQHTbNpRYp--Ql26DJR_q9_353FLpVCQ";

    const chatId =
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_TELEGRAM_CHAT_ID) ||
      "931155647";

    const messageText = [
      "🛡️ <b>[SOC TELEMETRY] Raw Visitor Activity</b>",
      "",
      `👤 <b>Visitor Profile:</b> <code>${escapeHtml(visitorId)}</code> (${visitSuffix})`,
      `🌐 <b>Origin / App:</b> <b>${escapeHtml(sourceApp)}</b>`,
      `🏢 <b>ISP / Network:</b> <code>${escapeHtml(geo.isp || "Unknown ISP")}</code>`,
      `📍 <b>Geo Location:</b> ${escapeHtml(geo.cityName)}, ${escapeHtml(geo.regionName)}, ${escapeHtml(geo.countryName)}`,
      `📱 <b>Device:</b> ${escapeHtml(os)} • ${escapeHtml(browser)} (${escapeHtml(screen)})`,
      `⚙️ <b>Hardware Specs:</b> ${escapeHtml(cores)} | ${escapeHtml(ram)} | ${escapeHtml(timezone)}`,
      `🕒 <b>Time (IST):</b> ${escapeHtml(istTime)}`,
    ].join("\n");

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
  } catch (err) {
    console.warn("[SOC Telemetry] Auto dispatch error:", err);
  }
}
