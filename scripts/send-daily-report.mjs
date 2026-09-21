#!/usr/bin/env node

/**
 * Daily Reporter Script for GitHub Actions Cron & Telegram Alerting
 * Tally daily visitor metrics, devices, and referral sources,
 * then dispatches the 11:59 PM IST end-of-day summary to Telegram.
 */

// Fallbacks from environment or project configuration
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "8632241749:AAHDQHTbNpRYp--Ql26DJR_q9_353FLpVCQ";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "931155647";

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const PORTFOLIO_URL =
  process.env.PORTFOLIO_URL || "https://ranjith-cyber-portfolio.vercel.app";

async function executeRedisCommand(command) {
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
    console.warn("[Redis] Command failed:", err.message);
  }
  return null;
}

async function fetchStatsFromPortfolioApi(dateKey) {
  if (!PORTFOLIO_URL) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const targetUrl = `${PORTFOLIO_URL.replace(/\/$/, "")}/api/visitor/daily-stats?date=${dateKey}`;
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[Portfolio API] Could not fetch live stats:", err.message);
  }
  return null;
}



function getReportTargetDateInfo(overrideArg) {
  const executionTimeIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "medium",
  });

  if (overrideArg && overrideArg.trim()) {
    const arg = overrideArg.trim();
    if (arg.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m, d] = arg.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d));
      const formatted = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(dt);
      return { dateKey: arg, dateFormatted: formatted, executionTimeIST };
    }
    return { dateKey: arg, dateFormatted: arg, executionTimeIST };
  }

  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = nowIST.getHours();

  let targetDate = new Date(nowIST);
  // If running in early AM (00:00 - 03:59 IST) from a delayed cron execution, target yesterday's completed day
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

async function fetchStatsFromRedis(dateKey) {
  if (!REDIS_URL || !REDIS_TOKEN) return null;

  try {
    const [views, unique, linkedin, whatsapp, direct, devM, devD, devT, b] = await Promise.all([
      executeRedisCommand(["GET", `views:${dateKey}`]),
      executeRedisCommand(["SCARD", `unique:${dateKey}`]),
      executeRedisCommand(["GET", `referrers:${dateKey}:LinkedIn`]),
      executeRedisCommand(["GET", `referrers:${dateKey}:WhatsApp`]),
      executeRedisCommand(["GET", `referrers:${dateKey}:Direct`]),
      executeRedisCommand(["GET", `devices:${dateKey}:Mobile`]),
      executeRedisCommand(["GET", `devices:${dateKey}:Desktop`]),
      executeRedisCommand(["GET", `devices:${dateKey}:Tablet`]),
      executeRedisCommand(["GET", `bots:${dateKey}`]),
    ]);

    const parsedViews = parseInt(views || "0", 10);
    const parsedUnique = parseInt(unique || "0", 10);
    const count = parsedUnique > 0 ? parsedUnique : parsedViews;

    const referrers = {
      LinkedIn: parseInt(linkedin || "0", 10),
      WhatsApp: parseInt(whatsapp || "0", 10),
      Direct: parseInt(direct || "0", 10),
    };

    const devices = {
      Mobile: parseInt(devM || "0", 10),
      Desktop: parseInt(devD || "0", 10),
      Tablet: parseInt(devT || "0", 10),
    };

    const bots = parseInt(b || "0", 10);

    return {
      totalVisitors: count,
      pageViews: parsedViews,
      referrers,
      devices,
      bots,
    };
  } catch (err) {
    console.warn("[Redis] Error querying Redis:", err.message);
  }
  return null;
}

async function main() {
  console.log("🚀 Starting Daily Visitor Reporter...");

  const isForce = process.argv.includes("--force");
  const nonFlagArgs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const argDate = nonFlagArgs.length > 0 ? nonFlagArgs[0] : undefined;

  const { dateKey, dateFormatted, executionTimeIST } = getReportTargetDateInfo(argDate);

  console.log(`📅 Target Date: ${dateFormatted} (Key: ${dateKey})`);

  // 1. Deduping Check: Prevent duplicate alerts if report was already sent today
  if (!isForce && REDIS_URL && REDIS_TOKEN) {
    const alreadySent = await executeRedisCommand(["GET", `report_sent:${dateKey}`]);
    if (alreadySent === "1" || alreadySent === "true") {
      console.log(`✓ Report for ${dateKey} was already dispatched today. Skipping duplicate run.`);
      process.exit(0);
    }
  }

  // 2. Tally metrics from available data stores
  let totalVisitors = 0;
  let pageViews = 0;
  let resumeClicks = 0;
  let botHits = 0;
  let referrers = { LinkedIn: 0, WhatsApp: 0, Direct: 0 };
  let devices = { Mobile: 0, Desktop: 0, Tablet: 0 };

  // Attempt 1: Portfolio API endpoint
  const apiStats = await fetchStatsFromPortfolioApi(dateKey);
  if (apiStats && apiStats.metrics) {
    console.log("✓ Successfully loaded live metrics from Portfolio API");
    totalVisitors = apiStats.totalVisitors || apiStats.metrics.unique || apiStats.metrics.views || 0;
    pageViews = apiStats.metrics.views || 0;
    resumeClicks = apiStats.metrics.resume || 0;
    botHits = apiStats.metrics.bots || 0;
    if (apiStats.metrics.linkedin !== undefined) referrers.LinkedIn = apiStats.metrics.linkedin;
    if (apiStats.metrics.whatsapp !== undefined) referrers.WhatsApp = apiStats.metrics.whatsapp;
    if (apiStats.metrics.direct !== undefined) referrers.Direct = apiStats.metrics.direct;
    if (apiStats.metrics.mobile !== undefined) devices.Mobile = apiStats.metrics.mobile;
    if (apiStats.metrics.desktop !== undefined) devices.Desktop = apiStats.metrics.desktop;
    if (apiStats.metrics.tablet !== undefined) devices.Tablet = apiStats.metrics.tablet;
  } else {
    // Attempt 2: Direct Redis query
    const redisStats = await fetchStatsFromRedis(dateKey);
    if (redisStats) {
      console.log("✓ Successfully loaded metrics from Redis");
      totalVisitors = redisStats.totalVisitors;
      pageViews = redisStats.pageViews;
      referrers = redisStats.referrers;
      devices = redisStats.devices;
      botHits = redisStats.bots;
    }
  }

  console.log(`👥 Computed Total Visitors: ${totalVisitors}`);
  console.log(`📱 Device Breakdown: Mobile: ${devices.Mobile}, Desktop: ${devices.Desktop}, Tablet: ${devices.Tablet}`);

  // 3. Format complete categorized report message
  const messageText = [
    "📊 DAILY PORTFOLIO TRAFFIC REPORT",
    `📅 Report Date: ${dateFormatted}`,
    `⏰ Target: 11:59 PM IST (Executed at ${executionTimeIST})`,
    "",
    `👥 TOTAL VISITORS TODAY: ${totalVisitors} members visited`,
    `👁️ Total Page Views: ${pageViews}`,
    "",
    "🌐 REFERRAL SOURCES (Categorized):",
    `  • LinkedIn: ${referrers.LinkedIn}`,
    `  • WhatsApp: ${referrers.WhatsApp}`,
    `  • Direct / Other: ${referrers.Direct}`,
    "",
    "📱 DEVICE BREAKDOWN (Categorized):",
    `  • Mobile: ${devices.Mobile}`,
    `  • Desktop: ${devices.Desktop}`,
    `  • Tablet: ${devices.Tablet}`,
    "",
    "📄 ENGAGEMENT / INTERACTIONS:",
    `  • Resume Downloads / Views: ${resumeClicks}`,
    "",
    `🤖 BOT / CRAWLER PREVIEWS FILTERED: ${botHits}`,
    "✅ End-of-Day Traffic Summary logged.",
  ].join("\n");

  console.log("\n✉️ Message Payload:\n" + messageText + "\n");

  // 4. Dispatch Telegram Alert
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("❌ Telegram Bot Token or Chat ID not found.");
    process.exit(1);
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
      }),
    });

    if (res.ok) {
      const responseData = await res.json();
      console.log("✅ Telegram Alert successfully dispatched! Message ID:", responseData.result?.message_id);

      // Mark report as sent in Redis with 24-hour TTL to block late duplicate runner calls
      if (REDIS_URL && REDIS_TOKEN) {
        await executeRedisCommand(["SET", `report_sent:${dateKey}`, "1", "EX", "86400"]);
      }
    } else {
      const errorText = await res.text();
      console.error(`❌ Failed to send Telegram alert. HTTP ${res.status}: ${errorText}`);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Network error sending Telegram alert:", err);
    process.exit(1);
  }
}

main();


