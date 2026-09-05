import { useState } from "react";
import { X, Mail, Send, CheckCircle2, Linkedin, Github, MapPin, Copy, Check, Twitter } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [subject, setSubject] = useState("Hiring Opportunity / Full-time SOC Role");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Trigger mailto link fallback
      const mailtoUrl = `mailto:ranjith.csecyber@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(`From: ${senderName} (${senderEmail})\n\n${message}`)}`;
      window.open(mailtoUrl, "_blank");
    }, 600);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ranjith.csecyber@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-line bg-panel p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-line bg-obsidian p-2 text-ink-muted transition-colors hover:text-ink"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-ember animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ember font-semibold">
                Direct Signal Route
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-ink">Get In Touch with Ranjith A</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Seeking full-time Cybersecurity Analyst, SOC Analyst, or Security Engineer opportunities.
            </p>

            {/* Quick Contact Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-obsidian p-3 font-mono text-xs text-ink-muted">
              <div className="flex items-center gap-1.5 text-ink">
                <Mail size={14} className="text-ember" />
                <span>ranjith.csecyber@gmail.com</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="ml-1 p-1 hover:text-ember transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? <Check size={13} className="text-mint" /> : <Copy size={13} />}
                </button>
              </div>

              <a
                href="https://x.com/Ranjith__A_"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-ink hover:text-ember transition-colors"
              >
                <Twitter size={14} className="text-amber-400" />
                <span>x.com/Ranjith__A_</span>
              </a>

              <div className="flex items-center gap-1.5 text-ink">
                <MapPin size={14} className="text-ice" />
                <span>Chennai / Remote</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block font-mono text-xs text-ink-muted mb-1.5">Inquiry Purpose:</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-line bg-obsidian px-3.5 py-2.5 font-mono text-xs text-ink focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
                >
                  <option value="Hiring Opportunity / Full-time SOC Role">Hiring Opportunity / Full-time SOC Role</option>
                  <option value="Security Consultation / Vulnerability Audit">Security Audit / Penetration Test</option>
                  <option value="Research Collaboration / Paper Query">Research Collaboration (ICSEAIS 2026)</option>
                  <option value="General Engineering Inquiry">General Technical Inquiry</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-ink-muted mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-lg border border-line bg-obsidian px-3.5 py-2 font-mono text-xs text-ink placeholder:text-ink-muted/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-ink-muted mb-1.5">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full rounded-lg border border-line bg-obsidian px-3.5 py-2 font-mono text-xs text-ink placeholder:text-ink-muted/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-ink-muted mb-1.5">Message / Details *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share role requirements, team details, or project scope..."
                  className="w-full rounded-lg border border-line bg-obsidian px-3.5 py-2 font-mono text-xs text-ink placeholder:text-ink-muted/40 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-[11px] text-ink-muted/60">
                  Response expected within 12 hours
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-2.5 font-mono text-xs font-semibold text-obsidian transition-transform hover:-translate-y-0.5"
                >
                  <Send size={14} /> Transmit Message
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4 rise-in">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-mint/20 text-mint border border-mint/40">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-ink">Transmission Confirmed!</h2>
            <p className="max-w-md mx-auto text-sm text-ink-muted">
              Your message was drafted and your email client was opened to transmit directly to{" "}
              <code className="text-ember">ranjith.csecyber@gmail.com</code>.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="rounded-lg bg-ember px-6 py-2.5 font-mono text-xs font-semibold text-obsidian hover:bg-ember/90"
              >
                Return to Portfolio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
