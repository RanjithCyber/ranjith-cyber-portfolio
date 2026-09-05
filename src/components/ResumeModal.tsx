import { X, Download, Printer, FileText, CheckCircle2, Briefcase, GraduationCap, Award, Shield } from "lucide-react";
import ranjithPhoto from "@/assets/ranjith.jpg";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-md animate-fade-in print:bg-white print:p-0">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-line bg-panel p-6 shadow-2xl scrollbar-thin print:max-h-none print:w-full print:border-none print:bg-white print:p-0 print:text-black">
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-line pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-ember" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
              Ranjith A — Formal Curriculum Vitae
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-obsidian px-3 py-1.5 font-mono text-xs text-ink-muted hover:text-ink transition-colors"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-line bg-obsidian p-1.5 text-ink-muted hover:text-ink transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Resume Content Body */}
        <div className="mt-6 space-y-6 text-ink print:text-black print:mt-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-line/70 pb-6 print:border-black/20">
            <div className="flex items-center gap-4">
              <img
                src={ranjithPhoto}
                alt="Ranjith A"
                className="size-20 rounded-full border-2 border-ember object-cover object-top shrink-0 shadow-md print:size-16"
              />
              <div>
                <h1 className="font-display text-3xl font-bold text-ink print:text-black">Ranjith A</h1>
                <p className="font-mono text-xs text-ember font-semibold print:text-gray-800">
                  Cybersecurity Analyst & Threat Defense Engineer
                </p>
                <p className="mt-1 text-xs text-ink-muted print:text-gray-600">
                  Chennai, Tamil Nadu, India · ranjith.csecyber@gmail.com
                </p>
              </div>
            </div>
            <div className="font-mono text-xs text-ink-muted sm:text-right space-y-1 print:text-black">
              <p>
                <a href="https://linkedin.com/in/ranjith-a-961b3724b" target="_blank" rel="noreferrer" className="hover:text-ember">
                  linkedin.com/in/ranjith-a-961b3724b
                </a>
              </p>
              <p>
                <a href="https://x.com/Ranjith__A_" target="_blank" rel="noreferrer" className="hover:text-ember">
                  x.com/Ranjith__A_
                </a>
              </p>
              <p>
                <a href="https://github.com/RanjithCyber" target="_blank" rel="noreferrer" className="hover:text-ember">
                  github.com/RanjithCyber
                </a>
              </p>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ember font-bold print:text-black border-b border-line/50 pb-1">
              Executive Profile
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted print:text-gray-800">
              B.Tech CSE (Cyber Security) graduate with CGPA 8.03. Proven hands-on expertise in threat intelligence automation, defensive network engineering, SIEM logging, honeypot decoy deployment, and machine learning based intrusion detection. Author of security research presented at ICSEAIS 2026. Certified CEH v13 AI, CompTIA CySA+, and ISC2 CC holder.
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ice font-bold print:text-black border-b border-line/50 pb-1 flex items-center gap-1.5">
              <GraduationCap size={14} /> Education &amp; Academic Distinction
            </h2>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-ink print:text-black text-sm leading-snug tracking-tight">
                    BS Abdur Rahman Crescent Institute of Science and Technology
                  </h3>
                  <p className="text-ink-muted print:text-gray-700 text-xs">
                    B.Tech in Computer Science &amp; Engineering (Specialization: Cyber Security)
                  </p>
                </div>
                <div className="sm:text-right font-mono shrink-0 bg-obsidian/70 border border-line/60 rounded px-2.5 py-1 print:bg-transparent print:border-none">
                  <span className="text-mint font-bold print:text-black">CGPA: 8.03</span>
                  <p className="text-[10px] text-ink-muted print:text-gray-500">Graduation: May 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ember font-bold print:text-black border-b border-line/50 pb-1 flex items-center gap-1.5">
              <Briefcase size={14} /> Practical Experience
            </h2>
            <div className="mt-3 space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold">
                  <span className="text-ink print:text-black">Thiranex — Cyber Security Analyst Intern</span>
                  <span className="font-mono text-ember text-[11px] print:text-gray-700">Apr 2026 – May 2026</span>
                </div>
                <p className="mt-1 text-ink-muted print:text-gray-700 leading-relaxed">
                  Engineered automated vulnerability scanners and phishing detectors; conducted threat analysis through Pwn College dojos.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-semibold">
                  <span className="text-ink print:text-black">VCodez — Data Scientist Intern</span>
                  <span className="font-mono text-ember text-[11px] print:text-gray-700">Jan 2026 – Apr 2026</span>
                </div>
                <p className="mt-1 text-ink-muted print:text-gray-700 leading-relaxed">
                  Built end-to-end data preprocessing pipelines and trained predictive ML models on enterprise datasets.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-semibold">
                  <span className="text-ink print:text-black">Postulate Info Tech — Security Analyst Intern</span>
                  <span className="font-mono text-ember text-[11px] print:text-gray-700">Jun 2025</span>
                </div>
                <p className="mt-1 text-ink-muted print:text-gray-700 leading-relaxed">
                  Executed network perimeter audits, vulnerability scanning, and threat vector assessments.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-semibold">
                  <span className="text-ink print:text-black">DCW Ltd — Cybersecurity Professional Trainee</span>
                  <span className="font-mono text-ember text-[11px] print:text-gray-700">May 2024</span>
                </div>
                <p className="mt-1 text-ink-muted print:text-gray-700 leading-relaxed">
                  Bolstered corporate security posture by deploying Zero Trust frameworks and AI-driven edge intrusion monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Skills Matrix */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-mint font-bold print:text-black border-b border-line/50 pb-1 flex items-center gap-1.5">
              <Shield size={14} /> Technical Skills & Tooling
            </h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded border border-line bg-obsidian p-3 print:bg-gray-50 print:border-gray-300">
                <h3 className="font-mono text-[11px] font-semibold text-ice print:text-black">Defensive & Network Security</h3>
                <p className="mt-1 text-ink-muted print:text-gray-700 text-[11px]">
                  Honeypot Decoy Telemetry, SIEM Logging, Wireshark, Nmap, Snort, Network Intrusion Detection (IDS), RBAC Access Control, Cryptographic Entropy Analysis.
                </p>
              </div>
              <div className="rounded border border-line bg-obsidian p-3 print:bg-gray-50 print:border-gray-300">
                <h3 className="font-mono text-[11px] font-semibold text-ice print:text-black">Languages & AI Frameworks</h3>
                <p className="mt-1 text-ink-muted print:text-gray-700 text-[11px]">
                  Python (Flask, Scikit-learn, Pandas), TypeScript, JavaScript, SQL, NSL-KDD Machine Learning, HTML5/CSS3.
                </p>
              </div>
            </div>
          </div>

          {/* Certifications & Research */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ice font-bold print:text-black border-b border-line/50 pb-1 flex items-center gap-1.5">
              <Award size={14} /> Certifications & Global Research
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded border border-line bg-obsidian text-ink print:bg-gray-50">
                • CEH v13 AI (EC-Council)
              </div>
              <div className="p-2 rounded border border-line bg-obsidian text-ink print:bg-gray-50">
                • CompTIA CySA+ (Security Analyst)
              </div>
              <div className="p-2 rounded border border-line bg-obsidian text-ink print:bg-gray-50">
                • ISC2 CC (Certified in Cybersecurity)
              </div>
              <div className="p-2 rounded border border-line bg-obsidian text-ink print:bg-gray-50">
                • ICSEAIS 2026 Conference Presenter
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 flex justify-end gap-3 border-t border-line pt-4 print:hidden">
          <button
            onClick={onClose}
            className="rounded-lg bg-ember px-5 py-2 font-mono text-xs font-medium text-obsidian hover:bg-ember/90"
          >
            Close Resume
          </button>
        </div>
      </div>
    </div>
  );
}
