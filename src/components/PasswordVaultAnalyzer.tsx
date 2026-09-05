import { useState } from "react";
import { KeyRound, ShieldAlert, ShieldCheck, Copy, Check, Sparkles, Lock, Hash } from "lucide-react";

export function PasswordVaultAnalyzer() {
  const [password, setPassword] = useState("CyberShield@2026!Ranjith");
  const [copied, setCopied] = useState(false);

  // Compute Shannon Entropy & Metrics
  const calculateMetrics = (input: string) => {
    if (!input)
      return {
        entropy: 0,
        score: 0,
        status: "Empty",
        crackTime: "Instant",
        hasLower: false,
        hasUpper: false,
        hasDigit: false,
        hasSymbol: false,
        length: 0,
      };

    const charMap: Record<string, number> = {};
    for (const char of input) {
      charMap[char] = ((charMap[char] as number | undefined) ?? 0) + 1;
    }

    let entropy = 0;
    const len = input.length;
    for (const char in charMap) {
      const count = charMap[char] ?? 0;
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    const totalEntropyBits = Math.round(entropy * len);

    let charsetSize = 0;
    if (/[a-z]/.test(input)) charsetSize += 26;
    if (/[A-Z]/.test(input)) charsetSize += 26;
    if (/[0-9]/.test(input)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(input)) charsetSize += 32;

    const possibleCombinations = Math.pow(charsetSize || 1, len);
    // Assuming 10^10 hashes per second (high-end GPU cluster)
    const secondsToCrack = possibleCombinations / 1e10;

    let crackTime = "Instant";
    if (secondsToCrack > 31536000 * 1000) crackTime = "Trillions of years";
    else if (secondsToCrack > 31536000) crackTime = `${Math.round(secondsToCrack / 31536000)} years`;
    else if (secondsToCrack > 86400) crackTime = `${Math.round(secondsToCrack / 86400)} days`;
    else if (secondsToCrack > 3600) crackTime = `${Math.round(secondsToCrack / 3600)} hours`;
    else if (secondsToCrack > 60) crackTime = `${Math.round(secondsToCrack / 60)} minutes`;
    else if (secondsToCrack > 1) crackTime = `${Math.round(secondsToCrack)} seconds`;

    let score = 0;
    if (totalEntropyBits > 80) score = 100;
    else if (totalEntropyBits > 60) score = 80;
    else if (totalEntropyBits > 40) score = 55;
    else score = Math.max(10, totalEntropyBits);

    let status = "Weak";
    if (score >= 80) status = "Military Grade";
    else if (score >= 60) status = "Strong";
    else if (score >= 40) status = "Moderate";

    return {
      entropy: totalEntropyBits,
      score,
      status,
      crackTime,
      hasLower: /[a-z]/.test(input),
      hasUpper: /[A-Z]/.test(input),
      hasDigit: /[0-9]/.test(input),
      hasSymbol: /[^a-zA-Z0-9]/.test(input),
      length: len,
    };
  };

  const metrics = calculateMetrics(password);

  const generateToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const array = new Uint32Array(24);
    crypto.getRandomValues(array);
    let token = "";
    for (let i = 0; i < 24; i++) {
      const idx = (array[i] ?? 0) % chars.length;
      token += chars[idx]!;
    }
    setPassword(token);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-line bg-panel p-6 shadow-2xl">
      <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2.5 rounded-full bg-ember animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ember font-semibold">
              CyberShield Vault Engine
            </span>
          </div>
          <h3 className="mt-1 text-xl font-medium text-ink">
            Shannon Entropy & Credential Defense Analyzer
          </h3>
        </div>
        <button
          onClick={generateToken}
          className="inline-flex items-center gap-2 rounded-md bg-ember px-3.5 py-1.5 font-mono text-xs font-medium text-obsidian transition-transform hover:-translate-y-0.5"
        >
          <Sparkles size={14} /> Generate Crypto Token
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <label htmlFor="pass-input" className="block font-mono text-xs text-ink-muted mb-2">
            Test Credential / Password Entropy:
          </label>
          <div className="relative">
            <input
              id="pass-input"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to test..."
              className="w-full rounded-lg border border-line bg-obsidian px-4 py-3 font-mono text-sm text-ink placeholder:text-ink-muted/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember pr-24"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded p-1.5 text-ink-muted hover:bg-panel-2 hover:text-ink transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-mint" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Entropy Progress Bar */}
        <div>
          <div className="flex items-center justify-between font-mono text-xs mb-1.5">
            <span className="text-ink-muted">Security Strength Rating</span>
            <span
              className={`font-semibold ${
                metrics.score >= 80
                  ? "text-mint"
                  : metrics.score >= 60
                  ? "text-ice"
                  : metrics.score >= 40
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {metrics.status} ({metrics.score}/100)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-obsidian border border-line/60">
            <div
              className={`h-full transition-all duration-300 ${
                metrics.score >= 80
                  ? "bg-mint"
                  : metrics.score >= 60
                  ? "bg-ice"
                  : metrics.score >= 40
                  ? "bg-amber-400"
                  : "bg-red-400"
              }`}
              style={{ width: `${metrics.score}%` }}
            />
          </div>
        </div>

        {/* Realtime Metrics Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line/70 bg-obsidian/70 p-3.5">
            <div className="flex items-center justify-between text-ink-muted">
              <span className="font-mono text-[10px] uppercase tracking-wider">Shannon Entropy</span>
              <Hash size={14} className="text-ice" />
            </div>
            <p className="mt-2 font-mono text-xl font-bold text-ink">{metrics.entropy} <span className="text-xs font-normal text-ink-muted">bits</span></p>
            <span className="mt-1 block font-mono text-[10px] text-ink-muted">
              {metrics.entropy > 64 ? "High Entropy (>64 bits)" : "Low Entropy (<64 bits)"}
            </span>
          </div>

          <div className="rounded-lg border border-line/70 bg-obsidian/70 p-3.5">
            <div className="flex items-center justify-between text-ink-muted">
              <span className="font-mono text-[10px] uppercase tracking-wider">GPU Offline Crack Time</span>
              <Lock size={14} className="text-ember" />
            </div>
            <p className="mt-2 font-mono text-lg font-bold text-ink truncate">{metrics.crackTime}</p>
            <span className="mt-1 block font-mono text-[10px] text-ink-muted">@ 10 Billion Hashes/Sec</span>
          </div>

          <div className="rounded-lg border border-line/70 bg-obsidian/70 p-3.5">
            <div className="flex items-center justify-between text-ink-muted">
              <span className="font-mono text-[10px] uppercase tracking-wider">NIST 800-63B</span>
              {metrics.length >= 12 && metrics.entropy >= 60 ? (
                <ShieldCheck size={14} className="text-mint" />
              ) : (
                <ShieldAlert size={14} className="text-amber-400" />
              )}
            </div>
            <p className={`mt-2 font-mono text-lg font-bold ${metrics.length >= 12 ? "text-mint" : "text-amber-400"}`}>
              {metrics.length >= 12 ? "Compliant" : "Non-Compliant"}
            </p>
            <span className="mt-1 block font-mono text-[10px] text-ink-muted">
              {metrics.length < 12 ? "Min 12 chars required" : "Passes length rule"}
            </span>
          </div>
        </div>

        {/* Character Pool Checklist */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono text-xs">
          <div className={`p-2 rounded border ${metrics.hasLower ? "border-mint/40 bg-mint/10 text-mint" : "border-line bg-obsidian text-ink-muted/50"}`}>
            ✓ Lowercase (a-z)
          </div>
          <div className={`p-2 rounded border ${metrics.hasUpper ? "border-mint/40 bg-mint/10 text-mint" : "border-line bg-obsidian text-ink-muted/50"}`}>
            ✓ Uppercase (A-Z)
          </div>
          <div className={`p-2 rounded border ${metrics.hasDigit ? "border-mint/40 bg-mint/10 text-mint" : "border-line bg-obsidian text-ink-muted/50"}`}>
            ✓ Digits (0-9)
          </div>
          <div className={`p-2 rounded border ${metrics.hasSymbol ? "border-mint/40 bg-mint/10 text-mint" : "border-line bg-obsidian text-ink-muted/50"}`}>
            ✓ Symbols (!@#$)
          </div>
        </div>
      </div>
    </div>
  );
}
