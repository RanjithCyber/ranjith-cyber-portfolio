import { X, ExternalLink, Github, ShieldCheck, Cpu, Code2, Layers, CheckCircle2 } from "lucide-react";

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
  demoUrl?: string;
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-line bg-panel p-6 shadow-2xl scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-line bg-obsidian p-2 text-ink-muted transition-colors hover:text-ink"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-ember">{project.code}</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-mint">
            <span className="size-1.5 rounded-full bg-mint" /> {project.status}
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-bold text-ink">{project.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.description}</p>

        {/* Tech Badges */}
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

        {/* Deep Dive Content */}
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

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <div className="flex gap-2">
            <a
              href={project.githubUrl || "https://github.com/RanjithCyber"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-obsidian px-4 py-2 font-mono text-xs font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              <Github size={15} /> GitHub Repository
            </a>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-ember px-4 py-2 font-mono text-xs font-medium text-obsidian transition-transform hover:-translate-y-0.5"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
