import { useState, useEffect } from "react";
import { ShieldCheck, Terminal, Lock, Cpu, AlertCircle } from "lucide-react";
import { sendTelegramAlert } from "@/utils/telegramAlert";

export function AccessGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputName, setInputName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof sessionStorage === "undefined") return;

    try {
      const accessGranted = sessionStorage.getItem("access_granted");
      if (!accessGranted) {
        setIsOpen(true);
      }
    } catch {
      // Storage unavailable or blocked
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();

    if (!trimmed) {
      setErrorMsg("Identity verification required. Please enter your name or organization handle.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.setItem("access_granted", "true");
        sessionStorage.setItem("visitor_name", trimmed);
      } catch {
        // Ignore storage exceptions
      }
    }

    // Record telemetry event to server metrics store
    try {
      fetch("/api/telemetry/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "view",
          isUnique: true,
          visitorId: trimmed,
          referrerCategory: "Direct",
          device: typeof navigator !== "undefined" && /mobile|android|iphone/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}

    // Asynchronously dispatch Telegram notification to Ranjith's bot
    sendTelegramAlert(trimmed).catch((err) => {
      console.warn("[AccessGate] Alert dispatch failed:", err);
    });

    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitting(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in font-mono print:hidden access-gate-modal">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-emerald-500/50 bg-[#0a0d14] p-6 sm:p-7 shadow-[0_0_80px_rgba(16,185,129,0.25)]">
        {/* Top Scanline Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]" />

        {/* Cyber Terminal Header */}
        <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <Lock size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-ping" />
              <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">
                Access Gate // Identify Session
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-wide mt-0.5">
              PROTOCOL: MANDATORY-IDENTITY-HANDSHAKE
            </p>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-emerald-500/20 bg-[#07090e] p-3.5 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <Terminal size={14} />
              <span>SECURITY GATEKEEPER</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Welcome to Ranjith's Cybersecurity & SOC Engineering Portfolio. To discover projects, live threat demos, and research, please enter your Name or Organization handle below.
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span className="text-[11px] leading-snug">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="visitor-handle-input"
                className="block text-[11px] font-medium tracking-wide text-zinc-300 mb-1.5"
              >
                Enter your Name or Organization Handle *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold select-none text-xs">
                  &gt;
                </span>
                <input
                  id="visitor-handle-input"
                  type="text"
                  required
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="e.g. Rahul, Suresh, Innspark HR, Recruiter"
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-emerald-500/40 bg-[#05070c] py-2.5 pl-8 pr-4 text-xs text-emerald-300 placeholder:text-zinc-600 focus:border-emerald-400 focus:bg-[#070a11] focus:outline-none focus:ring-1 focus:ring-emerald-400 shadow-inner"
                />
              </div>
            </div>

            {/* Single Mandatory Action Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/70 bg-emerald-500/20 px-5 py-3 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck size={16} />
                <span>{isSubmitting ? "VERIFYING IDENTITY..." : "INITIALIZE SESSION & DISCOVER PORTFOLIO"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Terminal Footer Indicator */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[10px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Cpu size={12} className="text-emerald-500/60" />
            <span>ENCRYPTED TELEMETRY DIRECT TO ENGINEER</span>
          </div>
          <span className="text-emerald-500/80 font-semibold">SECURE HANDSHAKE</span>
        </div>
      </div>
    </div>
  );
}

