import { useState } from "react";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  ShieldCheck,
  X,
  FileText,
  Terminal,
  Zap,
  Lock,
  Search,
  BookOpen,
  CheckCircle2,
  Eye,
  Bot,
  Activity,
  GraduationCap,
  Twitter,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import ranjithPhoto from "@/assets/ranjith.jpg";
import threatMap from "@/assets/threat-map.jpg";

import { HoneypotSimulator } from "@/components/HoneypotSimulator";
import { PhishingDetectorDemo } from "@/components/PhishingDetectorDemo";
import { IdsSimulatorDemo } from "@/components/IdsSimulatorDemo";
import { PasswordVaultAnalyzer } from "@/components/PasswordVaultAnalyzer";
import { VulnerabilityScannerDemo } from "@/components/VulnerabilityScannerDemo";
import { ProjectModal, ProjectData } from "@/components/ProjectModal";
import { CertificationModal, CertificationData } from "@/components/CertificationModal";
import { ContactModal } from "@/components/ContactModal";
import { ResumeModal } from "@/components/ResumeModal";

const navItems = [
  { href: "#work", label: "Projects" },
  { href: "#demos", label: "Live Demos" },
  { href: "#timeline", label: "Experience" },
  { href: "#credentials", label: "Certifications" },
  { href: "#research", label: "Research" },
];

const projectsData: ProjectData[] = [
  {
    code: "P-01",
    status: "Presented",
    statusTone: "mint",
    title: "Multi-Layer Security Dashboard (MLSD)",
    description:
      "A real-time risk scoring engine that traps brute-force attacks in isolated honeypots with centralized telemetry logging. Presented at ICSEAIS 2026.",
    tags: ["Python", "Honeypot Architecture", "Threat Telemetry", "92% Accuracy"],
    fullDescription:
      "Engineered an enterprise decoy environment designed to deceive attackers while recording granular threat telemetry. Features automated dynamic IP quarantine, attack pattern classification via machine learning models, and real-time dashboard telemetry visualization.",
    keyFeatures: [
      "Dynamic honeypot isolation trapping 92%+ of malicious automated botnets",
      "Centralized syslog telemetry aggregation with zero leakage into production",
      "Real-time IP risk scoring and automated firewall block rule generation",
      "Presented peer-reviewed research at ICSEAIS 2026 international conference",
    ],
    impact: "Trapped 140+ active threat vectors in sandbox testing with 92% classification accuracy.",
    githubUrl: "https://github.com/RanjithCyber",
  },
  {
    code: "P-02",
    status: "Engineered",
    statusTone: "ice",
    title: "AI-Based Network Intrusion Detection System",
    description:
      "An ML-driven IDS trained on the NSL-KDD dataset to capture DoS and probe attacks through a Flask API and cloud-deployed Next.js visualization dashboard.",
    tags: ["Flask", "Next.js", "NSL-KDD", "Network Security"],
    fullDescription:
      "Built a network intrusion detection engine leveraging Random Forest and XGBoost trained on the benchmark NSL-KDD dataset. Detects probe, DoS, U2R, and R2L attacks in under 12ms per packet payload.",
    keyFeatures: [
      "Custom feature engineering pipeline optimizing 41 raw network packet attributes",
      "Sub-15ms packet anomaly classification for live network telemetry stream",
      "Flask REST API backend with secure CORS and token authorization",
    ],
    impact: "Achieved 94.8% detection sensitivity for Denial of Service (DoS) and port scan probes.",
    githubUrl: "https://github.com/RanjithCyber",
  },
  {
    code: "P-03",
    status: "Deployed",
    statusTone: "ember",
    title: "Phishing Detector Tool & AI Phishing Chatbot",
    description:
      "An AI-powered threat analysis platform scanning suspicious URLs, domain homoglyphs, and email NLP semantics with an interactive AI security assistant.",
    tags: ["AI Chatbot", "NLP", "Phishing Detection", "Homoglyph Audit"],
    fullDescription:
      "Combines heuristic URL inspection (domain age, TLD reputation, SSL validity) with Natural Language Processing semantics and PhishGuard AI Assistant to detect social engineering attacks.",
    keyFeatures: [
      "Automated homoglyph & typosquatting domain detection engine",
      "NLP sentiment analyzer detecting urgent credential harvesting triggers",
      "Interactive PhishGuard AI Chatbot assisting users with real-time threat queries",
    ],
    impact: "Identifies newly registered phishing domains within 300ms of analysis.",
    githubUrl: "https://github.com/RanjithCyber",
  },
  {
    code: "P-04",
    status: "Automated",
    statusTone: "ice",
    title: "CyberShield AI Vulnerability Scanner",
    description:
      "An automated web audit suite evaluating open ports, HTTPS misconfigurations, security headers, and RBAC with immutable audit logging.",
    tags: ["Vulnerability Assessment", "Python Flask", "RBAC"],
    fullDescription:
      "An automated audit platform designed to scan public perimeter surfaces, check SSL/TLS protocol strength, evaluate strict security headers (CSP, HSTS), and detect open port exposures.",
    keyFeatures: [
      "Automated header audit engine verifying CSP, HSTS, X-Frame-Options",
      "Asynchronous port availability scanner covering top 100 enterprise ports",
      "Role-Based Access Control (RBAC) enforced with cryptographically signed tokens",
    ],
    impact: "Scans web attack surfaces in under 5 seconds with automated remediation reports.",
    githubUrl: "https://github.com/RanjithCyber",
  },
  {
    code: "P-05",
    status: "Defensive lab",
    statusTone: "mint",
    title: "CyberShield Password Analyzer & Vault",
    description:
      "A credential defense engine analyzing Shannon entropy with live feedback loops, cryptographic token generation, and isolated frontend vault blocks.",
    tags: ["Entropy Analysis", "Cryptography", "Credential Defense"],
    fullDescription:
      "Built to combat credential stuffing and weak password adoption. Evaluates mathematical Shannon entropy in real-time, measures GPU cracking difficulty, and generates cryptographically secure pseudo-random tokens.",
    keyFeatures: [
      "Real-time Shannon entropy mathematical computation (bits)",
      "NIST 800-63B guidelines compliance checker",
      "Client-side zero-knowledge vault logic with crypto.getRandomValues()",
    ],
    impact: "Prevents brute-force vulnerabilities by enforcing entropy-based strength thresholds.",
    githubUrl: "https://github.com/RanjithCyber",
  },
];

const experiences = [
  {
    period: "Apr 2026 — May 2026",
    company: "Thiranex",
    role: "Cyber Security Analyst Intern",
    description:
      "Engineered automated vulnerability scanners and phishing detectors; conducted threat analysis through Pwn College dojos.",
    active: true,
  },
  {
    period: "Jan 2026 — Apr 2026",
    company: "VCodez",
    role: "Data Scientist Intern",
    description:
      "Built end-to-end data preprocessing pipelines and trained predictive ML models on enterprise datasets.",
  },
  {
    period: "Jun 2025",
    company: "Postulate Info Tech",
    role: "Security Analyst Intern",
    description:
      "Executed network perimeter audits, vulnerability scanning, and threat vector assessments.",
  },
  {
    period: "May 2024",
    company: "DCW Ltd",
    role: "Cybersecurity Professional Trainee",
    description:
      "Bolstered corporate security posture by deploying Zero Trust frameworks and AI-driven edge intrusion monitoring.",
  },
];

const certificationsData: CertificationData[] = [
  {
    code: "C-01",
    issuer: "EC-Council",
    title: "CEH v13 AI",
    detail: "Certified Ethical Hacker with AI threat techniques and offensive penetration testing skills.",
    skillsValidated: ["AI Threat Vectors", "Ethical Hacking", "Metasploit", "Vulnerability Scanning"],
    verificationId: "488207",
    issuedDate: "April 2026",
  },
  {
    code: "C-02",
    issuer: "Cybrary / CompTIA",
    title: "CompTIA CySA+",
    detail: "Security analytics, threat modeling, incident response, and log triage.",
    skillsValidated: ["SIEM Log Analysis", "Threat Hunting", "Incident Response", "Network Defense"],
    verificationId: "CC-f716ab2a-7816-44fb-981c-93dcf71c5789",
    issuedDate: "Jul 2, 2024",
  },
  {
    code: "C-03",
    issuer: "ISC2",
    title: "ISC2 CC",
    detail: "Cybersecurity fundamentals, access control, network defense, and risk management.",
    skillsValidated: ["Access Control", "Risk Management", "Business Continuity", "Network Security"],
    issuedDate: "Active Record",
  },
  {
    code: "C-04",
    issuer: "Alison Framework",
    title: "CompTIA Security+",
    detail: "Risk mitigation, enterprise defensive controls, and operational security.",
    skillsValidated: ["Enterprise Controls", "Threat Mitigation", "Cryptography", "Security Auditing"],
    issuedDate: "Active Record",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ranjith A | Cybersecurity Analyst & Threat Defense Portfolio" },
      {
        name: "description",
        content:
          "Official portfolio of Ranjith A — Cybersecurity Analyst, CEH v13 AI, CySA+, ICSEAIS 2026 author specializing in threat defense engineering.",
      },
      { property: "og:title", content: "Ranjith A | Cybersecurity Analyst Portfolio" },
      {
        property: "og:description",
        content:
          "Explore Ranjith A's threat defense projects, MLSD honeypot research, certifications, and interactive security tool demos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroView, setHeroView] = useState<"portrait" | "map">("portrait");
  const [activeDemoTab, setActiveDemoTab] = useState<"honeypot" | "phishing" | "ids" | "vault" | "scanner">("honeypot");

  // Modals state
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificationData | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-obsidian text-ink antialiased bg-cyber-grid selection:bg-ember/30 selection:text-ink">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-obsidian/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3 group" onClick={closeMenu}>
            <span className="relative flex size-2.5">
              <span className="status-dot absolute inline-flex size-full rounded-full bg-mint" />
              <span className="relative inline-flex size-2.5 rounded-full bg-mint/30" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide text-ink group-hover:text-ember transition-colors">
              ranjith.a
            </span>
            <span className="hidden font-mono text-xs tracking-wide text-ink-muted sm:inline">
              / threat defense
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-xs text-ink-muted transition-colors hover:text-ink hover:underline decoration-ember underline-offset-4"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setResumeOpen(true)}
              className="hidden items-center gap-1.5 rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-xs text-ink-muted transition-colors hover:border-ember hover:text-ink sm:inline-flex"
            >
              <FileText size={14} className="text-ice" /> View CV
            </button>

            <button
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-xs font-semibold text-obsidian ring-1 ring-ember transition-transform hover:-translate-y-0.5"
            >
              Contact / Hire Me
              <ArrowUpRight size={14} aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex size-9 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:text-ink md:hidden"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen ? (
          <nav className="border-t border-line px-6 py-4 md:hidden bg-obsidian" aria-label="Mobile navigation">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ember"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-line/60">
                <button
                  onClick={() => {
                    closeMenu();
                    setResumeOpen(true);
                  }}
                  className="inline-flex items-center gap-2 font-mono text-xs text-ice"
                >
                  <FileText size={14} /> View Formal CV / Resume
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    setContactOpen(true);
                  }}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ember font-semibold"
                >
                  Contact / Hire Me <ArrowUpRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-[1200px] px-6" id="top">
        {/* Hero Section */}
        <section className="grid grid-cols-1 gap-10 border-b border-line py-12 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 font-mono text-xs text-ember rise-in">
              <span className="size-2 rounded-full bg-ember animate-ping" />
              <span>Available for Cybersecurity &amp; SOC Roles · May 2026 Graduate</span>
            </div>

            <h1 className="mt-6 font-display text-[44px] leading-[1.02] text-ink md:text-[68px]">
              Ranjith A
              <span className="mt-2 block font-sans text-xl font-normal text-ink-muted md:text-2xl">
                Cybersecurity Analyst &amp; Threat Defense Engineer
              </span>
            </h1>

            <span className="draw-line mt-6 block h-px w-full max-w-[420px] bg-ember/70" />

            <p className="mt-6 max-w-[58ch] text-pretty text-base leading-relaxed text-ink-muted">
              B.Tech CSE Cyber Security (CGPA 8.03) graduate specializing in real-time threat intelligence automation, defensive network engineering, honeypot telemetry, and incident response. Author of security research presented at <span className="text-ink font-semibold">ICSEAIS 2026</span>.
            </p>

            {/* Academic Branding Pill */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line bg-panel p-2.5 font-mono text-xs text-ink-muted">
              <GraduationCap size={16} className="text-ice shrink-0" />
              <span className="font-semibold text-ink leading-snug">
                BS Abdur Rahman Crescent Institute of Science and Technology
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-semibold text-obsidian ring-1 ring-ember transition-transform hover:-translate-y-0.5"
              >
                Hire / Contact Me <ArrowUpRight size={16} aria-hidden="true" />
              </button>
              <a
                href="#demos"
                className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 hover:border-ice hover:text-ice"
              >
                <Terminal size={16} className="text-ice" /> Test Live Demos
              </a>
              <button
                onClick={() => setResumeOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-3 text-sm text-ink-muted transition-transform hover:-translate-y-0.5 hover:text-ink"
              >
                <FileText size={16} className="text-ember" /> Download Resume
              </button>
            </div>

            {/* Social & Contact Direct Links */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-ink-muted">
              <a
                href="https://github.com/RanjithCyber"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-mint"
              >
                <Github size={15} aria-hidden="true" /> github.com/RanjithCyber
              </a>
              <a
                href="https://x.com/Ranjith__A_"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-amber-400"
              >
                <Twitter size={15} aria-hidden="true" /> x.com/Ranjith__A_
              </a>
              <a
                href="https://www.linkedin.com/in/ranjith-a-961b3724b"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-ice"
              >
                <Linkedin size={15} aria-hidden="true" /> linkedin.com/in/ranjith-a-961b3724b
              </a>
              <a
                href="mailto:ranjith.csecyber@gmail.com"
                className="inline-flex items-center gap-2 transition-colors hover:text-ember"
              >
                <Mail size={15} aria-hidden="true" /> ranjith.csecyber@gmail.com
              </a>
            </div>
          </div>

          {/* Hero Portrait & Interactive Display Frame */}
          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-xl border border-line bg-panel shadow-2xl glow-ember">
              {/* Image Switcher Toggle Bar */}
              <div className="flex items-center justify-between border-b border-line bg-obsidian/90 px-4 py-2.5 font-mono text-xs">
                <span className="flex items-center gap-2 text-ink">
                  <ShieldCheck size={14} className="text-mint" />
                  <span>Ranjith A / Verified Profile</span>
                </span>
                <div className="flex rounded-md border border-line bg-panel p-0.5 text-[10px]">
                  <button
                    onClick={() => setHeroView("portrait")}
                    className={`rounded px-2.5 py-1 font-mono transition-colors ${
                      heroView === "portrait" ? "bg-ember text-obsidian font-bold" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setHeroView("map")}
                    className={`rounded px-2.5 py-1 font-mono transition-colors ${
                      heroView === "map" ? "bg-ember text-obsidian font-bold" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    Threat Radar
                  </button>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-obsidian">
                <img
                  src={heroView === "portrait" ? ranjithPhoto : threatMap}
                  alt={heroView === "portrait" ? "Ranjith A — Cybersecurity Analyst" : "Threat Radar Telemetry"}
                  className="size-full object-cover object-top transition-all duration-500"
                />

                {/* Subtle cyber scanline & gradient overlays */}
                <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent pointer-events-none" />

                {/* Live Status Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="rounded border border-line/80 bg-obsidian/80 px-2 py-1 text-ink backdrop-blur-sm">
                    {heroView === "portrait" ? "SOC Analyst · CEH v13 AI" : "MLSD Telemetry Signal"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded border border-mint/40 bg-mint/15 px-2 py-1 text-mint backdrop-blur-sm font-semibold">
                    <span className="status-dot size-1.5 rounded-full bg-mint" /> Active
                  </span>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-line/80 bg-obsidian/90 p-3.5 backdrop-blur-md">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-ink">B.Tech CSE Cyber Security</span>
                    <span className="text-mint font-bold">CGPA: 8.03</span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-ink-muted leading-tight font-medium">
                    BS Abdur Rahman Crescent Institute of Science and Technology
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1 font-mono text-[9px]">
                    <span className="rounded bg-panel border border-line px-1.5 py-0.5 text-ice">CEH v13 AI</span>
                    <span className="rounded bg-panel border border-line px-1.5 py-0.5 text-ice">CompTIA CySA+</span>
                    <span className="rounded bg-panel border border-line px-1.5 py-0.5 text-ice">ISC2 CC</span>
                    <span className="rounded bg-panel border border-line px-1.5 py-0.5 text-ember">ICSEAIS 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4" aria-label="Proof metrics">
          <Metric value="92%" label="MLSD Honeypot Trapping Accuracy" highlight="ICSEAIS 2026 Paper" />
          <Metric value="8.03" label="B.Tech Cyber Security CGPA" highlight="Crescent Institute" />
          <Metric value="384" label="Hands-on CTF Milestones Solved" highlight="Linux Luminarium &amp; Dojo" />
          <Metric value="4" label="Enterprise Internships Completed" highlight="Thiranex, VCodez, DCW" />
        </section>

        {/* Interactive Demos / Playground Section */}
        <section id="demos" className="scroll-mt-24 py-16">
          <SectionHeading index="01" title="Interactive Security Tools & Live Demos" aside="Test real-time code" />

          {/* Tab Selector */}
          <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
            <button
              onClick={() => setActiveDemoTab("honeypot")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs transition-colors ${
                activeDemoTab === "honeypot"
                  ? "bg-ember text-obsidian font-bold shadow-md"
                  : "border border-line bg-panel text-ink-muted hover:text-ink"
              }`}
            >
              <Zap size={14} /> 1. MLSD Honeypot Telemetry
            </button>
            <button
              onClick={() => setActiveDemoTab("phishing")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs transition-colors ${
                activeDemoTab === "phishing"
                  ? "bg-ember text-obsidian font-bold shadow-md"
                  : "border border-line bg-panel text-ink-muted hover:text-ink"
              }`}
            >
              <Bot size={14} /> 2. Phishing Detector &amp; AI Chatbot
            </button>
            <button
              onClick={() => setActiveDemoTab("ids")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs transition-colors ${
                activeDemoTab === "ids"
                  ? "bg-ember text-obsidian font-bold shadow-md"
                  : "border border-line bg-panel text-ink-muted hover:text-ink"
              }`}
            >
              <Activity size={14} /> 3. AI Intrusion Detection (NSL-KDD)
            </button>
            <button
              onClick={() => setActiveDemoTab("vault")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs transition-colors ${
                activeDemoTab === "vault"
                  ? "bg-ember text-obsidian font-bold shadow-md"
                  : "border border-line bg-panel text-ink-muted hover:text-ink"
              }`}
            >
              <Lock size={14} /> 4. Password Shannon Entropy Vault
            </button>
            <button
              onClick={() => setActiveDemoTab("scanner")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs transition-colors ${
                activeDemoTab === "scanner"
                  ? "bg-ember text-obsidian font-bold shadow-md"
                  : "border border-line bg-panel text-ink-muted hover:text-ink"
              }`}
            >
              <Search size={14} /> 5. CyberShield Web Audit
            </button>
          </div>

          {/* Active Demo Component View */}
          <div className="mt-6">
            {activeDemoTab === "honeypot" && <HoneypotSimulator />}
            {activeDemoTab === "phishing" && <PhishingDetectorDemo />}
            {activeDemoTab === "ids" && <IdsSimulatorDemo />}
            {activeDemoTab === "vault" && <PasswordVaultAnalyzer />}
            {activeDemoTab === "scanner" && <VulnerabilityScannerDemo />}
          </div>
        </section>

        {/* Flagship Projects Section */}
        <section id="work" className="scroll-mt-24 py-16">
          <SectionHeading index="02" title="Flagship Engineering Projects" aside="Click cards for deep dive" />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectsData.map((project) => (
              <article
                key={project.code}
                onClick={() => setSelectedProject(project)}
                className="group relative cursor-pointer rounded-xl border border-line bg-panel p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ember/60 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ember">{project.code}</span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-mint">
                      <span className="size-1.5 rounded-full bg-mint" /> {project.status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-ink group-hover:text-ember transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{project.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-line/80 bg-obsidian px-2 py-0.5 font-mono text-[10px] text-ink-muted group-hover:border-line"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 font-mono text-[11px] text-ink-muted">
                  <span className="inline-flex items-center gap-1 group-hover:text-ink">
                    <Eye size={13} className="text-ice" /> Inspect architecture
                  </span>
                  <ArrowUpRight size={14} className="text-ember transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section id="timeline" className="scroll-mt-24 py-16">
          <SectionHeading index="03" title="Professional Experience" aside="Cyber & Data Internships" />
          <ol className="relative mt-8 space-y-8 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-line md:before:left-[11px]">
            {experiences.map((experience) => (
              <li key={`${experience.company}-${experience.period}`} className="relative pl-10 md:pl-12">
                <span
                  className={`absolute left-0 top-1 size-3.5 rounded-full border-2 bg-obsidian ${
                    experience.active ? "border-ember bg-ember animate-pulse" : "border-line"
                  }`}
                />
                <span className="font-mono text-xs font-semibold text-ember">{experience.period}</span>
                <h3 className="mt-1 text-lg font-bold text-ink">
                  {experience.company} · <span className="text-ink-muted font-normal">{experience.role}</span>
                </h3>
                <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-ink-muted">
                  {experience.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Certifications Section */}
        <section id="credentials" className="scroll-mt-24 py-16">
          <SectionHeading index="04" title="Global Certifications & Credentials" aside="Click card to verify record" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certificationsData.map((cert) => (
              <article
                key={cert.code}
                onClick={() => setSelectedCert(cert)}
                className="group cursor-pointer rounded-xl border border-line bg-panel p-5 transition-all duration-200 hover:-translate-y-1 hover:border-mint/60"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ember">{cert.code}</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-mint">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  {cert.issuer}
                </p>
                <h3 className="mt-1 text-lg font-bold text-ink group-hover:text-mint transition-colors">
                  {cert.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{cert.detail}</p>
                {cert.verificationId ? (
                  <span className="mt-2.5 block font-mono text-[10px] text-ember truncate font-semibold">
                    ID: {cert.verificationId}
                  </span>
                ) : null}
                <div className="mt-4 font-mono text-[10px] text-ice flex items-center gap-1">
                  Click to inspect credential details →
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Research & Honors */}
        <section id="research" className="scroll-mt-24 py-16">
          <SectionHeading index="05" title="Research & Academic Honors" />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="rounded-xl border border-line bg-panel p-6">
              <div className="flex items-center gap-2 font-mono text-xs text-ice font-semibold">
                <BookOpen size={15} /> R-01 / PEER-REVIEWED CONFERENCE PRESENTATION
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink">
                Multi-Layer Security Dashboard (MLSD)
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Research presented at the International Conference on Sustainable Engineering and AI Solutions (ICSEAIS 2026), focusing on real-time honeypot decoy telemetry and machine-learning assisted threat vector isolation.
              </p>
            </article>

            <article className="rounded-xl border border-line bg-panel p-6">
              <div className="flex items-center gap-2 font-mono text-xs text-ice font-semibold">
                <ShieldCheck size={15} /> R-02 / PRACTICAL SECURITY CHALLENGES
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink">384 Hands-On Security Milestones Solved</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Practical work completed across Linux Luminarium, Computing 101, and Playing With Programs dojos, building deep system-level fluency across binary exploitation, reverse engineering, and defensive scripting.
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-line bg-obsidian">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl font-bold text-ink">Ranjith A</p>
            <p className="mt-2 max-w-[55ch] text-sm leading-relaxed text-ink-muted">
              B.Tech CSE Cyber Security · CGPA 8.03 · <span className="text-ink font-medium">BS Abdur Rahman Crescent Institute of Science and Technology</span>
            </p>
          </div>

          <div className="flex flex-col gap-2.5 font-mono text-xs">
            <button
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 text-ember hover:underline font-semibold text-left"
            >
              <Mail size={14} aria-hidden="true" /> Open Direct Contact Form
            </button>
            <a
              href="mailto:ranjith.csecyber@gmail.com"
              className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ember"
            >
              <Mail size={14} aria-hidden="true" /> ranjith.csecyber@gmail.com
            </a>
            <a
              href="https://x.com/Ranjith__A_"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-amber-400"
            >
              <Twitter size={14} aria-hidden="true" /> x.com/Ranjith__A_
            </a>
            <a
              href="https://www.linkedin.com/in/ranjith-a-961b3724b"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ice"
            >
              <Linkedin size={14} aria-hidden="true" /> linkedin.com/in/ranjith-a-961b3724b
            </a>
            <a
              href="https://github.com/RanjithCyber"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-mint"
            >
              <Github size={14} aria-hidden="true" /> github.com/RanjithCyber
            </a>
          </div>
        </div>

        <div className="border-t border-line/60 py-4">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 font-mono text-[11px] text-ink-muted/60">
            <span>© 2026 Ranjith A · Defensive Threat Engineering</span>
            <span className="inline-flex items-center gap-1.5 text-mint">
              <span className="status-dot size-1.5 rounded-full bg-mint" /> Systems nominal
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <CertificationModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}

function Metric({ value, label, highlight }: { value: string; label: string; highlight?: string }) {
  return (
    <div className="bg-panel p-6">
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-muted">{label}</p>
      {highlight && <span className="mt-2 block font-mono text-[10px] text-ember font-semibold">{highlight}</span>}
    </div>
  );
}

function SectionHeading({ index, title, aside }: { index: string; title: string; aside?: string }) {
  return (
    <div className="flex items-end justify-between border-b border-line pb-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-ink-muted">
        {index} / {title}
      </h2>
      {aside ? <span className="hidden font-mono text-xs text-ember font-medium sm:inline">{aside}</span> : null}
    </div>
  );
}