import { useState } from "react";
import { Cpu, Zap, ShieldCheck, ShieldAlert, Activity, RefreshCw, BarChart2, CheckCircle2 } from "lucide-react";

interface PacketPreset {
  name: string;
  type: "Normal" | "DoS" | "Probe" | "U2R";
  duration: number;
  protocol: "tcp" | "udp" | "icmp";
  service: string;
  flag: string;
  srcBytes: number;
  dstBytes: number;
  count: number;
  description: string;
}

const PACKET_PRESETS: PacketPreset[] = [
  {
    name: "Normal Web Browsing (HTTP GET)",
    type: "Normal",
    duration: 0,
    protocol: "tcp",
    service: "http",
    flag: "SF",
    srcBytes: 215,
    dstBytes: 4500,
    count: 1,
    description: "Standard web payload retrieval with normal TCP session handshake",
  },
  {
    name: "Neptune Attack (SYN Flood DoS)",
    type: "DoS",
    duration: 0,
    protocol: "tcp",
    service: "private",
    flag: "S0",
    srcBytes: 0,
    dstBytes: 0,
    count: 240,
    description: "Massive SYN flood sending half-open TCP connections to exhaust socket pools",
  },
  {
    name: "Satan Attack (Port Scan / Probe)",
    type: "Probe",
    duration: 2,
    protocol: "udp",
    service: "other",
    flag: "SF",
    srcBytes: 105,
    dstBytes: 146,
    count: 120,
    description: "Systematic port probing attempting to discover unpatched listening daemons",
  },
  {
    name: "Buffer Overflow (User to Root - U2R)",
    type: "U2R",
    duration: 14,
    protocol: "tcp",
    service: "telnet",
    flag: "SF",
    srcBytes: 2480,
    dstBytes: 15400,
    count: 2,
    description: "Local privilege escalation payload seeking root shell via stack overflow",
  },
];

export function IdsSimulatorDemo() {
  const [selectedPreset, setSelectedPreset] = useState<PacketPreset>(PACKET_PRESETS[1]!);
  const [isClassifying, setIsClassifying] = useState(false);
  const [idsResult, setIdsResult] = useState<{
    attackClass: string;
    confidence: number;
    latencyMs: number;
    riskLevel: "CRITICAL" | "HIGH" | "SAFE";
    mitigation: string;
    featureImportances: { name: string; weight: number }[];
  } | null>({
    attackClass: "Neptune (Denial of Service - DoS)",
    confidence: 98.4,
    latencyMs: 8.2,
    riskLevel: "CRITICAL",
    mitigation: "Engage TCP SYN Cookies; apply rate limiting drop rules on ingress interface eth0",
    featureImportances: [
      { name: "count (SYN connection rate)", weight: 38 },
      { name: "flag (S0 half-open status)", weight: 29 },
      { name: "dst_bytes (zero payload return)", weight: 18 },
      { name: "service (private port target)", weight: 15 },
    ],
  });

  const handleRunClassification = () => {
    setIsClassifying(true);
    setIdsResult(null);

    setTimeout(() => {
      const isAnomaly = selectedPreset.type !== "Normal";
      setIdsResult({
        attackClass: isAnomaly
          ? `${(selectedPreset.name.split("(")[0] ?? selectedPreset.name).trim()} (${selectedPreset.type})`
          : "Normal Traffic (No Anomaly)",
        confidence: isAnomaly ? 97.6 : 99.1,
        latencyMs: Math.round((Math.random() * 5 + 6) * 10) / 10,
        riskLevel: isAnomaly ? (selectedPreset.type === "DoS" ? "CRITICAL" : "HIGH") : "SAFE",
        mitigation: isAnomaly
          ? selectedPreset.type === "DoS"
            ? "Deploy dynamic SYN proxy & IP firewall drop rule"
            : selectedPreset.type === "Probe"
            ? "Block source IP across perimeter routers & alert SOC triage"
            : "Isolate session immediately & trigger host integrity audit"
          : "Traffic verified normal; log packet parameters into history storage",
        featureImportances: [
          { name: `count (${selectedPreset.count} pkts/sec)`, weight: 36 },
          { name: `src_bytes (${selectedPreset.srcBytes} B)`, weight: 26 },
          { name: `service (${selectedPreset.service})`, weight: 22 },
          { name: `flag (${selectedPreset.flag})`, weight: 16 },
        ],
      });
      setIsClassifying(false);
    }, 1400);
  };

  return (
    <div className="rounded-xl border border-line bg-panel p-6 shadow-2xl">
      <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2.5 rounded-full bg-ice animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ice font-semibold">
              Machine Learning Security Engine
            </span>
          </div>
          <h3 className="mt-1 text-xl font-medium text-ink">
            AI-Based Network Intrusion Detection System (NSL-KDD Dataset)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-obsidian border border-line px-3 py-1.5 font-mono text-xs text-mint">
            Random Forest &amp; XGBoost: 94.8% Acc
          </span>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="mt-5">
        <p className="font-mono text-xs text-ink-muted mb-2">Select NSL-KDD Network Packet Preset:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PACKET_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSelectedPreset(preset)}
              className={`p-3 rounded-lg border text-left font-mono text-xs transition-all ${
                selectedPreset.name === preset.name
                  ? "border-ice bg-ice/15 text-ink shadow-md"
                  : "border-line bg-obsidian text-ink-muted hover:border-line/80 hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{preset.type}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    preset.type === "Normal"
                      ? "bg-mint/20 text-mint"
                      : preset.type === "DoS"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {preset.type}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-ink font-semibold truncate">{preset.name.split("(")[0]}</p>
              <p className="mt-1 text-[10px] text-ink-muted/70 truncate">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Parameters Table */}
      <div className="mt-5 rounded-lg border border-line bg-obsidian p-4 font-mono text-xs">
        <div className="flex items-center justify-between mb-3 border-b border-line/60 pb-2">
          <span className="text-ice font-semibold">Active Packet Features (41 NSL-KDD Attributes)</span>
          <button
            onClick={handleRunClassification}
            disabled={isClassifying}
            className="inline-flex items-center gap-2 rounded bg-ice px-4 py-1.5 font-mono text-xs font-bold text-obsidian hover:bg-ice/90 disabled:opacity-50"
          >
            {isClassifying ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
            {isClassifying ? "Classifying..." : "Run ML Packet Classifier"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div>
            <span className="text-ink-muted/60 block">PROTOCOL TYPE</span>
            <span className="text-ink font-semibold">{selectedPreset.protocol.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-ink-muted/60 block">SERVICE TARGET</span>
            <span className="text-ink font-semibold">{selectedPreset.service}</span>
          </div>
          <div>
            <span className="text-ink-muted/60 block">TCP FLAG</span>
            <span className="text-ember font-semibold">{selectedPreset.flag}</span>
          </div>
          <div>
            <span className="text-ink-muted/60 block">SRC / DST BYTES</span>
            <span className="text-ink font-semibold">{selectedPreset.srcBytes}B / {selectedPreset.dstBytes}B</span>
          </div>
        </div>
      </div>

      {/* Classification Result Banner */}
      {isClassifying && (
        <div className="mt-6 py-8 text-center font-mono text-xs text-ink-muted space-y-2">
          <RefreshCw size={24} className="mx-auto text-ice animate-spin" />
          <p className="text-ink font-medium">Feeding 41 features into Random Forest classifier pipeline...</p>
        </div>
      )}

      {idsResult && !isClassifying && (
        <div className="mt-6 space-y-4 rise-in">
          <div
            className={`flex items-center justify-between rounded-lg border p-4 ${
              idsResult.riskLevel === "SAFE"
                ? "border-mint/40 bg-mint/10 text-mint"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {idsResult.riskLevel === "SAFE" ? (
                <ShieldCheck size={28} className="shrink-0 text-mint" />
              ) : (
                <ShieldAlert size={28} className="shrink-0 text-red-400" />
              )}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider opacity-75">Classification Result</span>
                <h4 className="font-mono text-lg font-bold">{idsResult.attackClass}</h4>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs opacity-75">Prediction Latency</span>
              <p className="text-xl font-bold">{idsResult.latencyMs} ms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-line bg-obsidian p-4 font-mono text-xs">
              <h5 className="text-ice font-semibold mb-2 flex items-center gap-1.5">
                <BarChart2 size={14} /> Key Feature Importances
              </h5>
              <div className="space-y-2">
                {idsResult.featureImportances.map((feat) => (
                  <div key={feat.name}>
                    <div className="flex justify-between text-[11px] text-ink-muted mb-0.5">
                      <span>{feat.name}</span>
                      <span>{feat.weight}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-panel rounded-full overflow-hidden">
                      <div className="h-full bg-ice" style={{ width: `${feat.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-line bg-obsidian p-4 font-mono text-xs flex flex-col justify-between">
              <div>
                <h5 className="text-mint font-semibold mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Autonomous Defensive Mitigation
                </h5>
                <p className="text-ink-muted leading-relaxed text-[11px]">{idsResult.mitigation}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-ink-muted">
                <span>Model: Random Forest / XGBoost</span>
                <span className="text-mint font-semibold">{idsResult.confidence}% Confidence</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
