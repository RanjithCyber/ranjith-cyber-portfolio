import { X, Award, CheckCircle2, Shield, Calendar, ExternalLink } from "lucide-react";

export interface CertificationData {
  code: string;
  issuer: string;
  title: string;
  detail: string;
  skillsValidated?: string[];
  issuedDate?: string;
  verificationId?: string;
}

interface CertificationModalProps {
  cert: CertificationData | null;
  onClose: () => void;
}

export function CertificationModal({ cert, onClose }: CertificationModalProps) {
  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-panel p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-line bg-obsidian p-2 text-ink-muted transition-colors hover:text-ink"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-ember">
          <Award size={16} /> Verified Credential Record
        </div>

        <h2 className="mt-3 text-2xl font-bold text-ink">{cert.title}</h2>
        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted mt-1">{cert.issuer}</p>

        <div className="mt-4 rounded-lg border border-mint/30 bg-mint/10 p-3.5 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-mint shrink-0" />
          <div className="font-mono text-xs">
            <span className="text-mint font-semibold">Active & Verified Status</span>
            <p className="text-ink-muted/80 text-[11px] mt-0.5">
              Verified domain mastery in cybersecurity engineering.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-xs text-ink-muted border-t border-line pt-4">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">Summary</h3>
            <p className="mt-1 leading-relaxed">{cert.detail}</p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">Key Domains Tested</h3>
            <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {cert.skillsValidated?.map((sk) => (
                <span key={sk} className="rounded border border-line bg-obsidian px-2 py-1 text-ice">
                  {sk}
                </span>
              )) || (
                <>
                  <span className="rounded border border-line bg-obsidian px-2 py-1 text-ice">Threat Modeling</span>
                  <span className="rounded border border-line bg-obsidian px-2 py-1 text-ice">Ethical Hacking</span>
                  <span className="rounded border border-line bg-obsidian px-2 py-1 text-ice">Access Control</span>
                  <span className="rounded border border-line bg-obsidian px-2 py-1 text-ice">Incident Triage</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-[11px]">
            <div className="rounded border border-line bg-obsidian p-2.5">
              <span className="text-ink-muted/60 block">VERIFICATION CODE</span>
              <span className="text-ember font-semibold">{cert.verificationId || `${cert.code}-2026-VAL`}</span>
            </div>
            <div className="rounded border border-line bg-obsidian p-2.5">
              <span className="text-ink-muted/60 block">VALIDITY</span>
              <span className="text-mint font-semibold">Active / 2026</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-ember px-4 py-2 font-mono text-xs font-medium text-obsidian hover:bg-ember/90"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
