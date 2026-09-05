import { useState } from "react";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import threatMap from "@/assets/threat-map.jpg";

const navItems = [
  { href: "#work", label: "Work" },
  { href: "#timeline", label: "Timeline" },
  { href: "#credentials", label: "Credentials" },
  { href: "#research", label: "Research" },
];

const projects = [
  {
    code: "P-01",
    status: "Presented",
    statusTone: "mint",
    title: "Multi-Layer Security Dashboard (MLSD)",
    description:
      "A real-time risk scoring engine that traps brute-force attacks in isolated honeypots with centralized telemetry logging. Presented at ICSEAIS 2026.",
    tags: ["Python", "Honeypot Architecture", "Threat Telemetry", "92% Accuracy"],
  },
  {
    code: "P-02",
    status: "Engineered",
    statusTone: "ice",
    title: "AI-Based Network Intrusion Detection System",
    description:
      "An ML-driven IDS trained on the NSL-KDD dataset to capture DoS and probe attacks through a Flask API and cloud-deployed Next.js visualization dashboard.",
    tags: ["Flask", "Next.js", "NSL-KDD", "Network Security"],
  },
  {
    code: "P-03",
    status: "Automated",
    statusTone: "ember",
    title: "CyberShield AI Vulnerability Scanner",
    description:
      "An automated web audit suite evaluating open ports, HTTPS misconfigurations, security headers, and RBAC with immutable audit logging.",
    tags: ["Vulnerability Assessment", "Python Flask", "RBAC"],
  },
  {
    code: "P-04",
    status: "Defensive lab",
    statusTone: "mint",
    title: "CyberShield Password Analyzer & Vault",
    description:
      "A credential defense engine analyzing Shannon entropy with live feedback loops, cryptographic token generation, and isolated frontend vault blocks.",
    tags: ["Entropy Analysis", "Cryptography", "Credential Defense"],
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

const certifications = [
  {
    code: "C-01",
    issuer: "EC-Council",
    title: "CEH v13 AI",
    detail: "Certified Ethical Hacker with AI threat techniques",
  },
  {
    code: "C-02",
    issuer: "Cybrary / CompTIA",
    title: "CompTIA CySA+",
    detail: "Security analytics, threat modeling, and log triage",
  },
  {
    code: "C-03",
    issuer: "ISC2",
    title: "ISC2 CC",
    detail: "Cybersecurity fundamentals and access control",
  },
  {
    code: "C-04",
    issuer: "Alison Framework",
    title: "CompTIA Security+",
    detail: "Risk mitigation and enterprise defensive controls",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ranjith A | Cybersecurity Portfolio" },
      {
        name: "description",
        content:
          "Explore Ranjith A's cybersecurity projects, certifications, internships, research, and threat defense engineering work.",
      },
      { property: "og:title", content: "Ranjith A | Cybersecurity Portfolio" },
      {
        property: "og:description",
        content:
          "Explore Ranjith A's cybersecurity projects, certifications, internships, research, and threat defense engineering work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-obsidian text-ink antialiased">
      <header className="sticky top-0 z-50 border-b border-line bg-obsidian/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3" onClick={closeMenu}>
            <span className="relative flex size-2.5">
              <span className="status-dot absolute inline-flex size-full rounded-full bg-mint" />
              <span className="relative inline-flex size-2.5 rounded-full bg-mint/30" />
            </span>
            <span className="font-mono text-xs tracking-wide text-ink">ranjith.a</span>
            <span className="hidden font-mono text-xs tracking-wide text-ink-muted sm:inline">
              / threat defense
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-xs text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="mailto:ranjith.csecyber@gmail.com"
              className="hidden items-center gap-2 rounded-sm bg-ember px-3.5 py-2 text-sm font-medium text-obsidian ring-1 ring-ember transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Contact / Hire Me
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex size-9 items-center justify-center rounded-sm border border-line text-ink-muted transition-colors hover:text-ink md:hidden"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            className="border-t border-line px-6 py-4 md:hidden"
            aria-label="Mobile navigation"
          >
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
              <a
                href="mailto:ranjith.csecyber@gmail.com"
                onClick={closeMenu}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ember"
              >
                Contact / Hire Me <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-[1200px] px-6" id="top">
        <section className="grid grid-cols-1 gap-10 border-b border-line py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <p className="rise-in font-mono text-xs uppercase tracking-[0.25em] text-ember">
              Available for full-time cybersecurity &amp; SOC roles · May 2026 graduate
            </p>
            <h1 className="mt-6 font-display text-[48px] leading-[0.98] text-ink text-balance md:text-[76px]">
              Ranjith A
              <span className="mt-2 block text-[0.68em] leading-[1.05] text-ink-muted">
                Cybersecurity Analyst &amp; Threat Defense Engineer
              </span>
            </h1>
            <span className="draw-line mt-7 block h-px w-full max-w-[420px] bg-ember/70" />
            <p className="mt-7 max-w-[55ch] text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
              B.Tech CSE (Cyber Security) graduate specializing in threat intelligence
              automation, defensive web architectures, and incident response. Bridging
              machine learning with defensive network engineering.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-sm bg-ember px-4 py-2.5 text-sm font-medium text-obsidian ring-1 ring-ember transition-transform hover:-translate-y-0.5"
              >
                View projects <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/in/ranjith-a-961b3724b"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-line px-4 py-2.5 text-sm text-ink-muted transition-transform hover:-translate-y-0.5 hover:text-ink"
              >
                <Linkedin size={15} aria-hidden="true" /> LinkedIn
              </a>
            </div>
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
                href="mailto:ranjith.csecyber@gmail.com"
                className="inline-flex items-center gap-2 transition-colors hover:text-ember"
              >
                <Mail size={15} aria-hidden="true" /> ranjith.csecyber@gmail.com
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-lg border border-line bg-panel-2">
              <img
                src={threatMap}
                alt="Abstract threat map with connected telemetry nodes and an amber signal point"
                width={1024}
                height={1280}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ember/15 to-transparent" />
              <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
                <span>Threat surface / 0x21A0</span>
                <span className="inline-flex items-center gap-1.5 text-mint">
                  <span className="status-dot size-1.5 rounded-full bg-mint" /> Active
                </span>
              </div>
              <div className="absolute inset-x-5 bottom-5 border border-line/80 bg-obsidian/85 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  <ShieldCheck size={14} className="text-mint" aria-hidden="true" />
                  Defensive engineering / live signal
                </div>
                <p className="mt-2 font-mono text-xs leading-relaxed text-ink">
                  Detect · contain · learn · harden
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4" aria-label="Proof metrics">
          <Metric value="92%" label="MLSD honeypot detection accuracy" />
          <Metric value="384" label="Hands-on CTF milestones resolved" />
          <Metric value="4" label="Enterprise security & data internships" />
          <div className="bg-panel p-6">
            <p className="font-display text-3xl text-ink">3rd</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-muted">
              Campus-wide CTF place
            </p>
          </div>
        </section>

        <section id="work" className="scroll-mt-24 py-20">
          <SectionHeading index="01" title="Flagship engineering projects" aside="proof of work" />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.code} project={project} />
            ))}
          </div>
        </section>

        <section id="timeline" className="scroll-mt-24 py-20">
          <SectionHeading index="02" title="Professional experience" />
          <ol className="relative mt-8 space-y-10 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-line md:before:left-[11px]">
            {experiences.map((experience) => (
              <li key={`${experience.company}-${experience.period}`} className="relative pl-10 md:pl-12">
                <span
                  className={`absolute left-0 top-1 size-3.5 rounded-full border-2 bg-obsidian ${
                    experience.active ? "border-ember" : "border-line"
                  }`}
                />
                <p className="font-mono text-xs text-ember">{experience.period}</p>
                <h3 className="mt-1 text-lg font-medium text-ink">
                  {experience.company} · {experience.role}
                </h3>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-muted">
                  {experience.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section id="credentials" className="scroll-mt-24 py-20">
          <SectionHeading index="03" title="Global certifications & badges" aside="verified records" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((certification) => (
              <article key={certification.code} className="rounded-lg border border-line bg-panel p-5 transition-transform duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ember">{certification.code}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-mint">
                    <span className="size-1.5 rounded-full bg-mint" /> Verified
                  </span>
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  {certification.issuer}
                </p>
                <h3 className="mt-2 text-lg font-medium text-ink">{certification.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{certification.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="research" className="scroll-mt-24 py-20">
          <SectionHeading index="04" title="Research & honors" />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-line bg-panel p-6">
              <span className="font-mono text-xs text-ice">R-01 / PRESENTATION</span>
              <h3 className="mt-4 text-xl font-medium text-ink">
                Multi-Layer Security Dashboard (MLSD)
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Research presented at the International Conference on Sustainable Engineering and AI Solutions (ICSEAIS 2026), focused on real-time honeypot telemetry and machine-learning assisted threat detection.
              </p>
            </article>
            <article className="rounded-lg border border-line bg-panel p-6">
              <span className="font-mono text-xs text-ice">R-02 / PRACTICE</span>
              <h3 className="mt-4 text-xl font-medium text-ink">384 hands-on challenges resolved</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Practical work completed across Linux Luminarium, Computing 101, and Playing With Programs, building fluency across systems, programming, and defensive problem-solving.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl text-ink">Ranjith A</p>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-muted">
              B.Tech CSE Cyber Security · CGPA 8.03 · BS Abdur Rahman Crescent Institute of Science and Technology
            </p>
          </div>
          <div className="flex flex-col gap-2 font-mono text-xs">
            <a href="mailto:ranjith.csecyber@gmail.com" className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ember">
              <Mail size={14} aria-hidden="true" /> ranjith.csecyber@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/ranjith-a-961b3724b" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ember">
              <Linkedin size={14} aria-hidden="true" /> linkedin.com/in/ranjith-a-961b3724b
            </a>
            <a href="https://github.com/RanjithCyber" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ember">
              <Github size={14} aria-hidden="true" /> github.com/RanjithCyber
            </a>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4 font-mono text-[11px] text-ink-muted/60">
            <span>© 2026 Ranjith A</span>
            <span className="inline-flex items-center gap-1.5"><span className="status-dot size-1.5 rounded-full bg-mint" /> Systems nominal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-panel p-6">
      <p className="font-display text-3xl text-ink">{value}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-muted">{label}</p>
    </div>
  );
}

function SectionHeading({ index, title, aside }: { index: string; title: string; aside?: string }) {
  return (
    <div className="flex items-end justify-between border-b border-line pb-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
        {index} / {title}
      </h2>
      {aside ? <span className="hidden font-mono text-xs text-ink-muted/60 sm:inline">{aside}</span> : null}
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const toneClass = {
    mint: "text-mint",
    ice: "text-ice",
    ember: "text-ember",
  }[project.statusTone];

  return (
    <article className="rounded-lg border border-line bg-panel p-6 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ember">{project.code}</span>
        <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${toneClass}`}>
          <span className="size-1.5 rounded-full bg-current" /> {project.status}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-medium text-ink">{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-sm border border-line px-2 py-1 font-mono text-[11px] text-ink-muted">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}