import { useState, useEffect } from "react";
import { ShieldCheck, Terminal, UserCheck, ArrowRight, X, Lock, Cpu } from "lucide-react";
import { sendTelegramAlert } from "@/utils/telegramAlert";

export function AccessGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputName, setInputName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof sessionStorage === "undefined") return;

    try {
      const accessGranted = sessionStorage.getItem("access_granted");
      if (!accessGranted) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable or blocked
    }
  }, []);

  const handleGrantAccess = async (name: string) => {
    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.setItem("access_granted", "true");
      } catch {
        // Ignore storage exceptions
      }
    }

    setIsSubmitting(true);

    // Asynchronously dispatch notification without blocking modal close
    sendTelegramAlert(name).catch((err) => {
      console.warn("[AccessGate] Alert dispatch failed:", err);
    });

    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitting(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-emerald-500/40 bg-[#0a0d14] p-6 sm:p-7 shadow-[0_0_60px_rgba(16,185,129,0.18)]">
        {/* Top Scanline Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981]" />

        {/* Close Button */}
        <button
          onClick={() => handleGrantAccess("Anonymous Guest")}
          className="absolute top-4 right-4 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-emerald-400"
          aria-label="Close modal and continue as guest"
        >
          <X size={16} />
        </button>

        {/* Cyber Terminal Header */}
        <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Lock size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
              <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">
                Cyber Access Gate // Threat Defense
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-wide mt-0.5">
              PROTOCOL: VERIFY-IDENTITY-HANDSHAKE-v2.6
            </p>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-[#07090e] p-3.5 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <Terminal size={13} />
              <span>SECURITY HANDSHAKE INITIATION</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Welcome to the Defensive Engineering & Threat Intel console. Identify yourself or sign in with your handle to log access telemetry directly to the engineer.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGrantAccess(inputName);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="visitor-handle-input"
                className="block text-[11px] font-medium tracking-wide text-zinc-300 mb-1.5"
              >
                Enter your Name, Callsign, or Organization Handle:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70 font-bold select-none text-xs">
                  &gt;
                </span>
                <input
                  id="visitor-handle-input"
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="[ e.g. Rahul, Suresh, Innspark HR ]"
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-emerald-500/30 bg-[#05070c] py-2.5 pl-8 pr-4 text-xs text-emerald-300 placeholder:text-zinc-600 focus:border-emerald-400 focus:bg-[#070a11] focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/60 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck size={15} />
                <span>{isSubmitting ? "AUTHENTICATING..." : "INITIALIZE SESSION"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGrantAccess("Anonymous Guest")}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all disabled:opacity-50 cursor-pointer"
              >
                <UserCheck size={14} />
                <span>CONTINUE AS GUEST</span>
              </button>
            </div>
          </form>
        </div>

        {/* Terminal Footer Indicator */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[10px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Cpu size={12} className="text-emerald-500/60" />
            <span>DIRECT TELEGRAM BOT TELEMETRY ENCRYPTED</span>
          </div>
          <span className="text-zinc-600">ID: 931155647</span>
        </div>
      </div>
    </div>
  );
}
