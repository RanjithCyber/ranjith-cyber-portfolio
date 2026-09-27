import { useState } from "react";
import {
  X,
  ExternalLink,
  Github,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Terminal,
  ShieldAlert,
  Award,
  AlertTriangle,
  FileCode,
  Key,
  Flame,
  ArrowRight,
} from "lucide-react";

export interface CTFReportData {
  competition: string;
  date: string;
  cpeCredits: string;
  target: string;
  environment: string;
  headline?: string;
  executiveSummary: string;
  objectives: string[];
  toolsUsed: { tool: string; purpose: string }[];
  methodology: {
    number: number;
    title: string;
    description: string;
    codeSnippet?: string;
    details?: string[];
    link?: { label: string; url: string };
  }[];
  findings: { challenge: number; finding: string }[];
  securityImpact: string[];
  keyLearningOutcomes: string[];
  remediationRecommendations: string[];
  conclusion: string;
  skillsDemonstrated: string[];
  certificateText?: string;
}

export interface ProjectData {
  code: string;
  status: string;
  statusTone: string;
  title: string;
  description: string;
  tags: string[];
  fullDescription?: string;
  architecture?: string[];
  keyFeatures?: string[];
  impact?: string;
  githubUrl?: string;
  githubUrls?: { label: string; url: string }[];
  demoUrl?: string;
  ctfReport?: CTFReportData;
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"executive" | "methodology" | "findings" | "remediation" | "certificate">("executive");

  if (!project) return null;

  const isCTF = Boolean(project.ctfReport);
  const ctf = project.ctfReport;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-md animate-fade-in">
      <div
        className={`relative max-h-[92vh] w-full overflow-y-auto rounded-xl border border-line bg-panel p-6 shadow-2xl scrollbar-thin ${
          isCTF ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-line bg-obsidian p-2 text-ink-muted transition-colors hover:text-ink cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Standard Project View */}
        {!isCTF && (
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-ember">{project.code}</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-mint">
                <span className="size-1.5 rounded-full bg-mint" /> {project.status}
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold text-ink">{project.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-line bg-obsidian/60 px-2.5 py-1 font-mono text-xs text-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-5 border-t border-line pt-5">
              {project.fullDescription && (
                <div>
                  <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ember">
                    <Layers size={14} /> Technical Overview
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.fullDescription}</p>
                </div>
              )}

              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ice font-semibold">
                    <CheckCircle2 size={14} /> Key Security Engineering Capabilities
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {project.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-ink-muted">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-ice" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.impact && (
                <div className="rounded-lg border border-mint/30 bg-mint/10 p-4">
                  <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mint font-semibold">
                    <ShieldCheck size={14} /> Measured Defense & Research Impact
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink">{project.impact}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <div className="flex flex-wrap items-center gap-2">
                {project.githubUrls && project.githubUrls.length > 0 ? (
                  project.githubUrls.map((repo, idx) => (
                    <a
                      key={idx}
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-line bg-obsidian px-3.5 py-2 font-mono text-xs font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-ember hover:text-ember"
                    >
                      <Github size={15} /> {repo.label}
                      <ExternalLink size={12} className="text-ink-muted" />
                    </a>
                  ))
                ) : project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-line bg-obsidian px-4 py-2 font-mono text-xs font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-ember hover:text-ember"
                  >
                    <Github size={15} /> GitHub Repository
                    <ExternalLink size={12} className="text-ink-muted" />
                  </a>
                ) : null}

                {project.code === "P-01" && (
                  <span className="font-mono text-xs text-ink-muted flex items-center gap-1.5 rounded border border-line/70 bg-obsidian/70 px-2.5 py-1.5">
                    <ShieldCheck size={14} className="text-mint" /> Peer-Reviewed Research · ICSEAIS 2026
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-ember px-4 py-2 font-mono text-xs font-medium text-obsidian transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                Close Overview
              </button>
            </div>
          </div>
        )}

        {/* Enhanced CTF Security Assessment View */}
        {isCTF && ctf && (
          <div>
            {/* CTF Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/15 px-3 py-1 font-mono text-xs font-bold text-ember">
                <ShieldAlert size={14} /> {ctf.competition}
              </span>
              <span className="rounded border border-mint/40 bg-mint/10 px-2.5 py-1 font-mono text-xs font-semibold text-mint">
                {ctf.cpeCredits}
              </span>
              <span className="rounded border border-line bg-obsidian px-2.5 py-1 font-mono text-xs text-ink-muted">
                Date: <span className="text-ink">{ctf.date}</span>
              </span>
              <span className="rounded border border-line bg-obsidian px-2.5 py-1 font-mono text-xs text-ink-muted">
                Target: <span className="text-ice font-semibold">{ctf.target}</span>
              </span>
              <span className="rounded border border-line bg-obsidian px-2.5 py-1 font-mono text-xs text-ink-muted">
                OS: <span className="text-ink">{ctf.environment}</span>
              </span>
            </div>

            {/* Assessment Title & Headline */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-ember">{project.code}</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-mint font-semibold">
                  <span className="size-1.5 rounded-full bg-mint" /> {project.status}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
                {project.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Quick Attack Chain Indicator */}
            <div className="mt-5 rounded-lg border border-line bg-obsidian/70 p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted/80 mb-2">
                Demonstrated Exploit &amp; Escalation Kill-Chain:
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="rounded bg-panel border border-line px-2 py-1 text-ink">Web App</span>
                <ArrowRight size={12} className="text-ember" />
                <span className="rounded bg-panel border border-line px-2 py-1 text-ember font-semibold">Next.js 16.0.6</span>
                <ArrowRight size={12} className="text-ember" />
                <span className="rounded bg-panel border border-line px-2 py-1 text-ice font-semibold">React2Shell (CVE-2025-66478)</span>
                <ArrowRight size={12} className="text-ember" />
                <span className="rounded bg-panel border border-line px-2 py-1 text-yellow-400 font-semibold">RCE (nodejs_user)</span>
                <ArrowRight size={12} className="text-ember" />
                <span className="rounded bg-panel border border-line px-2 py-1 text-amber-400 font-semibold">sudo npm NOPASSWD</span>
                <ArrowRight size={12} className="text-ember" />
                <span className="rounded bg-mint/15 border border-mint/40 px-2 py-1 text-mint font-bold">Root Privileges (#)</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-3 font-mono text-xs">
              <button
                onClick={() => setActiveTab("executive")}
                className={`rounded-lg px-3.5 py-2 transition-colors cursor-pointer ${
                  activeTab === "executive" ? "bg-ember font-bold text-obsidian" : "bg-obsidian border border-line text-ink-muted hover:text-ink"
                }`}
              >
                1. Executive Summary
              </button>
              <button
                onClick={() => setActiveTab("methodology")}
                className={`rounded-lg px-3.5 py-2 transition-colors cursor-pointer ${
                  activeTab === "methodology" ? "bg-ember font-bold text-obsidian" : "bg-obsidian border border-line text-ink-muted hover:text-ink"
                }`}
              >
                2. Methodology (6 Stages)
              </button>
              <button
                onClick={() => setActiveTab("findings")}
                className={`rounded-lg px-3.5 py-2 transition-colors cursor-pointer ${
                  activeTab === "findings" ? "bg-ember font-bold text-obsidian" : "bg-obsidian border border-line text-ink-muted hover:text-ink"
                }`}
              >
                3. Findings &amp; Root Proof
              </button>
              <button
                onClick={() => setActiveTab("remediation")}
                className={`rounded-lg px-3.5 py-2 transition-colors cursor-pointer ${
                  activeTab === "remediation" ? "bg-ember font-bold text-obsidian" : "bg-obsidian border border-line text-ink-muted hover:text-ink"
                }`}
              >
                4. Remediation &amp; Defense
              </button>
              <button
                onClick={() => setActiveTab("certificate")}
                className={`rounded-lg px-3.5 py-2 transition-colors cursor-pointer ${
                  activeTab === "certificate" ? "bg-mint font-bold text-obsidian" : "bg-obsidian border border-line text-mint hover:bg-mint/10"
                }`}
              >
                5. Certificate &amp; CPE (1 Credit)
              </button>
            </div>

            {/* Tab 1: Executive Summary */}
            {activeTab === "executive" && (
              <div className="mt-6 space-y-6 animate-fade-in text-xs leading-relaxed text-ink-muted">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-ember font-semibold flex items-center gap-2">
                    <ShieldAlert size={15} /> Executive Summary
                  </h3>
                  <p className="mt-2 text-ink text-sm leading-relaxed">
                    {ctf.executiveSummary}
                  </p>
                </div>

                {/* Objectives */}
                <div className="rounded-lg border border-line bg-obsidian/70 p-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-ice font-semibold mb-3">
                    Assessment Objectives
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {ctf.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-mint shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools Used Grid */}
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-3">
                    Offensive Security Tooling &amp; Environment
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {ctf.toolsUsed.map((tool, i) => (
                      <div key={i} className="rounded-lg border border-line bg-obsidian p-2.5">
                        <span className="font-mono font-bold text-ember text-xs block">{tool.tool}</span>
                        <span className="text-[11px] text-ink-muted">{tool.purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Impact */}
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-xs">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-red-400 font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle size={15} /> Quantified Security Impact
                  </h4>
                  <p className="text-ink-muted mb-3">
                    In an enterprise production deployment, successful exploitation would expose:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ctf.securityImpact.map((impact, i) => (
                      <div key={i} className="flex items-center gap-2 text-ink">
                        <Flame size={12} className="text-red-400 shrink-0" />
                        <span>{impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Methodology (6 Stages) */}
            {activeTab === "methodology" && (
              <div className="mt-6 space-y-6 animate-fade-in">
                {ctf.methodology.map((m) => (
                  <div key={m.number} className="rounded-lg border border-line bg-obsidian/80 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-2.5">
                      <h4 className="font-mono text-xs font-bold text-ember">
                        {m.title}
                      </h4>
                      {m.link && (
                        <a
                          href={m.link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-ice hover:underline"
                        >
                          {m.link.label} <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ink-muted">{m.description}</p>
                    {m.codeSnippet && (
                      <div className="mt-3 rounded border border-line/60 bg-black p-3 font-mono text-[11px] text-gray-200 overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{m.codeSnippet}</pre>
                      </div>
                    )}
                    {m.details && (
                      <ul className="mt-3 space-y-1.5 text-xs text-ink-muted">
                        {m.details.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-ice shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Findings & Root Proof */}
            {activeTab === "findings" && (
              <div className="mt-6 space-y-6 animate-fade-in">
                <div className="overflow-x-auto rounded-lg border border-line bg-obsidian">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="border-b border-line bg-panel text-ink-muted uppercase text-[10px]">
                      <tr>
                        <th className="p-3 w-16">Challenge #</th>
                        <th className="p-3">Verified Finding</th>
                        <th className="p-3 text-right">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60">
                      {ctf.findings.map((f) => (
                        <tr key={f.challenge} className="hover:bg-panel/50">
                          <td className="p-3 text-ember font-bold">{f.challenge}</td>
                          <td className="p-3 text-ink font-semibold">{f.finding}</td>
                          <td className="p-3 text-right text-mint font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 size={12} /> Solved
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Command Execution Proof */}
                <div className="rounded-lg border border-line bg-black p-4 font-mono text-xs">
                  <div className="text-[10px] uppercase text-mint font-bold mb-2">
                    Verified Target Shell Evidence:
                  </div>
                  <pre className="whitespace-pre-wrap text-[11px] text-gray-300 leading-relaxed">
{`# 1. RCE Foothold verification:
$ id
uid=1001(nodejs_user) gid=1001(nodejs_user) groups=1001(nodejs_user)

# 2. Local Privilege Triage:
$ sudo -l
Matching Defaults entries for nodejs_user on ctf-target:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin
User nodejs_user may run the following commands on ctf-target:
    (ALL : ALL) NOPASSWD: /usr/bin/npm

# 3. Escalation to Root:
$ sudo /usr/bin/npm ...
# id
uid=0(root) gid=0(root) groups=0(root)
# whoami
root
# cat /root/proof.txt
[+] CTF Flag Successfully Retrieved!`}
                  </pre>
                </div>

                <div className="rounded-lg border border-mint/30 bg-mint/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-mint shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-mint font-mono">Proof of Compromise Accepted</span>
                      <p className="text-[11px] text-ink-muted">
                        All 7 challenge milestones solved; full unauthenticated server takeover demonstrated.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-mint font-bold">100% Score</span>
                </div>
              </div>
            )}

            {/* Tab 4: Remediation & Defense */}
            {activeTab === "remediation" && (
              <div className="mt-6 space-y-6 animate-fade-in text-xs leading-relaxed">
                <div className="rounded-lg border border-line bg-obsidian/70 p-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-mint font-semibold mb-2">
                    Hardening Recommendations for Production Next.js Deployments
                  </h4>
                  <ul className="mt-3 space-y-2.5 text-ink-muted">
                    {ctf.remediationRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-mint" />
                        <span className="text-ink">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-line bg-panel p-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-ice font-semibold mb-2">
                    Key Learning &amp; Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-ink-muted">
                    {ctf.keyLearningOutcomes.map((lo, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 text-ice font-bold">•</span>
                        <span>{lo}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-line/60 pt-3 text-[11px] text-ink italic leading-relaxed">
                    "{ctf.conclusion}"
                  </p>
                </div>
              </div>
            )}

            {/* Tab 5: Certificate & CPE */}
            {activeTab === "certificate" && (
              <div className="mt-6 space-y-6 animate-fade-in">
                <div className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-br from-panel via-obsidian to-panel p-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-xl border border-mint/40 bg-mint/15 text-mint shadow-md">
                        <Award size={24} />
                      </div>
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-mint font-semibold">
                          Official Certificate of CTF Achievement
                        </span>
                        <h4 className="text-lg font-bold text-ink sm:text-xl">
                          EC-Council Hackerverse CTF Competition
                        </h4>
                      </div>
                    </div>
                    <div className="sm:text-right font-mono text-xs">
                      <span className="rounded bg-mint/20 border border-mint/40 px-3 py-1 font-bold text-mint block">
                        1 CPE Credit Awarded
                      </span>
                      <span className="text-ink-muted text-[10px] mt-1 block">Issued: 27 September 2026</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 font-mono text-xs text-ink-muted">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded border border-line bg-obsidian p-3">
                        <span className="text-[10px] text-ink-muted block">CANDIDATE</span>
                        <span className="text-ink font-bold text-sm">Ranjith A</span>
                        <span className="text-[11px] text-ice block mt-0.5">Cybersecurity Analyst &amp; Threat Defense Engineer</span>
                      </div>
                      <div className="rounded border border-line bg-obsidian p-3">
                        <span className="text-[10px] text-ink-muted block">CHALLENGE TRACK</span>
                        <span className="text-ember font-bold text-sm">React2Shell</span>
                        <span className="text-[11px] text-ink-muted block mt-0.5">Next.js 16.0.6 RCE &amp; Sudo Root PrivEsc</span>
                      </div>
                    </div>

                    <div className="rounded border border-line bg-obsidian p-3">
                      <span className="text-[10px] text-ink-muted block">VERIFIED SKILLS DEMONSTRATED</span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {ctf.skillsDemonstrated.map((sk) => (
                          <span key={sk} className="rounded border border-line/80 bg-panel px-2 py-0.5 text-[11px] text-ice">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-line pt-4 font-mono text-xs text-ink-muted">
                    <span className="flex items-center gap-1.5 text-mint font-semibold">
                      <CheckCircle2 size={14} /> Authorized CTF Testing Environment · Kali Linux
                    </span>
                    <span className="text-[11px] text-ink-muted/80">
                      EC-Council Hackerverse CTF #React2Shell
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
                <ShieldCheck size={15} className="text-mint" />
                <span>Authorized CTF Target (10.10.1.10) · Competition Lab</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-ember px-5 py-2 font-mono text-xs font-semibold text-obsidian transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
