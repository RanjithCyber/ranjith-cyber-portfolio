/**
 * Server-side Daily Visitor Log Aggregation & Telegram Recap Dispatcher
 * Supports Upstash Redis REST API (with serverless memory fallback).
 */

interface DayCounters {
  views: number;
  uniqueVisitors: Set<string>;
  uniqueCount: number;
  resumeClicks: number;
  referrers: {
    LinkedIn: number;
    WhatsApp: number;
    Direct: number;
    Resume: number;
  };
}

// In-memory fallback for development and serverless continuity
const memoryStore = new Map<string, DayCounters>();

function getTodayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getFormattedDateIST(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function getOrCreateMemoryCounters(dateKey: string): DayCounters {
  let counters = memoryStore.get(dateKey);
  if (!counters) {
    counters = {
      views: 0,
      uniqueVisitors: new Set<string>(),
      uniqueCount: 0,
      resumeClicks: 0,
      referrers: {
        LinkedIn: 0,
        WhatsApp: 0,
        Direct: 0,
        Resume: 0,
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
}): Promise<void> {
  const today = getTodayIST();
  const memory = getOrCreateMemoryCounters(today);

  if (payload.type === "view") {
    // 1. Page view
    memory.views += 1;
    await executeRedisCommand(["INCR", `views:${today}`]);

    // 2. Unique visitor
    if (payload.isUnique) {
      const vid = payload.visitorId || `anon_${Date.now()}`;
      if (!memory.uniqueVisitors.has(vid)) {
        memory.uniqueVisitors.add(vid);
        memory.uniqueCount += 1;
      }
      await executeRedisCommand(["SADD", `unique:${today}`, vid]);
    }

    // 3. Referrers
    const category = payload.referrerCategory || "Direct";
    if (category in memory.referrers) {
      (memory.referrers as Record<string, number>)[category] += 1;
    } else {
      memory.referrers.Direct += 1;
    }
    await executeRedisCommand(["INCR", `referrers:${today}:${category}`]);
  } else if (payload.type === "resume") {
    // 4. Resume click
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

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const [v, u, r, l, w, d, rr] = await Promise.all([
        executeRedisCommand(["GET", `views:${dateKey}`]),
        executeRedisCommand(["SCARD", `unique:${dateKey}`]),
        executeRedisCommand(["GET", `resume:${dateKey}`]),
        executeRedisCommand(["GET", `referrers:${dateKey}:LinkedIn`]),
        executeRedisCommand(["GET", `referrers:${dateKey}:WhatsApp`]),
        executeRedisCommand(["GET", `referrers:${dateKey}:Direct`]),
        executeRedisCommand(["GET", `referrers:${dateKey}:Resume`]),
      ]);

      if (v !== null) redisViews = parseInt(v, 10);
      if (u !== null) redisUnique = parseInt(u, 10);
      if (r !== null) redisResume = parseInt(r, 10);
      if (l !== null) redisLinkedin = parseInt(l, 10);
      if (w !== null) redisWhatsapp = parseInt(w, 10);
      if (d !== null) redisDirect = parseInt(d, 10);
      if (rr !== null) redisResumeRef = parseInt(rr, 10);
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

  return { views, unique, resume, linkedin, whatsapp, direct };
}

export async function handleCronDailyReport(request: Request): Promise<Response> {
  const today = getTodayIST();
  const dateFormatted = getFormattedDateIST();

  const metrics = await getDailyMetricsForDate(today);

  const token =
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.VITE_TELEGRAM_BOT_TOKEN ||
    "8632241749:AAHDQHTbNpRYp--Ql26DJR_q9_353FLpVCQ";

  const chatId =
    process.env.TELEGRAM_CHAT_ID ||
    process.env.VITE_TELEGRAM_CHAT_ID ||
    "931155647";

  const reportText = [
    "📊 <b>[DAILY RECAP] Portfolio Visitor Report</b>",
    `📅 <b>Date:</b> ${dateFormatted} (IST)`,
    "",
    `👥 <b>Total Page Views:</b> ${metrics.views}`,
    `👤 <b>Unique Viewers:</b> ${metrics.unique}`,
    `📑 <b>Resume Clicks:</b> ${metrics.resume}`,
    "🌐 <b>Top Referrers:</b>",
    `• LinkedIn: ${metrics.linkedin}`,
    `• WhatsApp: ${metrics.whatsapp}`,
    `• Direct/Resume: ${metrics.direct}`,
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
        parse_mode: "HTML",
        text: reportText,
      }),
    });
    telegramSuccess = tgRes.ok;
  } catch (err) {
    console.error("[DailyCron] Telegram dispatch failed:", err);
  }

  // Archive / set expiry on Redis keys (TTL: 7 days) so history is retained without infinite growth
  if (REDIS_URL && REDIS_TOKEN) {
    executeRedisCommand(["EXPIRE", `views:${today}`, "604800"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `unique:${today}`, "604800"]).catch(() => {});
    executeRedisCommand(["EXPIRE", `resume:${today}`, "604800"]).catch(() => {});
  }

  return new Response(
    JSON.stringify({
      success: true,
      report_sent: telegramSuccess,
      date: dateFormatted,
      metrics,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
