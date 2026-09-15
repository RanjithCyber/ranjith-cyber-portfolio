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

async function fetchStatsFromRedis(dateKey) {
  if (!REDIS_URL || !REDIS_TOKEN) return null;

  try {
    const [views, unique, linkedin, whatsapp, direct, devM, devD, devT] = await Promise.all([
      executeRedisCommand(["GET", `views:${dateKey}`]),
      executeRedisCommand(["SCARD", `unique:${dateKey}`]),
      executeRedisCommand(["GET", `referrers:${dateKey}:LinkedIn`]),
      executeRedisCommand(["GET", `referrers:${dateKey}:WhatsApp`]),
      executeRedisCommand(["GET", `referrers:${dateKey}:Direct`]),
      executeRedisCommand(["GET", `devices:${dateKey}:Mobile`]),
      executeRedisCommand(["GET", `devices:${dateKey}:Desktop`]),
      executeRedisCommand(["GET", `devices:${dateKey}:Tablet`]),
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

    return {
      totalVisitors: count,
      referrers,
      devices,
    };
  } catch (err) {
    console.warn("[Redis] Error querying Redis:", err.message);
  }
  return null;
}

async function main() {
  console.log("🚀 Starting Daily Visitor Reporter...");

  // 1. Resolve date strings
  const todayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const argDate = process.argv[2];
  let dateFormatted;
  if (argDate && argDate.trim().length > 0) {
    dateFormatted = argDate.trim();
  } else {
    dateFormatted = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  }

  console.log(`📅 Target Date: ${dateFormatted} (Key: ${todayKey})`);

  // 2. Tally metrics from available data stores
  let totalVisitors = 0;
  let referrers = { LinkedIn: 0, WhatsApp: 0, Direct: 0 };
  let devices = { Mobile: 0, Desktop: 0, Tablet: 0 };

  // Attempt 1: Portfolio API endpoint
  const apiStats = await fetchStatsFromPortfolioApi(todayKey);
  if (apiStats && apiStats.metrics) {
    console.log("✓ Successfully loaded live metrics from Portfolio API");
    totalVisitors = apiStats.totalVisitors || apiStats.metrics.unique || apiStats.metrics.views || 0;
    if (apiStats.metrics.linkedin !== undefined) referrers.LinkedIn = apiStats.metrics.linkedin;
    if (apiStats.metrics.whatsapp !== undefined) referrers.WhatsApp = apiStats.metrics.whatsapp;
    if (apiStats.metrics.direct !== undefined) referrers.Direct = apiStats.metrics.direct;
    if (apiStats.metrics.mobile !== undefined) devices.Mobile = apiStats.metrics.mobile;
    if (apiStats.metrics.desktop !== undefined) devices.Desktop = apiStats.metrics.desktop;
    if (apiStats.metrics.tablet !== undefined) devices.Tablet = apiStats.metrics.tablet;
  } else {
    // Attempt 2: Direct Redis query
    const redisStats = await fetchStatsFromRedis(todayKey);
    if (redisStats) {
      console.log("✓ Successfully loaded metrics from Redis");
      totalVisitors = redisStats.totalVisitors;
      referrers = redisStats.referrers;
      devices = redisStats.devices;
    }
  }

  // 3. Determine top referral sources
  const sortedReferrers = Object.entries(referrers)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([source]) => source);

  const topSources =
    sortedReferrers.length > 0 ? sortedReferrers.join(", ") : "LinkedIn, WhatsApp, Direct";

  console.log(`👥 Computed Total Visitors: ${totalVisitors}`);
  console.log(`🌐 Top Referral Sources: ${topSources}`);
  console.log(`📱 Device Breakdown: Mobile: ${devices.Mobile}, Desktop: ${devices.Desktop}, Tablet: ${devices.Tablet}`);

  // 4. Format exact message as specified
  const messageText = [
    "📊 Daily Portfolio Traffic Log",
    `📅 Date: ${dateFormatted}`,
    "",
    `👥 Total Visitors Today: ${totalVisitors} members visited`,
    `🌐 Top Referral Sources: ${topSources}`,
    "⏰ Time Dispatched: 11:59 PM IST",
  ].join("\n");

  console.log("\n✉️ Message Payload:\n" + messageText + "\n");

  // 5. Dispatch Telegram Alert
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
