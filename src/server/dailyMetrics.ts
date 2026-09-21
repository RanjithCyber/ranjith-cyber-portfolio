/**
 * Server-side Daily Visitor Log Aggregation & Telegram Recap Dispatcher
 * Supports Upstash Redis REST API (with serverless memory fallback).
 */

interface DayCounters {
  views: number;
  uniqueVisitors: Set<string>;
  uniqueCount: number;
  resumeClicks: number;
  bots: number;
  referrers: {
    LinkedIn: number;
    WhatsApp: number;
    Direct: number;
    Resume: number;
    [key: string]: number;
  };
  devices: {
    Mobile: number;
    Desktop: number;
    Tablet: number;
    [key: string]: number;
  };
}

// In-memory fallback for development and serverless continuity
const memoryStore = new Map<string, DayCounters>();

export function getTodayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getFormattedDateIST(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/**
 * Calculates the exact target date for end-of-day (11:59 PM IST) reporting.
 * If executed in early morning hours (00:00 - 03:59 IST) due to runner delay,
 * automatically maps to yesterday's completed day.
 */
export function getReportTargetDateInfo(overrideDate?: string): { dateKey: string; dateFormatted: string; executionTimeIST: string } {
  const executionTimeIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "medium",
  });

  if (overrideDate && overrideDate.trim()) {
    const key = overrideDate.trim();
    const parts = key.split("-");
    let formatted = key;
    if (parts.length === 3) {
      const [y, m, d] = parts.map(Number);
      if (y && m && d) {
        const dt = new Date(Date.UTC(y, m - 1, d));
        formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(dt);
      }
    }
    return { dateKey: key, dateFormatted: formatted, executionTimeIST };
  }

  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = nowIST.getHours();

  let targetDate = new Date(nowIST);
  // If running in early AM (00:00 - 03:59 IST) from a delayed cron execution, use yesterday's date
  if (hour < 4) {
    targetDate.setDate(targetDate.getDate() - 1);
  }

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");
  const dateKey = `${year}-${month}-${day}`;

  const dateFormatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(targetDate);

  return { dateKey, dateFormatted, executionTimeIST };
}

function getOrCreateMemoryCounters(dateKey: string): DayCounters {
  let counters = memoryStore.get(dateKey);
  if (!counters) {
    counters = {
      views: 0,
      uniqueVisitors: new Set<string>(),
      uniqueCount: 0,
      resumeClicks: 0,
      bots: 0,
      referrers: {
        LinkedIn: 0,
        WhatsApp: 0,
        Direct: 0,
        Resume: 0,
      },
      devices: {
        Mobile: 0,
        Desktop: 0,
        Tablet: 0,
      },
    };
    memoryStore.set(dateKey, counters);
  }
  return counters;
}

// Upstash Redis helper
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

async function executeRedisCommand(command: (string | number)[]): Promise<any> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(REDIS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (res.ok) {
      const data = await res.json();
      return data.result;
    }
  } catch (err) {
    console.warn("[Redis] Command error:", err);
  }
  return null;
}

export async function recordTelemetryEvent(payload: {
  type: "view" | "resume";
  isUnique?: boolean;
  referrerCategory?: string;
  visitorId?: string;
  device?: string;
  timestamp?: string;
  isBot?: boolean;
}): Promise<void> {
  const today = getTodayIST();
  const memory = getOrCreateMemoryCounters(today);

  // Bot filtering: Exclude cloud crawlers & bots from human visitor tallies
  if (payload.isBot) {
    memory.bots = (memory.bots || 0) + 1;
    await executeRedisCommand(["INCR", `bots:${today}`]);
    return;
  }

  if (payload.type === "view") {
    // 1. Page view
    memory.views += 1;
    await executeRedisCommand(["INCR", `views:${today}`]);

    // 2. Unique visitor / session hash
    const vid = payload.visitorId || `anon_${Date.now()}`;
    if (payload.isUnique || !memory.uniqueVisitors.has(vid)) {
      memory.uniqueVisitors.add(vid);
      memory.uniqueCount += 1;
    }
    await executeRedisCommand(["SADD", `unique:${today}`, vid]);

    // 3. Referrers
    const category = payload.referrerCategory || "Direct";
    if (category in memory.referrers) {
      memory.referrers[category] += 1;
    } else {
      memory.referrers.Direct += 1;
    }
    await executeRedisCommand(["INCR", `referrers:${today}:${category}`]);

    // 4. Device classification
    const dev = payload.device === "Mobile" || payload.device === "Tablet" ? payload.device : "Desktop";
    memory.devices[dev] = (memory.devices[dev] || 0) + 1;
    await executeRedisCommand(["INCR", `devices:${today}:${dev}`]);
  } else if (payload.type === "resume") {
    // 5. Resume click
    memory.resumeClicks += 1;
    await executeRedisCommand(["INCR", `resume:${today}`]);
  }
}

export async function getDailyMetricsForDate(dateKey: string): Promise<{
  views: number;
  unique: number;
  resume: number;
  linkedin: number;
  whatsapp: number;
  direct: number;
  mobile: number;
  desktop: number;
  tablet: number;
  bots: number;
}> {
  const memory = getOrCreateMemoryCounters(dateKey);

  // Attempt to read from Upstash Redis first
  let redisViews: number | null = null;
  let redisUnique: number | null = null;
  let redisResume: number | null = null;
  let redisLinkedin: number | null = null;
  let redisWhatsapp: number | null = null;
  let redisDirect: number | null = null;
  let redisResumeRef: number | null = null;
  let redisMobile: number | null = null;
  let redisDesktop: number | null = null;
  let redisTablet: number | null = null;
  let redisBots: number | null = null;

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const [v, u, r, l, w, d, rr, devM, devD, devT, b] = await Promise.all([
        executeRedisCommand(["GET", `views:${dateKey}`]),
        executeRedisCommand(["SCARD", `unique:${dateKey}`]),
        executeRedisCommand(["GET", `resume:${dateKey}`]),
        executeRedisCommand(["GET", `referrers:${dateKey}:LinkedIn`]),
        executeRedisCommand(["GET", `referrers:${dateKey}:WhatsApp`]),
        executeRedisCommand(["GET", `referrers:${dateKey}:Direct`]),
        executeRedisCommand(["GET", `referrers:${dateKey}:Resume`]),
        executeRedisCommand(["GET", `devices:${dateKey}:Mobile`]),
        executeRedisCommand(["GET", `devices:${dateKey}:Desktop`]),
        executeRedisCommand(["GET", `devices:${dateKey}:Tablet`]),
        executeRedisCommand(["GET", `bots:${dateKey}`]),
      ]);

      if (v !== null) redisViews = parseInt(v, 10);
      if (u !== null) redisUnique = parseInt(u, 10);
      if (r !== null) redisResume = parseInt(r, 10);
      if (l !== null) redisLinkedin = parseInt(l, 10);
      if (w !== null) redisWhatsapp = parseInt(w, 10);
      if (d !== null) redisDirect = parseInt(d, 10);
      if (rr !== null) redisResumeRef = parseInt(rr, 10);
      if (devM !== null) redisMobile = parseInt(devM, 10);
      if (devD !== null) redisDesktop = parseInt(devD, 10);
      if (devT !== null) redisTablet = parseInt(devT, 10);
      if (b !== null) redisBots = parseInt(b, 10);
    } catch (e) {
      console.warn("[DailyMetrics] Error reading Redis:", e);
    }
  }

  const views = redisViews ?? memory.views;
  const unique = redisUnique ?? Math.max(memory.uniqueCount, memory.uniqueVisitors.size);
  const resume = redisResume ?? memory.resumeClicks;
  const linkedin = redisLinkedin ?? memory.referrers.LinkedIn;
  const whatsapp = redisWhatsapp ?? memory.referrers.WhatsApp;
  const directBase = redisDirect ?? memory.referrers.Direct;
  const resumeRefBase = redisResumeRef ?? memory.referrers.Resume;
  const direct = directBase + resumeRefBase;
  const mobile = redisMobile ?? (memory.devices.Mobile || 0);
  const desktop = redisDesktop ?? (memory.devices.Desktop || 0);
  const tablet = redisTablet ?? (memory.devices.Tablet || 0);
  const bots = redisBots ?? (memory.bots || 0);

  return { views, unique, resume, linkedin, whatsapp, direct, mobile, desktop, tablet, bots };
}

export async function handleCronDailyReport(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const isForce = url.searchParams.get("force") === "true";
  const dateParam = url.searchParams.get("date") || undefined;

  const { dateKey, dateFormatted, executionTimeIST } = getReportTargetDateInfo(dateParam);

  // Deduping check: Prevent duplicate dispatches if report was already sent today
  if (!isForce && REDIS_URL && REDIS_TOKEN) {
    const alreadySent = await executeRedisCommand(["GET", `report_sent:${dateKey}`]);
    if (alreadySent === "1" || alreadySent === "true") {
      console.log(`[DailyReport] Report for ${dateKey} already dispatched. Skipping duplicate.`);
      return new Response(
        JSON.stringify({
          success: true,
          skipped: true,
          message: `Report for ${dateKey} was already dispatched today.`,
          date: dateFormatted,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const metrics = await getDailyMetricsForDate(dateKey);

  const token =
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.VITE_TELEGRAM_BOT_TOKEN ||
    "8632241749:AAHDQHTbNpRYp--Ql26DJR_q9_353FLpVCQ";

  const chatId =
    process.env.TELEGRAM_CHAT_ID ||
    process.env.VITE_TELEGRAM_CHAT_ID ||
    "931155647";

  const visitorCount = metrics.unique > 0 ? metrics.unique : metrics.views;

  const reportText = [
    "📊 DAILY PORTFOLIO TRAFFIC REPORT",
    `📅 Report Date: ${dateFormatted}`,
    `⏰ Target: 11:59 PM IST (Executed at ${executionTimeIST})`,
    "",
    `👥 TOTAL VISITORS TODAY: ${visitorCount} members visited`,
    `👁️ Total Page Views: ${metrics.views}`,
    "",
    "🌐 REFERRAL SOURCES (Categorized):",
    `  • LinkedIn: ${metrics.linkedin}`,
    `  • WhatsApp: ${metrics.whatsapp}`,
    `  • Direct / Other: ${metrics.direct}`,
    "",
    "📱 DEVICE BREAKDOWN (Categorized):",
    `  • Mobile: ${metrics.mobile}`,
    `  • Desktop: ${metrics.desktop}`,
    `  • Tablet: ${metrics.tablet}`,
    "",
    "📄 ENGAGEMENT / INTERACTIONS:",
    `  • Resume Downloads / Views: ${metrics.resume}`,
    "",
    `🤖 BOT / CRAWLER PREVIEWS FILTERED: ${metrics.bots}`,
    "✅ End-of-Day Traffic Summary logged.",
  ].join("\n");

  let telegramSuccess = false;
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: reportText,
      }),
    });
    telegramSuccess = tgRes.ok;
  } catch (err) {
    console.error("[DailyCron] Telegram dispatch failed:", err);
  }

  // Mark report as sent in Redis with 24-hour TTL to prevent late duplicate runs
  if (telegramSuccess && REDIS_URL && REDIS_TOKEN) {
    executeRedisCommand(["SET", `report_sent:${dateKey}`, "1", "EX", "86400"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `views:${dateKey}`, "604800"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `unique:${dateKey}`, "604800"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `resume:${dateKey}`, "604800"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `devices:${dateKey}:Mobile`, "604800"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `devices:${dateKey}:Desktop`, "604800"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `devices:${dateKey}:Tablet`, "604800"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `bots:${dateKey}`, "604800"]).catch(() => {});
  }

  return new Response(
    JSON.stringify({
      success: true,
      report_sent: telegramSuccess,
      date: dateFormatted,
      dateKey,
      metrics,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function handleGetDailyStats(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date") || undefined;
  const { dateKey, dateFormatted } = getReportTargetDateInfo(dateParam);
  const metrics = await getDailyMetricsForDate(dateKey);

  const refList: { name: string; count: number }[] = [
    { name: "LinkedIn", count: metrics.linkedin },
    { name: "WhatsApp", count: metrics.whatsapp },
    { name: "Direct", count: metrics.direct },
  ]
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const topSources = refList.length > 0 ? refList.map((r) => r.name).join(", ") : "Direct";
  const visitorCount = metrics.unique > 0 ? metrics.unique : metrics.views;

  return new Response(
    JSON.stringify({
      success: true,
      date: dateFormatted,
      dateKey,
      totalVisitors: visitorCount,
      topSources,
      metrics,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export async function handleTelemetryRecord(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    await recordTelemetryEvent(body);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

