import { useState } from "react";
import { Search, Bot, AlertTriangle, CheckCircle2, ShieldAlert, Send, Sparkles, RefreshCw, Mail, Globe, Lock } from "lucide-react";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isPhishing?: boolean;
}

export function PhishingDetectorDemo() {
  const [activeSubTab, setActiveSubTab] = useState<"url" | "chatbot">("url");

  // URL / Email scanner state
  const [inputText, setInputText] = useState("http://secure-login-crescent-portal.verify-update.org/login");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    verdict: "SAFE" | "PHISHING" | "SUSPICIOUS";
    domainAge: string;
    homoglyphDetected: boolean;
    sslValid: boolean;
    heuristics: string[];
  } | null>({
    score: 88,
    verdict: "PHISHING",
    domainAge: "3 days old (High Risk)",
    homoglyphDetected: true,
    sslValid: false,
    heuristics: [
      "Detected brand spoofing keyword ('secure-login-crescent-portal')",
      "Suspicious TLD registered via anonymized proxy registrar",
      "Missing valid SSL/TLS certificate (HTTP only)",
      "Urgency trigger found in path parameters",
    ],
  });

  // Chatbot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am PhishGuard AI, your cybersecurity phishing detection assistant. Paste any email snippet, link, or security question to analyze for social engineering threats.",
      timestamp: "19:20:00",
    },
    {
      sender: "user",
      text: "Is an email asking me to click 'bit.ly/verify-password-now' from IT support legitimate?",
      timestamp: "19:20:15",
    },
    {
      sender: "ai",
      text: "⚠️ HIGH RISK ALERT: Legitimate IT departments will NEVER send shortened URL links (bit.ly) asking for password verification. Shortened links obscure the destination IP/domain. Do NOT click the link or supply credentials.",
      timestamp: "19:20:16",
      isPhishing: true,
    },
  ]);
  const [userChatInput, setUserChatInput] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);

  const handleAnalyzeText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const lower = inputText.toLowerCase();
      const isPhish =
        lower.includes("verify") ||
        lower.includes("update") ||
        lower.includes("login") ||
        lower.includes("bit.ly") ||
        lower.includes("bank") ||
        lower.includes("account") ||
        lower.includes("http://");

      setAnalysisResult({
        score: isPhish ? Math.floor(Math.random() * 20) + 75 : Math.floor(Math.random() * 15) + 10,
        verdict: isPhish ? "PHISHING" : "SAFE",
        domainAge: isPhish ? "4 days old (New registration)" : "6.2 years (Established)",
        homoglyphDetected: isPhish,
        sslValid: !isPhish,
        heuristics: isPhish
          ? [
              "Urgent psychological pressure keywords detected ('verify', 'update', 'login')",
              "Shortened link or suspicious domain mismatch",
              "Domain age under 30 days (typical disposable phishing infrastructure)",
              "Unsigned or untrusted SSL authority",
            ]
          : [
              "Domain registered to known organization with valid Extended Validation SSL",
              "No suspicious subdomains or typosquatting homoglyphs found",
              "SPF, DKIM, and DMARC record checks passed",
            ],
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    const userMsg = userChatInput.trim();

    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg, timestamp: timeStr }]);
    setUserChatInput("");
    setIsBotThinking(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let botReply = "I have analyzed your input. Always verify sender headers and avoid clicking unverified links or sharing MFA codes.";
      let phishFlag = false;

      if (lower.includes("password") || lower.includes("reset") || lower.includes("login") || lower.includes("bank")) {
        botReply = "🚨 PHISHING WARNING: Messages requesting password resets or bank credentials via unexpected channels are 95% correlated with phishing. Inspect sender domain headers before proceeding.";
        phishFlag = true;
      } else if (lower.includes("gift card") || lower.includes("urgency") || lower.includes("ceo")) {
        botReply = "⚠️ EXECUTIVE SPOOFING ALERT: Impersonating CEOs or managers to request gift cards or wire transfers is a common Business Email Compromise (BEC) attack vector.";
        phishFlag = true;
      } else if (lower.includes("how to spot") || lower.includes("tips") || lower.includes("detect")) {
        botReply = "To spot phishing: 1) Inspect exact sender email address (e.g. support@paypa1.com vs paypal.com), 2) Hover over links to check destination URL, 3) Look for artificial urgency, 4) Never share OTPs.";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: botReply, timestamp: timeStr, isPhishing: phishFlag },
      ]);
      setIsBotThinking(false);
    }, 1200);
  };

  return (
    <div className="rounded-xl border border-line bg-panel p-6 shadow-2xl">
      <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2.5 rounded-full bg-ember animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ember font-semibold">
              AI Security Intelligence Engine
            </span>
          </div>
          <h3 className="mt-1 text-xl font-medium text-ink">
            Phishing Detector &amp; Interactive Security AI Chatbot
          </h3>
        </div>

        {/* Sub-tab selection */}
        <div className="flex rounded-lg border border-line bg-obsidian p-1 font-mono text-xs">
          <button
            onClick={() => setActiveSubTab("url")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 transition-colors ${
              activeSubTab === "url" ? "bg-ember text-obsidian font-bold" : "text-ink-muted hover:text-ink"
            }`}
          >
            <Globe size={13} /> URL &amp; Email Scanner
          </button>
          <button
            onClick={() => setActiveSubTab("chatbot")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 transition-colors ${
              activeSubTab === "chatbot" ? "bg-ember text-obsidian font-bold" : "text-ink-muted hover:text-ink"
            }`}
          >
            <Bot size={13} /> PhishGuard AI Chatbot
          </button>
        </div>
      </div>

      {activeSubTab === "url" ? (
        <div className="mt-5 space-y-6">
          <form onSubmit={handleAnalyzeText} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3.5 size-4 text-ink-muted" />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste URL or email message body to evaluate..."
                className="w-full rounded-lg border border-line bg-obsidian pl-10 pr-4 py-2.5 font-mono text-xs text-ink placeholder:text-ink-muted/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-ember px-5 py-2.5 font-mono text-xs font-semibold text-obsidian transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Analyzing Phishing Vectors...
                </>
              ) : (
                <>
                  <Search size={14} /> Scan Phishing Threat
                </>
              )}
            </button>
          </form>

          {isAnalyzing && (
            <div className="py-10 text-center font-mono text-xs text-ink-muted space-y-2">
              <RefreshCw size={24} className="mx-auto text-ember animate-spin" />
              <p className="text-ink font-medium">Inspecting URL homoglyphs, domain registration, &amp; NLP sentiment...</p>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="space-y-4 rise-in">
              <div
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  analysisResult.verdict === "PHISHING"
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-mint/40 bg-mint/10 text-mint"
                }`}
              >
                <div className="flex items-center gap-3">
                  {analysisResult.verdict === "PHISHING" ? (
                    <ShieldAlert size={28} className="shrink-0" />
                  ) : (
                    <CheckCircle2 size={28} className="shrink-0" />
                  )}
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider opacity-80">Verdict Result</span>
                    <h4 className="font-mono text-xl font-bold">{analysisResult.verdict} THREAT DETECTED</h4>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs opacity-75">Risk Index</span>
                  <p className="text-2xl font-bold">{analysisResult.score}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="rounded border border-line bg-obsidian p-3">
                  <span className="text-ink-muted text-[10px] block">DOMAIN AGE &amp; REPUTATION</span>
                  <span className="text-ink font-semibold mt-1 block">{analysisResult.domainAge}</span>
                </div>
                <div className="rounded border border-line bg-obsidian p-3">
                  <span className="text-ink-muted text-[10px] block">HOMOGLYPH SPOOF CHECK</span>
                  <span className={analysisResult.homoglyphDetected ? "text-red-400 font-semibold" : "text-mint font-semibold"}>
                    {analysisResult.homoglyphDetected ? "SPOOF DETECTED" : "CLEAN"}
                  </span>
                </div>
                <div className="rounded border border-line bg-obsidian p-3">
                  <span className="text-ink-muted text-[10px] block">SSL CERTIFICATE VALIDITY</span>
                  <span className={analysisResult.sslValid ? "text-mint font-semibold" : "text-amber-400 font-semibold"}>
                    {analysisResult.sslValid ? "VALID SSL" : "INVALID / UNTRUSTED"}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-line bg-obsidian p-4">
                <h5 className="font-mono text-xs uppercase tracking-wider text-ember font-semibold mb-2">
                  Heuristic &amp; Machine Learning Analysis Breakdown:
                </h5>
                <ul className="space-y-1.5 font-mono text-xs text-ink-muted">
                  {analysisResult.heuristics.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-ember mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Chatbot Interface */
        <div className="mt-5 rounded-lg border border-line bg-obsidian font-mono text-xs flex flex-col h-[340px]">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5 bg-panel-2/60">
            <div className="flex items-center gap-2 text-ink">
              <Bot size={16} className="text-ember" />
              <span className="font-semibold text-xs">PhishGuard AI Assistant</span>
            </div>
            <span className="text-[10px] text-mint flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-mint animate-pulse" /> Online
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === "user"
                      ? "bg-ember text-obsidian font-medium"
                      : msg.isPhishing
                      ? "bg-red-500/20 text-red-300 border border-red-500/40"
                      : "bg-panel text-ink border border-line"
                  }`}
                >
                  <p className="leading-relaxed text-xs">{msg.text}</p>
                </div>
                <span className="text-[10px] text-ink-muted/50 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            {isBotThinking && (
              <div className="flex items-center gap-2 text-ink-muted text-xs p-2">
                <Sparkles size={14} className="text-ember animate-spin" /> PhishGuard AI is analyzing message semantics...
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-line p-2 flex gap-2">
            <input
              type="text"
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              placeholder="Ask PhishGuard AI about an email, link, or attack vector..."
              className="flex-1 rounded bg-panel px-3 py-2 text-xs text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-ember border border-line"
            />
            <button
              type="submit"
              className="rounded bg-ember px-4 py-2 text-xs font-semibold text-obsidian hover:bg-ember/90"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
