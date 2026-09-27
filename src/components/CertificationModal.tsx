import { X, Award, CheckCircle2, Shield, Calendar, ExternalLink, ArrowRight } from "lucide-react";

export interface CertificationData {
  code: string;
  issuer: string;
  title: string;
  detail: string;
  skillsValidated?: string[];
  issuedDate?: string;
  verificationId?: string;
  cpeCredits?: string;
  projectLinkCode?: string;
}

interface CertificationModalProps {
  cert: CertificationData | null;
  onClose: () => void;
  onSelectProjectByCode?: (code: string) => void;
}

export function CertificationModal({ cert, onClose, onSelectProjectByCode }: CertificationModalProps) {
  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-panel p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-line bg-obsidian p-2 text-ink-muted transition-colors hover:text-ink cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-ember">
          <Award size={16} /> Verified Credential Record
        </div>

        <h2 className="mt-3 text-2xl font-bold text-ink">{cert.title}</h2>
        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted mt-1">{cert.issuer}</p>

        <div className="mt-4 rounded-lg border border-mint/30 bg-mint/10 p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-mint shrink-0" />
            <div className="font-mono text-xs">
              <span className="text-mint font-semibold">Active &amp; Verified Status</span>
              <p className="text-ink-muted/80 text-[11px] mt-0.5">
                Verified domain mastery in offensive &amp; defensive cybersecurity engineering.
              </p>
            </div>
          </div>
          {cert.cpeCredits && (
            <span className="rounded bg-mint/20 border border-mint/40 px-2.5 py-1 font-mono text-[11px] font-bold text-mint shrink-0">
              {cert.cpeCredits}
            </span>
          )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-[11px]">
            {cert.verificationId ? (
              <div className="rounded border border-line bg-obsidian p-2.5">
                <span className="text-ink-muted/60 block">VERIFICATION / CHALLENGE ID</span>
                <span className="text-ember font-semibold break-all">{cert.verificationId}</span>
              </div>
            ) : null}
            <div className="rounded border border-line bg-obsidian p-2.5">
              <span className="text-ink-muted/60 block">ISSUED / VALIDITY</span>
              <span className="text-mint font-semibold">{cert.issuedDate || "Active Status"}</span>
            </div>
          </div>

          {cert.projectLinkCode && onSelectProjectByCode && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onSelectProjectByCode(cert.projectLinkCode!);
                }}
                className="w-full flex items-center justify-between rounded-lg border border-ember/40 bg-ember/10 p-3 font-mono text-xs text-ember hover:bg-ember/20 transition-colors cursor-pointer"
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <ExternalLink size={14} /> View Associated CTF Security Assessment Report
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-ember px-4 py-2 font-mono text-xs font-semibold text-obsidian hover:bg-ember/90 cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
